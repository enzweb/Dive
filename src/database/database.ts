import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join } from 'path';

export class DatabaseManager {
  private db: Database.Database;

  constructor(dbPath: string = './divemanager.db') {
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');
    this.initializeDatabase();
  }

  private initializeDatabase() {
    try {
      // Lire et exécuter le schema SQL
      const schemaPath = join(__dirname, 'schema.sql');
      const schema = readFileSync(schemaPath, 'utf8');
      
      // Diviser le schema en statements individuels
      const statements = schema
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);

      // Exécuter chaque statement
      for (const statement of statements) {
        this.db.exec(statement + ';');
      }

      console.log('✅ Base de données initialisée avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
      throw error;
    }
  }

  // Méthode pour obtenir l'instance de la base de données
  getDatabase(): Database.Database {
    return this.db;
  }

  // Méthode pour fermer la base de données
  close() {
    this.db.close();
  }

  // Méthode pour sauvegarder la base de données
  backup(backupPath: string) {
    try {
      this.db.backup(backupPath);
      console.log(`✅ Sauvegarde créée: ${backupPath}`);
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      throw error;
    }
  }

  // Méthode pour obtenir des statistiques
  getStats() {
    const stats = {
      users: this.db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number },
      assets: this.db.prepare('SELECT COUNT(*) as count FROM assets').get() as { count: number },
      movements: this.db.prepare('SELECT COUNT(*) as count FROM movements').get() as { count: number },
      issues: this.db.prepare('SELECT COUNT(*) as count FROM issues WHERE status IN ("open", "in_progress")').get() as { count: number }
    };

    return {
      totalUsers: stats.users.count,
      totalAssets: stats.assets.count,
      totalMovements: stats.movements.count,
      openIssues: stats.issues.count
    };
  }
}

// Instance singleton de la base de données
export const db = new DatabaseManager();