import { Database } from '../database';

export interface Asset {
  id: string;
  name: string;
  type: string;
  size?: string;
  condition: string;
  location?: string;
  qr_code?: string;
  is_available: boolean;
  last_maintenance?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export class AssetRepository {
  constructor(private db: Database) {}

  async findAll(): Promise<Asset[]> {
    return this.db.all('SELECT * FROM assets ORDER BY name');
  }

  async findById(id: string): Promise<Asset | undefined> {
    return this.db.get('SELECT * FROM assets WHERE id = ?', [id]);
  }

  async findByQRCode(qrCode: string): Promise<Asset | undefined> {
    return this.db.get('SELECT * FROM assets WHERE qr_code = ?', [qrCode]);
  }

  async findByType(type: string): Promise<Asset[]> {
    return this.db.all('SELECT * FROM assets WHERE type = ? ORDER BY name', [type]);
  }

  async findAvailable(): Promise<Asset[]> {
    return this.db.all('SELECT * FROM assets WHERE is_available = 1 ORDER BY name');
  }

  async create(asset: Omit<Asset, 'created_at' | 'updated_at'>): Promise<Asset> {
    await this.db.run(
      'INSERT INTO assets (id, name, type, size, condition, location, qr_code, is_available, last_maintenance, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [asset.id, asset.name, asset.type, asset.size, asset.condition, asset.location, asset.qr_code, asset.is_available, asset.last_maintenance, asset.notes]
    );
    
    const created = await this.findById(asset.id);
    if (!created) throw new Error('Failed to create asset');
    return created;
  }

  async updateAvailability(id: string, isAvailable: boolean): Promise<void> {
    await this.db.run(
      'UPDATE assets SET is_available = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [isAvailable, id]
    );
  }

  async update(id: string, updates: Partial<Asset>): Promise<Asset> {
    const fields = Object.keys(updates).filter(key => key !== 'id' && key !== 'created_at');
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => (updates as any)[field]);
    
    await this.db.run(
      `UPDATE assets SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [...values, id]
    );
    
    const updated = await this.findById(id);
    if (!updated) throw new Error('Asset not found');
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.db.run('DELETE FROM assets WHERE id = ?', [id]);
  }
}