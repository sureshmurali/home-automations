/**
 * Solar Dashboard — Full-screen standalone page + HA panel_custom
 *
 * Reuses the SolarHouseCard web component and wraps it in a full-screen
 * layout suitable for wall-mounted tablets, kiosk mode, or an HA sidebar panel.
 *
 * Two operating modes (auto-detected):
 *   1. **Panel custom** — HA injects `hass` via the panel API.
 *   2. **Standalone**  — fetches entity states via HA REST API using a
 *      long-lived access token stored in localStorage.
 */

import { LitElement, html, css, PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";

// Import the card so it registers its custom element
import "solar-house-card/src/solar-house-card.ts";

/* ================================================================
   Types
   ================================================================ */

interface HassState {
  state: string;
  attributes?: Record<string, unknown>;
}

interface HassLike {
  states: Record<string, HassState>;
}

interface SolarDashboardConfig {
  /** HA base URL for standalone REST API mode */
  ha_url?: string;
  /** Long-lived access token (standalone mode). Falls back to localStorage. */
  ha_token?: string;
  /** Polling interval in seconds. Default 30. */
  poll_interval?: number;
  /** Title shown at the top. Default "Solar Dashboard". */
  title?: string;
  /** Show fullscreen toggle button. Default true. */
  show_fullscreen?: boolean;
  /** Show clock. Default true. */
  show_clock?: boolean;

  // Pass-through config for the inner solar-house-card
  image?: string;
  images?: Record<string, string>;
  weather_entity?: string;
  battery_entity: string;
  solar_power_entity?: string;
  grid_entity?: string;
  show_flow_line?: boolean;
  flow_line_scale?: number;
  flow_line_color?: string;
  flow_animation_duration?: number;
  flow_animation_delay?: number;
  flow_glow_radius?: number;
  positions?: Record<string, Record<string, string>>;
  preview?: boolean;
}

/* ================================================================
   Helpers
   ================================================================ */

const LS_TOKEN_KEY = "solar-dashboard-ha-token";
const LS_URL_KEY = "solar-dashboard-ha-url";

function storedToken(): string {
  return localStorage.getItem(LS_TOKEN_KEY) ?? "";
}

function storedUrl(): string {
  return localStorage.getItem(LS_URL_KEY) ?? "";
}

/* ================================================================
   SolarDashboard element
   ================================================================ */

export class SolarDashboard extends LitElement {
  // HA panel API — HA sets this when used as panel_custom
  @property({ attribute: false }) public hass?: HassLike;

  // Panel API — HA sets this for panel_custom
  @property({ attribute: false }) public panel?: { config?: SolarDashboardConfig };

  @state() private _config!: SolarDashboardConfig;
  @state() private _standaloneHass: HassLike = { states: {} };
  @state() private _clock = "";
  @state() private _showSettings = false;
  @state() private _connectionError = "";

  private _pollTimer: ReturnType<typeof setInterval> | null = null;
  private _clockTimer: ReturnType<typeof setInterval> | null = null;

  /* ── Lifecycle ──────────────────────────────────────────────── */

  connectedCallback(): void {
    super.connectedCallback();
    this._updateClock();
    this._clockTimer = setInterval(() => this._updateClock(), 1000);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._pollTimer) clearInterval(this._pollTimer);
    if (this._clockTimer) clearInterval(this._clockTimer);
  }

  /** Called by HA for panel_custom */
  public setConfig(config: SolarDashboardConfig): void {
    this._config = config;
  }

  protected willUpdate(changed: PropertyValues): void {
    // Panel custom: config comes from panel.config
    if (changed.has("panel") && this.panel?.config && !this._config) {
      this._config = this.panel.config;
    }

    // If no config yet, use defaults (preview / standalone)
    if (!this._config) {
      this._config = {
        battery_entity: "sensor.solar_31_remaining_stored_electricity_3",
        solar_power_entity: "sensor.solar_31_current_power",
        image: "/local/solar-house-card/assets/home.png",
        show_flow_line: true,
        preview: true,
        title: "Solar Dashboard",
      };
    }

    // Start standalone polling if no HA hass is provided
    if (!this.hass && !this._pollTimer && !this._config.preview) {
      this._startPolling();
    }
  }

  /* ── Standalone REST API polling ────────────────────────────── */

  private _startPolling(): void {
    const interval = (this._config?.poll_interval ?? 30) * 1000;
    this._fetchStates();
    this._pollTimer = setInterval(() => this._fetchStates(), interval);
  }

  private async _fetchStates(): Promise<void> {
    const url = this._config?.ha_url || storedUrl();
    const token = this._config?.ha_token || storedToken();
    if (!url || !token) return;

    try {
      const resp = await fetch(`${url}/api/states`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!resp.ok) {
        this._connectionError = `HTTP ${resp.status}`;
        return;
      }
      const states: Array<{ entity_id: string; state: string; attributes?: Record<string, unknown> }> = await resp.json();
      const map: Record<string, HassState> = {};
      for (const s of states) {
        map[s.entity_id] = { state: s.state, attributes: s.attributes };
      }
      this._standaloneHass = { states: map };
      this._connectionError = "";
    } catch (e) {
      this._connectionError = String(e);
    }
  }

  /* ── Clock ──────────────────────────────────────────────────── */

  private _updateClock(): void {
    const now = new Date();
    this._clock = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  /* ── Settings overlay ───────────────────────────────────────── */

  private _toggleSettings(): void {
    this._showSettings = !this._showSettings;
  }

  private _saveSettings(e: Event): void {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const url = (form.querySelector("#ha-url") as HTMLInputElement).value.replace(/\/+$/, "");
    const token = (form.querySelector("#ha-token") as HTMLInputElement).value.trim();
    localStorage.setItem(LS_URL_KEY, url);
    localStorage.setItem(LS_TOKEN_KEY, token);
    this._showSettings = false;
    this._fetchStates();
    if (!this._pollTimer) this._startPolling();
  }

  /* ── Fullscreen ─────────────────────────────────────────────── */

  private _toggleFullscreen(): void {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }

  /* ── Render ─────────────────────────────────────────────────── */

  private _cardConfig(): Record<string, unknown> {
    const c = this._config;
    return {
      image: c.image,
      images: c.images,
      weather_entity: c.weather_entity,
      battery_entity: c.battery_entity,
      solar_power_entity: c.solar_power_entity,
      grid_entity: c.grid_entity,
      show_flow_line: c.show_flow_line,
      flow_line_scale: c.flow_line_scale,
      flow_line_color: c.flow_line_color,
      flow_animation_duration: c.flow_animation_duration,
      flow_animation_delay: c.flow_animation_delay,
      flow_glow_radius: c.flow_glow_radius,
      positions: c.positions,
      preview: c.preview,
    };
  }

  private _fullscreenStyleInjected = false;

  protected updated(changed: PropertyValues): void {
    super.updated(changed);
    const card = this.shadowRoot?.querySelector("solar-house-card") as any;
    if (card) {
      try { card.setConfig(this._cardConfig()); } catch { /* already set */ }
      // Always provide a hass object — preview mode needs it even if empty
      const hass = this.hass
        ?? (Object.keys(this._standaloneHass.states).length > 0 ? this._standaloneHass : { states: {} });
      card.hass = hass;

      // Inject fullscreen styles into the card's shadow DOM
      this._injectFullscreenStyles(card);
    }
  }

  private _injectFullscreenStyles(card: HTMLElement): void {
    if (this._fullscreenStyleInjected) return;
    const sr = card.shadowRoot;
    if (!sr) return;

    const style = document.createElement("style");
    style.textContent = `
      :host {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 100% !important;
        height: 100% !important;
      }
      ha-card {
        background: transparent !important;
        border-radius: 0 !important;
        box-shadow: none !important;
      }
      .card-container {
        position: relative !important;
        display: inline-block !important;
        width: auto !important;
        border-radius: 0 !important;
        background: #0a0a0a !important;
      }
      .bg-image {
        display: block !important;
        width: auto !important;
        height: auto !important;
        max-width: 100vw !important;
        max-height: 100vh !important;
      }
      .overlays {
        position: absolute !important;
        inset: 0 !important;
      }
      .flow-layer {
        position: absolute !important;
        inset: 0 !important;
      }
      .flow-layer svg {
        position: absolute !important;
        inset: 0 !important;
        width: 100% !important;
        height: 100% !important;
      }
      .overlay-label {
        font-family: 'Fira Code', monospace !important;
      }
      .overlay-label .label-value {
        font-family: 'Fira Code', monospace !important;
      }
      .overlay-label .label-title {
        font-family: 'Fira Code', monospace !important;
      }
    `;
    sr.appendChild(style);
    this._fullscreenStyleInjected = true;
  }

  static styles = css`
    :host {
      display: block;
      width: 100vw;
      height: 100vh;
      background: #0a0a0a;
      color: #e0e0e0;
      font-family: 'Fira Code', monospace;
      overflow: hidden;
    }

    .dashboard {
      position: relative;
      width: 100%;
      height: 100%;
    }

    /* ── Fullscreen card ─────────────────────────── */
    .card-fullscreen {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .card-fullscreen solar-house-card {
      display: block;
    }

    /* ── Floating header overlay ─────────────────── */
    .header {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      background: linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%);
      z-index: 10;
      pointer-events: none;
    }
    .header > * { pointer-events: auto; }

    .header-title {
      font-size: 1.1rem;
      font-weight: 600;
      letter-spacing: 0.02em;
      opacity: 0.85;
      text-shadow: 0 1px 4px rgba(0,0,0,0.5);
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .clock {
      font-size: 0.95rem;
      font-weight: 500;
      opacity: 0.6;
      font-variant-numeric: tabular-nums;
      text-shadow: 0 1px 4px rgba(0,0,0,0.5);
    }

    .icon-btn {
      background: none;
      border: none;
      color: #e0e0e0;
      opacity: 0.5;
      cursor: pointer;
      padding: 4px;
      font-size: 1.1rem;
      line-height: 1;
      transition: opacity 0.2s;
      text-shadow: 0 1px 4px rgba(0,0,0,0.5);
    }
    .icon-btn:hover { opacity: 0.9; }

    /* ── Address label (bottom-left corner) ───── */
    .address-label {
      position: absolute;
      bottom: 16px;
      left: 20px;
      font-size: 0.7rem;
      font-weight: 400;
      letter-spacing: 0.05em;
      opacity: 0.35;
      z-index: 10;
      text-shadow: 0 1px 4px rgba(0,0,0,0.5);
    }

    /* ── Connection status (floating bottom) ────── */
    .status-bar {
      position: absolute;
      bottom: 12px;
      left: 0;
      right: 0;
      font-size: 0.75rem;
      opacity: 0.4;
      text-align: center;
      z-index: 10;
      text-shadow: 0 1px 4px rgba(0,0,0,0.5);
    }
    .status-bar.error {
      color: #ff6b6b;
      opacity: 0.8;
    }

    /* ── Settings overlay ──────────────────────── */
    .settings-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.85);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
    }

    .settings-panel {
      background: #1c1c1c;
      border-radius: 16px;
      padding: 24px;
      width: 90%;
      max-width: 400px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
    }

    .settings-panel h2 {
      margin: 0 0 16px 0;
      font-size: 1rem;
      font-weight: 600;
    }

    .settings-panel label {
      display: block;
      margin-bottom: 4px;
      font-size: 0.8rem;
      opacity: 0.7;
    }

    .settings-panel input {
      width: 100%;
      padding: 8px 10px;
      margin-bottom: 12px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 8px;
      background: #111;
      color: #e0e0e0;
      font-size: 0.85rem;
      box-sizing: border-box;
    }
    .settings-panel input:focus {
      outline: none;
      border-color: rgba(255, 255, 255, 0.3);
    }

    .settings-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      margin-top: 8px;
    }

    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 8px;
      font-size: 0.85rem;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-primary {
      background: #3b82f6;
      color: #fff;
    }
    .btn-primary:hover { background: #2563eb; }
    .btn-secondary {
      background: rgba(255, 255, 255, 0.1);
      color: #e0e0e0;
    }
    .btn-secondary:hover { background: rgba(255, 255, 255, 0.15); }

  `;

  render() {
    const cfg = this._config;
    if (!cfg) return html`<div class="dashboard"><p>Loading…</p></div>`;

    const title = cfg.title ?? "Solar Dashboard";
    const showClock = cfg.show_clock !== false;
    const showFs = cfg.show_fullscreen !== false;
    const isPanel = !!this.hass;
    const hasStandalone = Object.keys(this._standaloneHass.states).length > 0;

    return html`
      <div class="dashboard">
        <div class="card-fullscreen">
          <solar-house-card></solar-house-card>
        </div>

        <div class="header">
          <span class="header-title">${title}</span>
          <div class="header-right">
            ${showClock ? html`<span class="clock">${this._clock}</span>` : ""}
            ${!isPanel ? html`
              <button class="icon-btn" @click=${this._toggleSettings} title="Settings">⚙</button>
            ` : ""}
            ${showFs ? html`
              <button class="icon-btn" @click=${this._toggleFullscreen} title="Fullscreen">⛶</button>
            ` : ""}
          </div>
        </div>

        <div class="address-label">Shiratori 2-3-13</div>

        ${this._connectionError
          ? html`<div class="status-bar error">Connection error: ${this._connectionError}</div>`
          : !isPanel && !cfg.preview
            ? html`<div class="status-bar">${hasStandalone ? "Live" : "Not connected"} · Polling every ${cfg.poll_interval ?? 30}s</div>`
            : ""}
      </div>

      ${this._showSettings ? html`
        <div class="settings-overlay" @click=${(e: Event) => { if (e.target === e.currentTarget) this._showSettings = false; }}>
          <div class="settings-panel">
            <h2>Connection Settings</h2>
            <form @submit=${this._saveSettings}>
              <label for="ha-url">Home Assistant URL</label>
              <input id="ha-url" type="url" placeholder="http://ohana-pi.local:8123" .value=${storedUrl()} required />
              <label for="ha-token">Long-Lived Access Token</label>
              <input id="ha-token" type="password" placeholder="eyJ0..." .value=${storedToken()} required />
              <div class="settings-actions">
                <button type="button" class="btn btn-secondary" @click=${() => this._showSettings = false}>Cancel</button>
                <button type="submit" class="btn btn-primary">Save & Connect</button>
              </div>
            </form>
          </div>
        </div>
      ` : ""}
    `;
  }
}

/* ── Register element ──────────────────────────────────────────── */

if (!customElements.get("solar-dashboard")) {
  customElements.define("solar-dashboard", SolarDashboard);
}

// HA panel_custom registration
if (typeof window !== "undefined") {
  (window as any).customPanels = (window as any).customPanels || [];
}
