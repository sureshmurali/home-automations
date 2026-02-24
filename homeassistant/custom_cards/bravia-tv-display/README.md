# Bravia TV Display

A Home Assistant Lovelace custom card that renders your TV photo with a **live ADB screenshot overlay**, showing exactly what's on screen in real time.

![card-type](https://img.shields.io/badge/card-custom-blue) ![ha](https://img.shields.io/badge/home--assistant-custom--card-41BDF5)

## Features

- Displays your actual TV photo as the card background
- Overlays a live ADB screenshot on the screen area, refreshing automatically
- Pulsing green "live" indicator when the screen capture is active
- Hover-to-reveal info bar showing the current app and media title
- Fallback display when the TV is off or no screenshot is available (shows app badge, title, artist, or power icon)
- Fully configurable screen position to match any TV photo

## Prerequisites

- **Home Assistant** with the [Android TV integration](https://www.home-assistant.io/integrations/androidtv/) configured
- ADB connection to your Sony Bravia Android TV (provides the `entity_picture` screenshot)
- A photo of your TV (used as the card background)

## Installation

1. Build the card:

   ```bash
   cd homeassistant/custom_cards/bravia-tv-display
   npm install
   npm run build
   ```

2. Copy the built file to Home Assistant:

   ```
   dist/bravia-tv-display.js  →  config/www/bravia-tv-display.js
   ```

3. Copy your TV photo:

   ```
   bravia-tv.png  →  config/www/bravia-tv.png
   ```

4. Add the resource in Home Assistant:

   **Settings → Dashboards → Resources → Add Resource**

   | Field | Value |
   |-------|-------|
   | URL   | `/local/bravia-tv-display.js` |
   | Type  | JavaScript Module |

5. Add the card to a dashboard via the **Manual** or **Code editor**.

## Configuration

```yaml
type: custom:bravia-tv-display
entity: media_player.android_tv_192_168_11_26
image: /local/bravia-tv.png
```

### Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `entity` | string | **Yes** | — | Your Android TV `media_player` entity ID |
| `image` | string | **Yes** | — | Path to the TV photo (e.g. `/local/bravia-tv.png`) |
| `screen_position` | object | No | *(see below)* | Position of the screen overlay on the TV photo |
| `screen_refresh` | number | No | `10` | Seconds between screenshot refreshes |

### Screen Position

The screen overlay is positioned using **percentage values** relative to the TV photo dimensions. The defaults match the included `bravia-tv.png`:

```yaml
screen_position:
  top: 39.63      # % from the top of the image
  left: 29.65     # % from the left of the image
  width: 43.15    # % of image width
  height: 29.99   # % of image height
```

To calculate for your own photo, measure the screen area in pixels and divide by the full image dimensions:

```
top    = (screen_top_px    / image_height_px) × 100
left   = (screen_left_px   / image_width_px)  × 100
width  = (screen_width_px  / image_width_px)  × 100
height = (screen_height_px / image_height_px) × 100
```

### How the Live Screen Works

The card uses the `entity_picture` attribute from the Android TV integration, which provides an ADB screenshot of the TV. It appends a cache-busting parameter (`?_cb=<timestamp>`) and refreshes at the configured interval to simulate a live feed.

## Development

Preview the card locally:

```bash
npm run build
npx serve -p 5010 .
# Open http://localhost:5010/preview.html
```

The preview includes state-toggle buttons (Off / Idle / YouTube / YT Music / Netflix) with mock data and simulated screenshots.

## Entity Attributes Used

| Attribute | Usage |
|-----------|-------|
| `state` | Determines if TV is on/off |
| `entity_picture` | ADB screenshot URL (the live screen image) |
| `app_id` | Identifies the running app for icon/color |
| `app_name` | Displayed in the info bar and fallback |
| `media_title` | Current media title |
| `media_artist` | Current media artist |

## Recognized Apps

The card displays branded colors and labels for these apps automatically:

| Package | Label |
|---------|-------|
| `com.google.android.youtube.tv` | YouTube |
| `com.google.android.apps.youtube.music` | YouTube Music |
| `com.netflix.ninja` | Netflix |
| `com.google.android.tvlauncher` | Home |
| `com.sony.dtv.tvx` | Live TV |
| `com.disney.disneyplus` | Disney+ |
| `com.amazon.amazonvideo.livingroom` | Prime Video |
| `com.apple.atve.androidtv.appletv` | Apple TV |
| `com.plexapp.android` | Plex |
