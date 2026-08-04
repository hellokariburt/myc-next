#!/usr/bin/env bash
#
# Take a plain-SQL logical backup of the live Neon database.
#
#   ./scripts/backup-db.sh
#
# Neon's free plan keeps no backup history (History = 0 GB, no PITR), so this is
# the only backup that exists — run it before risky migrations and periodically.
#
# Notes:
#  - Uses POSTGRES_URL_NON_POOLING from .env (the direct, non-pgbouncer conn —
#    pg_dump doesn't work through the pooler).
#  - pg_dump must be >= the server's major version. The Neon server is on PG 17,
#    so a Homebrew pg14 won't do; this prefers libpq's newer pg_dump. Install it
#    once with `brew install libpq` if the default is too old.
#  - --no-owner --no-acl so the dump restores cleanly onto Neon's managed roles.
#
# Restore:  psql "$POSTGRES_URL_NON_POOLING" < <backup-file>
#
# Overridable via env: PG_DUMP (path to pg_dump), BACKUP_DIR (output directory).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$ROOT/.env"
BACKUP_DIR="${BACKUP_DIR:-$HOME/Desktop/openmyc-backups}"

# Pick a pg_dump: explicit override, then libpq's (tracks latest PG), then PATH.
if [ -n "${PG_DUMP:-}" ]; then
  PGD="$PG_DUMP"
elif [ -x /opt/homebrew/opt/libpq/bin/pg_dump ]; then
  PGD=/opt/homebrew/opt/libpq/bin/pg_dump
else
  PGD="$(command -v pg_dump || true)"
fi
[ -n "$PGD" ] || { echo "ERROR: no pg_dump found. Try: brew install libpq" >&2; exit 1; }

[ -f "$ENV_FILE" ] || { echo "ERROR: $ENV_FILE not found" >&2; exit 1; }
URL="$(grep '^POSTGRES_URL_NON_POOLING=' "$ENV_FILE" | head -1 | cut -d= -f2- | sed 's/^"//; s/"$//')"
case "$URL" in
  postgres*|postgresql*) : ;;
  *) echo "ERROR: POSTGRES_URL_NON_POOLING missing or unparseable in .env" >&2; exit 1 ;;
esac

mkdir -p "$BACKUP_DIR"
OUT="$BACKUP_DIR/openmyc-$(date +%Y%m%d-%H%M%S).sql"

echo "pg_dump: $("$PGD" --version)"
echo "Dumping -> $OUT"
if ! "$PGD" "$URL" --no-owner --no-acl --format=plain >"$OUT" 2>/tmp/backup-db.err; then
  echo "DUMP FAILED:" >&2
  cat /tmp/backup-db.err >&2
  rm -f "$OUT"
  exit 1
fi

MICS="$(grep -c '^[0-9]' <(awk '/^COPY public.mics /{f=1;next} f&&/^\\\./{f=0} f' "$OUT") || true)"
echo "OK: $(du -h "$OUT" | cut -f1), mics rows: ${MICS:-?}"
