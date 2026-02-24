/**
 * Bravia TV Display — Home Assistant Lovelace Custom Card
 *
 * Shows a TV illustration image with a live ADB screenshot overlay
 * displaying what's currently running on the TV.
 *
 * ─── Configuration ───────────────────────────────────────────
 *
 *   type: custom:bravia-tv-display
 *   entity: media_player.android_tv_192_168_11_26
 *   image: /local/bravia-tv.png
 *   screen_position:
 *     top: 39.63
 *     left: 29.65
 *     width: 43.15
 *     height: 29.99
 *   screen_refresh: 10
 */

import { LitElement, html, css, nothing, PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";

/* ================================================================
   Types
   ================================================================ */

interface ScreenPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface BraviaDisplayConfig {
  entity: string;
  image: string;
  screen_position?: Partial<ScreenPosition>;
  screen_refresh?: number;
}

interface HassEntity {
  state: string;
  attributes: Record<string, unknown>;
}

interface Hass {
  states: Record<string, HassEntity>;
  callService(
    domain: string,
    service: string,
    data?: Record<string, unknown>
  ): Promise<void>;
}

/* ================================================================
   Constants
   ================================================================ */

const DEFAULT_SCREEN: ScreenPosition = {
  top: 39.63,
  left: 29.65,
  width: 43.15,
  height: 29.99,
};

const KNOWN_APPS: Record<string, { label: string; color: string }> = {
  "com.google.android.youtube.tv": { label: "YouTube", color: "#FF0000" },
  "com.google.android.apps.youtube.music": {
    label: "YouTube Music",
    color: "#FF0000",
  },
  "com.netflix.ninja": { label: "Netflix", color: "#E50914" },
  "com.google.android.tvlauncher": { label: "Home", color: "#4285F4" },
  "com.sony.dtv.tvx": { label: "Live TV", color: "#0077B5" },
  "com.disney.disneyplus": { label: "Disney+", color: "#113CCF" },
  "com.amazon.amazonvideo.livingroom": {
    label: "Prime Video",
    color: "#00A8E1",
  },
  "com.apple.atve.androidtv.appletv": {
    label: "Apple TV",
    color: "#555555",
  },
  "com.plexapp.android": { label: "Plex", color: "#E5A00D" },
};

const ICONS: Record<string, string> = {
  youtube: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
  "youtube-music": `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228 18.228 15.432 18.228 12 15.432 5.772 12 5.772zM9.684 15.54V8.46L15.816 12l-6.132 3.54z"/></svg>`,
  netflix: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5.398 0v.006c3.028 8.556 5.37 15.175 8.348 23.596 2.344.058 4.85.398 4.854.398-2.8-7.924-5.923-16.747-8.487-24h-4.715zm8.489 0v9.63L18.6 22.951c-.043-7.86-.004-15.913.002-22.95H13.887zM5.398 1.05V24c1.873-.225 2.81-.312 4.715-.398v-9.22l-4.715-13.332z"/></svg>`,
  power: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>`,
};

/* ================================================================
   Component
   ================================================================ */

export class BraviaTvDisplay extends LitElement {
  @property({ attribute: false }) public hass!: Hass;
  @state() private _config!: BraviaDisplayConfig;
  @state() private _cacheBuster = 0;

  private _screen!: ScreenPosition;
  private _refreshInterval: ReturnType<typeof setInterval> | null = null;
  private _lastEntityPicture = "";

  /* ── HA card API ────────────────────────────────────────────── */

  public static getStubConfig(): Partial<BraviaDisplayConfig> {
    return {
      entity: "media_player.android_tv_192_168_11_26",
      image: "/local/bravia-tv.png",
    };
  }

  public setConfig(config: BraviaDisplayConfig): void {
    if (!config.entity) {
      throw new Error("bravia-tv-display: 'entity' is required");
    }
    if (!config.image) {
      throw new Error("bravia-tv-display: 'image' is required");
    }
    this._config = { ...config };
    this._screen = { ...DEFAULT_SCREEN, ...config.screen_position };
  }

  public getCardSize(): number {
    return 5;
  }

  /* ── Lifecycle ──────────────────────────────────────────────── */

  connectedCallback(): void {
    super.connectedCallback();
    this._startScreenRefresh();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._stopScreenRefresh();
  }

  updated(changedProps: PropertyValues): void {
    super.updated(changedProps);
    if (changedProps.has("hass")) {
      const newPic = this._entityPicture;
      if (newPic !== this._lastEntityPicture) {
        this._lastEntityPicture = newPic;
        this._cacheBuster = Date.now();
      }
    }
  }

  private _startScreenRefresh(): void {
    this._stopScreenRefresh();
    const intervalSec = this._config?.screen_refresh ?? 10;
    this._refreshInterval = setInterval(() => {
      if (this._isOn && this._entityPicture) {
        this._cacheBuster = Date.now();
      }
    }, intervalSec * 1000);
  }

  private _stopScreenRefresh(): void {
    if (this._refreshInterval) {
      clearInterval(this._refreshInterval);
      this._refreshInterval = null;
    }
  }

  /* ── Entity helpers ─────────────────────────────────────────── */

  private get _entity(): HassEntity | null {
    return this.hass?.states?.[this._config.entity] ?? null;
  }

  private get _state(): string {
    return this._entity?.state ?? "unavailable";
  }

  private get _isOn(): boolean {
    return !["off", "unavailable", "unknown"].includes(this._state);
  }

  private _attr(key: string): string {
    const val = this._entity?.attributes?.[key];
    return val != null ? String(val) : "";
  }

  private get _appId(): string {
    return this._attr("app_id");
  }

  private get _appName(): string {
    const known = KNOWN_APPS[this._appId];
    if (known) return known.label;
    return this._attr("app_name") || this._attr("source") || "";
  }

  private get _appColor(): string {
    return KNOWN_APPS[this._appId]?.color ?? "#ffffff";
  }

  private get _mediaTitle(): string {
    return this._attr("media_title");
  }

  private get _mediaArtist(): string {
    return this._attr("media_artist");
  }

  private get _entityPicture(): string {
    return this._attr("entity_picture");
  }

  /* ── Styles ─────────────────────────────────────────────────── */

  static styles = css`
    :host {
      display: block;
    }

    ha-card {
      background: #0c0c0c;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid #222;
    }

    .tv-display {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .tv-image {
      display: block;
      width: 100%;
      height: auto;
    }

    .screen-overlay {
      position: absolute;
      overflow: hidden;
      border-radius: 2px;
      transition: background 600ms ease;
    }

    .screen-overlay.off {
      background: rgba(0, 0, 0, 0.92);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .screen-overlay.on {
      background: rgba(0, 0, 0, 0.85);
    }

    .screen-capture {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: opacity 400ms ease;
    }

    .screen-capture.loaded { opacity: 1; }
    .screen-capture.loading { opacity: 0.6; }

    .screen-info-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 8px;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
      z-index: 2;
      opacity: 0;
      transition: opacity 300ms ease;
    }

    .screen-overlay:hover .screen-info-bar {
      opacity: 1;
    }

    .screen-info-bar .info-app-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 6px;
      border-radius: 8px;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(6px);
      font-size: 8px;
      font-weight: 600;
      letter-spacing: 0.4px;
      text-transform: uppercase;
      color: var(--app-color, #fff);
    }

    .screen-info-bar .info-app-badge .app-icon {
      width: 10px;
      height: 10px;
    }

    .screen-info-bar .info-title {
      flex: 1;
      font-size: 9px;
      color: rgba(255, 255, 255, 0.85);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
    }

    .screen-content {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 8%;
      text-align: center;
      width: 100%;
      height: 100%;
    }

    .screen-power-icon {
      width: 28px;
      height: 28px;
      color: #333;
      opacity: 0.6;
    }

    .screen-state-text {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.4);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .screen-app-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 10px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(8px);
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      color: var(--app-color, #fff);
    }

    .screen-app-badge .app-icon {
      width: 12px;
      height: 12px;
    }

    .screen-media-title {
      font-size: 13px;
      font-weight: 600;
      color: #fff;
      text-shadow: 0 1px 6px rgba(0, 0, 0, 0.8);
      max-width: 90%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .screen-media-artist {
      font-size: 10px;
      color: rgba(255, 255, 255, 0.7);
      text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
    }

    .live-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #4caf50;
      animation: live-pulse 2s ease-in-out infinite;
      position: absolute;
      top: 5px;
      right: 5px;
      z-index: 3;
    }

    @keyframes live-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
  `;

  /* ── Render ─────────────────────────────────────────────────── */

  render() {
    if (!this._config) {
      return html`<ha-card><div>Loading…</div></ha-card>`;
    }

    const s = this._screen;
    const screenStyle = `
      top: ${s.top}%;
      left: ${s.left}%;
      width: ${s.width}%;
      height: ${s.height}%;
    `;

    const stateClass = !this._isOn ? "off" : "on";
    const entityPic = this._entityPicture;
    const hasScreenCapture = !!entityPic && this._isOn;

    const screenPicUrl = hasScreenCapture
      ? `${entityPic}${entityPic.includes("?") ? "&" : "?"}_cb=${this._cacheBuster}`
      : "";

    return html`
      <ha-card>
        <div class="tv-display">
          <img class="tv-image" src="${this._config.image}" alt="Bravia TV" />
          <div class="screen-overlay ${stateClass}" style="${screenStyle}">
            ${hasScreenCapture
              ? html`
                  <img
                    class="screen-capture loaded"
                    src="${screenPicUrl}"
                    alt="TV Screen"
                    @error="${this._onScreenError}"
                  />
                  <div class="live-dot"></div>
                  ${this._renderScreenInfoBar()}
                `
              : html`
                  <div class="screen-content">
                    ${this._renderScreenFallback()}
                  </div>
                `}
          </div>
        </div>
      </ha-card>
    `;
  }

  private _onScreenError = (e: Event): void => {
    const img = e.target as HTMLImageElement;
    img.classList.remove("loaded");
    img.classList.add("loading");
  };

  private _renderScreenInfoBar() {
    const appName = this._appName;
    const title = this._mediaTitle;
    const artist = this._mediaArtist;
    const appColor = this._appColor;
    const appIcon = this._getAppIcon();
    const infoText = [title, artist].filter(Boolean).join(" — ");

    if (!appName && !infoText) return nothing;

    return html`
      <div class="screen-info-bar">
        ${appName
          ? html`<span class="info-app-badge" style="--app-color: ${appColor}">
              ${appIcon
                ? html`<span class="app-icon" .innerHTML="${appIcon}"></span>`
                : nothing}
              ${appName}
            </span>`
          : nothing}
        ${infoText
          ? html`<span class="info-title">${infoText}</span>`
          : nothing}
      </div>
    `;
  }

  private _renderScreenFallback() {
    if (!this._isOn) {
      return nothing;
    }

    const appName = this._appName;
    const title = this._mediaTitle;
    const artist = this._mediaArtist;
    const appColor = this._appColor;
    const appIcon = this._getAppIcon();

    if (!title && !appName) {
      return nothing;
    }

    return html`
      ${appName
        ? html`<div class="screen-app-badge" style="--app-color: ${appColor}">
            ${appIcon
              ? html`<span class="app-icon" .innerHTML="${appIcon}"></span>`
              : nothing}
            ${appName}
          </div>`
        : nothing}
      ${title
        ? html`<div class="screen-media-title">${title}</div>`
        : nothing}
      ${artist
        ? html`<div class="screen-media-artist">${artist}</div>`
        : nothing}
    `;
  }

  private _getAppIcon(): string | null {
    const appId = this._appId;
    if (appId.includes("youtube.tv")) return ICONS.youtube;
    if (appId.includes("youtube.music")) return ICONS["youtube-music"];
    if (appId.includes("netflix")) return ICONS.netflix;
    return null;
  }
}

/* ================================================================
   Registration
   ================================================================ */

declare global {
  interface HTMLElementTagNameMap {
    "bravia-tv-display": BraviaTvDisplay;
  }
  interface Window {
    customCards?: Array<{ type: string; name: string; description: string }>;
  }
}

customElements.define("bravia-tv-display", BraviaTvDisplay);

if (typeof window !== "undefined") {
  window.customCards = window.customCards || [];
  window.customCards.push({
    type: "bravia-tv-display",
    name: "Bravia TV Display",
    description:
      "TV illustration with live screen overlay showing what's running",
  });
}
