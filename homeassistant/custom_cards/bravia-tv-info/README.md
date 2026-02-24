# Bravia TV Info

A Home Assistant Lovelace custom card that shows **currently playing media info** and **app launcher buttons** for your Sony Bravia Android TV.

![card-type](https://img.shields.io/badge/card-custom-blue) ![ha](https://img.shields.io/badge/home--assistant-custom--card-41BDF5)

## Features

- "Now Playing" bar with album art (from `entity_picture`), media title, and artist
- Shows the current app name and state when no media is playing
- App launcher buttons that open apps on the TV via ADB
- Active app highlighting with branded colors
- Default apps: YouTube, YouTube Music, Netflix (fully customizable)

## Prerequisites

- **Home Assistant** with the [Android TV integration](https://www.home-assistant.io/integrations/androidtv/) configured
- ADB connection to your Sony Bravia Android TV

## Installation

1. Build the card:

   ```bash
   cd homeassistant/custom_cards/bravia-tv-info
   npm install
   npm run build
   ```

2. Copy the built file to Home Assistant:

   ```
   dist/bravia-tv-info.js  →  config/www/bravia-tv-info.js
   ```

3. Add the resource in Home Assistant:

   **Settings → Dashboards → Resources → Add Resource**

   | Field | Value |
   |-------|-------|
   | URL   | `/local/bravia-tv-info.js` |
   | Type  | JavaScript Module |

4. Add the card to a dashboard via the **Manual** or **Code editor**.

## Configuration

### Minimal

```yaml
type: custom:bravia-tv-info
entity: media_player.android_tv_192_168_11_26
```

### With custom apps

```yaml
type: custom:bravia-tv-info
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
```

### Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `entity` | string | **Yes** | — | Your Android TV `media_player` entity ID |
| `apps` | list | No | *(see below)* | App launcher buttons to display |

### App Configuration

Each app in the `apps` list has these properties:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | Yes | Display label under the button |
| `icon` | string | Yes | Icon key: `youtube`, `youtube-music`, or `netflix` |
| `package` | string | Yes | Android package name (used with ADB `monkey` command) |

**Default apps** (used when `apps` is not specified):

| Name | Package | Icon |
|------|---------|------|
| YouTube | `com.google.android.youtube.tv` | `youtube` |
| YouTube Music | `com.google.android.apps.youtube.music` | `youtube-music` |
| Netflix | `com.netflix.ninja` | `netflix` |

### How App Launching Works

Tapping an app button sends an ADB command via the `androidtv.adb_command` service:

```
monkey -p <package> -c android.intent.category.LAUNCHER 1
```

This is the same command used by the Home Assistant Android TV scripts.

## Development

Preview the card locally:

```bash
npm run build
npx serve -p 5011 .
# Open http://localhost:5011/preview.html
```

The preview includes state-toggle buttons to simulate different TV states and media playback.

## Entity Attributes Used

| Attribute | Usage |
|-----------|-------|
| `state` | Displayed when no media is playing |
| `entity_picture` | Album art / thumbnail in the Now Playing bar |
| `app_id` | Identifies the running app; highlights the active app button |
| `app_name` | Shown in the Now Playing bar |
| `media_title` | Current media title |
| `media_artist` | Current media artist |

## Recognized Apps

Active app highlighting uses branded colors for these packages:

| Package | Label | Color |
|---------|-------|-------|
| `com.google.android.youtube.tv` | YouTube | Red |
| `com.google.android.apps.youtube.music` | YouTube Music | Red |
| `com.netflix.ninja` | Netflix | Red |
| `com.google.android.tvlauncher` | Home | Blue |
| `com.sony.dtv.tvx` | Live TV | Blue |
| `com.disney.disneyplus` | Disney+ | Blue |
| `com.amazon.amazonvideo.livingroom` | Prime Video | Cyan |
| `com.apple.atve.androidtv.appletv` | Apple TV | Grey |
| `com.plexapp.android` | Plex | Gold |
