import { Router } from 'express';
import { DatabaseManager } from '../database/database';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const db = new DatabaseManager();
const database = db.getDatabase();

// === UTILISATEURS ===

router.get('/users', (req, res) => {
  try {
    const { search } = req.query;
    let query = 'SELECT * FROM users WHERE is_active = 1';
    const params: any[] = [];

    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY name';
    const stmt = database.prepare(query);
    const users = stmt.all(...params);

    res.json(users);
  } catch (error) {
    console.error('Erreur récupération utilisateurs:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/users', (req, res) => {
  try {
    const { name, email, license_number, certification_level, role } = req.body;
    const id = uuidv4();
    const qr_code = `USER-${id.substring(0, 8)}-QR`;

    const stmt = database.prepare(`
      INSERT INTO users (id, name, email, license_number, certification_level, role, qr_code)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, name, email, license_number, certification_level, role, qr_code);
    res.status(201).json({ id, message: 'Utilisateur créé avec succès' });
  } catch (error) {
    console.error('Erreur création utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.put('/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    
    const stmt = database.prepare(`
      UPDATE users SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `);
    
    stmt.run(...values, id);
    res.json({ message: 'Utilisateur mis à jour' });
  } catch (error) {
    console.error('Erreur mise à jour utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// === ÉQUIPEMENTS ===

router.get('/assets', (req, res) => {
  try {
    const { search, status, category } = req.query;
    let query = `
      SELECT a.*, u.name as assigned_to_name 
      FROM assets a 
      LEFT JOIN users u ON a.assigned_to_user_id = u.id 
      WHERE 1=1
    `;
    const params: any[] = [];

    if (search) {
      query += ' AND (a.name LIKE ? OR a.asset_tag LIKE ? OR a.serial_number LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (status && status !== 'all') {
      query += ' AND a.status = ?';
      params.push(status);
    }

    if (category && category !== 'all') {
      query += ' AND a.category = ?';
      params.push(category);
    }

    query += ' ORDER BY a.name';
    const stmt = database.prepare(query);
    const assets = stmt.all(...params);

    res.json(assets);
  } catch (error) {
    console.error('Erreur récupération équipements:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/assets', (req, res) => {
  try {
    const { name, serial_number, asset_tag, category, model, manufacturer, location, notes } = req.body;
    const id = uuidv4();
    const qr_code = `${asset_tag}-QR`;

    const stmt = database.prepare(`
      INSERT INTO assets (id, name, serial_number, asset_tag, category, model, manufacturer, status, location, notes, qr_code)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'available', ?, ?, ?)
    `);

    stmt.run(id, name, serial_number, asset_tag, category, model, manufacturer, location, notes, qr_code);
    res.status(201).json({ id, message: 'Équipement créé avec succès' });
  } catch (error) {
    console.error('Erreur création équipement:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// === QR CODE ===

router.get('/qr/user/:code', (req, res) => {
  try {
    const { code } = req.params;
    const stmt = database.prepare('SELECT * FROM users WHERE qr_code = ? AND is_active = 1');
    const user = stmt.get(code);

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (error) {
    console.error('Erreur recherche utilisateur QR:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/qr/asset/:code', (req, res) => {
  try {
    const { code } = req.params;
    const stmt = database.prepare(`
      SELECT a.*, u.name as assigned_to_name 
      FROM assets a 
      LEFT JOIN users u ON a.assigned_to_user_id = u.id 
      WHERE a.qr_code = ?
    `);
    const asset = stmt.get(code);

    if (!asset) {
      return res.status(404).json({ error: 'Équipement non trouvé' });
    }

    res.json(asset);
  } catch (error) {
    console.error('Erreur recherche équipement QR:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// === CHECKOUT/CHECKIN ===

router.post('/checkout', (req, res) => {
  try {
    const { assetId, userId, performedBy, notes } = req.body;
    const movementId = uuidv4();

    database.transaction(() => {
      // Mettre à jour l'équipement
      const updateAsset = database.prepare(`
        UPDATE assets SET status = 'checked_out', assigned_to_user_id = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ? AND status = 'available'
      `);
      const result = updateAsset.run(userId, assetId);

      if (result.changes === 0) {
        throw new Error('Équipement non disponible');
      }

      // Enregistrer le mouvement
      const insertMovement = database.prepare(`
        INSERT INTO movements (id, asset_id, user_id, type, notes, performed_by, method)
        VALUES (?, ?, ?, 'checkout', ?, ?, 'qr_scan')
      `);
      insertMovement.run(movementId, assetId, userId, notes, performedBy);
    })();

    res.json({ message: 'Checkout effectué avec succès' });
  } catch (error) {
    console.error('Erreur checkout:', error);
    res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
});

router.post('/checkin', (req, res) => {
  try {
    const { assetId, userId, performedBy, notes, hasIssues, issueDescription } = req.body;
    const movementId = uuidv4();

    database.transaction(() => {
      // Mettre à jour l'équipement
      const newStatus = hasIssues ? 'defective' : 'available';
      const updateAsset = database.prepare(`
        UPDATE assets SET 
          status = ?, 
          assigned_to_user_id = NULL, 
          has_issues = ?, 
          issue_count = issue_count + ?,
          last_issue_date = CASE WHEN ? THEN CURRENT_TIMESTAMP ELSE last_issue_date END,
          updated_at = CURRENT_TIMESTAMP 
        WHERE id = ? AND status = 'checked_out'
      `);
      const result = updateAsset.run(newStatus, hasIssues ? 1 : 0, hasIssues ? 1 : 0, hasIssues, assetId);

      if (result.changes === 0) {
        throw new Error('Équipement non trouvé ou pas en sortie');
      }

      // Enregistrer le mouvement
      const insertMovement = database.prepare(`
        INSERT INTO movements (id, asset_id, user_id, type, notes, performed_by, has_issues, issue_description, method)
        VALUES (?, ?, ?, 'checkin', ?, ?, ?, ?, 'qr_scan')
      `);
      insertMovement.run(movementId, assetId, userId, notes, performedBy, hasIssues ? 1 : 0, issueDescription);

      // Créer un problème si nécessaire
      if (hasIssues && issueDescription) {
        const issueId = uuidv4();
        const insertIssue = database.prepare(`
          INSERT INTO issues (id, asset_id, title, description, severity, status, reported_by)
          VALUES (?, ?, ?, ?, 'medium', 'open', ?)
        `);
        insertIssue.run(issueId, assetId, 'Problème signalé lors du retour', issueDescription, performedBy);
      }
    })();

    res.json({ message: 'Checkin effectué avec succès' });
  } catch (error) {
    console.error('Erreur checkin:', error);
    res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
});

// === MOUVEMENTS ===

router.get('/movements', (req, res) => {
  try {
    const { search, type, limit } = req.query;
    let query = `
      SELECT m.*, a.name as asset_name, u.name as user_name
      FROM movements m
      JOIN assets a ON m.asset_id = a.id
      JOIN users u ON m.user_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (search) {
      query += ' AND (a.name LIKE ? OR u.name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (type && type !== 'all') {
      query += ' AND m.type = ?';
      params.push(type);
    }

    query += ' ORDER BY m.date DESC';

    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit as string));
    }

    const stmt = database.prepare(query);
    const movements = stmt.all(...params);

    res.json(movements);
  } catch (error) {
    console.error('Erreur récupération mouvements:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// === STATISTIQUES ===

router.get('/stats', (req, res) => {
  try {
    const totalAssets = database.prepare('SELECT COUNT(*) as count FROM assets').get() as { count: number };
    const availableAssets = database.prepare('SELECT COUNT(*) as count FROM assets WHERE status = "available"').get() as { count: number };
    const checkedOutAssets = database.prepare('SELECT COUNT(*) as count FROM assets WHERE status = "checked_out"').get() as { count: number };
    const maintenanceAssets = database.prepare('SELECT COUNT(*) as count FROM assets WHERE status = "maintenance"').get() as { count: number };
    const defectiveAssets = database.prepare('SELECT COUNT(*) as count FROM assets WHERE status = "defective"').get() as { count: number };
    const retiredAssets = database.prepare('SELECT COUNT(*) as count FROM assets WHERE status = "retired"').get() as { count: number };
    const activeUsers = database.prepare('SELECT COUNT(*) as count FROM users WHERE is_active = 1').get() as { count: number };

    // Mouvements récents
    const recentMovements = database.prepare(`
      SELECT m.*, a.name as asset_name, u.name as user_name
      FROM movements m
      JOIN assets a ON m.asset_id = a.id
      JOIN users u ON m.user_id = u.id
      ORDER BY m.date DESC
      LIMIT 5
    `).all();

    const stats = {
      totalAssets: totalAssets.count,
      availableAssets: availableAssets.count,
      checkedOutAssets: checkedOutAssets.count,
      maintenanceAssets: maintenanceAssets.count,
      retiredAssets: retiredAssets.count,
      defectiveAssets: defectiveAssets.count,
      activeUsers: activeUsers.count,
      recentMovements,
      unreadNotifications: 0,
      criticalIssues: 0,
      openIssues: 0
    };

    res.json(stats);
  } catch (error) {
    console.error('Erreur récupération statistiques:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// === HEALTH CHECK ===

router.get('/health', (req, res) => {
  try {
    const stats = db.getStats();
    res.json({ 
      status: 'OK', 
      database: 'Connected',
      timestamp: new Date().toISOString(),
      stats
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      database: 'Disconnected',
      error: error.message 
    });
  }
});

export default router;