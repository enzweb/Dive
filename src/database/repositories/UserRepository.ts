import { Database } from 'better-sqlite3';
import { User } from '../../types';
import { db } from '../database';

export class UserRepository {
  private database: Database.Database;

  constructor() {
    this.database = db.getDatabase();
  }

  // Créer un utilisateur
  create(user: Omit<User, 'createdAt'>): User {
    const stmt = this.database.prepare(`
      INSERT INTO users (id, name, email, license_number, certification_level, role, qr_code, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      user.id,
      user.name,
      user.email,
      user.licenseNumber || null,
      user.certificationLevel,
      user.role,
      user.qrCode,
      user.isActive ? 1 : 0
    );

    return this.findById(user.id)!;
  }

  // Trouver un utilisateur par ID
  findById(id: string): User | null {
    const stmt = this.database.prepare('SELECT * FROM users WHERE id = ?');
    const row = stmt.get(id) as any;
    
    if (!row) return null;
    
    return this.mapRowToUser(row);
  }

  // Trouver un utilisateur par QR code
  findByQrCode(qrCode: string): User | null {
    const stmt = this.database.prepare('SELECT * FROM users WHERE qr_code = ?');
    const row = stmt.get(qrCode) as any;
    
    if (!row) return null;
    
    return this.mapRowToUser(row);
  }

  // Obtenir tous les utilisateurs
  findAll(): User[] {
    const stmt = this.database.prepare('SELECT * FROM users ORDER BY name');
    const rows = stmt.all() as any[];
    
    return rows.map(row => this.mapRowToUser(row));
  }

  // Rechercher des utilisateurs
  search(searchTerm: string): User[] {
    const stmt = this.database.prepare(`
      SELECT * FROM users 
      WHERE name LIKE ? OR email LIKE ? OR license_number LIKE ?
      ORDER BY name
    `);
    
    const term = `%${searchTerm}%`;
    const rows = stmt.all(term, term, term) as any[];
    
    return rows.map(row => this.mapRowToUser(row));
  }

  // Mettre à jour un utilisateur
  update(id: string, updates: Partial<User>): User | null {
    const fields = [];
    const values = [];

    if (updates.name !== undefined) {
      fields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.email !== undefined) {
      fields.push('email = ?');
      values.push(updates.email);
    }
    if (updates.licenseNumber !== undefined) {
      fields.push('license_number = ?');
      values.push(updates.licenseNumber);
    }
    if (updates.certificationLevel !== undefined) {
      fields.push('certification_level = ?');
      values.push(updates.certificationLevel);
    }
    if (updates.role !== undefined) {
      fields.push('role = ?');
      values.push(updates.role);
    }
    if (updates.isActive !== undefined) {
      fields.push('is_active = ?');
      values.push(updates.isActive ? 1 : 0);
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    
    const stmt = this.database.prepare(`
      UPDATE users SET ${fields.join(', ')} WHERE id = ?
    `);
    
    stmt.run(...values);
    
    return this.findById(id);
  }

  // Supprimer un utilisateur
  delete(id: string): boolean {
    const stmt = this.database.prepare('DELETE FROM users WHERE id = ?');
    const result = stmt.run(id);
    
    return result.changes > 0;
  }

  // Mapper une ligne de base de données vers un objet User
  private mapRowToUser(row: any): User {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      licenseNumber: row.license_number,
      certificationLevel: row.certification_level,
      role: row.role,
      qrCode: row.qr_code,
      isActive: Boolean(row.is_active),
      createdAt: row.created_at
    };
  }
}