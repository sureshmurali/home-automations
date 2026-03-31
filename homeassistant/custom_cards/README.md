# Home Assistant Custom Cards Deploy Guide

This folder contains the build + deploy workflow for Lovelace custom cards.

## What this deploy does

- Builds all card bundles (`*.js`) from each card project.
- Uploads each card into an organized subfolder under:
  - `/home/sureshmurali/homeassistant/config/www/<card-name>/`
- Uploads required card assets (for example `home.png`).

## Remote folder structure

After deploy, your Home Assistant host will look like:

- `/config/www/solar-house-card/solar-house-card.js`
- `/config/www/solar-house-card/home.png`
- `/config/www/ecoone-visual-card/ecoone-visual-card.js`
- `/config/www/bravia-tv-display/bravia-tv-display.js`
- `/config/www/bravia-tv-remote/bravia-tv-remote.js`

## One-time setup

1. Copy `.env.example` to `.env` (if `.env` is not already present).
2. Fill your SSH values:
   - `SSH_HOST`
   - `SSH_USER`
   - `SSH_PASS` (optional if you use SSH keys)
   - `REMOTE_PATH`
3. Optional recommended key-based auth:
   - `npm run setup-ssh`

If you use password auth, install `sshpass` on macOS:

- `brew install esolitos/ipa/sshpass`

## Commands

Run these from `homeassistant/custom_cards`:

- `npm run build`  
  Build all cards.

- `npm run deploy`  
  Build + deploy in **sync mode** (overwrite matching files, keep unknown remote files).

- `npm run deploy:clean`  
  Build + deploy in **clean mode** (delete each remote card folder, then upload fresh files).

- `npm run deploy:only`  
  Deploy without rebuilding.

- `npm run deploy:only:clean`  
  Clean deploy without rebuilding.

- `npm run deploy:card -- solar-house-card`  
  Deploy only one card folder.

## Home Assistant steps after deployment

1. Go to **Settings -> Dashboards -> Resources**.
2. Add/update each JS resource as **JavaScript Module**:
   - `/local/solar-house-card/solar-house-card.js`
   - `/local/ecoone-visual-card/ecoone-visual-card.js`
   - `/local/bravia-tv-display/bravia-tv-display.js`
   - `/local/bravia-tv-remote/bravia-tv-remote.js`
3. Update image paths in card YAML to match subfolders (for example):
   - `/local/solar-house-card/home.png`
4. Hard refresh the browser (Cmd+Shift+R) or clear frontend cache.
5. Reload Lovelace dashboard.

## Troubleshooting

- **`rsync: invalid argument`**  
  The script is compatible with macOS stock `rsync` and avoids unsupported flags.

- **Auth prompt keeps appearing**  
  Use `npm run setup-ssh` to install keys, or install `sshpass`.

- **No files deployed**  
  Ensure build artifacts exist (`npm run build`) and check `.env` SSH values.
