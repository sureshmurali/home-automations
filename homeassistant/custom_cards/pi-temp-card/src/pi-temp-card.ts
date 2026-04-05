import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";

/* ================================================================
   Types
   ================================================================ */

interface Thresholds {
  cool: number;
  normal: number;
  warm: number;
  hot: number;
}

interface PiTempCardConfig {
  entity: string;
  name?: string;
  thresholds?: Partial<Thresholds>;
  preview?: boolean;
}

interface HassEntity {
  state: string;
  attributes?: Record<string, unknown>;
}

interface Hass {
  states: Record<string, HassEntity>;
}

/* ================================================================
   Constants
   ================================================================ */

const DEFAULT_THRESHOLDS: Thresholds = {
  cool: 50,
  normal: 65,
  warm: 75,
  hot: 80,
};

type ThermalZone = "cool" | "normal" | "warm" | "hot" | "critical";

interface ZoneInfo {
  zone: ThermalZone;
  label: string;
  color: string;
  iconColor: string;
}

function classifyTemp(temp: number, t: Thresholds): ZoneInfo {
  if (temp < t.cool) {
    return { zone: "cool", label: "Running Cool", color: "var(--pi-color-cool)", iconColor: "var(--pi-icon-cool)" };
  }
  if (temp < t.normal) {
    return { zone: "normal", label: "Normal", color: "var(--pi-color-normal)", iconColor: "var(--pi-icon-normal)" };
  }
  if (temp < t.warm) {
    return { zone: "warm", label: "Getting Warm", color: "var(--pi-color-warm)", iconColor: "var(--pi-icon-warm)" };
  }
  if (temp < t.hot) {
    return { zone: "hot", label: "Running Hot", color: "var(--pi-color-hot)", iconColor: "var(--pi-icon-hot)" };
  }
  return { zone: "critical", label: "Overheating!", color: "var(--pi-color-critical)", iconColor: "var(--pi-icon-critical)" };
}

/* Thermometer fill runs from 0 at ~30 °C to 100% at ~90 °C */
function fillPercent(temp: number): number {
  return Math.max(0, Math.min(100, ((temp - 30) / 60) * 100));
}

/* ================================================================
   Component
   ================================================================ */

export class PiTempCard extends LitElement {
  @property({ attribute: false }) public hass!: Hass;
  @state() private _config!: PiTempCardConfig;

  private _thresholds!: Thresholds;

  /* ── HA card API ────────────────────────────────────────────── */

  public static getStubConfig(): Partial<PiTempCardConfig> {
    return {
      entity: "sensor.processor_temperature",
      name: "Raspberry Pi",
    };
  }

  public setConfig(config: PiTempCardConfig): void {
    if (!config.entity && !config.preview) {
      throw new Error("pi-temp-card: 'entity' is required");
    }
    this._config = { name: "Raspberry Pi", ...config };
    this._thresholds = { ...DEFAULT_THRESHOLDS, ...config.thresholds };
  }

  public getCardSize(): number {
    return 3;
  }

  /* ── Entity helpers ─────────────────────────────────────────── */

  private _entityState(): string | null {
    if (this._config.preview) return "52.3";
    const obj = this.hass?.states?.[this._config.entity];
    if (!obj) return null;
    const s = obj.state;
    if (s === "unavailable" || s === "unknown") return null;
    return s;
  }

  private _temperature(): number | null {
    const s = this._entityState();
    if (s === null) return null;
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : null;
  }

  private _unit(): string {
    if (this._config.preview) return "°C";
    const obj = this.hass?.states?.[this._config.entity];
    return (obj?.attributes?.unit_of_measurement as string) ?? "°C";
  }

  /* ── Render ─────────────────────────────────────────────────── */

  render() {
    if (!this._config) {
      return html`<ha-card><div class="wrapper">Loading…</div></ha-card>`;
    }

    const temp = this._temperature();
    const unit = this._unit();

    if (temp === null) {
      return html`
        <ha-card>
          <div class="wrapper unavailable">
            <div class="thermo-col">${this._renderThermometer(0, "var(--pi-color-unavailable)")}</div>
            <div class="info-col">
              <span class="card-name">${this._config.name}</span>
              <span class="temp-value" style="color: var(--pi-color-unavailable)">--${unit}</span>
              <span class="status-label" style="color: var(--pi-color-unavailable)">Unavailable</span>
            </div>
          </div>
        </ha-card>
      `;
    }

    const info = classifyTemp(temp, this._thresholds);
    const fill = fillPercent(temp);
    const isAlert = info.zone === "hot" || info.zone === "critical";

    return html`
      <ha-card>
        <div class="wrapper ${isAlert ? "alert" : ""}">
          <div class="accent-bar" style="background: ${info.color}"></div>
          <div class="body">
            <div class="thermo-col">${this._renderThermometer(fill, info.iconColor)}</div>
            <div class="info-col">
              <span class="card-name">${this._config.name}</span>
              <span class="temp-value" style="color: ${info.color}">${temp.toFixed(1)}${unit}</span>
              <span class="status-label" style="color: ${info.color}">${info.label}</span>
            </div>
          </div>
        </div>
      </ha-card>
    `;
  }

