# Hall rain light

`hall_rain_light.yaml` controls `light.signe_gradient_floor_1` (Hall lights).
It uses Open-Meteo current rain plus showers at the configured home's approximate
coordinates in Katsushika, Tokyo. These are model estimates, not an on-site rain
gauge. The preceding interval's rainfall is converted to mm/h using the API's
reported interval; polling is every five minutes.

| Estimated rain rate | Blue brightness |
| --- | --- |
| More than 0, below 1 mm/h | 15% |
| 1 to below 2.5 mm/h | 30% |
| 2.5 to below 7.5 mm/h | 55% |
| 7.5 to below 15 mm/h | 80% |
| 15 mm/h or more | 100% |

The saved pre-rain setting survives Home Assistant restarts. Missing, invalid,
or hour-old readings stop the stream. The automation clears its saved rain
session after ten dry minutes. Disable **Hall light - Katsushika rain** to stop
automatic control; the worker releases streaming on its next control check.

Manual off or color commands pause rain for two hours. Off commands sent directly
to the Hue Bridge are also detected, covering Alexa's direct Hue connection.
The paused-until helper survives Home Assistant restarts. Earthquake alerts retain
priority over rain and its manual pause.

Installed on the Pi in `/home/sureshmurali/homeassistant/config/packages/`.
The configuration includes this directory under the existing `homeassistant:`:

```yaml
homeassistant:
  packages: !include_dir_named packages
```

The original configuration was backed up on the Pi in
`rain-light-backup-20260916-223051/configuration.yaml` before installation.

Sources: [Open-Meteo API](https://open-meteo.com/en/docs),
[Home Assistant REST sensors](https://www.home-assistant.io/integrations/sensor.rest/).

## Editing and restoring

Edit `homeassistant/packages/hall_rain_light.yaml` in this Git repository.
This single package contains the rain sensor, saved-setting helper, and automation.
The brightness and speed thresholds are in `helpers/hue_falling_rain.py`;
the weather location is in the REST `resource` URL.

To deploy an edit or restore this automation on a replacement Pi:

1. Copy `hall_rain_light.yaml` into the Home Assistant config's `packages/` folder.
   Install the helper, pinned streaming dependency, and private Hue credentials
   as described in [falling-rain setup](../helpers/HUE_FALLING_RAIN.md).
2. Add the `packages` include shown above under the existing `homeassistant:`
   section in `configuration.yaml`. Keep other settings in that section.
3. Check the configuration in Home Assistant's Developer Tools → YAML, then
   restart Home Assistant. For automation-only edits, reload automations instead.
4. Confirm **Hall light - Katsushika rain** is enabled and **Katsushika rain
   intensity** has a numeric reading. On a replacement installation, confirm the
   Hall light still has entity ID `light.signe_gradient_floor_1`, or replace its
   references in this file with the new entity ID.

Local edits and GitHub commits do not automatically deploy to the Pi. This is a
backup of this automation's configuration; it does not contain Home Assistant's
integrations, credentials, database, or the runtime saved light setting. Keep a
full Home Assistant backup separately for complete server recovery.

## Rainfall motion

One enabled automation, **Hall light - Katsushika rain**, manages the effect,
weather changes, and manual overrides. The helper streams a downward glow through
the Hall Signe's three controllable sections at 50 frames per second. Blue shades
fade into one another over 30 seconds; rain intensity controls speed and peak
brightness. Other Hue lights are not part of this effect.

The former rainfall shimmer automation, manual-color automation, and shimmer
wrapper script have been removed. See [implementation and test notes](../helpers/HUE_FALLING_RAIN.md).
