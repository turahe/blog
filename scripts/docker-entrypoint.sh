#!/bin/sh
set -e

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
  npm ci --ignore-scripts
  echo "$CURRENT_HASH" > "$MARKER"
else
  echo "→ Dependencies up to date; skipping npm ci"
fi

echo "→ Generating Prisma client..."
npx prisma generate

exec next dev --hostname 0.0.0.0
