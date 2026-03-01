# Bravia TV Remote

A Home Assistant Lovelace custom card that provides a **full remote control** for your Sony Bravia Android TV, styled to resemble the physical remote with tactile button designs.

![card-type](https://img.shields.io/badge/card-custom-blue) ![ha](https://img.shields.io/badge/home--assistant-custom--card-41BDF5)

## Features

- **Now Playing** — displays current media title, artist, and album art
- **App Launchers** — quick launch buttons for YouTube, Netflix, YouTube Music, and IPTV
- **Power** toggle with on/off state indicator
- **D-pad** — circular disc with directional arrows and a central OK button
- **Navigation** — Back and Home buttons
- **Volume** — rocker-style up/down with a separate Mute toggle
- **Input / Settings** — HDMI input selector and quick settings menu
- **Color buttons** — Blue, Red, Green, Yellow (standard Bravia remote colors)
- **Media transport** — Play/Pause, Rewind, Fast Forward, Previous, Stop, Next

All controls send ADB commands via the `androidtv.adb_command` service or use built-in `media_player` services.

## Prerequisites

- **Home Assistant** with the [Android TV integration](https://www.home-assistant.io/integrations/androidtv/) configured
- ADB connection to your Sony Bravia Android TV

## Installation

1. Build the card:

   ```bash
   cd homeassistant/custom_cards/bravia-tv-remote
   npm install
   npm run build
   ```

2. Copy the built file to Home Assistant:

   ```
   dist/bravia-tv-remote.js  →  config/www/bravia-tv-remote.js
   ```

3. Add the resource in Home Assistant:

   **Settings → Dashboards → Resources → Add Resource**

   | Field | Value |
   |-------|-------|
   | URL   | `/local/bravia-tv-remote.js` |
   | Type  | JavaScript Module |

4. Add the card to a dashboard via the **Manual** or **Code editor**.

## Configuration

```yaml
type: custom:bravia-tv-remote
entity: media_player.android_tv_192_168_11_26
apps:
  - name: YouTube
    icon: youtube
    package: com.google.android.youtube.tv
  - name: YouTube Music
    icon: youtube-music
    package: com.google.android.apps.youtube.music
  - name: Netflix
    icon: netflix
    package: com.netflix.ninja
  - name: IPTV
    icon: tv
    package: ru.iptvremote.android.iptv
```

### Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `entity` | string | **Yes** | — | Your Android TV `media_player` entity ID |
| `apps` | array | No | YouTube, YouTube Music, Netflix, IPTV | List of app launcher buttons to display |

### App Configuration

Each app in the `apps` array has the following properties:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | **Yes** | Display name for the app |
| `icon` | string | **Yes** | Icon identifier (`youtube`, `youtube-music`, `netflix`, `tv`) |
| `package` | string | **Yes** | Android package name for the app |

## Button Reference

### Top Row

| Button | Service | Command / Action |
|--------|---------|-----------------|
| Input | `androidtv.adb_command` | `input keyevent KEYCODE_TV_INPUT` |
| Power | `media_player.turn_on` / `turn_off` | Toggles TV power based on current state |
| Settings | `androidtv.adb_command` | `input keyevent KEYCODE_MENU` |

### D-pad

| Button | ADB Key |
|--------|---------|
| Up | `KEYCODE_DPAD_UP` |
| Down | `KEYCODE_DPAD_DOWN` |
| Left | `KEYCODE_DPAD_LEFT` |
| Right | `KEYCODE_DPAD_RIGHT` |
| OK (center) | `KEYCODE_DPAD_CENTER` |

### Navigation

| Button | ADB Key |
|--------|---------|
| Back | `KEYCODE_BACK` |
| Home | `KEYCODE_HOME` |

### Volume

| Button | Service |
|--------|---------|
| Volume + | `media_player.volume_up` |
| Volume − | `media_player.volume_down` |
| Mute | `media_player.volume_mute` (toggles `is_volume_muted`) |

### Color Buttons

| Button | ADB Key |
|--------|---------|
| Blue | `KEYCODE_PROG_BLUE` |
| Red | `KEYCODE_PROG_RED` |
| Green | `KEYCODE_PROG_GREEN` |
| Yellow | `KEYCODE_PROG_YELLOW` |

### Media Transport

| Button | ADB Key / Service |
|--------|------------------|
| Rewind | `KEYCODE_MEDIA_REWIND` |
| Play/Pause | `media_player.media_play_pause` |
| Fast Forward | `KEYCODE_MEDIA_FAST_FORWARD` |
| Previous | `KEYCODE_MEDIA_PREVIOUS` |
| Stop | `KEYCODE_MEDIA_STOP` |
| Next | `KEYCODE_MEDIA_NEXT` |

## Remote Layout

```
    ┌─────────────────────────┐
    │  [INPUT]   ⏻   [SETTINGS] │
    │                           │
    │         ┌─────┐           │
    │         │  ▲  │           │
    │     ◄   │ OK  │   ►       │
    │         │  ▼  │           │
    │         └─────┘           │
    │                           │
    │     [BACK]   [HOME]       │
    │  ─────────────────────    │
    │   [+]                     │
    │   VOL    [MUTE]           │
    │   [−]                     │
    │  ─────────────────────    │
    │   ■ ■ ■ ■  (color btns)  │
    │  ─────────────────────    │
    │  [REW]  [PLAY]  [FF]      │
    │  [PREV] [STOP]  [NEXT]    │
    └─────────────────────────┘
```

## Development

Preview the card locally:

```bash
npm run build
npx serve -p 5012 .
# Open http://localhost:5012/preview.html
```

The preview logs all ADB/service calls to the browser console and displays the last command in the status bar.

## Entity Attributes Used

| Attribute | Usage |
|-----------|-------|
| `state` | Power button color (green when on, grey when off); Play/Pause icon toggle |
| `is_volume_muted` | Mute button state |
| `media_title` | Displayed in now playing section |
| `media_artist` | Displayed in now playing section |
| `entity_picture` | Album/media artwork in now playing section |
| `app_id` | Used to highlight the currently active app |
| `app_name` | Fallback app name display |
| `source` | Alternative app name source |

## Using with Companion Card

This remote card is designed to work alongside the bravia-tv-display card:

```yaml
# Example: Horizontal layout with both cards
type: horizontal-stack
cards:
  - type: custom:bravia-tv-display
    entity: media_player.android_tv_192_168_11_26
    image: /local/bravia-tv.png

  - type: custom:bravia-tv-remote
    entity: media_player.android_tv_192_168_11_26
```
