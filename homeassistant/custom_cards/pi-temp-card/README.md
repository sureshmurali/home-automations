# Pi Temperature Card

A simple, color-coded Raspberry Pi CPU temperature card for Home Assistant.

No fan, no controls — just a clear at-a-glance indicator of whether your Pi is running fine or getting too hot.

## Prerequisites — Getting the Temperature Sensor

If Home Assistant is running on the Raspberry Pi itself:

1. Go to **Settings → Devices & Services → Add Integration**
2. Search for **System Monitor** and add it
3. Enable the **Processor Temperature** sensor
4. The entity will appear as `sensor.processor_temperature`

If HA is on a different machine, you'll need to expose the Pi's CPU temp via MQTT, REST, or a `command_line` sensor reading `/sys/class/thermal/thermal_zone0/temp`.

## Installation

```bash
cd homeassistant/custom_cards/pi-temp-card
npm install
npm run build
```

The built file lands in `dist/pi-temp-card.js`.

### Deploy to your Pi

From the `homeassistant/custom_cards/` root:

```bash
# Build all cards and deploy
npm run deploy

# Or deploy just this card (must be built first)
npm run deploy:card -- pi-temp-card
```

### Manual install

Copy `dist/pi-temp-card.js` to your HA config:

```
config/www/pi-temp-card/pi-temp-card.js
```

Then add the resource in HA:

**Settings → Dashboards → Resources → Add Resource**

- URL: `/local/pi-temp-card/pi-temp-card.js`
- Type: JavaScript Module

## Configuration

```yaml
type: custom:pi-temp-card
entity: sensor.processor_temperature
```

### Full options

```yaml
type: custom:pi-temp-card
entity: sensor.processor_temperature
name: "Ohana Pi"              # optional, default "Raspberry Pi"
thresholds:                   # optional, all values in °C
  cool: 50                    # below → "Running Cool" (green)
  normal: 65                  # below → "Normal" (teal)
  warm: 75                    # below → "Getting Warm" (amber)
  hot: 80                     # below → "Running Hot" (orange)
                              # above → "Overheating!" (red)
```

### Temperature zones

| Zone     | Default range | Color  | Label          | Notes                       |
|----------|--------------|--------|----------------|-----------------------------|
| Cool     | < 50°C       | Green  | Running Cool   | Idle / light load           |
| Normal   | 50–65°C      | Teal   | Normal         | Typical under load          |
| Warm     | 65–75°C      | Amber  | Getting Warm   | Sustained heavy load        |
| Hot      | 75–80°C      | Orange | Running Hot    | Approaching throttle point  |
| Critical | > 80°C       | Red    | Overheating!   | Pi 4 throttles at 80°C      |

The accent bar pulses when in Hot or Critical zones.

## Theming

All colors are exposed as CSS custom properties on `:host`, overridable via `card_mod` or your HA theme:

```yaml
card_mod:
  style: |
    pi-temp-card {
      --pi-color-cool: #4caf50;
      --pi-color-normal: #26a69a;
      --pi-color-warm: #ffa726;
      --pi-color-hot: #ff7043;
      --pi-color-critical: #ef5350;
    }
```

## Local Preview

```bash
npm run preview
```

Opens a browser at `http://localhost:5020` with a temperature slider to simulate all zones.
