import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

export class DatabaseManager {
  private db: Database.Database;
  private dbPath: string;

  constructor(dbPath?: string) {
    this.dbPath = dbPath || path.join(__dirname, '../../divemanager.db');
    this.db = new Database(this.dbPath);
    this.init();
  }

  private init() {
    // Configuration SQLite
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');
    
    // Création des tables
    this.createTables();
    this.insertSampleData();
  }

  private createTables() {
    // Table des utilisateurs
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        license_number TEXT,
        certification_level TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'user')),
        qr_code TEXT UNIQUE NOT NULL,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Table des équipements
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS assets (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        serial_number TEXT UNIQUE NOT NULL,
        asset_tag TEXT UNIQUE NOT NULL,
        category TEXT NOT NULL,
        model TEXT,
        manufacturer TEXT,
        status TEXT NOT NULL CHECK (status IN ('available', 'checked_out', 'maintenance', 'retired', 'defective')),
        assigned_to_user_id TEXT,
        location TEXT NOT NULL,
        notes TEXT,
        has_issues BOOLEAN DEFAULT 0,
        issue_count INTEGER DEFAULT 0,
        last_issue_date DATETIME,
        qr_code TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (assigned_to_user_id) REFERENCES users(id)
      )
    `);

    // Table des mouvements
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS movements (
        id TEXT PRIMARY KEY,
        asset_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('checkout', 'checkin', 'maintenance', 'retired')),
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        notes TEXT,
        performed_by TEXT NOT NULL,
        has_issues BOOLEAN DEFAULT 0,
        issue_description TEXT,
        method TEXT NOT NULL CHECK (method IN ('manual', 'qr_scan')),
        FOREIGN KEY (asset_id) REFERENCES assets(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Table des problèmes
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS issues (
        id TEXT PRIMARY KEY,
        asset_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
        status TEXT NOT NULL CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
        reported_by TEXT NOT NULL,
        reported_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        assigned_to TEXT,
        resolved_at DATETIME,
        resolved_by TEXT,
        resolution TEXT,
        FOREIGN KEY (asset_id) REFERENCES assets(id)
      )
    `);

    // Index pour les performances
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_assets_status ON assets(status);
      CREATE INDEX IF NOT EXISTS idx_assets_assigned_to ON assets(assigned_to_user_id);
      CREATE INDEX IF NOT EXISTS idx_movements_asset_id ON movements(asset_id);
      CREATE INDEX IF NOT EXISTS idx_movements_user_id ON movements(user_id);
      CREATE INDEX IF NOT EXISTS idx_movements_date ON movements(date);
      CREATE INDEX IF NOT EXISTS idx_issues_asset_id ON issues(asset_id);
      CREATE INDEX IF NOT EXISTS idx_issues_status ON issues(status);
    `);
  }

  private insertSampleData() {
    // Vérifier si des données existent déjà
    const userCount = this.db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
    if (userCount.count > 0) return;

    // Insérer des utilisateurs de démonstration
    const insertUser = this.db.prepare(`
      INSERT INTO users (id, name, email, license_number, certification_level, role, qr_code, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const users = [
      ['1', 'Jean Dupont', 'jean.dupont@club-plongee.com', 'FFESSM-123456', 'Niveau 2', 'user', 'USER-001-QR', 1],
      ['2', 'Marie Martin', 'marie.martin@club-plongee.com', 'FFESSM-789012', 'Niveau 3', 'user', 'USER-002-QR', 1],
      ['3', 'Pierre Dubois', 'pierre.dubois@club-plongee.com', 'FFESSM-345678', 'Moniteur E3', 'manager', 'USER-003-QR', 1],
      ['4', 'Sophie Leroy', 'sophie.leroy@club-plongee.com', 'FFESSM-901234', 'Instructeur', 'admin', 'USER-004-QR', 1]
    ];

    users.forEach(user => insertUser.run(...user));

    // Insérer des équipements de démonstration
    const insertAsset = this.db.prepare(`
      INSERT INTO assets (id, name, serial_number, asset_tag, category, model, manufacturer, status, assigned_to_user_id, location, notes, has_issues, issue_count, last_issue_date, qr_code)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const assets = [
      ['1', 'Détendeur Scubapro MK25 EVO', 'SP2023001', 'DET-001', 'Détendeurs', 'MK25 EVO', 'Scubapro', 'checked_out', '1', 'Club de Plongée - Vestiaire', 'Révision effectuée en janvier 2024', 0, 0, null, 'DET-001-QR'],
      ['2', 'Combinaison Néoprène 5mm', 'NEO2023002', 'COM-002', 'Combinaisons', 'Néoprène 5mm Taille L', 'Beuchat', 'available', null, 'Club de Plongée - Stock', 'Taille L, bon état général', 0, 0, null, 'COM-002-QR'],
      ['3', 'Masque Cressi Big Eyes Evolution', 'CR2023003', 'MAS-003', 'Masques', 'Big Eyes Evolution', 'Cressi', 'defective', null, 'Club de Plongée - Maintenance', 'Sangle cassée - en attente de réparation', 1, 1, '2024-01-08 09:15:00', 'MAS-003-QR'],
      ['4', 'Palmes Mares Avanti Quattro Plus', 'MA2023004', 'PAL-004', 'Palmes', 'Avanti Quattro Plus Taille 42-43', 'Mares', 'maintenance', null, 'Club de Plongée - Maintenance', 'Nettoyage et vérification des sangles', 1, 1, '2024-01-05 11:45:00', 'PAL-004-QR'],
      ['5', 'Gilet Stabilisateur Aqualung Pro HD', 'AQ2023005', 'GIL-005', 'Gilets', 'Pro HD Taille M', 'Aqualung', 'checked_out', '2', 'Club de Plongée - En sortie', 'Taille M, excellent état', 0, 0, null, 'GIL-005-QR'],
      ['6', 'Bouteille 12L Acier', 'BT2023006', 'BOU-006', 'Bouteilles', '12L Acier 232 bars', 'Roth', 'available', null, 'Club de Plongée - Compresseur', 'Contrôle technique valide jusqu\'en 2025', 0, 0, null, 'BOU-006-QR']
    ];

    assets.forEach(asset => insertAsset.run(...asset));

    // Insérer des mouvements de démonstration
    const insertMovement = this.db.prepare(`
      INSERT INTO movements (id, asset_id, user_id, type, date, notes, performed_by, has_issues, issue_description, method)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const movements = [
      ['1', '1', '1', 'checkout', '2024-01-15 10:30:00', 'Sortie plongée épave', 'Pierre Dubois', 0, null, 'qr_scan'],
      ['2', '3', '2', 'checkin', '2024-01-08 14:20:00', 'Retour avec sangle cassée', 'Pierre Dubois', 1, 'Sangle du masque cassée pendant la plongée', 'manual'],
      ['3', '4', '3', 'maintenance', '2024-01-05 09:15:00', 'Maintenance préventive', 'Pierre Dubois', 0, null, 'manual'],
      ['4', '5', '2', 'checkout', '2024-01-10 16:20:00', 'Formation Niveau 1', 'Sophie Leroy', 0, null, 'qr_scan']
    ];

    movements.forEach(movement => insertMovement.run(...movement));
  }

  // Méthodes utilitaires
  public getDatabase(): Database.Database {
    return this.db;
  }

  public close(): void {
    this.db.close();
  }

  public backup(backupPath: string): void {
    this.db.backup(backupPath);
  }

  public getStats() {
    const totalUsers = this.db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
    const totalAssets = this.db.prepare('SELECT COUNT(*) as count FROM assets').get() as { count: number };
    const totalMovements = this.db.prepare('SELECT COUNT(*) as count FROM movements').get() as { count: number };
    const openIssues = this.db.prepare('SELECT COUNT(*) as count FROM issues WHERE status IN ("open", "in_progress")').get() as { count: number };

    return {
      totalUsers: totalUsers.count,
      totalAssets: totalAssets.count,
      totalMovements: totalMovements.count,
      openIssues: openIssues.count
    };
  }
}