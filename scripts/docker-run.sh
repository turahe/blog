#!/bin/sh
set -e

. /app/scripts/docker-ensure-deps.sh
exec "$@"
