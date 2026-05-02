#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
export XDG_STATE_HOME="${XDG_STATE_HOME:-/tmp/domino-watchman-state}"
WATCHMAN_LOG="${WATCHMAN_LOG:-/tmp/domino-watchman.log}"
USE_WATCHMAN_PREFLIGHT="${USE_WATCHMAN_PREFLIGHT:-0}"

cleanup() {
  if [[ -n "${WATCHMAN_PID:-}" ]] && kill -0 "$WATCHMAN_PID" 2>/dev/null; then
    kill "$WATCHMAN_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

if [[ "$USE_WATCHMAN_PREFLIGHT" == "1" ]] && command -v watchman >/dev/null 2>&1; then
  if ! XDG_STATE_HOME="$XDG_STATE_HOME" watchman --no-spawn version >/dev/null 2>&1; then
    watchman -f -o "$WATCHMAN_LOG" --log-level=1 &
    WATCHMAN_PID=$!
  fi

  for _ in 1 2 3 4 5; do
    if XDG_STATE_HOME="$XDG_STATE_HOME" watchman watch-project "$ROOT_DIR" >/dev/null 2>&1 & then
      WATCHMAN_PREFLIGHT_PID=$!
      for _ in 1 2 3 4; do
        if ! kill -0 "$WATCHMAN_PREFLIGHT_PID" 2>/dev/null; then
          wait "$WATCHMAN_PREFLIGHT_PID" 2>/dev/null || true
          WATCHMAN_PREFLIGHT_PID=""
          break 2
        fi
        sleep 0.25
      done
      kill "$WATCHMAN_PREFLIGHT_PID" 2>/dev/null || true
      WATCHMAN_PREFLIGHT_PID=""
    fi
    sleep 0.5
  done
fi

cd "$ROOT_DIR"
exec expo start --clear "$@"
