#!/bin/sh
set -e

cd /app

# Bind mounts (especially networked paths) can appear empty for a moment at
# container start. Wait for the project root before running npm/prisma.
WAIT_SECS=0
MAX_WAIT_SECS=60
while [ ! -f package.json ]; do
  if [ "$WAIT_SECS" -ge "$MAX_WAIT_SECS" ]; then
    echo "✗ /app/package.json not found after ${MAX_WAIT_SECS}s — is the compose volume mounted?"
    ls -la /app 2>/dev/null || true
    exit 1
  fi
  if [ "$WAIT_SECS" -eq 0 ]; then
    echo "→ Waiting for /app/package.json (bind mount)..."
  fi
  sleep 1
  WAIT_SECS=$((WAIT_SECS + 1))
done

LOCK_FILE="package-lock.json"
MARKER="node_modules/.docker-lock-hash"

hash_lock() {
  sha256sum "$LOCK_FILE" | awk '{ print $1 }'
}

CURRENT_HASH=$(hash_lock)
STORED_HASH=""
if [ -f "$MARKER" ]; then
  STORED_HASH=$(cat "$MARKER")
fi

if [ ! -d "node_modules/next" ] || [ "$CURRENT_HASH" != "$STORED_HASH" ]; then
  echo "→ Installing dependencies (package-lock changed or node_modules missing)..."
  # Always include devDependencies — NODE_ENV=production would otherwise omit
  # tools needed for seed/build (tsx, typescript, etc.).
  npm ci --ignore-scripts --include=dev
  echo "$CURRENT_HASH" > "$MARKER"
else
  echo "→ Dependencies up to date; skipping npm ci"
fi

export PATH="/app/node_modules/.bin:$PATH"
