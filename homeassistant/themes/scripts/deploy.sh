#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# ── Load .env from repo root ──────────────────────────────────────────
REPO_ROOT="$(cd "$ROOT_DIR/../../.." && pwd)"
if [[ -f "$REPO_ROOT/.env" ]]; then
  set -a
  source "$REPO_ROOT/.env"
  set +a
fi

SSH_HOST="${SSH_HOST:-ohana-pi.local}"
SSH_USER="${SSH_USER:-sureshmurali}"
SSH_TARGET="${SSH_USER}@${SSH_HOST}"
REMOTE_THEMES_PATH="${REMOTE_THEMES_PATH:-/home/sureshmurali/homeassistant/config/themes}"
# Container name on the Pi (see: docker ps)
HA_DOCKER_CONTAINER="${HA_DOCKER_CONTAINER:-homeassistant}"
# Set to 1 to skip restart (e.g. quick uploads while testing)
SKIP_DOCKER_RESTART="${SKIP_DOCKER_RESTART:-0}"
CLEAN_DEPLOY="${DEPLOY_CLEAN:-0}"
START_TS="$(date +%s)"

build_ssh_cmd() {
  if [[ -n "${SSH_PASS:-}" ]] && command -v sshpass &>/dev/null; then
    echo "sshpass -e"
  else
    if [[ -n "${SSH_PASS:-}" ]]; then
      echo "⚠️  SSH_PASS is set but sshpass is not installed." >&2
      echo "   Install: brew install esolitos/ipa/sshpass" >&2
      echo "   Or switch to SSH keys (recommended)." >&2
    fi
    echo ""
  fi
}

SSH_PREFIX=$(build_ssh_cmd)

do_ssh() {
  if [[ -n "$SSH_PREFIX" ]]; then
    SSHPASS="${SSH_PASS}" $SSH_PREFIX ssh -o StrictHostKeyChecking=no "${SSH_TARGET}" "$@"
  else
    ssh -o StrictHostKeyChecking=no "${SSH_TARGET}" "$@"
  fi
}

# Like `ssh ... "$@"` but passes argv through (needed for `bash -s` + heredoc).
do_ssh_exec() {
  if [[ -n "$SSH_PREFIX" ]]; then
    SSHPASS="${SSH_PASS}" $SSH_PREFIX ssh -o StrictHostKeyChecking=no "${SSH_TARGET}" "$@"
  else
    ssh -o StrictHostKeyChecking=no "${SSH_TARGET}" "$@"
  fi
}

do_rsync() {
  local src="$1"
  local dest="$2"
  if [[ -n "$SSH_PREFIX" ]]; then
    SSHPASS="${SSH_PASS}" $SSH_PREFIX rsync -avz --delete \
      -e "ssh -o StrictHostKeyChecking=no" \
      "$src" "${SSH_TARGET}:${dest}"
  else
    rsync -avz --delete \
      -e "ssh -o StrictHostKeyChecking=no" \
      "$src" "${SSH_TARGET}:${dest}"
  fi
}

echo ""
# Banner as heredoc avoids backslash/quote pitfalls in echo lines on macOS bash.
cat <<'BANNER'
🎨 =============================================== 🎨
 _____ _                                  
|_   _| |__   ___ _ __ ___   ___  ___     
  | | | '_ \ / _ \ '_ ' _ \ / _ \/ __|
  | | | | | |  __/ | | | | |  __/\__ \
  |_| |_| |_|\___|_| |_| |_|\___||___/
🎨 =============================================== 🎨
BANNER
echo "🎯 Target : ${SSH_TARGET}"
echo "📂 Remote : ${REMOTE_THEMES_PATH}"
if [[ "$CLEAN_DEPLOY" == "1" ]]; then
  echo "🧹 Mode   : CLEAN (wipe remote themes folder first)"
else
  echo "🔁 Mode   : SYNC  (mirror local themes folder)"
fi
echo ""

if [[ "$CLEAN_DEPLOY" == "1" ]]; then
  echo "ℹ️  Cleaning remote themes path..."
  do_ssh "rm -rf '${REMOTE_THEMES_PATH}' && mkdir -p '${REMOTE_THEMES_PATH}'"
