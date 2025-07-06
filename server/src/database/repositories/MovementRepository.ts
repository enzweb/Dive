import { Database } from 'better-sqlite3';
import { Movement } from '../../../src/types/index.js';

export class MovementRepository {
  private database: Database.Database;

  constructor(database: Database.Database) {
    this.database = database;
  }

  // Créer un mouvement
  create(movement: Omit<Movement, 'date'>): Movement {
    const stmt = this.database.prepare(`
      INSERT INTO movements (
        id, asset_id, user_id, type, notes, performed_by,
        has_issues, issue_description, method
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const userId = this.getUserIdByName(movement.userName);
    if (!userId) {
      throw new Error(`Utilisateur non trouvé: ${movement.userName}`);
    }

    stmt.run(
      movement.id,
      movement.assetId,
      userId,
      movement.type,
      movement.notes || null,
      movement.performedBy,
      movement.hasIssues ? 1 : 0,
      movement.issueDescription || null,
      movement.method
    );

    return this.findById(movement.id)!;
  }

  // Trouver un mouvement par ID
  findById(id: string): Movement | null {
    const stmt = this.database.prepare(`
      SELECT m.*, a.name as asset_name, u.name as user_name
      FROM movements m
      JOIN assets a ON m.asset_id = a.id
      JOIN users u ON m.user_id = u.id
      WHERE m.id = ?
    `);
    
    const row = stmt.get(id) as any;
    
    if (!row) return null;
    
    return this.mapRowToMovement(row);
  }

  // Obtenir tous les mouvements
  findAll(limit?: number): Movement[] {
    let query = `
      SELECT m.*, a.name as asset_name, u.name as user_name
      FROM movements m
      JOIN assets a ON m.asset_id = a.id
      JOIN users u ON m.user_id = u.id
      ORDER BY m.date DESC
    `;

    if (limit) {
      query += ` LIMIT ${limit}`;
    }

    const stmt = this.database.prepare(query);
    const rows = stmt.all() as any[];
    
    return rows.map(row => this.mapRowToMovement(row));
  }

  // Rechercher des mouvements
  search(searchTerm: string, typeFilter?: string): Movement[] {
    let query = `
      SELECT m.*, a.name as asset_name, u.name as user_name
      FROM movements m
      JOIN assets a ON m.asset_id = a.id
      JOIN users u ON m.user_id = u.id
      WHERE (a.name LIKE ? OR u.name LIKE ?)
    `;
    
    const params: any[] = [`%${searchTerm}%`, `%${searchTerm}%`];

    if (typeFilter && typeFilter !== 'all') {
      query += ' AND m.type = ?';
      params.push(typeFilter);
    }

    query += ' ORDER BY m.date DESC';

    const stmt = this.database.prepare(query);
    const rows = stmt.all(...params) as any[];
    
    return rows.map(row => this.mapRowToMovement(row));
  }

  // Obtenir les mouvements récents
  getRecent(limit: number = 10): Movement[] {
    return this.findAll(limit);
  }

  // Méthode utilitaire pour obtenir l'ID utilisateur par nom
  private getUserIdByName(userName: string): string | null {
    const stmt = this.database.prepare('SELECT id FROM users WHERE name = ?');
    const result = stmt.get(userName) as any;
    
    return result?.id || null;
  }

  // Mapper une ligne de base de données vers un objet Movement
  private mapRowToMovement(row: any): Movement {
    return {
      id: row.id,
      assetId: row.asset_id,
      assetName: row.asset_name,
      type: row.type,
      userId: row.user_id,
      userName: row.user_name,
      date: row.date,
      notes: row.notes,
      performedBy: row.performed_by,
      hasIssues: Boolean(row.has_issues),
      issueDescription: row.issue_description,
      method: row.method
    };
  }
}