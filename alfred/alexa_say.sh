#!/usr/bin/env bash
# Alfred "Alexa say .." workflow – send typed message to Home Assistant script for Alexa TTS.
# Requires HA_TOKEN in workflow env.
# Optional: HA_SCRIPT (script entity_id).
# URL: set HA_URL (full URL) OR HA_HOST (e.g. 192.168.11.34); HA_PORT defaults to 8123.
# If HA_URL gets truncated (e.g. "http:") in Alfred, use HA_HOST instead.
#
# Input: one argument. If it starts with hall|bed|work|all followed by a space, that's the target; rest is message.
# Otherwise the whole argument is the message and target defaults to "hall".
# Examples: "hello" -> hall says "hello"; "all hello" -> all Alexas say "hello"; "bed good night" -> bedroom says "good night".
# If the only argument is a target (bed|hall|work|all), we prompt for the message via a dialog.

set -e
input="${1:-}"
# When invoked from Script Filter with just a target, prompt for message
if [[ "$input" == "bed" || "$input" == "hall" || "$input" == "work" || "$input" == "all" ]]; then
  name="bedroom"; [[ "$input" == "hall" ]] && name="hall"; [[ "$input" == "work" ]] && name="work room"; [[ "$input" == "all" ]] && name="all"
  msg=$(osascript -e "display dialog \"Message for $name?\" default answer \"\" with title \"Alexa say\"" -e "text returned of result" 2>/dev/null) || true
  input="$input ${msg:-}"
fi
# Parse optional target: first word if it's hall|bed|work|all
case "$input" in
  hall\ *)   target="hall"; msg="${input#hall }";;
  bed\ *)    target="bed";  msg="${input#bed }";;
  work\ *)   target="work"; msg="${input#work }";;
  all\ *)    target="all";  msg="${input#all }";;
  *)         target="hall"; msg="$input";;
esac
if [[ -n "${HA_URL:-}" && "$HA_URL" == *"//"* ]]; then
  url="${HA_URL%/}"
else
  host="${HA_HOST:-192.168.11.34}"
  port="${HA_PORT:-8123}"
  url="http://${host}:${port}"
fi
token="${HA_TOKEN:-}"
# HA_SCRIPT = script entity_id (e.g. script.alexa_say). We call /api/services/script/<slug> with body {message}.
script_entity="${HA_SCRIPT:-script.alexa_say}"
script_slug="${script_entity#script.}"

if [[ -z "$token" ]]; then
  echo "HA_TOKEN is not set. Add it in the workflow's Environment Variables." >&2
  exit 1
fi

if [[ -z "$msg" ]]; then
  echo "Type something after the keyword for Alexa to say (e.g. 'hello' or 'all hello')." >&2
  exit 1
fi

# Build JSON body: { "message": "...", "target": "hall"|"bedroom"|"work"|"all" }.
if command -v jq &>/dev/null; then
  body=$(jq -n --arg m "$msg" --arg t "$target" '{message: $m, target: $t}')
else
  json_msg=$(printf '%s' "$msg" | sed 's/\\/\\\\/g; s/"/\\"/g')
  body=$(printf '{"message":"%s","target":"%s"}' "$json_msg" "$target")
fi
resp=$(curl -s -w "\n%{http_code}" -X POST \
  -H "Authorization: Bearer ${token}" \
  -H "Content-Type: application/json" \
  -d "$body" \
  "${url}/api/services/script/${script_slug}")

http_code=$(echo "$resp" | tail -n1)
out=$(echo "$resp" | sed '$d')

if [[ "$http_code" != "200" ]]; then
  echo "Home Assistant returned HTTP ${http_code}: ${out}" >&2
  exit 1
fi