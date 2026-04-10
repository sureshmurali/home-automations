# Solar Dashboard

Full-screen solar house dashboard for Home Assistant — works as both a **standalone web page** (kiosk/tablet) and an **HA sidebar panel** (`panel_custom`).

Reuses the `solar-house-card` visualization (isometric house, battery/solar/grid overlays, flow line animations).

## Quick Start

```bash
# Install & preview locally
npm install
npm run preview        # → http://localhost:5001

# Build for deployment
npm run build          # → dist/solar-dashboard.js + dist/index.html
```

## Deployment

### Option A: Standalone Page (kiosk/tablet)

Deploy via the parent orchestrator:

```bash
# From custom_cards/
npm run deploy
```

Access at: `http://ohana-pi.local:8123/local/solar-dashboard/index.html`

On first load, click ⚙ to enter your HA URL and long-lived access token. These are saved in `localStorage`.

### Option B: HA Sidebar Panel

1. Deploy `solar-dashboard.js` to `config/www/solar-dashboard/`
2. Add the snippet from `example-panel-custom.yaml` to your `configuration.yaml`
3. Restart Home Assistant
4. "Solar" appears in the sidebar

### Option C: Both

Use both! The standalone page works independently, and the sidebar panel integrates into HA's UI.

## Configuration

| Key | Default | Description |
|-----|---------|-------------|
| `title` | `"Solar Dashboard"` | Header title |
| `show_clock` | `true` | Show clock in header |
| `show_fullscreen` | `true` | Show fullscreen toggle |
| `ha_url` | — | HA base URL (standalone mode) |
| `ha_token` | — | Long-lived access token (standalone mode) |
| `poll_interval` | `30` | Seconds between REST API polls |
| `image` | — | Background image path |
| `battery_entity` | *required* | Battery sensor entity ID |
| `solar_power_entity` | — | Solar power sensor entity ID |
| `grid_entity` | — | Grid sensor entity ID |
| `show_flow_line` | `true` | Show animated flow lines |
| `preview` | `false` | Use hardcoded mock data |
