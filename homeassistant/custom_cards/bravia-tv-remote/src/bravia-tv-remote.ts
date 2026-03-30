/**
 * Bravia TV Remote — Home Assistant Lovelace Custom Card
 *
 * Full remote control for Sony Bravia Android TV with ADB integration.
 * Includes power, app launchers, D-pad, volume, media transport,
 * input selector, and color buttons.
 *
 * ─── Configuration ───────────────────────────────────────────
 *
 *   type: custom:bravia-tv-remote
 *   entity: media_player.android_tv_192_168_11_26
 *   apps:
 *     - name: YouTube
 *       icon: youtube
 *       package: com.google.android.youtube.tv
 *     - name: Netflix
 *       icon: netflix
 *       package: com.netflix.ninja
 */

import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { gsap } from "gsap";

/* ================================================================
   Types
   ================================================================ */

interface AppConfig {
  name: string;
  icon: string;
  package: string;
}

interface BraviaRemoteConfig {
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
  { name: "Netflix", icon: "netflix", package: "com.netflix.ninja" },
  { name: "IPTV", icon: "tv", package: "ru.iptvremote.android.iptv" },
];

const KNOWN_APPS: Record<string, { label: string; color: string }> = {
  "com.google.android.youtube.tv": { label: "YouTube", color: "#FF0000" },
  "com.netflix.ninja": { label: "Netflix", color: "#E50914" },
  "ru.iptvremote.android.iptv": { label: "IPTV", color: "#4fc3f7" },
  "com.google.android.tvlauncher": { label: "Home", color: "#4285F4" },
  "com.sony.dtv.tvx": { label: "Live TV", color: "#0077B5" },
  "com.disney.disneyplus": { label: "Disney+", color: "#113CCF" },
  "com.amazon.amazonvideo.livingroom": { label: "Prime Video", color: "#00A8E1" },
  "com.apple.atve.androidtv.appletv": { label: "Apple TV", color: "#555555" },
  "com.plexapp.android": { label: "Plex", color: "#E5A00D" },
};

