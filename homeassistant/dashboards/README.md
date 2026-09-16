# Alexa Reminders dashboard

Open `/alexa-reminders/upcoming` in Home Assistant or select **Alexa Reminders**
in the sidebar. `alexa_reminders.yaml` is the editable backup of the complete
dashboard, built entirely from native Markdown cards without custom cards.

The dashboard reads Alexa Media Player sensors ending in `_next_reminder` and
lists each enabled reminder's next future occurrence. It separates recurring
reminders using `rRuleData` and `recurringPattern`, deduplicates by reminder ID,
and sorts by the next scheduled time. All times use Home Assistant's configured
local timezone (Asia/Tokyo on this installation). Stale data older than 30 minutes
or unavailable devices produce a warning instead of a misleading empty list.
An `unknown` next-reminder state with fresh data and no active reminders is normal.

This is view-only. It does not create, edit, dismiss, delete, or announce reminders.
Alexa Routine announcements are different from repeating reminders and are not
included. Alexa Media Player updates can take several minutes to reach this page.

## Edit or restore

The live dashboard uses Home Assistant's storage mode. To apply local edits:

1. Open **Alexa Reminders** and select **Edit dashboard**.
2. Open its menu and select **Raw configuration editor**.
3. Replace the configuration with `alexa_reminders.yaml` and save.

For a new installation, first reconnect Alexa Media Player and enable its reminder
sensors. Create an empty dashboard named **Alexa Reminders**, with URL
`alexa-reminders` and **Show in sidebar** enabled, then paste the YAML as above.
No Home Assistant restart is required. The copy at
`/home/sureshmurali/homeassistant/config/dashboards/alexa_reminders.yaml` is also
an export; editing it does not change the live storage-mode dashboard automatically.

The YAML contains display logic only, not reminder text or Alexa credentials.
It backs up the dashboard, not the Alexa integration or Amazon's reminders.

Reference: [Home Assistant Markdown cards](https://www.home-assistant.io/dashboards/markdown/).

## Shiratori earthquakes

`shiratori_earthquakes.yaml` backs up the **Earthquakes** dashboard at
`/shiratori-earthquakes/history`. It reads the earthquake feed sensor's persistent
history, displays the latest 25 records and monitoring health, and explains alert
thresholds. See `../packages/SHIRATORI_EARTHQUAKE.md` for installation and history
backup instructions. Use the dashboard Raw configuration editor to apply edits.
