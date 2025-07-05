import { Database } from 'better-sqlite3';
import { Asset } from '../../types';
import { db } from '../database';

export class AssetRepository {
  private database: Database.Database;

  constructor() {
    this.database = db.getDatabase();
  }

  // Créer un équipement
  create(asset: Omit<Asset, 'createdAt' | 'updatedAt'>): Asset {
    const stmt = this.database.prepare(`
      INSERT INTO assets (
        id, name, serial_number, asset_tag, category, model, manufacturer,
        status, assigned_to_user_id, location, notes, has_issues, issue_count,
        last_issue_date, qr_code
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      asset.id,
      asset.name,
      asset.serialNumber,
      asset.assetTag,
      asset.category,
      asset.model || null,
      asset.manufacturer || null,
      asset.status,
      this.getUserIdByName(asset.assignedTo) || null,
      asset.location,
      asset.notes || null,
      asset.hasIssues ? 1 : 0,
      asset.issueCount || 0,
      asset.lastIssueDate || null,
      asset.qrCode
    );

    return this.findById(asset.id)!;
  }

  // Trouver un équipement par ID
  findById(id: string): Asset | null {
    const stmt = this.database.prepare(`
      SELECT a.*, u.name as assigned_to_name 
      FROM assets a
      LEFT JOIN users u ON a.assigned_to_user_id = u.id
      WHERE a.id = ?
    `);
    
    const row = stmt.get(id) as any;
    
    if (!row) return null;
    
    return this.mapRowToAsset(row);
  }

  // Trouver un équipement par QR code
  findByQrCode(qrCode: string): Asset | null {
    const stmt = this.database.prepare(`
      SELECT a.*, u.name as assigned_to_name 
      FROM assets a
      LEFT JOIN users u ON a.assigned_to_user_id = u.id
      WHERE a.qr_code = ?
    `);
    
    const row = stmt.get(qrCode) as any;
    
    if (!row) return null;
    
    return this.mapRowToAsset(row);
  }

  // Obtenir tous les équipements
  findAll(): Asset[] {
    const stmt = this.database.prepare(`
      SELECT a.*, u.name as assigned_to_name 
      FROM assets a
      LEFT JOIN users u ON a.assigned_to_user_id = u.id
      ORDER BY a.name
    `);
    
    const rows = stmt.all() as any[];
    
    return rows.map(row => this.mapRowToAsset(row));
  }

  // Rechercher des équipements
  search(searchTerm: string, statusFilter?: string, categoryFilter?: string): Asset[] {
    let query = `
      SELECT a.*, u.name as assigned_to_name 
      FROM assets a
      LEFT JOIN users u ON a.assigned_to_user_id = u.id
      WHERE (a.name LIKE ? OR a.asset_tag LIKE ? OR a.serial_number LIKE ?)
    `;
    
    const params: any[] = [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`];

    if (statusFilter && statusFilter !== 'all') {
      query += ' AND a.status = ?';
      params.push(statusFilter);
    }

    if (categoryFilter && categoryFilter !== 'all') {
      query += ' AND a.category = ?';
      params.push(categoryFilter);
    }

    query += ' ORDER BY a.name';

    const stmt = this.database.prepare(query);
    const rows = stmt.all(...params) as any[];
    
    return rows.map(row => this.mapRowToAsset(row));
  }

  // Obtenir les équipements par utilisateur
  findByUser(userName: string): Asset[] {
    const stmt = this.database.prepare(`
      SELECT a.*, u.name as assigned_to_name 
      FROM assets a
      JOIN users u ON a.assigned_to_user_id = u.id
      WHERE u.name = ?
      ORDER BY a.name
    `);
    
    const rows = stmt.all(userName) as any[];
    
    return rows.map(row => this.mapRowToAsset(row));
  }

  // Mettre à jour un équipement
  update(id: string, updates: Partial<Asset>): Asset | null {
    const fields = [];
    const values = [];

    if (updates.name !== undefined) {
      fields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.status !== undefined) {
      fields.push('status = ?');
      values.push(updates.status);
    }
    if (updates.assignedTo !== undefined) {
      fields.push('assigned_to_user_id = ?');
      values.push(this.getUserIdByName(updates.assignedTo) || null);
    }
    if (updates.location !== undefined) {
      fields.push('location = ?');
      values.push(updates.location);
    }
    if (updates.notes !== undefined) {
      fields.push('notes = ?');
      values.push(updates.notes);
    }
    if (updates.hasIssues !== undefined) {
      fields.push('has_issues = ?');
      values.push(updates.hasIssues ? 1 : 0);
    }
    if (updates.issueCount !== undefined) {
      fields.push('issue_count = ?');
      values.push(updates.issueCount);
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    
    const stmt = this.database.prepare(`
      UPDATE assets SET ${fields.join(', ')} WHERE id = ?
    `);
    
    stmt.run(...values);
    
    return this.findById(id);
  }

  // Obtenir les statistiques des équipements
  getStats() {
    const stmt = this.database.prepare(`
      SELECT 
        status,
        COUNT(*) as count
      FROM assets 
      GROUP BY status
    `);
    
    const rows = stmt.all() as any[];
    
    const stats = {
      total: 0,
      available: 0,
      checked_out: 0,
      maintenance: 0,
      defective: 0,
      retired: 0
    };

    rows.forEach(row => {
      stats.total += row.count;
      stats[row.status as keyof typeof stats] = row.count;
    });

    return stats;
  }

  // Méthode utilitaire pour obtenir l'ID utilisateur par nom
  private getUserIdByName(userName?: string): string | null {
    if (!userName) return null;
    
    const stmt = this.database.prepare('SELECT id FROM users WHERE name = ?');
    const result = stmt.get(userName) as any;
    
    return result?.id || null;
  }

  // Mapper une ligne de base de données vers un objet Asset
  private mapRowToAsset(row: any): Asset {
    return {
      id: row.id,
      name: row.name,
      serialNumber: row.serial_number,
      assetTag: row.asset_tag,
      category: row.category,
      model: row.model,
      manufacturer: row.manufacturer,
      status: row.status,
      assignedTo: row.assigned_to_name,
      location: row.location,
      notes: row.notes,
      hasIssues: Boolean(row.has_issues),
      issueCount: row.issue_count,
      lastIssueDate: row.last_issue_date,
      qrCode: row.qr_code,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}