const ICONS: Record<string, string> = {
  power: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>`,
  "volume-x": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`,
  play: `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
  pause: `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`,
  back: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  up: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>`,
  down: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`,
  left: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,
  right: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>`,
  rewind: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z"/></svg>`,
  "fast-forward": `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/></svg>`,
  stop: `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="1"/></svg>`,
  "skip-back": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/></svg>`,
  "skip-forward": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>`,
  hdmi: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="10" rx="2"/><line x1="6" y1="11" x2="6" y2="13"/><line x1="10" y1="11" x2="10" y2="13"/><line x1="14" y1="11" x2="14" y2="13"/><line x1="18" y1="11" x2="18" y2="13"/></svg>`,
  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  mute: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`,
  youtube: `<svg viewBox="0 0 90 20" fill="currentColor"><path d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 0 14.285 0 14.285 0C14.285 0 5.35042 0 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C0 5.35042 0 10 0 10C0 10 0 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z" fill="#FF0000"/><path d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z" fill="white"/><g><path d="M34.6024 13.0036L31.3945 1.41846H34.1932L35.3174 6.6701C35.6043 7.96361 35.8136 9.06662 35.95 9.97913H36.0323C36.1264 9.32532 36.3381 8.22937 36.665 6.68892L37.8291 1.41846H40.6278L37.3799 13.0036V18.561H34.6001V13.0036H34.6024Z"/><path d="M41.4697 18.1937C40.9053 17.8127 40.5031 17.22 40.2632 16.4157C40.0257 15.6114 39.9058 14.5437 39.9058 13.2078V11.3898C39.9058 10.0422 40.0422 8.95805 40.315 8.14196C40.5878 7.32588 41.0135 6.72851 41.592 6.35457C42.1706 5.98063 42.9302 5.79248 43.871 5.79248C44.7976 5.79248 45.5384 5.98298 46.0981 6.36398C46.6555 6.74497 47.0508 7.34234 47.2765 8.15137C47.5023 8.96275 47.6176 10.0422 47.6176 11.3898V13.2078C47.6176 14.5437 47.5023 15.6161 47.2765 16.4251C47.0508 17.2365 46.6508 17.8292 46.0787 18.2031C45.5066 18.5771 44.7764 18.7652 43.8874 18.7652C42.9514 18.7675 42.1847 18.5747 41.4697 18.1937ZM44.6353 16.2323C44.7905 15.8231 44.8705 15.1575 44.8705 14.2309V10.3292C44.8705 9.43077 44.7929 8.77225 44.6353 8.35833C44.4777 7.94206 44.2026 7.7351 43.8074 7.7351C43.4265 7.7351 43.156 7.94206 42.9914 8.35833C42.8268 8.77461 42.7445 9.43077 42.7445 10.3292V14.2309C42.7445 15.1575 42.8268 15.8254 42.9914 16.2323C43.156 16.6415 43.4382 16.8461 43.8074 16.8461C44.1767 16.8461 44.4777 16.6415 44.6353 16.2323Z"/><path d="M56.8154 18.5634H54.6094L54.3648 17.03H54.3037C53.7039 18.1871 52.8055 18.7656 51.6061 18.7656C50.7759 18.7656 50.1621 18.4928 49.767 17.9496C49.3719 17.4039 49.1743 16.5526 49.1743 15.3955V6.03751H51.9942V15.2308C51.9942 15.7906 52.0553 16.188 52.1776 16.4256C52.2999 16.6631 52.5045 16.783 52.7914 16.783C53.036 16.783 53.2712 16.7078 53.497 16.5573C53.7228 16.4067 53.8874 16.2162 53.9979 15.9858V6.03516H56.8154V18.5634Z"/><path d="M64.4755 3.68758H61.6768V18.5629H58.9181V3.68758H56.1194V1.42041H64.4755V3.68758Z"/><path d="M71.2768 18.5634H69.0708L68.8262 17.03H68.7651C68.1654 18.1871 67.267 18.7656 66.0675 18.7656C65.2373 18.7656 64.6235 18.4928 64.2284 17.9496C63.8333 17.4039 63.6357 16.5526 63.6357 15.3955V6.03751H66.4556V15.2308C66.4556 15.7906 66.5167 16.188 66.639 16.4256C66.7613 16.6631 66.9659 16.783 67.2529 16.783C67.4974 16.783 67.7326 16.7078 67.9584 16.5573C68.1842 16.4067 68.3488 16.2162 68.4593 15.9858V6.03516H71.2768V18.5634Z"/><path d="M80.609 8.0387C80.4373 7.24849 80.1621 6.67699 79.7812 6.32186C79.4002 5.96674 78.8757 5.79035 78.2078 5.79035C77.6904 5.79035 77.2059 5.93616 76.7567 6.23014C76.3075 6.52412 75.9594 6.90747 75.7148 7.38489H75.6937V0.785645H72.9773V18.5608H75.3056L75.5925 17.3755H75.6537C75.8724 17.7988 76.1993 18.1304 76.6344 18.3774C77.0695 18.622 77.554 18.7443 78.0855 18.7443C79.038 18.7443 79.7412 18.3045 80.1904 17.4272C80.6396 16.5476 80.8653 15.1765 80.8653 13.3092V11.3266C80.8653 9.92722 80.7783 8.82892 80.609 8.0387ZM78.0243 13.1492C78.0243 14.0617 77.9867 14.7767 77.9114 15.2941C77.8362 15.8115 77.7115 16.1808 77.5328 16.3971C77.3564 16.6158 77.1165 16.724 76.8178 16.724C76.585 16.724 76.371 16.6699 76.1734 16.5594C75.9759 16.4512 75.816 16.2866 75.6937 16.0702V8.96062C75.7877 8.6196 75.9524 8.34209 76.1852 8.12337C76.4157 7.90465 76.6697 7.79646 76.9401 7.79646C77.2271 7.79646 77.4481 7.90935 77.6034 8.13278C77.7609 8.35855 77.8691 8.73485 77.9303 9.26636C77.9914 9.79787 78.022 10.5528 78.022 11.5335V13.1492H78.0243Z"/></g></svg>`,
  netflix: `<svg viewBox="0 0 111 30" fill="currentColor"><path d="M105.062 14.28L111 30c-1.75-.25-3.499-.563-5.28-.845l-3.345-8.686-3.437 8.31c-1.812-.28-3.624-.436-5.405-.625l6.062-13.5L93.5 0h5.28l3.062 7.874L105 0h5.343l-5.28 14.28zM90.311 0h-4.968v27.25c1.687.094 3.374.156 5.125.156V0zm-14.406 0h-4.968v24.938c1.687.094 3.374.156 5.125.156V0zM70.999 0h-4.969v22.625c1.688.094 3.375.156 5.125.156V0zM56.124 0h-4.969v20.313c1.688.093 3.375.155 5.125.155V0zM41.062 0h-4.969v17.969c1.688.094 3.375.156 5.125.156V0zM24.999 0h-4.969v15.656c1.688.094 3.375.156 5.125.156V0zM10.937 0H6v13.344c1.688.093 3.375.155 5.125.155V0z"/></svg>`,
  tv: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="13" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>`,
  yen: `<svg width="36" height="44" viewBox="0 0 5 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.18488 2.03001H0.298626C0.251126 2.03001 0.213626 2.06876 0.213626 2.11626V2.70376C0.213626 2.75126 0.252376 2.79001 0.298626 2.79001H1.65613V3.16251H0.299876C0.252376 3.16251 0.214876 3.20126 0.214876 3.24876V3.83626C0.214876 3.88501 0.253626 3.92251 0.299876 3.92251H1.65738V4.92001C1.65738 4.98001 1.70613 5.02751 1.76488 5.02751H2.82738C2.88613 5.02751 2.93488 4.97876 2.93488 4.92001V3.92251H4.28238C4.33113 3.92251 4.36988 3.88376 4.36988 3.83626V3.24876C4.36988 3.20126 4.33113 3.16251 4.28238 3.16251H2.93488V2.79001H4.28238C4.33113 2.79001 4.36988 2.75126 4.36988 2.70376V2.11626C4.36988 2.06876 4.33113 2.03001 4.28238 2.03001H3.40613L4.57363 0.167514C4.59488 0.133764 4.59613 0.0912643 4.57738 0.0562643C4.56801 0.0389851 4.55408 0.0246048 4.53711 0.0146874C4.52014 0.00477002 4.50078 -0.000304935 4.48113 1.41729e-05H3.48363C3.44738 1.41729e-05 3.41238 0.0187644 3.39238 0.0500144L2.29613 1.73251L1.20113 0.0500144C1.19111 0.0346204 1.17739 0.0219796 1.16124 0.0132459C1.14508 0.00451221 1.12699 -3.66332e-05 1.10863 1.41729e-05H0.109876C0.0698757 1.41729e-05 0.0336257 0.0225143 0.0136257 0.0562643C-0.00512429 0.0912643 -0.0051242 0.133764 0.0173758 0.167514L1.18488 2.03001Z" fill="currentColor"/></svg>`,
};

const APP_IMAGES: Record<string, string> = {
  youtube: "data:image/png;base64,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",
  netflix: "data:image/png;base64,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",
  tv: "data:image/png;base64,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",
};

/* ================================================================
   Component
   ================================================================ */

export class BraviaTvRemote extends LitElement {
  @property({ attribute: false }) public hass!: Hass;
  @state() private _config!: BraviaRemoteConfig;
  private _apps!: AppConfig[];
  @state() private _showIndicator = false;

  /* ── HA card API ────────────────────────────────────────────── */

  public static getStubConfig(): Partial<BraviaRemoteConfig> {
    return { entity: "media_player.android_tv_192_168_11_26", apps: DEFAULT_APPS };
  }

  public setConfig(config: BraviaRemoteConfig): void {
    if (!config.entity) {
      throw new Error("bravia-tv-remote: 'entity' is required");
    }
    this._config = { ...config };
    this._apps = config.apps ?? DEFAULT_APPS;
  }

  public getCardSize(): number {
    return 10;
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

  private get _isPlaying(): boolean {
    return this._state === "playing";
  }

  private _attr(key: string): string {
    const val = this._entity?.attributes?.[key];
    return val != null ? String(val) : "";
  }

  private get _isMuted(): boolean {
    return this._entity?.attributes?.is_volume_muted === true;
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

  private _callService(domain: string, service: string, data?: Record<string, unknown>): void {
    this.hass.callService(domain, service, {
      entity_id: this._config.entity,
      ...data,
    });
  }

  private _togglePower(): void {
    this._showFeedback();
    if (this._isOn) {
      this._callService("media_player", "turn_off");
    } else {
      this._callService("media_player", "turn_on");
    }
  }

  private _playPause(): void {
    this._showFeedback();
    this._callService("media_player", "media_play_pause");
  }

  private _volumeUp(): void {
    this._showFeedback();
    this._callService("media_player", "volume_up");
  }

  private _volumeDown(): void {
    this._showFeedback();
    this._callService("media_player", "volume_down");
  }

  private _volumeMute(): void {
    this._showFeedback();
    this._callService("media_player", "volume_mute", {
      is_volume_muted: !this._isMuted,
    });
  }

  private _sendKey(key: string): void {
    this._showFeedback();
    this._callService("androidtv", "adb_command", {
      command: `input keyevent ${key}`,
    });
  }

  private _goBack(): void { this._sendKey("KEYCODE_BACK"); }
  private _goHome(): void { this._sendKey("KEYCODE_HOME"); }
  private _dpadUp(): void { this._sendKey("KEYCODE_DPAD_UP"); }
  private _dpadDown(): void { this._sendKey("KEYCODE_DPAD_DOWN"); }
  private _dpadLeft(): void { this._sendKey("KEYCODE_DPAD_LEFT"); }
  private _dpadRight(): void { this._sendKey("KEYCODE_DPAD_RIGHT"); }
  private _dpadCenter(): void { this._sendKey("KEYCODE_DPAD_CENTER"); }
  private _mediaRewind(): void { this._sendKey("KEYCODE_MEDIA_REWIND"); }
  private _mediaFastForward(): void { this._sendKey("KEYCODE_MEDIA_FAST_FORWARD"); }
  private _mediaPrevious(): void { this._sendKey("KEYCODE_MEDIA_PREVIOUS"); }
  private _mediaNext(): void { this._sendKey("KEYCODE_MEDIA_NEXT"); }
  private _mediaStop(): void { this._sendKey("KEYCODE_MEDIA_STOP"); }
  private _colorRed(): void { this._sendKey("KEYCODE_PROG_RED"); }
  private _colorGreen(): void { this._sendKey("KEYCODE_PROG_GREEN"); }
  private _colorYellow(): void { this._sendKey("KEYCODE_PROG_YELLOW"); }
  private _colorBlue(): void { this._sendKey("KEYCODE_PROG_BLUE"); }
  private _hdmiInput(): void { this._sendKey("KEYCODE_TV_INPUT"); }
  private _quickSettings(): void { this._sendKey("KEYCODE_MENU"); }

  private _launchApp(pkg: string): void {
    this._showFeedback();
    this._callService("androidtv", "adb_command", {
      command: `monkey -p ${pkg} -c android.intent.category.LAUNCHER 1`,
    });
  }

  /* ── Swipe gesture & GSAP animations ─────────────────────────── */

  private _swipeStartX = 0;
  private _swipeStartY = 0;
  private _SWIPE_THRESHOLD = 30;

  private _boundPointerDown = this._onDpadPointerDown.bind(this);
  private _boundPointerUp = this._onDpadPointerUp.bind(this);
  private _audioContext: AudioContext | null = null;

  private _playClickSound(): void {
    try {
      if (!this._audioContext) {
        this._audioContext = new AudioContext();
      }
      const ctx = this._audioContext;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.1);
    } catch (e) {
      console.warn('Audio feedback not available:', e);
    }
  }

  private _showFeedback(): void {
    this._playClickSound();
    this._showIndicator = true;
    setTimeout(() => {
      this._showIndicator = false;
    }, 800);
  }

  firstUpdated(): void {
    const disc = this.shadowRoot!.querySelector<HTMLElement>('.dpad-disc');
    if (disc) {
      disc.addEventListener('pointerdown', this._boundPointerDown);
      disc.addEventListener('pointerup', this._boundPointerUp);
    }

    const body = this.shadowRoot!.querySelector<HTMLElement>('.remote-body');
    if (body) {
      body.addEventListener('click', (e: Event) => {
        const btn = (e.target as Element).closest('.ctrl-btn, .app-btn, .vol-rocker-btn, .color-btn');
        if (btn) {
          gsap.fromTo(btn,
            { scale: 0.92 },
            { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.4)" }
          );
        }
      });
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    const disc = this.shadowRoot?.querySelector<HTMLElement>('.dpad-disc');
    if (disc) {
      disc.removeEventListener('pointerdown', this._boundPointerDown);
      disc.removeEventListener('pointerup', this._boundPointerUp);
    }
  }

  private _onDpadPointerDown(e: PointerEvent): void {
    this._swipeStartX = e.clientX;
    this._swipeStartY = e.clientY;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  private _onDpadPointerUp(e: PointerEvent): void {
    const dx = e.clientX - this._swipeStartX;
    const dy = e.clientY - this._swipeStartY;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) < this._SWIPE_THRESHOLD) return;

    const disc = this.shadowRoot!.querySelector<HTMLElement>('.dpad-disc');
    if (!disc) return;

    let direction: 'up' | 'down' | 'left' | 'right';
    let animProps: gsap.TweenVars;

    if (absDx > absDy) {
      direction = dx > 0 ? 'right' : 'left';
      animProps = { x: dx > 0 ? 10 : -10 };
    } else {
      direction = dy > 0 ? 'down' : 'up';
      animProps = { y: dy > 0 ? 10 : -10 };
    }

    const dirMethods = {
      up: () => this._dpadUp(),
      down: () => this._dpadDown(),
      left: () => this._dpadLeft(),
      right: () => this._dpadRight(),
    };
    dirMethods[direction]();

    gsap.timeline()
      .to(disc, { ...animProps, duration: 0.12, ease: "power2.out" })
      .to(disc, { x: 0, y: 0, duration: 0.25, ease: "elastic.out(1, 0.5)" });

    const arrow = this.shadowRoot!.querySelector<HTMLElement>(`.dpad-arrow.${direction}`);
    if (arrow) {
      gsap.fromTo(arrow,
        { color: "rgba(255,255,255,0.8)" },
        { color: "rgba(255,255,255,0.25)", duration: 0.4 }
      );
    }
  }

  private _animateOk(): void {
    const okBtn = this.shadowRoot!.querySelector<HTMLElement>('.dpad-ok');
    if (okBtn) {
      gsap.fromTo(okBtn,
        { scale: 0.9 },
        { scale: 1, duration: 0.35, ease: "elastic.out(1, 0.5)" }
      );
    }
    this._dpadCenter();
  }

  private _animateDpadArrow(direction: 'up' | 'down' | 'left' | 'right'): void {
    const arrow = this.shadowRoot!.querySelector<HTMLElement>(`.dpad-arrow.${direction}`);
    if (arrow) {
      gsap.fromTo(arrow,
        { scale: 0.85, color: "rgba(255,255,255,0.8)" },
        { scale: 1, color: "rgba(255,255,255,0.25)", duration: 0.3, ease: "elastic.out(1, 0.4)" }
      );
    }
    const methods = { up: () => this._dpadUp(), down: () => this._dpadDown(), left: () => this._dpadLeft(), right: () => this._dpadRight() };
    methods[direction]();
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
      --netflix: #e50914;
      --iptv: #4fc3f7;
    }

    ha-card {
      background: transparent;
      border: none;
      box-shadow: none;
      padding: 24px 0;
      position: relative;
    }

    /* ── Feedback Indicator ──────────────────── */

    .feedback-indicator {
      position: fixed;
      top: 20px;
      right: 20px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #4caf50;
      box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
      opacity: 0;
      transition: opacity 0.2s ease;
      z-index: 1000;
    }

    .feedback-indicator.active {
      opacity: 1;
      animation: pulse 0.8s ease-out;
    }

    @keyframes pulse {
      0% {
        box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
      }
      50% {
        box-shadow: 0 0 0 8px rgba(76, 175, 80, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
      }
    }

    /* ── App launchers ───────────────────────── */

    .app-launchers {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 10px;
      width: 100%;
      margin: 0 0 32px;
    }

    .app-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      transition: all 150ms ease;
      -webkit-tap-highlight-color: transparent;
      position: relative;
      overflow: hidden;
      min-height: 44px;
    }

    .app-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
    

    .app-btn img { pointer-events: none; }

    .app-btn.youtube {
      background: white;
      border-radius: 14px;
      padding: 14px 8px;
      box-shadow: none;
    }
    .app-btn.youtube.active { box-shadow: none; }
    .app-btn.youtube img { width: 100%; height: auto; }

    .app-btn.netflix {
      background: #E50914;
      border-radius: 14px;
      padding: 14px 8px;
    }
    .app-btn.netflix img { width: 100%; height: auto; }

    .app-btn.tv {
      background: #8CC24A;
      padding: 10px 20px;
      gap: 4px;
      border-radius: 14px;
    }
    .app-btn.tv img { width: 36px; height: 36px; flex-shrink: 0; object-fit: contain; }
    .app-btn.tv .label {
      font-size: 12px;
      font-weight: 700;
      color: #fff;
    }

    .app-btn.active {
      box-shadow: 0 0 0 2px var(--active-color, var(--accent));
    }

    /* ── Remote Body ────────────────────────────── */

    .remote-body {
      background: linear-gradient(180deg, #1c1c1e 0%, #141414 50%, #111 100%);
      border-radius: 32px 32px 40px 40px;
      margin: 0 auto;
      max-width: 320px;
      padding: 22px 32px 28px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0;
      box-shadow:
        0 2px 8px rgba(0,0,0,0.4),
        inset 0 1px 0 rgba(255,255,255,0.04);
    }

    .remote-section {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 16px;
    }

    .remote-divider {
      width: 50%;
      height: 1px;
      background: linear-gradient(90deg, transparent, #2a2a2a, transparent);
      margin: 14px 0;
    }

    /* ── Power button row ──────────────────── */

    .top-row {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 32px;
    }

    /* ── Color buttons ───────────────────────── */

    .color-row { display: flex; gap: 14px; margin: 2px 0; }

    .color-btn {
      width: 52px; height: 16px; border-radius: 8px; border: none;
      cursor: pointer; transition: all 120ms ease;
      -webkit-tap-highlight-color: transparent; opacity: 0.85;
    }
    .color-btn:hover { opacity: 1; transform: scaleY(1.4); }
    
    .color-btn.blue   { background: #5c6bc0; }
    .color-btn.red    { background: #e53935; }
    .color-btn.green  { background: #43a047; }
    .color-btn.yellow { background: #fdd835; }

    /* ── Utility row ─────────────────────────── */

    .util-row { display: flex; gap: 20px; }

    /* ── D-pad ───────────────────────────────── */

    .dpad-container { position: relative; width: 250px; height: 250px; }

    .dpad-disc {
      position: absolute; inset: 0; border-radius: 50%;
      background: radial-gradient(circle at 50% 50%, #222 0%, #1a1a1a 70%, #161616 100%);
      box-shadow: 0 3px 10px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.04), inset 0 -1px 1px rgba(0,0,0,0.3);
      touch-action: none;
    }

    .dpad-arrow {
      position: absolute; display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: rgba(255,255,255,0.25); transition: all 120ms ease;
      -webkit-tap-highlight-color: transparent; background: none; border: none; padding: 0; z-index: 1;
    }
    .dpad-arrow:hover { color: rgba(255,255,255,0.6); }
    .dpad-arrow svg { width: 32px; height: 32px; }

    .dpad-arrow.up { top: -4px; left: 50%; transform: translateX(-50%); width: 70px; height: 64px; }
    .dpad-arrow.down { bottom: -4px; left: 50%; transform: translateX(-50%); width: 70px; height: 64px; }
    .dpad-arrow.left { left: -4px; top: 50%; transform: translateY(-50%); width: 64px; height: 70px; }
    .dpad-arrow.right { right: -4px; top: 50%; transform: translateY(-50%); width: 64px; height: 70px; }

    .dpad-ok {
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
      width: 110px; height: 110px; border-radius: 50%;
      background: radial-gradient(circle at 50% 40%, #2c2c2e, #242424);
      border: 1px solid rgba(255,255,255,0.08);
      box-shadow: 0 2px 6px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06);
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      font-size: 18px; font-weight: 600; color: rgba(255,255,255,0.5);
      letter-spacing: 2px; transition: all 120ms ease;
      -webkit-tap-highlight-color: transparent; z-index: 2;
    }
    .dpad-ok:hover { background: radial-gradient(circle at 50% 40%, #353537, #2a2a2c); color: rgba(255,255,255,0.8); border-color: rgba(255,255,255,0.15); }

    /* ── Back / Home row ─────────────────────── */

    .nav-row { display: flex; width: 100%; justify-content: space-between; }

    /* ── Volume ──────────────────────────────── */

    .vol-section { display: flex; align-items: center; gap: 28px; }

    .vol-rocker {
      display: flex; flex-direction: column; align-items: center; gap: 0;
      background: rgba(255,255,255,0.03); border-radius: 18px;
      border: 1px solid rgba(255,255,255,0.06); overflow: hidden;
    }

    .vol-rocker-btn {
      width: 78px; height: 60px; display: flex; align-items: center; justify-content: center;
      cursor: pointer; background: none; border: none;
      color: rgba(255,255,255,0.45); font-size: 28px; font-weight: 300;
      transition: all 120ms ease; -webkit-tap-highlight-color: transparent;
    }
    .vol-rocker-btn:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.8); }

    .vol-rocker-label {
      font-size: 12px; color: var(--text-dim); text-transform: uppercase;
      letter-spacing: 0.8px; padding: 2px 0;
    }

    /* ── Media transport ─────────────────────── */

    .transport-row { display: flex; align-items: flex-end; gap: 16px; }

    /* ── Shared button styles ────────────────── */

    .ctrl-btn {
      display: flex; align-items: center; justify-content: center;
      border: 1px solid rgba(255,255,255,0.06); border-radius: 18px;
      background: rgba(255,255,255,0.04); cursor: pointer;
      transition: all 120ms ease; -webkit-tap-highlight-color: transparent;
      color: rgba(255,255,255,0.45);
    }
    .ctrl-btn:hover { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.8); }
    .ctrl-btn span { display: flex; align-items: center; justify-content: center; }
    .ctrl-btn svg { width: 28px; height: 28px; display: block; }

    .ctrl-btn.sm { width: 70px; height: 60px; }
    .ctrl-btn.md { width: 82px; height: 68px; }
    .ctrl-btn.round { border-radius: 50%; }

    .ctrl-btn.power-btn {
      width: 60px; height: 60px; border-radius: 50%;
      background: rgba(255,255,255,0.03);
    }
    .ctrl-btn.power-btn.on {
      color: #4caf50; border-color: rgba(76, 175, 80, 0.4);
      box-shadow: 0 0 12px rgba(76, 175, 80, 0.15);
    }
    .ctrl-btn.power-btn.off { color: #444; }

    /* ── Labeled button ──────────────────────── */

    .labeled-btn { display: flex; flex-direction: column; align-items: center; gap: 6px; }
    .labeled-btn .btn-label {
      font-size: 12px; color: var(--text-dim); text-transform: uppercase;
      letter-spacing: 0.8px; font-weight: 500;
    }
  `;

  /* ── Render ─────────────────────────────────────────────────── */

  render() {
    if (!this._config) {
      return html`<ha-card><div>Loading…</div></ha-card>`;
    }

    const powerClass = this._isOn ? "on" : "off";

    const title = this._mediaTitle;
    const artist = this._mediaArtist;
    const entityPic = this._entityPicture;
    const appName = this._appName;

    return html`
      <ha-card>
        <!-- Feedback Indicator -->
        <div class="feedback-indicator ${this._showIndicator ? 'active' : ''}"></div>

        <div class="remote-body">

          <!-- Power button -->
          <div class="top-row">
            <button class="ctrl-btn power-btn ${powerClass}" @click="${this._togglePower}" title="Power">
              <span .innerHTML="${ICONS.power}"></span>
            </button>
          </div>

          <!-- App launchers -->
          <div class="app-launchers">
            ${this._apps.map((app) => {
              const isActive = this._appId === app.package;
              const colorVar = KNOWN_APPS[app.package]?.color ?? "#4fc3f7";
              const imgSrc = APP_IMAGES[app.icon];
              return html`
                <button
                  class="app-btn ${app.icon} ${isActive ? 'active' : ''}"
                  style="--active-color: ${colorVar}"
                  @click="${() => this._launchApp(app.package)}"
                >
                  ${imgSrc
                    ? html`<img src="${imgSrc}" alt="${app.name}" />`
                    : html`<span .innerHTML="${ICONS[app.icon] || ICONS.play}"></span>`}
                  ${app.icon === 'tv' ? html`<span class="label">${app.name}</span>` : ''}
                </button>
              `;
            })}
          </div>

          <!-- D-pad disc -->
          <div class="remote-section">
            <div class="dpad-container">
              <div class="dpad-disc"></div>
              <button class="dpad-arrow up" @click="${() => this._animateDpadArrow('up')}">
                <span .innerHTML="${ICONS.up}"></span>
              </button>
              <button class="dpad-arrow left" @click="${() => this._animateDpadArrow('left')}">
                <span .innerHTML="${ICONS.left}"></span>
              </button>
              <button class="dpad-ok" @click="${this._animateOk}"><span .innerHTML="${ICONS.yen}"></span></button>
              <button class="dpad-arrow right" @click="${() => this._animateDpadArrow('right')}">
                <span .innerHTML="${ICONS.right}"></span>
              </button>
              <button class="dpad-arrow down" @click="${() => this._animateDpadArrow('down')}">
                <span .innerHTML="${ICONS.down}"></span>
              </button>
            </div>
          </div>

          <!-- Back + Home -->
          <div class="remote-section" style="margin-top: 8px;">
            <div class="nav-row">
              <div class="labeled-btn">
                <button class="ctrl-btn sm" @click="${this._goBack}" title="Back">
                  <span .innerHTML="${ICONS.back}"></span>
                </button>
                <span class="btn-label">Back</span>
              </div>
              <div class="labeled-btn">
                <button class="ctrl-btn sm" @click="${this._goHome}" title="Home">
                  <span .innerHTML="${ICONS.home}"></span>
                </button>
                <span class="btn-label">Home</span>
              </div>
            </div>
          </div>

          <div class="remote-divider"></div>

          <!-- Volume -->
          <div class="remote-section">
            <div class="vol-section">
              <div class="vol-rocker">
                <button class="vol-rocker-btn" @click="${this._volumeUp}" title="Volume Up">+</button>
                <span class="vol-rocker-label">Vol</span>
                <button class="vol-rocker-btn" @click="${this._volumeDown}" title="Volume Down">−</button>
              </div>
              <div class="labeled-btn">
                <button class="ctrl-btn sm" @click="${this._volumeMute}" title="Mute">
                  <span .innerHTML="${ICONS[this._isMuted ? 'mute' : 'volume-x']}"></span>
                </button>
                <span class="btn-label">Mute</span>
              </div>
            </div>
          </div>

          <div class="remote-divider"></div>

          <!-- Color buttons -->
          <div class="remote-section">
            <div class="color-row">
              <button class="color-btn blue" @click="${this._colorBlue}" title="Blue"></button>
              <button class="color-btn red" @click="${this._colorRed}" title="Red"></button>
              <button class="color-btn green" @click="${this._colorGreen}" title="Green"></button>
              <button class="color-btn yellow" @click="${this._colorYellow}" title="Yellow"></button>
            </div>
          </div>

          <div class="remote-divider"></div>

          <!-- Media row 1: Rewind / Play / Fast Forward -->
          <div class="remote-section">
            <div class="transport-row">
              <div class="labeled-btn">
                <button class="ctrl-btn sm" @click="${this._mediaRewind}" title="Rewind">
                  <span .innerHTML="${ICONS.rewind}"></span>
                </button>
                <span class="btn-label">Rew</span>
              </div>
              <div class="labeled-btn">
                <button class="ctrl-btn md" @click="${this._playPause}" title="Play/Pause">
                  <span .innerHTML="${ICONS[this._isPlaying ? 'pause' : 'play']}"></span>
                </button>
                <span class="btn-label">Play</span>
              </div>
              <div class="labeled-btn">
                <button class="ctrl-btn sm" @click="${this._mediaFastForward}" title="Fast Forward">
                  <span .innerHTML="${ICONS['fast-forward']}"></span>
                </button>
                <span class="btn-label">FF</span>
              </div>
            </div>
          </div>

          <!-- Media row 2: Previous / Stop / Next -->
          <div class="remote-section" style="margin-top: 6px;">
            <div class="transport-row">
              <div class="labeled-btn">
                <button class="ctrl-btn sm" @click="${this._mediaPrevious}" title="Previous">
                  <span .innerHTML="${ICONS['skip-back']}"></span>
                </button>
                <span class="btn-label">Prev</span>
              </div>
              <div class="labeled-btn">
                <button class="ctrl-btn sm" @click="${this._playPause}" title="Pause">
                  <span .innerHTML="${ICONS.pause}"></span>
                </button>
                <span class="btn-label">Pause</span>
              </div>
              <div class="labeled-btn">
                <button class="ctrl-btn sm" @click="${this._mediaNext}" title="Next">
                  <span .innerHTML="${ICONS['skip-forward']}"></span>
                </button>
                <span class="btn-label">Next</span>
              </div>
            </div>
          </div>

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
    "bravia-tv-remote": BraviaTvRemote;
  }
  interface Window {
    customCards?: Array<{ type: string; name: string; description: string }>;
  }
}

if (!customElements.get("bravia-tv-remote")) {
  customElements.define("bravia-tv-remote", BraviaTvRemote);
}

if (typeof window !== "undefined") {
  window.customCards = window.customCards || [];
  if (!window.customCards.some((c) => c.type === "bravia-tv-remote")) {
    window.customCards.push({
      type: "bravia-tv-remote",
      name: "Bravia TV Remote",
      description:
        "Full remote control for Sony Bravia Android TV with ADB integration",
    });
  }
}

if (import.meta.hot) {
  import.meta.hot.accept();
  import.meta.hot.invalidate();
}
