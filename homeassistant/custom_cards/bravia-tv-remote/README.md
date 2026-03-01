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

## Installation & Deployment

### Step 1: Build the Card

```bash
cd homeassistant/custom_cards/bravia-tv-remote
npm install
npm run build
```

This creates `dist/bravia-tv-remote.js` (the compiled card).

### Step 2: Deploy to Home Assistant

You have several options to deploy the card to your Home Assistant instance:

#### Option A: Direct File Copy (Local Installation)

If you have direct access to your Home Assistant configuration directory:

```bash
# Copy the built file to Home Assistant's www directory
cp dist/bravia-tv-remote.js /path/to/homeassistant/config/www/

# Example paths:
# Docker: /volume1/docker/homeassistant/config/www/
# HAOS: /config/www/
# Core: ~/.homeassistant/www/
```

#### Option B: Using Samba/SMB Share

1. Connect to your Home Assistant via network share (Samba/SMB)
2. Navigate to the `config/www/` folder
3. Copy `dist/bravia-tv-remote.js` into this folder

#### Option C: Using File Editor Add-on

1. Install the **File Editor** add-on from Home Assistant
2. Create the `www` folder if it doesn't exist
3. Upload `dist/bravia-tv-remote.js` to `config/www/`

#### Option D: Using SSH/Terminal

```bash
# SSH into your Home Assistant instance
ssh root@homeassistant.local

# Create www directory if it doesn't exist
mkdir -p /config/www

# Exit SSH and copy file from your local machine
scp dist/bravia-tv-remote.js root@homeassistant.local:/config/www/
```

### Step 3: Register the Resource in Home Assistant

1. Go to **Settings → Dashboards → Resources** (top-right menu)
2. Click **+ Add Resource**
3. Configure:
   - **URL**: `/local/bravia-tv-remote.js`
   - **Resource type**: JavaScript Module
4. Click **Create**

> **Note**: You may need to clear your browser cache (Ctrl+Shift+R or Cmd+Shift+R) after adding the resource.

### Step 4: Add the Card to Your Dashboard

#### Using the UI Editor:

1. Edit your dashboard
2. Click **+ Add Card**
3. Search for "Bravia TV Remote"
4. Configure the entity

#### Using YAML:

```yaml
type: custom:bravia-tv-remote
entity: media_player.android_tv_192_168_11_26
```

### Updating the Card

When you make changes and rebuild:

```bash
npm run build
# Copy the new dist/bravia-tv-remote.js to /config/www/
# Clear browser cache and refresh Home Assistant
```

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

### Local Preview with Hot Reload

```bash
npm run preview:card
# or
npm run dev
```

This starts Vite's dev server at `http://localhost:5012` with hot module replacement (HMR). Any changes to the source code will automatically reload in the browser.

### Build for Production

```bash
npm run build
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
