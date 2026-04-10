import { LitElement, html, css, nothing, svg } from "lit";
import { property, state } from "lit/decorators.js";
import { FLOW_PATH, FLOW_ORIGIN_X, FLOW_ORIGIN_Y } from "./flow-path.js";

export type Position = { left?: string; top?: string; width?: string; height?: string; align?: string };

export interface SolarHouseCardConfig {
  image?: string;
  images?: Record<string, string>;
  weather_entity?: string;
  positions?: {
    battery?: Position;
    solar?: Position;
    grid?: Position;
  };
  battery_entity: string;
  solar_power_entity?: string;
  grid_entity?: string;
  show_flow_line?: boolean;
  /** Scale factor for flow lines: 1 = native Figma size. Default 1. */
  flow_line_scale?: number;
  /** Flow line color. Default "#FFF2AF". */
  flow_line_color?: string;
  /** Duration of one electric pulse sweep in seconds. Default 1.8. */
  flow_animation_duration?: number;
  /** Delay between the two staggered pulses in seconds. Default half of duration. */
  flow_animation_delay?: number;
  /** Glow blur radius in SVG units. Default 5 for base, 10 for pulse. */
  flow_glow_radius?: number;
  preview?: boolean;
}

const PREVIEW_DATA = {
  battery: "72",
  solar_power: "1200",
  grid: "846",
} as const;

const DEFAULT_POSITIONS = {
  solar:   { left: "48%", top: "14%" },
  battery: { left: "93%", top: "53%" },
  grid:    { left: "9%", top: "18%" },
} as const;

const WEATHER_STATE_TO_VARIANT: Record<string, string> = {
  sunny: "sunny",
  "clear-day": "sunny",
  "clear-night": "night",
  rainy: "rainy",
  raining: "rainy",
  pouring: "rainy",
  drizzle: "drizzle",
  "light-rain": "drizzle",
  cloudy: "day",
  partlycloudy: "day",
  "partly-cloudy": "day",
  fog: "day",
  snowy: "day",
  exceptional: "default",
};

function getTimeVariant(): "day" | "noon" | "night" {
  const hour = new Date().getHours();
  if (hour >= 10 && hour < 14) return "noon";
  if (hour >= 6 && hour < 10) return "day";
  if (hour >= 14 && hour < 20) return "day";
  return "night";
}

export class SolarHouseCard extends LitElement {
  @property({ attribute: false }) public hass!: Record<string, unknown> & { states: Record<string, { state: string; attributes?: Record<string, unknown> }> };
  @state() private _config!: SolarHouseCardConfig;

  public static getStubConfig(): Partial<SolarHouseCardConfig> {
    return {
      image: "/local/solar-house-card/assets/home.png",
      battery_entity: "sensor.solar_31_remaining_stored_electricity_3",
      show_flow_line: true,
      positions: { ...DEFAULT_POSITIONS },
    };
  }

  public setConfig(config: SolarHouseCardConfig): void {
    if (!config.battery_entity && !config.preview) {
      throw new Error("battery_entity is required");
    }
    this._config = {
      show_flow_line: true,
      ...config,
      battery_entity: config.preview ? (config.battery_entity || "preview_battery") : config.battery_entity,
      solar_power_entity: config.preview ? (config.solar_power_entity || "preview_solar") : config.solar_power_entity,
      grid_entity: config.preview ? (config.grid_entity ?? "preview_grid") : config.grid_entity,
      positions: {
        battery: { ...DEFAULT_POSITIONS.battery, ...config.positions?.battery },
        solar: { ...DEFAULT_POSITIONS.solar, ...config.positions?.solar },
        grid: { ...DEFAULT_POSITIONS.grid, ...config.positions?.grid },
      },
    };
  }

  public getCardSize(): number {
    return 6;
  }

  private _resolveImageUrl(): string {
    const c = this._config;
    if (c.image && !c.images) return c.image;
    const images = c.images || {};
    let variant: string = "default";
    if (c.weather_entity && this.hass?.states) {
      const stateObj = this.hass.states[c.weather_entity];
      if (stateObj?.state) {
        const weatherKey = WEATHER_STATE_TO_VARIANT[stateObj.state] ?? stateObj.state?.toLowerCase?.();
        if (weatherKey && images[weatherKey]) variant = weatherKey;
      }
    }
    if (images[variant]) return images[variant];
    const timeKey = getTimeVariant();
    if (images[timeKey]) variant = timeKey;
    if (images[variant]) return images[variant];
    return images.default || c.image || "";
  }

