"""JMA reports for the Tateishi station near Shiratori (not an EEW service)."""
import json
import fcntl
import os
import sys
import math
import re
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

BASE_URL = 'https://www.jma.go.jp/bosai/quake/data/'
LATITUDE, LONGITUDE = 35.7497, 139.8438
RADIUS_KM = 500
MAX_AGE_SECONDS = 1200  # Station observations may arrive minutes after a quake.
STATION_CODE = '1312230'  # Tokyo Katsushika-ku Tateishi
CACHE = Path('/config/earthquake_cache')
HISTORY = Path('/config/earthquake_history.json')
SCALES = {'0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5-': 5, '5+': 6, '6-': 7, '6+': 8, '7': 9}


def distance_km(latitude, longitude):
    a, b = math.radians(LATITUDE), math.radians(latitude)
    h = math.sin((b-a)/2)**2 + math.cos(a)*math.cos(b)*math.sin(math.radians(longitude-LONGITUDE)/2)**2
    return 6371 * 2 * math.asin(min(1, math.sqrt(h)))


def fetch_json(name):
    if not re.fullmatch(r'[A-Za-z0-9_]+\.json', name):
        raise ValueError('Invalid JMA filename')
    req = urllib.request.Request(BASE_URL + name, headers={'User-Agent': 'HomeAssistant-ShiratoriEarthquake/1.0'})
    with urllib.request.urlopen(req, timeout=10) as response:
        return json.load(response)


def fetch_detail(name):
    # JMA revision filenames are immutable. Cache avoids re-fetching every poll.
    if not re.fullmatch(r'[A-Za-z0-9_]+\.json', name):
        raise ValueError('Invalid JMA filename')
    CACHE.mkdir(exist_ok=True)
    path = CACHE / name
    if path.exists():
        return json.loads(path.read_text())
    detail = fetch_json(name)
    path.write_text(json.dumps(detail))
    for old in sorted(CACHE.glob('*.json'), key=lambda p: p.stat().st_mtime, reverse=True)[1000:]:
        old.unlink()
    return detail


def station_intensity(detail):
    for pref in detail.get('Body', {}).get('Intensity', {}).get('Observation', {}).get('Pref', []):
        for area in pref.get('Area', []):
            for city in area.get('City', []):
                for station in city.get('IntensityStation', []):
                    if station.get('Code') == STATION_CODE:
                        return station.get('Int')
    return None


def select_records(reports, now, get_detail):
    latest = {}
    for r in sorted(reports, key=lambda r: (r.get('rdt', ''), r.get('ctt', '')), reverse=True):
        eid = r.get('eid', '')
        if not re.fullmatch(r'\d{14}', eid) or eid in latest:
            continue
        if r.get('ift') not in ('取消', '取り消し') and not all(k in r for k in ('at', 'cod', 'json', 'int')):
            continue
        latest[eid] = r
    events = []
    for eid, r in latest.items():
        if r.get('ift') in ('取消', '取り消し'):
            continue
        try:
            occurred = datetime.fromisoformat(r['at'])
            if occurred.tzinfo is None or (now-occurred).total_seconds() < 0:
                continue
            coords = re.match(r'^([+-]\d+(?:\.\d+)?)([+-]\d+(?:\.\d+)?)', r['cod'])
            if not coords:
                continue
            lat, lon = map(float, coords.groups())
            if not (-90 <= lat <= 90 and -180 <= lon <= 180):
                continue
            distance = distance_km(lat, lon)
            if distance > RADIUS_KM:
                continue
            # A ward maximum is only a prefilter, never the alert intensity.
            if not any(c.get('code') == '1312200' and SCALES.get(c.get('maxi'), -1) >= 1
                       for p in r['int'] for c in p.get('city', [])):
                continue
        except (KeyError, TypeError, ValueError, OverflowError):
            continue
        scale = station_intensity(get_detail(r['json']))
        rank = SCALES.get(scale, -1)
        if rank < 1:
            continue
        tier = 0 if rank < 3 else 1 if rank == 3 else 2 if rank == 4 else 3
        spoken = scale.replace('-', ' lower').replace('+', ' upper')
        events.append(dict(id=eid, intensity=scale, spoken_intensity=spoken, tier=tier,
                           distance_km=round(distance, 1), occurred_at=occurred.isoformat(),
                           station='Tokyo Katsushika-ku Tateishi', magnitude=r.get('mag'),
                           region=r.get('en_anm') or r.get('anm', ''), report_at=r.get('rdt'),
                           source_url=BASE_URL+r['json']))
    return sorted(events, key=lambda e: e['occurred_at'])


def select_events(reports, now, get_detail):
    return [r for r in select_records(reports, now, get_detail)
            if r['tier'] > 0 and 0 <= (now-datetime.fromisoformat(r['occurred_at'])).total_seconds() <= MAX_AGE_SECONDS]


def save_history(records=(), alert=None):
    HISTORY.parent.mkdir(exist_ok=True)
    with open(str(HISTORY)+'.lock', 'a') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        existing = json.loads(HISTORY.read_text()) if HISTORY.exists() else []
        items = {r['id']: r for r in existing}
        for r in records:
            items[r['id']] = dict(items.get(r['id'], {}), **r)
        if alert:
            eid, intensity, stage, speech = alert
            if not re.fullmatch(r'\d{14}', eid) or intensity not in SCALES or stage not in ('started', 'completed') or speech not in ('allowed', 'quiet'):
                raise ValueError('Invalid audit arguments')
            if eid in items:
                items[eid].update(alert_status=stage, alert_intensity=intensity,
                                  speech_window=speech, alert_updated_at=datetime.now(timezone.utc).isoformat())
        result = sorted(items.values(), key=lambda r: r['occurred_at'], reverse=True)[:1000]
        tmp = HISTORY.with_suffix('.tmp')
        tmp.write_text(json.dumps(result, ensure_ascii=False))
        os.replace(tmp, HISTORY)
        return result


def main():
    if len(sys.argv) > 1:
        if len(sys.argv) != 6 or sys.argv[1] != '--record-alert':
            raise ValueError('Invalid arguments')
        save_history(alert=sys.argv[2:]); return
    now = datetime.now(timezone.utc)
    try:
        reports = fetch_json('list.json')
        if not isinstance(reports, list) or not reports or not all(isinstance(r, dict) for r in reports):
            raise ValueError('Unexpected JMA feed format')
        records = select_records(reports, now, fetch_detail)
        history = save_history(records)
        events = [r for r in records if r['tier'] > 0 and 0 <= (now-datetime.fromisoformat(r['occurred_at'])).total_seconds() <= MAX_AGE_SECONDS]
        output = dict(status='ok', checked_at=now.isoformat(), events=events,
                      history=history[:25], history_count=len(history))
    except Exception as exc:
        try:
            history = json.loads(HISTORY.read_text()) if HISTORY.exists() else []
        except (OSError, ValueError):
            history = []
        output = dict(status='error', checked_at=now.isoformat(), events=[], error=type(exc).__name__,
                      history=history[:25], history_count=len(history))
    print(json.dumps(output, separators=(',', ':')))


if __name__ == '__main__':
    main()
