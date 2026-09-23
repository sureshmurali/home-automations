"""Hall Signe-only Hue Entertainment rain. Credentials stay on the Pi."""
import asyncio
import fcntl
import json
import math
import os
import random
from pathlib import Path
import signal
import ssl
import subprocess
import struct
import sys
import time
import urllib.request

ROOT = Path('/config')
CREDS = ROOT / 'hue_rain_credentials.json'
PID = ROOT / 'hue_rain.pid'
STATUS = ROOT / 'hue_rain_status.json'
SNAPSHOT = ROOT / 'hue_rain_snapshot.json'
STOP = False
PAUSE = ROOT / "hue_rain_paused_until"
PALETTE = ((0.04, 0.22, 1.0), (0.0, 0.025, 0.40), (0.0, 0.40, 1.0))


def encode_channels(commands):
    """Serialize actual 16-bit RGB, including dim values below 256."""
    return b''.join(struct.pack('!BHHH', cmd.channel_id,
        *[max(0, min(65535, int(v))) for v in (cmd.red, cmd.green, cmd.blue)])
        for cmd in commands)


def fix_stream_encoder():
    # hue-entertainment 0.1.2 guesses that values <=255 are 8-bit,
    # amplifying dim components 257-fold. Retain its header/session handling.
    from hue_entertainment.dtls import HueDtlsStreamer
    original = HueDtlsStreamer._build_huestream_message
    if getattr(original, '_rain_fixed', False): return
    def build(self, commands):
        return original(self, []) + encode_channels(commands)
    build._rain_fixed = True
    HueDtlsStreamer._build_huestream_message = build


def paused():
    try: return float(PAUSE.read_text()) > time.time()
    except (OSError, ValueError): return False


def pause_rain():
    until=time.time()+7200
    PAUSE.write_text(str(until))
    c=json.loads(CREDS.read_text())
    for service,body in [('input_datetime/set_datetime', {'entity_id':'input_datetime.hall_rain_paused_until','timestamp':until}), ('input_text/set_value', {'entity_id':'input_text.hall_rain_previous_setting','value':''})]:
        req=urllib.request.Request(c['ha_url']+'/api/services/'+service,data=json.dumps(body).encode(),headers={'Authorization':'Bearer '+c['ha_token'],'Content-Type':'application/json'})
        with urllib.request.urlopen(req,timeout=3) as response:response.read()


def blend_color(source, target, progress):
    t = min(1, max(0, progress))
    t = t*t*(3-2*t)
    return tuple(a+(b-a)*t for a,b in zip(source,target))


def weather_parameters(rate):
    if rate < 1: return 15, 4.0
    if rate < 2.5: return 30, 2.8
    if rate < 7.5: return 55, 1.8
    if rate < 15: return 80, 1.1
    return 100, 0.65


def frame(elapsed, rate, reverse=False, color=(0, 0, 1), phase=None):
    peak, period = weather_parameters(rate)
    # Gravity-shaped path with a wide Gaussian glow across the three sections.
    # A cosine envelope removes abrupt appearance/disappearance at the ends.
    phase = (elapsed % period) / period if phase is None else phase % 1
    head = 3.5 - 5.0 * phase * phase
    envelope = math.sin(math.pi * phase) ** 2
    values = []
    for index in range(3):
        position = 2-index if reverse else index
        glow = math.exp(-0.5 * ((position-head)/1.05)**2) * envelope
        level = peak/100 * (0.015 + 0.985*glow)
        values.append(tuple(int(65535*level*c) for c in color))
    return values


def bridge(c, resource, payload=None):
    req = urllib.request.Request('https://'+c['host']+'/clip/v2/resource/'+resource,
        data=None if payload is None else json.dumps(payload).encode(),
        headers={'hue-application-key':c['username'],'Content-Type':'application/json'},
        method='GET' if payload is None else 'PUT')
    with urllib.request.urlopen(req, context=ssl._create_unverified_context(), timeout=3) as response:
        result = json.load(response)
    if result.get('errors'): raise RuntimeError('Hue request failed')
    return result['data']


