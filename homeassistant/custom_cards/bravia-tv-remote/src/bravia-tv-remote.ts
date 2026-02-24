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
 *     - name: YouTube Music
 *       icon: youtube-music
 *       package: com.google.android.apps.youtube.music
 *     - name: Netflix
 *       icon: netflix
 *       package: com.netflix.ninja
 */

import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";

/* ================================================================
   Types
   ================================================================ */

interface BraviaRemoteConfig {
  entity: string;
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
};

/* ================================================================
   Component
   ================================================================ */

export class BraviaTvRemote extends LitElement {
  @property({ attribute: false }) public hass!: Hass;
  @state() private _config!: BraviaRemoteConfig;

  /* ── HA card API ────────────────────────────────────────────── */

  public static getStubConfig(): Partial<BraviaRemoteConfig> {
    return { entity: "media_player.android_tv_192_168_11_26" };
  }

  public setConfig(config: BraviaRemoteConfig): void {
    if (!config.entity) {
      throw new Error("bravia-tv-remote: 'entity' is required");
    }
    this._config = { ...config };
  }

  public getCardSize(): number {
    return 8;
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

  /* ── Service calls ─────────────────────────────────────────── */

  private _callService(domain: string, service: string, data?: Record<string, unknown>): void {
    this.hass.callService(domain, service, {
      entity_id: this._config.entity,
      ...data,
    });
  }

  private _togglePower(): void {
    if (this._isOn) {
      this._callService("media_player", "turn_off");
    } else {
      this._callService("media_player", "turn_on");
    }
  }

  private _playPause(): void {
    this._callService("media_player", "media_play_pause");
  }

  private _volumeUp(): void {
    this._callService("media_player", "volume_up");
  }

  private _volumeDown(): void {
    this._callService("media_player", "volume_down");
  }

  private _volumeMute(): void {
    this._callService("media_player", "volume_mute", {
      is_volume_muted: !this._isMuted,
    });
  }

  private _sendKey(key: string): void {
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

  /* ── Styles ─────────────────────────────────────────────────── */

  static styles = css`
    :host {
      display: block;
      --text-primary: #e0e0e0;
      --text-secondary: #777;
      --text-dim: #444;
      --accent: #4fc3f7;
      
    }

    ha-card {
      background: transparent;
      border: none;
      box-shadow: none;
    }

    /* ── Remote Body ────────────────────────────── */

    .remote-body {
      background: linear-gradient(180deg, #1c1c1e 0%, #141414 50%, #111 100%);
      border-radius: 32px 32px 40px 40px;
      margin: 0 auto;
      max-width: 300px;
      padding: 22px 28px 28px;
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
    }

    .remote-divider {
      width: 50%;
      height: 1px;
      background: linear-gradient(90deg, transparent, #2a2a2a, transparent);
      margin: 14px 0;
    }

    /* ── Top row: Input / Power / Settings ──── */

    .top-row {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }

    /* ── Color buttons ───────────────────────── */

    .color-row { display: flex; gap: 10px; margin: 2px 0; }

    .color-btn {
      width: 38px; height: 10px; border-radius: 5px; border: none;
      cursor: pointer; transition: all 120ms ease;
      -webkit-tap-highlight-color: transparent; opacity: 0.85;
    }
    .color-btn:hover { opacity: 1; transform: scaleY(1.4); }
    .color-btn:active { transform: scale(0.9); }
    .color-btn.blue   { background: #5c6bc0; }
    .color-btn.red    { background: #e53935; }
    .color-btn.green  { background: #43a047; }
    .color-btn.yellow { background: #fdd835; }

    /* ── Utility row ─────────────────────────── */

    .util-row { display: flex; gap: 20px; }

    /* ── D-pad ───────────────────────────────── */

    .dpad-container { position: relative; width: 160px; height: 160px; }

    .dpad-disc {
      position: absolute; inset: 0; border-radius: 50%;
      background: radial-gradient(circle at 50% 50%, #222 0%, #1a1a1a 70%, #161616 100%);
      box-shadow: 0 2px 6px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.04), inset 0 -1px 1px rgba(0,0,0,0.3);
    }

    .dpad-arrow {
      position: absolute; display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: rgba(255,255,255,0.25); transition: all 120ms ease;
      -webkit-tap-highlight-color: transparent; background: none; border: none; padding: 0; z-index: 1;
    }
    .dpad-arrow:hover { color: rgba(255,255,255,0.6); }
    .dpad-arrow:active { color: rgba(255,255,255,0.8); transform: scale(0.85); }
    .dpad-arrow svg { width: 20px; height: 20px; }

    .dpad-arrow.up { top: 8px; left: 50%; transform: translateX(-50%); width: 40px; height: 36px; }
    .dpad-arrow.up:active { transform: translateX(-50%) scale(0.85); }
    .dpad-arrow.down { bottom: 8px; left: 50%; transform: translateX(-50%); width: 40px; height: 36px; }
    .dpad-arrow.down:active { transform: translateX(-50%) scale(0.85); }
    .dpad-arrow.left { left: 8px; top: 50%; transform: translateY(-50%); width: 36px; height: 40px; }
    .dpad-arrow.left:active { transform: translateY(-50%) scale(0.85); }
    .dpad-arrow.right { right: 8px; top: 50%; transform: translateY(-50%); width: 36px; height: 40px; }
    .dpad-arrow.right:active { transform: translateY(-50%) scale(0.85); }

    .dpad-ok {
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
      width: 64px; height: 64px; border-radius: 50%;
      background: radial-gradient(circle at 50% 40%, #2c2c2e, #242424);
      border: 1px solid rgba(255,255,255,0.08);
      box-shadow: 0 2px 6px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06);
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.5);
      letter-spacing: 1px; transition: all 120ms ease;
      -webkit-tap-highlight-color: transparent; z-index: 2;
    }
    .dpad-ok:hover { background: radial-gradient(circle at 50% 40%, #353537, #2a2a2c); color: rgba(255,255,255,0.8); border-color: rgba(255,255,255,0.15); }
    .dpad-ok:active { transform: translate(-50%, -50%) scale(0.95); box-shadow: 0 1px 3px rgba(0,0,0,0.5); }

    /* ── Back / Home row ─────────────────────── */

    .nav-row { display: flex; gap: 28px; }

    /* ── Volume ──────────────────────────────── */

    .vol-section { display: flex; align-items: center; gap: 16px; }

    .vol-rocker {
      display: flex; flex-direction: column; align-items: center; gap: 0;
      background: rgba(255,255,255,0.03); border-radius: 20px;
      border: 1px solid rgba(255,255,255,0.06); overflow: hidden;
    }

    .vol-rocker-btn {
      width: 44px; height: 34px; display: flex; align-items: center; justify-content: center;
      cursor: pointer; background: none; border: none;
      color: rgba(255,255,255,0.45); font-size: 18px; font-weight: 300;
      transition: all 120ms ease; -webkit-tap-highlight-color: transparent;
    }
    .vol-rocker-btn:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.8); }
    .vol-rocker-btn:active { background: rgba(255,255,255,0.1); }

    .vol-rocker-label {
      font-size: 7px; color: var(--text-dim); text-transform: uppercase;
      letter-spacing: 0.5px; padding: 1px 0;
    }

    /* ── Media transport ─────────────────────── */

    .transport-row { display: flex; align-items: flex-end; gap: 10px; }

    /* ── Shared button styles ────────────────── */

    .ctrl-btn {
      display: flex; align-items: center; justify-content: center;
      border: 1px solid rgba(255,255,255,0.06); border-radius: 10px;
      background: rgba(255,255,255,0.04); cursor: pointer;
      transition: all 120ms ease; -webkit-tap-highlight-color: transparent;
      color: rgba(255,255,255,0.45);
    }
    .ctrl-btn:hover { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.8); }
    .ctrl-btn:active { transform: scale(0.92); background: rgba(255,255,255,0.12); }
    .ctrl-btn svg { width: 16px; height: 16px; }

    .ctrl-btn.sm { width: 40px; height: 34px; }
    .ctrl-btn.md { width: 46px; height: 38px; }
    .ctrl-btn.round { border-radius: 50%; }

    .ctrl-btn.power-btn {
      width: 34px; height: 34px; border-radius: 50%;
      background: rgba(255,255,255,0.03);
    }
    .ctrl-btn.power-btn.on {
      color: #4caf50; border-color: rgba(76, 175, 80, 0.4);
      box-shadow: 0 0 12px rgba(76, 175, 80, 0.15);
    }
    .ctrl-btn.power-btn.off { color: #444; }

    /* ── Labeled button ──────────────────────── */

    .labeled-btn { display: flex; flex-direction: column; align-items: center; gap: 4px; }
    .labeled-btn .btn-label {
      font-size: 7px; color: var(--text-dim); text-transform: uppercase;
      letter-spacing: 0.6px; font-weight: 500;
    }
  `;

  /* ── Render ─────────────────────────────────────────────────── */

  render() {
    if (!this._config) {
      return html`<ha-card><div>Loading…</div></ha-card>`;
    }

    const powerClass = this._isOn ? "on" : "off";

    return html`
      <ha-card>
        <div class="remote-body">

          <!-- Top row: Input / Power / Settings -->
          <div class="top-row">
            <div class="labeled-btn">
              <button class="ctrl-btn sm" @click="${this._hdmiInput}" title="Input">
                <span .innerHTML="${ICONS.hdmi}"></span>
              </button>
              <span class="btn-label">Input</span>
            </div>
            <button class="ctrl-btn power-btn ${powerClass}" @click="${this._togglePower}" title="Power">
              <span .innerHTML="${ICONS.power}"></span>
            </button>
            <div class="labeled-btn">
              <button class="ctrl-btn sm" @click="${this._quickSettings}" title="Settings">
                <span .innerHTML="${ICONS.settings}"></span>
              </button>
              <span class="btn-label">Settings</span>
            </div>
          </div>

          <!-- D-pad disc -->
          <div class="remote-section">
            <div class="dpad-container">
              <div class="dpad-disc"></div>
              <button class="dpad-arrow up" @click="${this._dpadUp}">
                <span .innerHTML="${ICONS.up}"></span>
              </button>
              <button class="dpad-arrow left" @click="${this._dpadLeft}">
                <span .innerHTML="${ICONS.left}"></span>
              </button>
              <button class="dpad-ok" @click="${this._dpadCenter}">OK</button>
              <button class="dpad-arrow right" @click="${this._dpadRight}">
                <span .innerHTML="${ICONS.right}"></span>
              </button>
              <button class="dpad-arrow down" @click="${this._dpadDown}">
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
                <button class="ctrl-btn sm round" @click="${this._volumeMute}" title="Mute">
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
                <button class="ctrl-btn sm" @click="${this._mediaStop}" title="Stop">
                  <span .innerHTML="${ICONS.stop}"></span>
                </button>
                <span class="btn-label">Stop</span>
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

customElements.define("bravia-tv-remote", BraviaTvRemote);

if (typeof window !== "undefined") {
  window.customCards = window.customCards || [];
  window.customCards.push({
    type: "bravia-tv-remote",
    name: "Bravia TV Remote",
    description:
      "Full remote control for Sony Bravia Android TV with ADB integration",
  });
}
