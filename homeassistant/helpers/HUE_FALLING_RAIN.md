# Hall floor lamp: falling rain

Uses Hue Entertainment v2 to stream blue highlights through the Hall Signe's
three hardware sections at 50 frames per second. Only that lamp belongs to the
**Hall Rainfall** entertainment area. This is a three-section travelling effect,
not individually addressable LED pixels.

| Rain rate (mm/h) | Peak brightness | Time per drop |
| --- | --- | --- |
| Below 1 | 15% | 4 seconds |
| 1–2.49 | 30% | 2.8 seconds |
| 2.5–7.49 | 55% | 1.8 seconds |
| 7.5–14.99 | 80% | 1.1 seconds |
| 15+ | 100% | 0.65 seconds |

The background is dim. The falling glow accelerates downward and overlaps adjacent
sections. Weather checks run separately from rendering to avoid pauses. Colors
randomly alternate between light blue, dark blue, and cyan-blue, with a smooth
30-second fade across each complete interval. Consecutive targets never repeat.

Manual color/effect commands from Home Assistant (including room/device targets)
stop streaming, apply the chosen setting, and pause rain for two hours. The
`input_datetime.hall_rain_paused_until` helper shows when it can resume. A Hue app
takeover that ends Entertainment streaming also starts this pause. The pause
persists across restarts; earthquake warnings still take priority.

The background follows the selected blue/turquoise shade. The direction can be reversed with `reverse` in the
private runtime configuration. Rain control checks the weather and automation
states every second; a separate stop command releases streaming before an
earthquake alert or normal rain-state restoration. Other active Hue entertainment
areas (TV or PC sync) take priority over rain. Hue only supports one entertainment
stream at a time.

## Installation / recovery

1. Copy `hue_falling_rain.py` to `/config/helpers/` inside Home Assistant.
2. Install the pinned dependency in the persistent config directory:
   `python -m pip install --no-deps --target /config/hue_rain_lib hue-entertainment==0.1.2`.
   Its aiohttp, cryptography, and zeroconf dependencies are provided by this HA container.
3. Pair with the Hue Bridge using its physical link button and request a client key.
4. Create a Hall-only entertainment area with three independent channels. This
   bridge groups segments when configured with vertical locations; using endpoints
   x=-1 and x=1 produces separate channels for segment indices 0, 1, and 2. Those
   logical positions do not alter the actual lamp orientation.
5. Store `host`, `username`, `clientkey`, `area_id`, `light_id`, `ha_url`, `ha_token`,
   and `reverse` in `/config/hue_rain_credentials.json` with mode 0600. Never commit
   this file. The HA URL is the local container endpoint.
6. Deploy the updated rain and earthquake packages, validate, and restart Home
   Assistant for newly added shell commands.

Preview commands inside the container:

```sh
python /config/helpers/hue_falling_rain.py preview 0.4 20
python /config/helpers/hue_falling_rain.py preview 20 10
python /config/helpers/hue_falling_rain.py stop
```

`start` launches a single worker only when rain controls allow it. `stop` waits for
a clean exit, with forced cleanup if a streaming handshake stalls. Preview and
normal exit restore the lamp's pre-stream state. Status is written to
`/config/hue_rain_status.json`; runtime files and credentials belong in secure
Home Assistant backups, not the source repository. Continuous streaming consumes
more resources than the previous periodic shimmer. If the dependency or bridge
connection fails, inspect `hue_rain.log` and stop streaming before troubleshooting.

The worker corrects the pinned library’s ambiguous 8/16-bit RGB encoding.
All components use exact 16-bit values, preventing dim red/green components
from jumping to bright values below 256. Every palette color is blue-dominant.

## Single automation and manual off

Only `automation.hall_light_katsushika_rain` needs to be enabled. It handles
weather changes, a ten-second recovery check, and manual off/color commands.
The old rainfall shimmer automation, manual-color automation, and wrapper script
are removed. The Python helper is still required for 50 Hz Hue Entertainment.

An off command through Home Assistant stops Entertainment first and reapplies off.
The worker also checks the Hue Bridge on-state every second, covering Alexa/Hue
commands that bypass Home Assistant. Off pauses rain for two hours and discards
the old rain restoration snapshot, so it cannot turn the lamp back on. Earthquake
alerts keep priority. Disabling the one automation stops its active rain worker
on the next control check.

Live regression validation: run rain, send HA `light.turn_off`, verify the lamp
is off, Entertainment is inactive, and the pause is approximately 7200 seconds.
Repeat with a direct Hue Bridge off request; explicitly try restarting rain during
both pauses. Restore test state afterward. This validates the two control paths;
it does not validate Alexa's microphone or interpretation of a spoken command.
