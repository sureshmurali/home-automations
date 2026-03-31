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
};

/** PNGs in assets/ → /local/bravia-tv-remote/assets/ (HA CSP blocks data: URLs on <img>) */
const APP_IMAGE_FILES: Record<string, string> = {
  youtube: "app-youtube.png",
  netflix: "app-netflix.png",
  tv: "app-iptv.png",
};

const APP_IMAGES_BASE = "/local/bravia-tv-remote/assets";

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
              const imgFile = APP_IMAGE_FILES[app.icon];
              const imgSrc = imgFile ? `${APP_IMAGES_BASE}/${imgFile}` : "";
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
              <button class="dpad-ok" @click="${this._animateOk}">OK</button>
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
