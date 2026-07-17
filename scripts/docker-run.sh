#!/bin/sh
set -e

sh /app/scripts/docker-ensure-deps.sh
exec "$@"
