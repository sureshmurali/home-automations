# Shiratori earthquake warning

Uses JMA **observed local seismic intensity (shindo)** at **Tokyo Katsushika-ku
Tateishi**, station `1312230`, as a nearby proxy for Shiratori. This is not a
measurement inside the house. Earthquake epicentres must also be within **500 km**
of the configured home coordinates. Magnitude does not select the alert tier.

| Local shindo | All four Hue lights | Alexa speech, Japan time |
| --- | --- | --- |
| 3 | Yellow for 5 seconds | 10:00–19:59 |
| 4 | Orange for 10 seconds | 08:00–21:59 |
| 5-lower, 5-upper, 6-lower, 6-upper, 7 | Red for 30 seconds | 08:00–21:59 |

Alexa says **“Earthquake warning: local intensity X.”** on the Hall Echo Dot,
Bedroom Echo Dot, and Echo Show. Lights alert at all hours. The flash target is
250 ms on and 250 ms off (two blinks per second), paced against elapsed time.
A dedicated Hue zone named **Earthquake Alert** (`light.earthquake_alert`) sends
one command to all four lights per change. The silent five-second integration
test completed all ten commanded blink cycles. Hue bridge, Zigbee, and Home
Assistant scheduling can still reduce the actual blink
rate or cause lamps to be slightly out of sync. This is not a precision strobe.

The automation saves each lamp's state, brightness, color, and supported effect;
pauses the five competing solar/desk/rain automations; then restores the saved
settings and previously enabled automations. Snapshot helpers persist across HA
restarts. A recovery automation runs on startup if interrupted and after an alert
has remained active for two minutes. Lamps unavailable during recovery may not
restore; check them manually if the bridge or power was down.

## Source and limitations

The helper reads the [official JMA earthquake reports](https://www.jma.go.jp/bosai/quake/)
every 30 seconds, then fetches the relevant station report. Reports may arrive
minutes after shaking; **this is not Earthquake Early Warning** and does not
replace Japan's official alerts. It needs the Pi, Hue bridge, network, and JMA
feed; Alexa additionally needs its cloud connection. The public JMA JSON format
can change. A missing Tateishi reading is not substituted with magnitude, the
ward maximum, or another station's stronger reading.

Events older than 20 minutes, future-dated events, withdrawn reports, missing
coordinates, and epicentres outside the radius are ignored. The latest ten
alerted event IDs and tiers are remembered to suppress duplicates. A revision
that raises the alert tier can alert again. On first installation, a qualifying
event from the preceding 20 minutes may alert; already recorded events do not
replay after normal restarts.

Check `sensor.shiratori_earthquake_feed`: it should be `ok`, with a recent
`checked_at` attribute. `error`, `unavailable`, or an old timestamp means monitoring
is impaired. `input_boolean.earthquake_alert_active` is an internal recovery flag;
do not use it as an enable/disable switch. Disable **Shiratori - local earthquake
warning** to suspend alerts.

## Edit / restore

Copy both files from this repository into the Home Assistant config directory:

- `packages/shiratori_earthquake.yaml` → `/config/packages/shiratori_earthquake.yaml`
- `helpers/shiratori_earthquakes.py` → `/config/helpers/shiratori_earthquakes.py`

The existing `homeassistant: packages: !include_dir_named packages` include loads
the package. Validate configuration and restart HA for initial setup. Subsequent
script/automation-only YAML edits can use those domain reloads; helper edits take
effect on the next poll. Python uses only the standard library. Cached report
files are kept in `/config/earthquake_cache/` (at most 1,000).

On a replacement Hue setup, create an **Earthquake Alert** zone in the Hue app
containing the four lights and ensure Home Assistant exposes it as
`light.earthquake_alert`. Without it, the script falls back to individual lights,
which tested slower (about seven commanded cycles in five seconds).

Update light, Alexa, and competing-automation entity IDs if restoring to a new
installation. Home Assistant's timezone must be Asia/Tokyo. These source files
contain no Alexa credentials and do not replace a full Home Assistant backup.

Run offline data-selection checks from the `homeassistant` directory:

```sh
python3 -m unittest discover -s tests -p test_shiratori_earthquakes.py -v
```

For an intentional silent yellow light test, run script
`script.shiratori_earthquake_alert` with `intensity: "3"` and `test_mode: true`.
This flashes real lights but does not speak or modify the seen-event history.

## Persistent history and dashboard

**Earthquakes** in the sidebar (`/shiratori-earthquakes/history`) shows the latest
25 events observed at Tateishi, including shindo 1–2, with dates, local intensity,
magnitude, distance, JMA source, and alert eligibility/execution status.
`dashboards/shiratori_earthquakes.yaml` is the editable dashboard backup; deploy
it through the dashboard's Raw configuration editor. The live dashboard uses
storage mode and does not automatically reread the YAML file.

The helper stores up to 1,000 records in `/config/earthquake_history.json`, using
atomic replacement and file locking. Include this file in Home Assistant backups
to retain your collected history if the Pi fails. The source repository backs up
the code, not this changing history file. The first import uses available JMA
reports only, so it is not a complete historical earthquake catalogue. Future
polls retain records even after they disappear from JMA's rolling feed. Report
caches now retain up to 1,000 files to avoid downloading the same historical
reports every 30 seconds.

The automation logs alert sequence start and completion separately. Completion
means Home Assistant finished the script, not a guarantee that a speaker was
heard or a powered-off lamp displayed the alert. Existing historical imports
have no fabricated alert-execution history. A failure to fetch new data retains
the saved history and changes the feed health to `error`.

### 17 September 2026 overnight event

JMA event `20260917000748` occurred at **00:07 JST**, magnitude **4.8**, about
**45.3 km** from the configured home position. Both Tateishi and Kanamachi reported
**shindo 2** in the 00:13 and 00:16 station reports. This was below the configured
shindo 3 light threshold. Alexa was outside its speaking window. The automation
was already enabled at 23:07 the previous evening; setup was not the reason this
event produced no alert.
