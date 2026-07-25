#!/usr/bin/env bash
# Nightly Postgres backup with 14-day rotation. Install via crontab:
#   0 3 * * * /opt/portfolio/infra/backup.sh >> /var/log/portfolio-backup.log 2>&1
set -euo pipefail

BACKUP_DIR="/opt/portfolio/backups"
STAMP="$(date +%Y%m%d-%H%M%S)"
KEEP_DAYS=14

mkdir -p "$BACKUP_DIR"
docker compose -f /opt/portfolio/infra/docker-compose.yml exec -T db \
  pg_dump -U portfolio portfolio | gzip > "$BACKUP_DIR/portfolio-$STAMP.sql.gz"

find "$BACKUP_DIR" -name 'portfolio-*.sql.gz' -mtime +"$KEEP_DAYS" -delete
echo "backup ok: portfolio-$STAMP.sql.gz"

# Restore drill (run quarterly, seriously):
#   gunzip -c backups/portfolio-XXXX.sql.gz | docker compose exec -T db psql -U portfolio portfolio
