import { Database } from '../database';

export interface User {
  id: string;
  name: string;
  email: string;
  certification_level: string;
  phone?: string;
  emergency_contact?: string;
  created_at: string;
  updated_at: string;
}

export class UserRepository {
  constructor(private db: Database) {}

  async findAll(): Promise<User[]> {
    return this.db.all('SELECT * FROM users ORDER BY name');
  }

  async findById(id: string): Promise<User | undefined> {
    return this.db.get('SELECT * FROM users WHERE id = ?', [id]);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.db.get('SELECT * FROM users WHERE email = ?', [email]);
  }

  async create(user: Omit<User, 'created_at' | 'updated_at'>): Promise<User> {
    await this.db.run(
      'INSERT INTO users (id, name, email, certification_level, phone, emergency_contact) VALUES (?, ?, ?, ?, ?, ?)',
      [user.id, user.name, user.email, user.certification_level, user.phone, user.emergency_contact]
    );
    
    const created = await this.findById(user.id);
    if (!created) throw new Error('Failed to create user');
    return created;
  }

  async update(id: string, updates: Partial<User>): Promise<User> {
    const fields = Object.keys(updates).filter(key => key !== 'id' && key !== 'created_at');
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => (updates as any)[field]);
    
    await this.db.run(
      `UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [...values, id]
    );
    
    const updated = await this.findById(id);
    if (!updated) throw new Error('User not found');
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.db.run('DELETE FROM users WHERE id = ?', [id]);
  }
}