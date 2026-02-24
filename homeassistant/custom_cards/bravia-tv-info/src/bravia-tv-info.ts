/**
 * Bravia TV Info — Home Assistant Lovelace Custom Card
 *
 * Shows currently playing media info and app launcher buttons.
 *
 * ─── Configuration ───────────────────────────────────────────
 *
 *   type: custom:bravia-tv-info
 *   entity: media_player.android_tv_192_168_11_26
 *   apps:
 *     - name: YouTube
 *       icon: youtube
 *       package: com.google.android.youtube.tv
 */

import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";

/* ================================================================
   Types
   ================================================================ */

interface AppConfig {
  name: string;
  icon: string;
  package: string;
}

interface BraviaInfoConfig {
  entity: string;
  apps?: AppConfig[];
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

const DEFAULT_APPS: AppConfig[] = [
  { name: "YouTube", icon: "youtube", package: "com.google.android.youtube.tv" },
  { name: "YouTube Music", icon: "youtube-music", package: "com.google.android.apps.youtube.music" },
  { name: "Netflix", icon: "netflix", package: "com.netflix.ninja" },
];

const KNOWN_APPS: Record<string, { label: string; color: string }> = {
  "com.google.android.youtube.tv": { label: "YouTube", color: "#FF0000" },
  "com.google.android.apps.youtube.music": { label: "YouTube Music", color: "#FF0000" },
  "com.netflix.ninja": { label: "Netflix", color: "#E50914" },
  "com.google.android.tvlauncher": { label: "Home", color: "#4285F4" },
  "com.sony.dtv.tvx": { label: "Live TV", color: "#0077B5" },
  "com.disney.disneyplus": { label: "Disney+", color: "#113CCF" },
  "com.amazon.amazonvideo.livingroom": { label: "Prime Video", color: "#00A8E1" },
  "com.apple.atve.androidtv.appletv": { label: "Apple TV", color: "#555555" },
  "com.plexapp.android": { label: "Plex", color: "#E5A00D" },
};

const ICONS: Record<string, string> = {
  youtube: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
  "youtube-music": `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228 18.228 15.432 18.228 12 15.432 5.772 12 5.772zM9.684 15.54V8.46L15.816 12l-6.132 3.54z"/></svg>`,
  netflix: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5.398 0v.006c3.028 8.556 5.37 15.175 8.348 23.596 2.344.058 4.85.398 4.854.398-2.8-7.924-5.923-16.747-8.487-24h-4.715zm8.489 0v9.63L18.6 22.951c-.043-7.86-.004-15.913.002-22.95H13.887zM5.398 1.05V24c1.873-.225 2.81-.312 4.715-.398v-9.22l-4.715-13.332z"/></svg>`,
  play: `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
};

/* ================================================================
   Component
   ================================================================ */

export class BraviaTvInfo extends LitElement {
  @property({ attribute: false }) public hass!: Hass;
  @state() private _config!: BraviaInfoConfig;
  private _apps!: AppConfig[];

  public static getStubConfig(): Partial<BraviaInfoConfig> {
    return { entity: "media_player.android_tv_192_168_11_26", apps: DEFAULT_APPS };
  }

  public setConfig(config: BraviaInfoConfig): void {
    if (!config.entity) throw new Error("bravia-tv-info: 'entity' is required");
    this._config = { ...config };
    this._apps = config.apps ?? DEFAULT_APPS;
  }

  public getCardSize(): number {
    return 3;
  }

  /* ── Entity helpers ─────────────────────────────────────────── */

  private get _entity(): HassEntity | null {
    return this.hass?.states?.[this._config.entity] ?? null;
  }

  private get _state(): string { return this._entity?.state ?? "unavailable"; }

  private _attr(key: string): string {
    const val = this._entity?.attributes?.[key];
    return val != null ? String(val) : "";
  }

  private get _appId(): string { return this._attr("app_id"); }

  private get _appName(): string {
    const known = KNOWN_APPS[this._appId];
    if (known) return known.label;
    return this._attr("app_name") || this._attr("source") || "";
  }

  private get _mediaTitle(): string { return this._attr("media_title"); }
  private get _mediaArtist(): string { return this._attr("media_artist"); }
  private get _entityPicture(): string { return this._attr("entity_picture"); }

  /* ── Service calls ─────────────────────────────────────────── */

  private _launchApp(pkg: string): void {
    this.hass.callService("androidtv", "adb_command", {
      entity_id: this._config.entity,
      command: `monkey -p ${pkg} -c android.intent.category.LAUNCHER 1`,
    });
  }

  /* ── Styles ─────────────────────────────────────────────────── */

  static styles = css`
    :host {
      display: block;
      --text-primary: #e0e0e0;
      --text-secondary: #777;
      --text-dim: #444;
      --accent: #4fc3f7;
      --youtube: #ff0000;
      --youtube-music: #ff0000;
      --netflix: #e50914;
    }

    ha-card {
      background: #1c1c1e;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.06);
      padding: 16px;
    }

    /* ── Now playing ─────────────────────────── */

    .now-playing {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      margin-bottom: 14px;
      background: rgba(255,255,255,0.03);
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.06);
      min-height: 44px;
    }

