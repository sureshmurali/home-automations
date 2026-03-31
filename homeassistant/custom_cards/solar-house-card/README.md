# Solar House Card

Custom Home Assistant Lovelace card that renders an isometric house illustration with real-time solar monitoring overlays — battery level, solar production, and grid usage. Features animated electric flow lines whose speed reflects battery charge, weather-based background images, and fully configurable label positions.

## Configuration

Put artwork in **`assets/`** (e.g. `assets/home.png`); deploy syncs that folder to `config/www/solar-house-card/assets/`.

```yaml
type: custom:solar-house-card
# 🖼️ House illustration (deployed under assets/)
image: /local/solar-house-card/assets/home.png
battery_entity: sensor.solar_31_remaining_stored_electricity_3
solar_power_entity: sensor.solar_31_current_power
grid_entity: sensor.grid_power
show_flow_line: true
```

\* Provide either `image` or `images` (with at least a `default` key). Weather variants should live under `assets/` on disk and use `/local/solar-house-card/assets/...` in YAML.

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| 🖼️ `image` | string | No* | — | Single background image URL (e.g. `/local/solar-house-card/assets/home.png`) |
| 🖼️ `images` | object | No* | — | Map of variant key → URL for weather/time-based backgrounds |
| `weather_entity` | string | No | — | Weather entity (e.g. `weather.home`) to auto-select from `images` |
| `battery_entity` | string | **Yes** | — | Battery level entity (%). Drives flow line visibility and speed |
| `solar_power_entity` | string | No | — | Current solar power (W). Shown in Solar overlay |
| `grid_entity` | string | No | — | Grid import/export entity. Shown in Grid overlay |
| `show_flow_line` | boolean | No | `true` | Show/hide animated flow lines |
| `flow_line_color` | string | No | `#FFF2AF` | Color of the flow line cables |
| `flow_line_scale` | number | No | `1` | Scale factor for the flow path SVG (1 = native Figma size) |
| `flow_animation_duration` | number | No | dynamic | Seconds per glow sweep. Auto-calculated from battery %: 8s at 1%, 3s at 100%. Set to override |
| `flow_animation_delay` | number | No | half of duration | Delay before the second staggered pulse starts |
| `flow_glow_radius` | number | No | `5` | Glow blur radius (pulse glow is auto 2× this value) |
| `positions` | object | No | see below | Override overlay label positions |
| `preview` | boolean | No | `false` | Use hardcoded test data for layout previewing |

## Features

- Isometric house illustration as the card background
- **Live overlays** for Battery, Solar, and Grid with title labels
- **Animated flow lines** — electric glow pulses travel along your custom SVG cable paths; speed is dynamic (faster at higher battery %)
- **Weather-based backgrounds** — swap images automatically by weather state or time of day
- **Configurable positions** — place each overlay label anywhere via YAML (`left`/`top` percentages)
- **Tunable animation** — control glow speed, delay, color, blur radius, and scale
- No HACS required — one JS file, one image

## Quick start

### 1. Build

```bash
cd homeassistant/custom_cards/solar-house-card
npm install
npm run build
```

This produces `dist/solar-house-card.js`.

### 2. Copy files to Home Assistant

```
config/
  www/
    solar-house-card/
      solar-house-card.js   ← from dist/
      assets/
        🖼️  home.png        ← your isometric house image
```

### 3. Add as a Lovelace resource

Go to **Settings → Dashboards → Resources → Add resource**:

| Field | Value |
|-------|-------|
| URL   | `/local/solar-house-card/solar-house-card.js` |
| Type  | **JavaScript Module** |

### 4. Add the card to your dashboard

Open your dashboard, click **Edit → Add Card → Manual**, and paste the YAML from **Configuration** above (adjust entity IDs).

That's it — the card will appear with your house image, live data, and animated flow lines.

## Preview (without Home Assistant)

To test the card in your browser with hardcoded data (Battery 72%, Solar 1.2 kW, Grid 846 kWh):

```bash
npm run preview
```

Open **http://localhost:4173/**. You can also set `preview: true` in the card YAML to use test data inside Home Assistant.

### Overlay positions

Each label is positioned with `left` and `top` as CSS percentages relative to the card. Defaults:

```yaml
positions:
  solar:
    left: "48%"
    top: "14%"
  battery:
    left: "93%"
    top: "53%"
  grid:
    left: "9%"
    top: "18%"
```

### Flow line animation behavior

The flow lines are driven by the **battery entity** value:

| Battery % | Behavior |
|-----------|----------|
| **0%** | Flow lines hidden — only the house image is shown |
| **1–99%** | Flow lines visible, glow speed scales linearly: 8s (slow) at 1% → 3s (fast) at 99% |
| **100%** | Full speed (3s sweeps) |

Two staggered glow pulses travel down the cables for a continuous electricity-flowing effect. You can override the auto speed with `flow_animation_duration`.

### Weather-based backgrounds

Set `images` with variant keys and `weather_entity` to auto-switch:

```yaml
# 🖼️ Weather / time-of-day backgrounds (optional — add files under assets/)
images:
  default: /local/solar-house-card/assets/solar-house-default.png
  sunny: /local/solar-house-card/assets/solar-house-sunny.png
  rainy: /local/solar-house-card/assets/solar-house-rainy.png
  drizzle: /local/solar-house-card/assets/solar-house-drizzle.png
  night: /local/solar-house-card/assets/solar-house-night.png
  day: /local/solar-house-card/assets/solar-house-day.png
  noon: /local/solar-house-card/assets/solar-house-noon.png
weather_entity: weather.home
```

Selection priority: weather state → time of day (`day`/`noon`/`night`) → `default`.

Supported weather state mappings: `sunny`, `clear-day` → sunny; `rainy`, `pouring` → rainy; `drizzle`, `light-rain` → drizzle; `clear-night` → night; `cloudy`, `partlycloudy`, `fog` → day.

## Full example YAML

```yaml
type: custom:solar-house-card

# 🖼️ Background
image: /local/solar-house-card/assets/home.png

# Entities
battery_entity: sensor.solar_31_remaining_stored_electricity_3
solar_power_entity: sensor.solar_31_current_power
grid_entity: sensor.grid_power

# Flow animation
show_flow_line: true
flow_line_color: "#FFF2AF"
flow_glow_radius: 5

# Label positions (adjust to match your illustration)
positions:
  solar:
    left: "48%"
    top: "14%"
  battery:
    left: "93%"
    top: "53%"
  grid:
    left: "9%"
    top: "18%"
```

## Finding your entity IDs

1. Go to **Settings → Developer Tools → States**
2. Search for your solar/inverter integration (e.g. `solar_31`)
3. Look for:
   - **Battery**: entity showing percentage (e.g. `sensor.solar_31_remaining_stored_electricity_3`)
   - **Solar power**: entity showing current watts (e.g. `sensor.solar_31_current_power`)
   - **Grid**: entity showing grid import/export

Your existing battery sensor from `scripts/solar_battery_kitchen_light.yaml` is `sensor.solar_31_remaining_stored_electricity_3`.

## Project structure

```
solar-house-card/
  src/
    solar-house-card.ts   ← Main Lit component
    flow-path.ts          ← SVG flow line path data and position
  dist/
    solar-house-card.js   ← Built bundle (after npm run build)
  preview.html            ← Browser preview page
  example-dashboard.yaml  ← Full example card config
  assets/
    🖼️  home.png          ← Isometric house image
```

No changes to your existing automations or scripts are required — the card only reads entity state.
