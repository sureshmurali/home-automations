#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# ── Load .env ──────────────────────────────────────────────────────────
if [[ -f "$ROOT_DIR/.env" ]]; then
  set -a
  source "$ROOT_DIR/.env"
  set +a
fi

SSH_HOST="${SSH_HOST:-ohana-pi.local}"
SSH_USER="${SSH_USER:-sureshmurali}"
REMOTE_PATH="${REMOTE_PATH:-/home/sureshmurali/homeassistant/config/www}"

SSH_TARGET="${SSH_USER}@${SSH_HOST}"
CLEAN_DEPLOY="${DEPLOY_CLEAN:-0}"
START_TS="$(date +%s)"

# ── SSH / rsync command builder ────────────────────────────────────────
build_ssh_cmd() {
  if [[ -n "${SSH_PASS:-}" ]] && command -v sshpass &>/dev/null; then
    echo "sshpass -e"
  else
    if [[ -n "${SSH_PASS:-}" ]]; then
      echo ""
      echo "⚠  SSH_PASS is set but sshpass is not installed." >&2
      echo "   Install it:  brew install esolitos/ipa/sshpass" >&2
      echo "   Or set up SSH keys:  npm run setup-ssh" >&2
      echo "   Falling back to interactive password prompt." >&2
      echo "" >&2
    fi
    echo ""
  fi
}

SSH_PREFIX=$(build_ssh_cmd)

log_info() {
  echo "ℹ️  $*"
}

log_ok() {
  echo "✅ $*"
}

log_warn() {
  echo "⚠️  $*"
}

log_step() {
  echo "🔹 $*"
}

do_rsync() {
  local src="$1" dest="$2"
  # No --chmod: macOS bundled rsync is too old and rejects GNU-style D755,F644.
  if [[ -n "$SSH_PREFIX" ]]; then
    SSHPASS="${SSH_PASS}" $SSH_PREFIX rsync -avz \
      -e "ssh -o StrictHostKeyChecking=no" \
      "$src" "${SSH_TARGET}:${dest}"
  else
    rsync -avz \
      -e "ssh -o StrictHostKeyChecking=no" \
      "$src" "${SSH_TARGET}:${dest}"
  fi
}

do_ssh() {
  if [[ -n "$SSH_PREFIX" ]]; then
    SSHPASS="${SSH_PASS}" $SSH_PREFIX ssh -o StrictHostKeyChecking=no "${SSH_TARGET}" "$@"
  else
    ssh -o StrictHostKeyChecking=no "${SSH_TARGET}" "$@"
  fi
}

# ── Card registry ─────────────────────────────────────────────────────
# Each entry: card_dir|js_filename|space-separated asset globs
CARDS=(
  "solar-house-card|solar-house-card.js|home.png"
  "ecoone-visual-card|ecoone-visual-card.js|EcoOneIllustration.png"
  "bravia-tv-display|bravia-tv-display.js|"
  "bravia-tv-remote|bravia-tv-remote.js|"
)

# Allow deploying a single card: npm run deploy:card -- solar-house-card
FILTER="${1:-}"

echo ""
echo "🚀 =============================================== 🚀"
echo "   _   _    _       ____            _           "
echo "  | | | |  / \\     |  _ \\ ___ _ __ | | ___  _   _ "
echo "  | |_| | / _ \\    | | | / _ \\ '_ \\| |/ _ \\| | | |"
echo "  |  _  |/ ___ \\   | |_| |  __/ |_) | | (_) | |_| |"
echo "  |_| |_/_/   \\_\\  |____/ \\___| .__/|_|\\___/ \\__, |"
echo "                               |_|            |___/ "
echo "🛰️  Target : ${SSH_TARGET}"
echo "📂 Remote : ${REMOTE_PATH}"
if [[ "$CLEAN_DEPLOY" == "1" ]]; then
  echo "🧹 Mode   : CLEAN (delete remote card folders, then upload fresh)"
else
  echo "🔁 Mode   : SYNC  (overwrite matching files, keep unknown files)"
fi
echo "🚀 =============================================== 🚀"
echo ""

deployed=0

for entry in "${CARDS[@]}"; do
  IFS='|' read -r card_dir js_file assets <<< "$entry"

  if [[ -n "$FILTER" && "$card_dir" != "$FILTER" ]]; then
    continue
  fi

  dist_dir="${ROOT_DIR}/${card_dir}/dist"
  js_path="${dist_dir}/${js_file}"

  if [[ ! -f "$js_path" ]]; then
    log_warn "${card_dir} — no build found (${js_file} missing), skipping"
    continue
  fi

  log_step "Deploying ${card_dir}"

  remote_card_dir="${REMOTE_PATH}/${card_dir}"
  if [[ "$CLEAN_DEPLOY" == "1" ]]; then
    log_info "Cleaning remote folder: ${remote_card_dir}"
    do_ssh "rm -rf '${remote_card_dir}' && mkdir -p '${remote_card_dir}'"
  else
    do_ssh "mkdir -p '${remote_card_dir}'"
  fi

  log_info "Uploading JS: ${js_file}"
  do_rsync "${js_path}" "${remote_card_dir}/"

  # Deploy assets from the card's root directory
  if [[ -n "$assets" ]]; then
    for asset in $assets; do
      asset_path="${ROOT_DIR}/${card_dir}/${asset}"
      if [[ -f "$asset_path" ]]; then
        log_info "Uploading asset: ${asset}"
        do_rsync "${asset_path}" "${remote_card_dir}/"
      else
        log_warn "${card_dir}/${asset} not found, skipping"
      fi
    done
  fi

  deployed=$((deployed + 1))
  log_ok "${card_dir} complete"
  echo "-------------------------------------------------------"
done

if [[ $deployed -eq 0 ]]; then
  echo "❌ No cards deployed. Run 'npm run build' first."
  exit 1
fi

END_TS="$(date +%s)"
ELAPSED="$((END_TS - START_TS))"

log_ok "Deployed ${deployed} card(s) to ${SSH_TARGET}:${REMOTE_PATH}"
log_info "Total time: ${ELAPSED}s"
echo ""
echo "📝 Lovelace resource paths (add in HA → Settings → Dashboards → Resources):"
for entry in "${CARDS[@]}"; do
  IFS='|' read -r card_dir js_file _ <<< "$entry"
  if [[ -n "$FILTER" && "$card_dir" != "$FILTER" ]]; then
    continue
  fi
  echo "   /local/${card_dir}/${js_file}  (JavaScript Module)"
done
echo ""
