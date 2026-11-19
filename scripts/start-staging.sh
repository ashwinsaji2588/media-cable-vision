#!/usr/bin/env bash
set -eu

: "${STAGING_PASSWORD:?Set STAGING_PASSWORD before starting staging}"
export DATABASE_URL="${DATABASE_URL:-jdbc:postgresql://${POSTGRES_HOST:?Set POSTGRES_HOST or DATABASE_URL}:5432/${POSTGRES_DB:?Set POSTGRES_DB}}"
export NOTIFICATION_MODE=mock

/opt/java/openjdk/bin/java -Xms32m -Xmx128m -XX:MaxMetaspaceSize=112m \
  -XX:ReservedCodeCacheSize=32m -XX:ActiveProcessorCount=2 -jar backend.jar \
  --server.address=127.0.0.1 --server.port=8080 --server.tomcat.threads.max=16 \
  --spring.datasource.hikari.maximum-pool-size=4 &
api_pid=$!
node --max-old-space-size=128 server.js &
web_pid=$!

trap 'kill "$api_pid" "$web_pid" 2>/dev/null || true; wait || true' EXIT
trap 'exit 0' TERM INT
wait -n "$api_pid" "$web_pid"
