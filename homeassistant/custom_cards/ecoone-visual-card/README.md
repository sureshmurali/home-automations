# Eco One Visual Card

A premium-minimal Home Assistant Lovelace custom card that visualizes a Rinnai Eco One heat pump + tank system. Uses a photograph of your outdoor unit as a background with animated SVG overlays driven by real-time entity states.

## Features

- **Tank fill level** — hot water level shown as an animated orange fill over a blue cold-water base
- **Fan rotation** — heat pump fan spins when heating is active
- **Status indicators** — SVG-based indicators for Heating, Not Heating, Supplying Hot Water, and System Fault
- **Fault alert** — red overlay flash across the entire card with a pulsing warning badge
- **Supply pulse** — pulsing indicator when hot water is actively being supplied
- **Inactive state** — card desaturates when the system is off
- **Responsive** — scales to any card width using ResizeObserver

## Deployment to Home Assistant

### 1. Build the card

```bash
cd homeassistant/custom_cards/ecoone-visual-card
npm install
npm run build
```

This produces `dist/ecoone-visual-card.js`.

### 2. Copy files to Home Assistant

Copy these files into your Home Assistant `config/www/` directory:

```
config/www/ecoone-visual-card.js      ← from dist/ecoone-visual-card.js
config/www/EcoOneIllustration.png     ← your background photo
```

You can copy via Samba share, SSH/SCP, or the File Editor add-on:

```bash
scp dist/ecoone-visual-card.js homeassistant:/config/www/
scp EcoOneIllustration.png homeassistant:/config/www/
```

### 3. Register the resource

Go to **Settings → Dashboards → ⋮ (three dots) → Resources** and add:

| URL                                  | Type              |
|--------------------------------------|-------------------|
| `/local/ecoone-visual-card.js`       | JavaScript Module |

Or add it manually in your Lovelace configuration YAML:

```yaml
resources:
  - url: /local/ecoone-visual-card.js
    type: module
```

### 4. Add the card to a dashboard

Open a dashboard, click **Edit → Add Card → Manual**, and paste:

```yaml
type: custom:ecoone-visual-card
image: /local/EcoOneIllustration.png
entities:
  fault: binary_sensor.omron_fault_status_4
  supply_status: sensor.omron_hot_water_supply_status
  heating_status: sensor.omron_water_heating_status
  operation_status: sensor.omron_operation_status
  tank_capacity_l: sensor.omron_tank_capacity
  hot_water_remaining_l: sensor.omron_measured_amount_of_hot_water_remaining_in_tank
```

### 5. Restart or refresh

After adding the resource, do a **hard refresh** in your browser (Ctrl+Shift+R / Cmd+Shift+R) or restart Home Assistant.

## Configuration Reference

| Key | Required | Description |
|-----|----------|-------------|
| `image` | Yes | Path to the background photo (e.g. `/local/EcoOneIllustration.png`) |
| `aspect_ratio` | No | Override aspect ratio (`"auto"`, `"16:9"`, `"4:3"`, etc.) |
| `entities.fault` | Yes | Binary sensor for fault status (`on` = fault) |
| `entities.supply_status` | Yes | Sensor: `"Supplying Hot Water"` or `"Stopped"` |
| `entities.heating_status` | Yes | Sensor: `"Heating"` or `"Not Heating"` |
| `entities.operation_status` | Yes | Sensor: `"On"` or `"Off"` |
| `entities.tank_capacity_l` | Yes | Sensor: tank capacity in litres |
| `entities.hot_water_remaining_l` | Yes | Sensor: hot water remaining in litres |
| `entities.cumulative_kwh` | No | Sensor: cumulative energy consumption |
| `entities.schedule` | No | Sensor: solar utilization schedule |

## Entity States

| Entity | Active Value | Inactive Value |
|--------|-------------|----------------|
| `fault` | `on` | `off` |
| `supply_status` | `Supplying Hot Water` | `Stopped` |
| `heating_status` | `Heating` | `Not Heating` |
| `operation_status` | `On` | `Off` / `unavailable` |

## Visual Behavior

| State | Visual Effect |
|-------|--------------|
| **Heating** | Fan spins, warm glow overlay, "HEATING" indicator appears |
| **Not Heating** | Fan stops, "NOT HEATING" indicator with crossed flame |
| **Supplying Hot Water** | "SUPPLYING HOT WATER" indicator pulses (1s cycle) |
| **Fault** | Red flash overlay on entire card, fault badge pulses |
| **System Off** | Card desaturates, all animations pause |
| **Tank Level** | Orange fill height matches hot water percentage |

## Local Preview

To test locally without Home Assistant:

```bash
npm run build
npx serve -p 5001 .
```

Open `http://localhost:5001/preview.html` — use the toggle buttons and sliders to simulate different states.

## Updating

After making changes to `src/ecoone-visual-card.ts`:

```bash
npm run build
```

Then copy the updated `dist/ecoone-visual-card.js` to `config/www/` and hard-refresh your browser.