    .np-art {
      width: 36px;
      height: 36px;
      border-radius: 6px;
      object-fit: cover;
      flex-shrink: 0;
    }

    .np-art-placeholder {
      width: 36px;
      height: 36px;
      border-radius: 6px;
      background: rgba(255,255,255,0.04);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: #444;
    }

    .np-art-placeholder svg { width: 16px; height: 16px; }

    .np-info { flex: 1; min-width: 0; }

    .np-title {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-primary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .np-subtitle {
      font-size: 10px;
      color: var(--text-secondary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-top: 2px;
    }

    .np-state {
      font-size: 10px;
      color: var(--text-dim);
      text-transform: capitalize;
    }

    /* ── App launchers ───────────────────────── */

    .app-launchers {
      display: flex;
      gap: 8px;
    }

    .app-btn {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
      padding: 10px 4px;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 12px;
      background: rgba(255,255,255,0.03);
      cursor: pointer;
      transition: all 150ms ease;
      -webkit-tap-highlight-color: transparent;
    }

    .app-btn:hover { background: rgba(255,255,255,0.06); transform: translateY(-1px); }
    .app-btn:active { transform: translateY(0) scale(0.97); }

    .app-btn .icon { width: 24px; height: 24px; transition: color 150ms ease; }
    .app-btn .label { font-size: 9px; font-weight: 500; color: var(--text-secondary); letter-spacing: 0.3px; }

    .app-btn.youtube .icon { color: var(--youtube); }
    .app-btn.youtube-music .icon { color: var(--youtube-music); }
    .app-btn.netflix .icon { color: var(--netflix); }

    .app-btn.active {
      border-color: var(--active-color, var(--accent));
      background: color-mix(in srgb, var(--active-color, var(--accent)) 8%, transparent);
    }
  `;

  /* ── Render ─────────────────────────────────────────────────── */

  render() {
    if (!this._config) return html`<ha-card><div>Loading…</div></ha-card>`;

    const title = this._mediaTitle;
    const artist = this._mediaArtist;
    const entityPic = this._entityPicture;
    const appName = this._appName;

    return html`
      <ha-card>
        <div class="now-playing">
          ${entityPic
            ? html`<img class="np-art" src="${entityPic}" alt="" />`
            : html`<div class="np-art-placeholder">
                <span .innerHTML="${ICONS.play}"></span>
              </div>`}
          <div class="np-info">
            ${title
              ? html`
                  <div class="np-title">${title}</div>
                  <div class="np-subtitle">${artist || appName}</div>
                `
              : html`
                  <div class="np-title">${appName || "Bravia TV"}</div>
                  <div class="np-state">${this._state}</div>
                `}
          </div>
        </div>

        <div class="app-launchers">
          ${this._apps.map((app) => {
            const isActive = this._appId === app.package;
            const colorVar = KNOWN_APPS[app.package]?.color ?? "#4fc3f7";
            return html`
              <button
                class="app-btn ${app.icon} ${isActive ? 'active' : ''}"
                style="--active-color: ${colorVar}"
                @click="${() => this._launchApp(app.package)}"
              >
                <span class="icon" .innerHTML="${ICONS[app.icon] || ICONS.play}"></span>
                <span class="label">${app.name}</span>
              </button>
            `;
          })}
        </div>
      </ha-card>
    `;
  }
}

/* ================================================================
   Registration
   ================================================================ */

declare global {
  interface HTMLElementTagNameMap {
    "bravia-tv-info": BraviaTvInfo;
  }
  interface Window {
    customCards?: Array<{ type: string; name: string; description: string }>;
  }
}

customElements.define("bravia-tv-info", BraviaTvInfo);

if (typeof window !== "undefined") {
  window.customCards = window.customCards || [];
  window.customCards.push({
    type: "bravia-tv-info",
    name: "Bravia TV Info",
    description: "Now playing info and app launchers for Sony Bravia Android TV",
  });
}