  private _getEntityState(entityId: string): string | undefined {
    if (this._config.preview) {
      if (entityId === this._config.battery_entity) return PREVIEW_DATA.battery;
      if (entityId === this._config.solar_power_entity) return PREVIEW_DATA.solar_power;
      if (entityId === this._config.grid_entity) return PREVIEW_DATA.grid;
      return undefined;
    }
    const stateObj = this.hass?.states?.[entityId];
    return stateObj?.state;
  }

  private _getBatteryPercent(): number {
    const val = this._getEntityState(this._config.battery_entity);
    const pct = val ? Number(val) : 0;
    return Number.isNaN(pct) ? 0 : Math.max(0, Math.min(100, pct));
  }

  private _formatPower(w: number): string {
    return `${(w / 1000).toFixed(1)} kW`;
  }

  static styles = css`
    :host { display: block; }
    .card-container {
      position: relative;
      width: 100%;
      border-radius: 12px;
      overflow: hidden;
      background: #1c1c1c;
    }
    .bg-image {
      display: block;
      width: 100%;
      height: auto;
    }
    .overlays {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }
    .overlays > * { pointer-events: auto; }
    .overlay-label {
      position: absolute;
      transform: translate(-50%, -50%);
      padding: 5px 10px;
      border-radius: 8px;
      background: rgba(0, 0, 0, 0.15);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      color: #fff;
      white-space: nowrap;
      letter-spacing: 0.02em;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .overlay-label .label-title {
      font-size: 7px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      opacity: 0.6;
      line-height: 1.2;
      margin-bottom: 2px;
    }
    .overlay-label .label-value {
      font-size: 12px;
      font-weight: 600;
      line-height: 1;
    }
    .flow-layer {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }
    .flow-layer svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }
  
  `;