def state(c, entity):
    req=urllib.request.Request(c['ha_url']+'/api/states/'+entity,headers={'Authorization':'Bearer '+c['ha_token']})
    with urllib.request.urlopen(req,timeout=2) as response:return json.load(response)


def rain_rate(c):
    if paused():return 0
    if state(c,'input_boolean.earthquake_alert_active')['state']=='on':return 0
    if state(c,'automation.hall_light_katsushika_rain')['state']!='on':return 0
    s=state(c,'sensor.katsushika_rain_intensity')
    if not -300 <= time.time()-float(s['attributes'].get('time',0)) < 3600:return 0
    return max(0,float(s['state']))


def status(message):
    tmp=STATUS.with_suffix('.tmp')
    tmp.write_text(json.dumps({'status':message,'updated_at':time.time()}));os.replace(tmp,STATUS)


def request_stop(*args):
    global STOP
    STOP=True


async def run(preview_rate=None, duration=None):
    sys.path.insert(0,str(ROOT/'hue_rain_lib'))
    from hue_entertainment import EntertainmentSession, LightColorCommand
    fix_stream_encoder()
    lock=open(ROOT/'hue_rain.lock','a')
    try:fcntl.flock(lock,fcntl.LOCK_EX|fcntl.LOCK_NB)
    except BlockingIOError:return
    PID.write_text(str(os.getpid()))
    c=json.loads(CREDS.read_text());session=None;snapshot=None;started_stream=False;failed=False;manual_off=False
    signal.signal(signal.SIGTERM,request_stop);signal.signal(signal.SIGINT,request_stop)
    try:
        rate=preview_rate if preview_rate is not None else await asyncio.to_thread(rain_rate,c)
        if rate<=0:return
        areas=await asyncio.to_thread(bridge,c,'entertainment_configuration')
        if any(a['status']=='active' and a['id']!=c['area_id'] for a in areas):
            status('paused_other_hue_sync');return
        area=next(a for a in areas if a['id']==c['area_id'])
        if {l['rid'] for l in area.get('light_services',[])}!={c['light_id']}:
            raise RuntimeError('Rain area must contain only Hall floor lamp')
        channels={m['index']:ch['channel_id'] for ch in area['channels'] for m in ch['members']}
        if set(channels)!={0,1,2} or len(set(channels.values()))!=3:
            raise RuntimeError('Three independent lamp segments required')
        light=(await asyncio.to_thread(bridge,c,'light/'+c['light_id']))[0]
        snapshot={'on':light['on'],'dimming':{'brightness':light['dimming']['brightness']}}
        if light.get('color_temperature',{}).get('mirek_valid'):
            snapshot['color_temperature']={'mirek':light['color_temperature']['mirek']}
        elif light.get('gradient',{}).get('points'):
            snapshot['gradient']={k:light['gradient'][k] for k in ['points','mode']}
        else:snapshot['color']={'xy':light['color']['xy']}
        if light.get('effects'):snapshot['effects']={'effect':light['effects']['status']}
        SNAPSHOT.write_text(json.dumps(snapshot))
        # Keep the REST on-state meaningful while streaming so direct Hue/Alexa
        # off commands can be detected even when they bypass Home Assistant.
        await asyncio.to_thread(bridge,c,'light/'+c['light_id'],{'on':{'on':True}})
        session=EntertainmentSession(c['host'],c['username'],c['clientkey'])
        await session.start(c['area_id'],stop_others=False);started_stream=True
        status('preview' if preview_rate is not None else 'raining')
        start=time.monotonic();previous=start;phase=0.0
        source=PALETTE[0];target=random.choice(PALETTE[1:]);color_start=start
        running=True
        async def monitor():
            nonlocal rate,running,manual_off
            while running and not STOP:
                await asyncio.sleep(1)
                light=(await asyncio.to_thread(bridge,c,'light/'+c['light_id']))[0]
                if not light['on']['on']:
                    manual_off=True
                    await asyncio.to_thread(pause_rain)
                    running=False;break
                if preview_rate is None:rate=await asyncio.to_thread(rain_rate,c)
                elif (await asyncio.to_thread(state,c,'input_boolean.earthquake_alert_active'))['state']=='on':
                    running=False;break
                if paused() or rate<=0:running=False;break
                if (await session.remote_status())[0]!='active':
                    # Hue app taking over the stream is a manual override.
                    await asyncio.to_thread(pause_rain);running=False;break
        monitor_task=asyncio.create_task(monitor())
        try:
            while running and not STOP and (duration is None or time.monotonic()-start<duration):
                if monitor_task.done():
                    monitor_task.result();break
                now=time.monotonic()
                phase=(phase+(now-previous)/weather_parameters(rate)[1])%1
                previous=now
                if now-color_start>=30:
                    source=target;target=random.choice([c for c in PALETTE if c!=source]);color_start+=30
                color=blend_color(source,target,(now-color_start)/30)
                colors=frame(now-start,rate,c.get('reverse',False),color,phase)
                session.send([LightColorCommand(channel_id=channels[i],red=r,green=g,blue=b) for i,(r,g,b) in enumerate(colors)])
                await asyncio.sleep(0.02)
        finally:
            running=False;monitor_task.cancel()
            try:await monitor_task
            except asyncio.CancelledError:pass
    except Exception as exc:
        failed=True
        status('error_'+type(exc).__name__)
        print('Rain stream failed:',type(exc).__name__,flush=True)
    finally:
        if session:await session.aclose()
        if manual_off:
            await asyncio.to_thread(bridge,c,'light/'+c['light_id'],{'on':{'on':False}})
        if snapshot and started_stream and not paused():
            # Stop streaming before restoring, so HA can take over for warnings.
            try:await asyncio.to_thread(bridge,c,'light/'+c['light_id'],snapshot)
            except Exception:status('restore_failed')
        if PID.exists() and PID.read_text()==str(os.getpid()):PID.unlink()
        lock.close()
        if not failed and (STOP or started_stream):status('idle')
        SNAPSHOT.unlink(missing_ok=True)


