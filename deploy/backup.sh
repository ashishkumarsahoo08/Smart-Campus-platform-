#!/usr/bin/env bash
# Shell Automated Database Backup Script (for Linux/macOS cron)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
DB_FILE="$PROJECT_ROOT/backend/data/campus_db.json"
BACKUP_DIR="$PROJECT_ROOT/backend/data/backups"

mkdir -p "$BACKUP_DIR"

if [ -f "$DB_FILE" ]; then
    STAMP=$(date +"%Y%m%d-%H%M%S")
    DEST="$BACKUP_DIR/campus_db_${STAMP}.json"
    cp "$DB_FILE" "$DEST"
    echo "✅ Database backed up to: $DEST"
    
    # Prune snapshots older than 30 days
    find "$BACKUP_DIR" -name "campus_db_*.json" -mtime +30 -exec rm {} \;
else
    echo "⚠️ Database file $DB_FILE not found."
fi