  /* ── Thermometer SVG ──────────────────────────────────────── */

  private _renderThermometer(fillPct: number, color: string) {
    // fillPct 0–100 maps to the mercury column height inside the thermometer
    // The bulb is at the bottom; the column rises upward.
    // SVG viewBox is 40×100. Bulb center at (20, 85), column from y=15 to y=75.
    const colHeight = (fillPct / 100) * 60; // max 60 units tall
    const colTop = 75 - colHeight;

    return html`
      <svg class="thermometer" viewBox="0 0 40 100" xmlns="http://www.w3.org/2000/svg">
        <!-- outer shell -->
        <rect x="14" y="10" width="12" height="68" rx="6" fill="var(--pi-thermo-bg)" stroke="var(--pi-thermo-border)" stroke-width="1.2"/>
        <circle cx="20" cy="85" r="11" fill="var(--pi-thermo-bg)" stroke="var(--pi-thermo-border)" stroke-width="1.2"/>

        <!-- mercury column -->
        <rect x="16.5" y="${colTop}" width="7" height="${colHeight + 3}" rx="3.5"
              fill="${color}" style="transition: y 0.8s ease, height 0.8s ease;"/>
        <!-- mercury bulb -->
        <circle cx="20" cy="85" r="8" fill="${color}" style="transition: fill 0.8s ease;"/>

        <!-- tick marks -->
        ${[25, 40, 55, 70].map(
          (y) => html`<line x1="27" y1="${y}" x2="31" y2="${y}" stroke="var(--pi-thermo-tick)" stroke-width="0.8" stroke-linecap="round"/>`
        )}
      </svg>
    `;
  }

  /* ── Styles ─────────────────────────────────────────────────── */

  static styles = css`
    :host {
      display: block;

      /* Zone colors */
      --pi-color-cool: #4caf50;
      --pi-color-normal: #26a69a;
      --pi-color-warm: #ffa726;
      --pi-color-hot: #ff7043;
      --pi-color-critical: #ef5350;
      --pi-color-unavailable: #78909c;

      /* Icon fill mirrors zone but slightly brighter for the SVG */
      --pi-icon-cool: #66bb6a;
      --pi-icon-normal: #4db6ac;
      --pi-icon-warm: #ffb74d;
      --pi-icon-hot: #ff8a65;
      --pi-icon-critical: #ef5350;

      /* Thermometer chrome */
      --pi-thermo-bg: rgba(255, 255, 255, 0.08);
      --pi-thermo-border: rgba(255, 255, 255, 0.18);
      --pi-thermo-tick: rgba(255, 255, 255, 0.25);

      /* Card surface */
      --pi-card-bg: var(--ha-card-background, var(--card-background-color, #1e1e1e));
      --pi-card-radius: var(--ha-card-border-radius, 12px);
      --pi-text-primary: var(--primary-text-color, #e0e0e0);
      --pi-text-secondary: var(--secondary-text-color, #9e9e9e);
    }

    ha-card {
      overflow: hidden;
      border-radius: var(--pi-card-radius);
      background: var(--pi-card-bg);
    }

    .wrapper {
      position: relative;
      display: flex;
      flex-direction: column;
    }

    .wrapper.unavailable {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 16px 20px;
      gap: 16px;
      opacity: 0.6;
    }

    .accent-bar {
      height: 3px;
      width: 100%;
      transition: background 0.8s ease;
    }

    .body {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 16px 20px;
      gap: 16px;
    }

    .thermo-col {
      flex: 0 0 auto;
    }

    .thermometer {
      width: 32px;
      height: 80px;
      display: block;
    }

    .info-col {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .card-name {
      font-size: 13px;
      font-weight: 500;
      color: var(--pi-text-secondary);
      letter-spacing: 0.02em;
      text-transform: uppercase;
    }

    .temp-value {
      font-size: 36px;
      font-weight: 700;
      line-height: 1.1;
      letter-spacing: -0.02em;
      font-variant-numeric: tabular-nums;
      transition: color 0.8s ease;
    }

    .status-label {
      font-size: 14px;
      font-weight: 500;
      transition: color 0.8s ease;
    }

    /* Subtle pulse for hot / critical states */
    .wrapper.alert .accent-bar {
      animation: accent-pulse 2s ease-in-out infinite;
    }

    @keyframes accent-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `;
}

/* ================================================================
   Registration
   ================================================================ */

declare global {
  interface HTMLElementTagNameMap {
    "pi-temp-card": PiTempCard;
  }
  interface Window {
    customCards?: Array<{ type: string; name: string; description: string }>;
  }
}

if (!customElements.get("pi-temp-card")) {
  customElements.define("pi-temp-card", PiTempCard);
}

if (typeof window !== "undefined") {
  window.customCards = window.customCards || [];
  if (!window.customCards.some((c) => c.type === "pi-temp-card")) {
    window.customCards.push({
      type: "pi-temp-card",
      name: "Pi Temperature",
      description: "Simple color-coded Raspberry Pi CPU temperature monitor",
    });
  }
}

if (import.meta.hot) {
  import.meta.hot.accept();
  import.meta.hot.invalidate();
}