def stop_worker():
    if not PID.exists():return
    try:
        pid=int(PID.read_text())
        cmd=Path('/proc')/str(pid)/'cmdline'
        if not cmd.exists() or b'hue_falling_rain.py' not in cmd.read_bytes():return
        os.kill(pid,signal.SIGTERM)
        deadline=time.monotonic()+2
        while time.monotonic()<deadline and cmd.exists():time.sleep(0.05)
        if cmd.exists():
            # A DTLS handshake may be waiting in a thread. Do not let it block HA.
            os.kill(pid,signal.SIGKILL)
            c=json.loads(CREDS.read_text())
            bridge(c,'entertainment_configuration/'+c['area_id'],{'action':'stop'})
            if SNAPSHOT.exists() and not paused():
                bridge(c,'light/'+c['light_id'],json.loads(SNAPSHOT.read_text()))
                SNAPSHOT.unlink()
            PID.unlink(missing_ok=True)
            status('idle')
    except ProcessLookupError:pass


def main():
    command=sys.argv[1] if len(sys.argv)>1 else 'start'
    if command=='pause':pause_rain();stop_worker();return
    if command=='stop':stop_worker();return
    if command=='start':
        if paused():return
        if PID.exists() and (Path('/proc')/PID.read_text()/'cmdline').exists():return
        with open(ROOT/'hue_rain.log','a') as log:
            subprocess.Popen([sys.executable,__file__,'worker'],stdout=log,stderr=log,stdin=subprocess.DEVNULL,start_new_session=True)
        return
    if command=='preview':
        stop_worker();asyncio.run(run(float(sys.argv[2]),float(sys.argv[3])));return
    if command=='worker':asyncio.run(run());return
    raise ValueError('Unknown command')

if __name__=='__main__':main()
