import fs from 'fs';
import path from 'path';

const DB_PATH = process.env.DB_PATH || './divemanager.db';
const BACKUP_DIR = './backups';

async function backupDatabase() {
  try {
    // Create backup directory if it doesn't exist
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    // Generate backup filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(BACKUP_DIR, `divemanager-backup-${timestamp}.db`);

    // Copy database file
    fs.copyFileSync(DB_PATH, backupPath);
    
    console.log(`Database backed up to: ${backupPath}`);
    
    // Clean up old backups (keep last 10)
    const backupFiles = fs.readdirSync(BACKUP_DIR)
      .filter(file => file.startsWith('divemanager-backup-'))
      .sort()
      .reverse();
    
    if (backupFiles.length > 10) {
      const filesToDelete = backupFiles.slice(10);
      filesToDelete.forEach(file => {
        fs.unlinkSync(path.join(BACKUP_DIR, file));
        console.log(`Deleted old backup: ${file}`);
      });
    }
    
  } catch (error) {
    console.error('Backup failed:', error);
    process.exit(1);
  }
}

backupDatabase();