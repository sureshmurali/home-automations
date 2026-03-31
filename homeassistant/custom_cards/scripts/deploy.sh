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

do_rsync() {
  local src="$1" dest="$2"
  if [[ -n "$SSH_PREFIX" ]]; then
    SSHPASS="${SSH_PASS}" $SSH_PREFIX rsync -avz --chmod=D755,F644 \
      -e "ssh -o StrictHostKeyChecking=no" \
      "$src" "${SSH_TARGET}:${dest}"
  else
    rsync -avz --chmod=D755,F644 \
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
echo "╔══════════════════════════════════════════════════════╗"
echo "║  HA Custom Cards Deploy → ${SSH_TARGET}             ║"
echo "╠══════════════════════════════════════════════════════╣"
echo "║  Remote: ${REMOTE_PATH}                             ║"
echo "╚══════════════════════════════════════════════════════╝"
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
    echo "⏭  ${card_dir} — no build found (${js_file} missing), skipping"
    continue
  fi

  echo "📦 ${card_dir}"

  # Create remote subdirectory
  remote_card_dir="${REMOTE_PATH}/${card_dir}"
  do_ssh "mkdir -p '${remote_card_dir}'"

  # Deploy JS (skip .map files)
  echo "   ↳ ${js_file}"
  do_rsync "${js_path}" "${remote_card_dir}/"

  # Deploy assets from the card's root directory
  if [[ -n "$assets" ]]; then
    for asset in $assets; do
      asset_path="${ROOT_DIR}/${card_dir}/${asset}"
      if [[ -f "$asset_path" ]]; then
        echo "   ↳ ${asset}"
        do_rsync "${asset_path}" "${remote_card_dir}/"
      else
        echo "   ⚠ ${asset} not found, skipping"
      fi
    done
  fi

  deployed=$((deployed + 1))
  echo ""
done

if [[ $deployed -eq 0 ]]; then
  echo "❌ No cards deployed. Run 'npm run build' first."
  exit 1
fi

echo "✅ Deployed ${deployed} card(s) to ${SSH_TARGET}:${REMOTE_PATH}"
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
