# Home Assistant – Next train (Aoto & Keisei-Ueno)

Script for Home Assistant that announces the next train to **Aoto** and **Keisei-Ueno** from Ohanajaya, using your existing Alexa devices.

**Tests** (same logic as the script, run from repo root):
```bash
python3 -m tests.test_next_train -v
```
Optional: `pip install pytest` then `pytest tests/ -v`.

## Setup

1. **Time zone**  
   Set Home Assistant’s time zone to **Asia/Tokyo**:  
   **Settings → General → Time zone** (or `time_zone: Asia/Tokyo` in `configuration.yaml`).

2. **Script**  
   - Copy `scripts/next_train_alexa.yaml` into your HA config (e.g. under `config/scripts.yaml` or include it from `configuration.yaml`).
   - Or in the UI: **Settings → Automations & Scenes → Scripts → Add script**, then paste the actions and use the same `variables` / `message_text` template.

3. **Alexa targets**  
   Update the `target` list under `notify.alexa_media` if your entity IDs differ:
   - `media_player.bedroom_echo_dot`
   - `media_player.echo_show`
   - `media_player.hall_echo_dot`

## Behaviour

- **Walk time**: The script uses a **walk time** (default **10 minutes**) so the “next train” is the first one you can catch after leaving now. Change the `walk_minutes` variable at the top of the script to match your door-to-platform time.
- **Schedule**: Uses **weekday** or **weekend** schedule depending on the current day.
- **Holidays**: If the current date is a Japanese national holiday, the **weekend** schedule is used (even on weekdays).
- **Message**:  
  `Your next train to Aoto is 17 34 and for Keisei-Ueno is 17 36`  
  Times are formatted with a space for TTS (e.g. “17 34” instead of “17:34”).

## Data (Aoto / Keisei-Ueno / holidays)

- **Aoto** times are fully embedded from your JSON (weekday and weekend).
- **Keisei-Ueno** times are in the same structure; the script uses a filled placeholder list. If your real `toKeiseiUeno` JSON has different times, replace the `ueno_weekday` and `ueno_weekend` lists in the template with your full `depart` (and optional `durationMin`) entries.
- **Japan holidays** for 2026–2030 are embedded; add or edit the `holidays_YYYY` lists if you need more years or different dates.

## Dashboard

- **[Solar House Card](custom_cards/solar-house-card/)** — Custom Lovelace card that shows an isometric house with solar monitoring (battery, production, grid), weather-based image variants, and configurable overlay positions. Build with `npm run build` in that folder, then copy `dist/solar-house-card.js` to HA `config/www/` and add as a resource. See the card README and `example-dashboard.yaml` for config.

## Example message

When run at 17:30 on a weekday:  
*“Your next train to Aoto is 17 36 and for Keisei-Ueno is 17 40.”*
