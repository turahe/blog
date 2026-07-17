#!/bin/sh
set -e

echo "→ Generating Prisma client..."
npx prisma generate

exec next dev --hostname 0.0.0.0