  render() {
    if (!this._config || !this.hass) {
      return html`<ha-card><div class="card-container">No config or hass</div></ha-card>`;
    }

    const url = this._resolveImageUrl();
    const batteryState = this._getEntityState(this._config.battery_entity);
    const solarState = this._config.solar_power_entity ? this._getEntityState(this._config.solar_power_entity) : null;
    const gridState = this._config.grid_entity ? this._getEntityState(this._config.grid_entity) : null;
    const batteryPct = this._getBatteryPercent();
    const showFlow = this._config.show_flow_line !== false && batteryPct > 0;

    const solarNum = solarState != null ? Number(solarState) : 0;
    const solarStr = Number.isNaN(solarNum) ? solarState ?? "—" : this._formatPower(solarNum);
    const gridNum = gridState != null ? Number(gridState) : NaN;
    const gridStr = Number.isNaN(gridNum) ? (gridState ?? "—") : `${gridNum} kW`;
    const batteryStr = batteryState != null && batteryState !== "unknown" && batteryState !== "unavailable"
      ? `${batteryState}%` : "—";

    const pos = this._config.positions!;

    return html`
      <ha-card>
        <div class="card-container">
          ${url ? html`<img class="bg-image" src="${url}" alt="Solar house" />` : nothing}

          <div class="overlays">
            ${this._config.solar_power_entity
              ? html`<div class="overlay-label" style="left:${pos.solar!.left};top:${pos.solar!.top}">
                  <span class="label-title">Solar</span><span class="label-value">${solarStr}</span>
                </div>` : nothing}
            ${this._config.battery_entity
              ? html`<div class="overlay-label" style="left:${pos.battery!.left};top:${pos.battery!.top}">
                  <span class="label-title">Battery</span><span class="label-value">${batteryStr}</span>
                </div>` : nothing}
            ${this._config.grid_entity
              ? html`<div class="overlay-label" style="left:${pos.grid!.left};top:${pos.grid!.top}">
                  <span class="label-title">Grid</span><span class="label-value">${gridStr}</span>
                </div>` : nothing}
          </div>

          ${showFlow
            ? (() => {
                const scale = this._config.flow_line_scale ?? 1;
                const color = this._config.flow_line_color ?? "#FFF2AF";
                const dur = this._config.flow_animation_duration
                  ?? (8 - (batteryPct / 100) * 5);
                const delay = this._config.flow_animation_delay ?? dur / 2;
                const glowBase = this._config.flow_glow_radius ?? 5;
                const glowPulse = glowBase * 3;
                return html`
                <div class="flow-layer">
                  <svg viewBox="0 0 1792 2410" preserveAspectRatio="xMidYMid meet">
                    <defs>
                      <linearGradient id="elecPulse1" x1="0" y1="0" x2="0" y2="1"
                        gradientUnits="objectBoundingBox" spreadMethod="pad">
                        <stop offset="0" stop-color="#fff" stop-opacity="0" />
                        <stop offset="0.44" stop-color="#fff" stop-opacity="0" />
                        <stop offset="0.48" stop-color="#fff" stop-opacity="0.8" />
                        <stop offset="0.5" stop-color="#fff" stop-opacity="1" />
                        <stop offset="0.52" stop-color="#fff" stop-opacity="0.8" />
                        <stop offset="0.56" stop-color="#fff" stop-opacity="0" />
                        <stop offset="1" stop-color="#fff" stop-opacity="0" />
                        <animateTransform attributeName="gradientTransform"
                          type="translate" values="0 -1; 0 2"
                          dur="${dur}s" repeatCount="indefinite" />
                      </linearGradient>
                      <linearGradient id="elecPulse2" x1="0" y1="0" x2="0" y2="1"
                        gradientUnits="objectBoundingBox" spreadMethod="pad">
                        <stop offset="0" stop-color="#fff" stop-opacity="0" />
                        <stop offset="0.44" stop-color="#fff" stop-opacity="0" />
                        <stop offset="0.48" stop-color="${color}" stop-opacity="0.6" />
                        <stop offset="0.5" stop-color="#fff" stop-opacity="0.9" />
                        <stop offset="0.52" stop-color="${color}" stop-opacity="0.6" />
                        <stop offset="0.56" stop-color="#fff" stop-opacity="0" />
                        <stop offset="1" stop-color="#fff" stop-opacity="0" />
                        <animateTransform attributeName="gradientTransform"
                          type="translate" values="0 -1; 0 2"
                          dur="${dur}s" begin="${delay}s" repeatCount="indefinite" />
                      </linearGradient>
                      <filter id="flowGlow">
                        <feGaussianBlur stdDeviation="${glowBase}" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                      <filter id="brightGlow">
                        <feGaussianBlur stdDeviation="${glowPulse}" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <g>
                      <g transform="translate(${FLOW_ORIGIN_X}, ${FLOW_ORIGIN_Y}) scale(${scale})"
                         filter="url(#flowGlow)">
                        <path fill="${color}" opacity="0"
                          d="${FLOW_PATH}" />
                      </g>
                      <g transform="translate(${FLOW_ORIGIN_X}, ${FLOW_ORIGIN_Y}) scale(${scale})"
                         filter="url(#brightGlow)">
                        <path fill="url(#elecPulse1)" opacity="0.9"
                          d="${FLOW_PATH}" />
                      </g>
                      <g transform="translate(${FLOW_ORIGIN_X}, ${FLOW_ORIGIN_Y}) scale(${scale})"
                         filter="url(#brightGlow)">
                        <path fill="url(#elecPulse2)" opacity="0.7"
                          d="${FLOW_PATH}" />
                      </g>
                    </g>
                  </svg>
                </div>
              `;
              })()
            : nothing}
        </div>
      </ha-card>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "solar-house-card": SolarHouseCard;
  }
  interface Window {
    customCards?: Array<{ type: string; name: string; description: string }>;
  }
}

if (!customElements.get("solar-house-card")) {
  customElements.define("solar-house-card", SolarHouseCard);
}

if (typeof window !== "undefined") {
  window.customCards = window.customCards || [];
  if (!window.customCards.some((c) => c.type === "solar-house-card")) {
    window.customCards.push({
      type: "solar-house-card",
      name: "Solar House",
      description: "Isometric house with solar monitoring and weather-based image variants",
    });
  }
}

if (import.meta.hot) {
  import.meta.hot.accept();
  import.meta.hot.invalidate();
}
