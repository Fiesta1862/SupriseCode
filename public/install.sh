#!/usr/bin/env sh
set -eu

if ! command -v npm >/dev/null 2>&1 && ! command -v bun >/dev/null 2>&1; then
  echo "Install Node.js 22+ (npm) or Bun first: https://nodejs.org/ or https://bun.sh/" >&2
  exit 1
fi

if command -v bun >/dev/null 2>&1; then
  bun add --global @suprisecode/cli
else
  npm install --global @suprisecode/cli
fi

printf '\nSupriseCode CLI installed. Configure SUPRISCODE_URL and SUPRISCODE_PASSWORD before connecting.\n'
