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

After at least ten minutes at zero rain, the previous on/off, brightness, color,
and effect setting is restored on the next evaluation. The snapshot survives
Home Assistant restarts. Missing, invalid, or hour-old readings do not change the
light. During rain, the automation reapplies blue on its five-minute checks.
Disable **Hall light - Katsushika rain** to suspend automatic control; disabling
alone leaves the light in its current setting.

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
The brightness thresholds are in the automation's `brightness_pct` template;
the weather location is in the REST `resource` URL.

To deploy an edit or restore this automation on a replacement Pi:

1. Copy `hall_rain_light.yaml` into the Home Assistant config's `packages/` folder.
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

While it is raining, **Hall light - rainfall shimmer** runs a short blue brightness
animation every ten seconds: three brief rises followed by slower fades. The
original rain mapping sets the peak (15/30/55/80/100%); each glimmer fades to 55%
of that peak without switching off. This simulates a rain-like shimmer rather
than vertically moving drops along individual gradient segments.

`script.hall_rain_shimmer` controls the motion. It checks the earthquake flag
before each change. Earthquake warnings stop this script and pause its automation,
then restore the lamp and resume rain control afterwards. Disabling the main
**Hall light - Katsushika rain** automation also prevents new shimmer runs.
Missing/stale rain data and dry weather prevent new shimmer runs.