else
  do_ssh "mkdir -p '${REMOTE_THEMES_PATH}'"
fi

echo "ℹ️  Uploading theme files (*.yaml) ..."
TMP_DIR="$(mktemp -d)"
shopt -s nullglob
THEME_FILES=("${ROOT_DIR}"/*.yaml)
shopt -u nullglob
if [[ ${#THEME_FILES[@]} -eq 0 ]]; then
  echo "❌ No theme YAML files found in ${ROOT_DIR}"
  rm -rf "${TMP_DIR}"
  exit 1
fi
cp "${THEME_FILES[@]}" "${TMP_DIR}/"
do_rsync "${TMP_DIR}/" "${REMOTE_THEMES_PATH}/"
rm -rf "${TMP_DIR}"

echo ""
echo "══════════════════════════════════════════════════════════════"
echo " 🐳  POST-DEPLOY: Docker (Home Assistant)"
echo "══════════════════════════════════════════════════════════════"
echo "ℹ️  HA_DOCKER_CONTAINER='${HA_DOCKER_CONTAINER}'"
echo "ℹ️  SKIP_DOCKER_RESTART='${SKIP_DOCKER_RESTART:-0}'"
echo ""

if [[ "${SKIP_DOCKER_RESTART}" == "1" ]]; then
  echo "⏭️  Docker restart skipped — set SKIP_DOCKER_RESTART=0 (or remove it) to enable."
  echo "   Manual:  ssh ${SSH_TARGET} \"docker restart '${HA_DOCKER_CONTAINER}'\""
else
  echo "▶️  [LOCAL] $(date '+%Y-%m-%d %H:%M:%S %z') — SSH session opening for docker restart ..."
  LOCAL_RS_START="$(date +%s)"
  # Remote script prints to your terminal (stdout/stderr from SSH).
  do_ssh_exec bash -s -- "${HA_DOCKER_CONTAINER}" <<'REMOTE'
set -euo pipefail
CONTAINER="${1:?container name missing}"
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  [REMOTE] Home Assistant — docker restart                  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo "[REMOTE] ▶ START  $(date '+%Y-%m-%d %H:%M:%S %z')"
echo "[REMOTE]    container: ${CONTAINER}"
echo "[REMOTE]    command:   docker restart ${CONTAINER}"
echo ""
T0="$(date +%s)"
if ! RESTART_OUT="$(docker restart "${CONTAINER}" 2>&1)"; then
  echo "[REMOTE] ✖ docker restart FAILED"
  echo "${RESTART_OUT}"
  exit 1
fi
echo "${RESTART_OUT}"
T1="$(date +%s)"
echo ""
echo "[REMOTE] ■ DONE   $(date '+%Y-%m-%d %H:%M:%S %z')"
echo "[REMOTE]    docker reported OK (wall ~$((T1 - T0))s on Pi — includes stop/start)"
echo "[REMOTE]    container status (docker inspect):"
if docker inspect "${CONTAINER}" &>/dev/null; then
  docker inspect --format '       status={{.State.Status}}  health={{if .State.Health}}{{.State.Health.Status}}{{else}}n/a{{end}}  started={{.State.StartedAt}}' "${CONTAINER}"
else
  echo "       (!) No container named '${CONTAINER}' — run on Pi: docker ps -a"
fi
echo ""
echo "[REMOTE] ✔ docker restart sequence finished for: ${CONTAINER}"
echo ""
REMOTE
  LOCAL_RS_END="$(date +%s)"
  echo ""
  echo "✅ [LOCAL] $(date '+%Y-%m-%d %H:%M:%S %z') — SSH docker step finished OK (local SSH wall ~$((LOCAL_RS_END - LOCAL_RS_START))s)"
  echo "   Theme YAML is read when Home Assistant starts; UI may take a minute to respond."
fi
echo "══════════════════════════════════════════════════════════════"

END_TS="$(date +%s)"
echo ""
echo "✅ Theme deploy complete"
echo "ℹ️  Total time: $((END_TS - START_TS))s"
echo ""
echo "📝 Home Assistant:"
echo "   - Profile -> Theme -> pick your theme after HA is back up"
echo ""
