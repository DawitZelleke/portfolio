#!/usr/bin/env bash
# Nightly Postgres backup with rotation. Works with Podman or Docker.
# Scheduled by infra/systemd/portfolio-backup.timer (or cron on Docker hosts).
#
# Settings (environment variables, all optional):
#   BACKUP_DIR  where dumps go   (default: ~/backups/portfolio, outside the repo
#                                 so dumps can never be committed by accident)
#   KEEP_DAYS   days to keep     (default: 14)
set -euo pipefail

INFRA_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_DIR="${BACKUP_DIR:-$HOME/backups/portfolio}"
KEEP_DAYS="${KEEP_DAYS:-14}"
STAMP="$(date +%Y%m%d-%H%M%S)"
OUT="$BACKUP_DIR/portfolio-$STAMP.sql.gz"

if command -v podman >/dev/null 2>&1; then
  COMPOSE=(podman compose)
  export PODMAN_COMPOSE_WARNING_LOGS=false
else
  COMPOSE=(docker compose)
fi

mkdir -p "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR"
umask 077                          # dumps readable by this user only
trap 'rm -f "$OUT.partial"' EXIT   # never leave a half-written dump behind

# Write to .partial first, rename only on success: a failed dump can never
# masquerade as a good backup.
"${COMPOSE[@]}" -f "$INFRA_DIR/docker-compose.yml" exec -T db \
  pg_dump -U portfolio portfolio | gzip > "$OUT.partial"

# Sanity check: the file must be valid gzip and start like a pg_dump.
gzip -t "$OUT.partial"
if ! gunzip -c "$OUT.partial" | head -n 5 | grep -q 'PostgreSQL database dump'; then
  echo "backup FAILED: output does not look like a pg_dump" >&2
  exit 1
fi
mv "$OUT.partial" "$OUT"

find "$BACKUP_DIR" -name 'portfolio-*.sql.gz' -mtime +"$KEEP_DAYS" -delete
echo "backup ok: $OUT ($(du -h "$OUT" | cut -f1))"

# Restore drill into a SCRATCH database (never the live one), from infra/:
#   podman compose exec -T db createdb -U portfolio restore_test
#   gunzip -c ~/backups/portfolio/portfolio-XXXX.sql.gz \
#     | podman compose exec -T db psql -q -U portfolio restore_test
#   podman compose exec -T db psql -U portfolio restore_test -c '\dt'
#   podman compose exec -T db dropdb -U portfolio restore_test
# An unrestored backup is a hope, not a backup.
