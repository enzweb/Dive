import { Router } from 'express';
import { UserRepository } from '../database/repositories/UserRepository.js';
import { AssetRepository } from '../database/repositories/AssetRepository.js';
import { MovementRepository } from '../database/repositories/MovementRepository.js';
import { DatabaseManager } from '../database/database.js';

const router = Router();
const db = new DatabaseManager();
const database = db.getDatabase();

const userRepo = new UserRepository(database);
const assetRepo = new AssetRepository(database);
const movementRepo = new MovementRepository(database);

// === ROUTES UTILISATEURS ===

router.get('/users', (req, res) => {
  try {
    const { search } = req.query;
    const users = search 
      ? userRepo.search(search as string)
      : userRepo.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
  }
});

router.get('/users/:id', (req, res) => {
  try {
    const user = userRepo.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur' });
  }
});

router.post('/users', (req, res) => {
  try {
    const user = userRepo.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la création de l\'utilisateur' });
  }
});

router.put('/users/:id', (req, res) => {
  try {
    const user = userRepo.update(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur' });
  }
});

router.delete('/users/:id', (req, res) => {
  try {
    const success = userRepo.delete(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur' });
  }
});

// === ROUTES ÉQUIPEMENTS ===

router.get('/assets', (req, res) => {
  try {
    const { search, status, category } = req.query;
    const assets = search 
      ? assetRepo.search(search as string, status as string, category as string)
      : assetRepo.findAll();
    res.json(assets);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des équipements' });
  }
});

router.get('/assets/:id', (req, res) => {
  try {
    const asset = assetRepo.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ error: 'Équipement non trouvé' });
    }
    res.json(asset);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'équipement' });
  }
});

router.post('/assets', (req, res) => {
  try {
    const asset = assetRepo.create(req.body);
    res.status(201).json(asset);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la création de l\'équipement' });
  }
});

router.put('/assets/:id', (req, res) => {
  try {
    const asset = assetRepo.update(req.params.id, req.body);
    if (!asset) {
      return res.status(404).json({ error: 'Équipement non trouvé' });
    }
    res.json(asset);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la mise à jour de l\'équipement' });
  }
});

// === ROUTES MOUVEMENTS ===

router.get('/movements', (req, res) => {
  try {
    const { search, type, limit } = req.query;
    const movements = search 
      ? movementRepo.search(search as string, type as string)
      : movementRepo.findAll(limit ? parseInt(limit as string) : undefined);
    res.json(movements);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des mouvements' });
  }
});

router.post('/movements', (req, res) => {
  try {
    const movement = movementRepo.create(req.body);
    res.status(201).json(movement);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la création du mouvement' });
  }
});

// === ROUTES QR CODE ===

router.get('/qr/user/:qrCode', (req, res) => {
  try {
    const user = userRepo.findByQrCode(req.params.qrCode);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la recherche par QR code' });
  }
});

router.get('/qr/asset/:qrCode', (req, res) => {
  try {
    const asset = assetRepo.findByQrCode(req.params.qrCode);
    if (!asset) {
      return res.status(404).json({ error: 'Équipement non trouvé' });
    }
    res.json(asset);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la recherche par QR code' });
  }
});

// === ROUTES CHECKOUT/CHECKIN ===

router.post('/checkout', (req, res) => {
  try {
    const { assetId, userId, performedBy, notes } = req.body;
    
    const asset = assetRepo.findById(assetId);
    const user = userRepo.findById(userId);

    if (!asset) {
      return res.status(404).json({ error: 'Équipement non trouvé' });
    }

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    if (asset.status !== 'available') {
      return res.status(400).json({ error: `Équipement non disponible (${asset.status})` });
    }

    // Mettre à jour l'équipement
    assetRepo.update(assetId, {
      status: 'checked_out',
      assignedTo: user.name
    });

    // Créer le mouvement
    const movement = movementRepo.create({
      id: Date.now().toString(),
      assetId,
      assetName: asset.name,
      type: 'checkout',
      userId,
      userName: user.name,
      performedBy,
      notes,
      method: 'qr_scan'
    });

    res.json({
      success: true,
      message: `${asset.name} assigné à ${user.name}`,
      movement,
      asset: assetRepo.findById(assetId)
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du checkout' });
  }
});

router.post('/checkin', (req, res) => {
  try {
    const { assetId, userId, performedBy, notes, hasIssues, issueDescription } = req.body;
    
    const asset = assetRepo.findById(assetId);
    const user = userRepo.findById(userId);

    if (!asset) {
      return res.status(404).json({ error: 'Équipement non trouvé' });
    }

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    if (asset.status !== 'checked_out') {
      return res.status(400).json({ error: 'Équipement non en sortie' });
    }

    if (asset.assignedTo !== user.name) {
      return res.status(400).json({ error: `Équipement assigné à ${asset.assignedTo}` });
    }

    // Mettre à jour l'équipement
    const newStatus = hasIssues ? 'defective' : 'available';
    assetRepo.update(assetId, {
      status: newStatus,
      assignedTo: undefined,
      hasIssues,
      issueCount: hasIssues ? (asset.issueCount || 0) + 1 : asset.issueCount,
      lastIssueDate: hasIssues ? new Date().toISOString() : asset.lastIssueDate
    });

    // Créer le mouvement
    const movement = movementRepo.create({
      id: Date.now().toString(),
      assetId,
      assetName: asset.name,
      type: 'checkin',
      userId,
      userName: user.name,
      performedBy,
      notes,
      hasIssues,
      issueDescription,
      method: 'qr_scan'
    });

    res.json({
      success: true,
      message: `${asset.name} retourné par ${user.name}${hasIssues ? ' (avec problème)' : ''}`,
      movement,
      asset: assetRepo.findById(assetId)
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du checkin' });
  }
});

// === ROUTES STATISTIQUES ===

router.get('/stats', (req, res) => {
  try {
    const assetStats = assetRepo.getStats();
    const recentMovements = movementRepo.getRecent(5);
    const users = userRepo.findAll();

    const stats = {
      totalAssets: assetStats.total,
      availableAssets: assetStats.available,
      checkedOutAssets: assetStats.checked_out,
      maintenanceAssets: assetStats.maintenance,
      retiredAssets: assetStats.retired,
      defectiveAssets: assetStats.defective,
      recentMovements,
      unreadNotifications: 0,
      criticalIssues: 0,
      openIssues: 0,
      activeUsers: users.filter(u => u.isActive).length
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
  }
});

export { router as apiRoutes };