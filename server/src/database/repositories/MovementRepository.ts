import { Database } from '../database';

export interface Movement {
  id: string;
  asset_id: string;
  user_id: string;
  type: 'checkout' | 'checkin';
  performed_by: string;
  timestamp: string;
  notes?: string;
}

export class MovementRepository {
  constructor(private db: Database) {}

  async findAll(): Promise<Movement[]> {
    return this.db.all(`
      SELECT m.*, u.name as user_name, a.name as asset_name 
      FROM movements m
      JOIN users u ON m.user_id = u.id
      JOIN assets a ON m.asset_id = a.id
      ORDER BY m.timestamp DESC
    `);
  }

  async findById(id: string): Promise<Movement | undefined> {
    return this.db.get('SELECT * FROM movements WHERE id = ?', [id]);
  }

  async findByAssetId(assetId: string): Promise<Movement[]> {
    return this.db.all(
      'SELECT * FROM movements WHERE asset_id = ? ORDER BY timestamp DESC',
      [assetId]
    );
  }

  async findByUserId(userId: string): Promise<Movement[]> {
    return this.db.all(
      'SELECT * FROM movements WHERE user_id = ? ORDER BY timestamp DESC',
      [userId]
    );
  }

  async create(movement: Omit<Movement, 'id' | 'timestamp'>): Promise<Movement> {
    const id = `mov-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    await this.db.run(
      'INSERT INTO movements (id, asset_id, user_id, type, performed_by, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [id, movement.asset_id, movement.user_id, movement.type, movement.performed_by, movement.notes]
    );
    
    const created = await this.findById(id);
    if (!created) throw new Error('Failed to create movement');
    return created;
  }
}