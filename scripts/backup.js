/**
 * Universal Database Backup Script (Node.js)
 * Creates timestamped snapshots in backend/data/backups/
 * Run with: npm run backup or node scripts/backup.js
 */

const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const dbFile = process.env.DB_FILE || path.join(projectRoot, 'backend', 'data', 'campus_db.json');
const backupDir = process.env.BACKUP_DIR || path.join(projectRoot, 'backend', 'data', 'backups');

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

if (!fs.existsSync(dbFile)) {
  console.warn(`⚠️ Warning: Database file not found at ${dbFile}`);
  process.exit(0);
}

try {
  const now = new Date();
  const stamp = now.toISOString().replace(/[:.]/g, '-');
  const dest = path.join(backupDir, `campus_db_${stamp}.json`);

  fs.copyFileSync(dbFile, dest);
  const stats = fs.statSync(dest);
  console.log(`✅ Database backup created successfully!`);
  console.log(`   Destination: ${dest}`);
  console.log(`   Size: ${(stats.size / 1024).toFixed(2)} KB`);

  // Prune older than 30 days or keep last 20
  const files = fs.readdirSync(backupDir)
    .filter(f => f.startsWith('campus_db_') && f.endsWith('.json'))
    .map(f => ({ name: f, path: path.join(backupDir, f), mtime: fs.statSync(path.join(backupDir, f)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime);

  if (files.length > 20) {
    const toRemove = files.slice(20);
    toRemove.forEach(f => {
      try { fs.unlinkSync(f.path); } catch (e) {}
    });
    console.log(`   Cleaned up ${toRemove.length} older backup archives.`);
  }
} catch (err) {
  console.error(`❌ Backup failed:`, err.message);
  process.exit(1);
}
