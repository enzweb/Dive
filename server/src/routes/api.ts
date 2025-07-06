import express from 'express';
import { getDatabase } from '../database/database';
import { UserRepository } from '../database/repositories/UserRepository';
import { AssetRepository } from '../database/repositories/AssetRepository';
import { MovementRepository } from '../database/repositories/MovementRepository';

const router = express.Router();
const db = getDatabase();
const userRepo = new UserRepository(db);
const assetRepo = new AssetRepository(db);
const movementRepo = new MovementRepository(db);

// Users endpoints
router.get('/users', async (req, res) => {
  try {
    const users = await userRepo.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const user = await userRepo.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Assets endpoints
router.get('/assets', async (req, res) => {
  try {
    const assets = await assetRepo.findAll();
    res.json(assets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assets' });
  }
});

router.get('/assets/:id', async (req, res) => {
  try {
    const asset = await assetRepo.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    res.json(asset);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch asset' });
  }
});

// Movements endpoints
router.get('/movements', async (req, res) => {
  try {
    const movements = await movementRepo.findAll();
    res.json(movements);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movements' });
  }
});

// Checkout endpoint
router.post('/checkout', async (req, res) => {
  try {
    const { assetId, userId, performedBy, notes } = req.body;
    
    // Check if asset is available
    const asset = await assetRepo.findById(assetId);
    if (!asset || !asset.is_available) {
      return res.status(400).json({ error: 'Asset not available' });
    }
    
    // Create movement record
    const movement = await movementRepo.create({
      asset_id: assetId,
      user_id: userId,
      type: 'checkout',
      performed_by: performedBy,
      notes
    });
    
    // Update asset availability
    await assetRepo.updateAvailability(assetId, false);
    
    res.json({ success: true, movement });
  } catch (error) {
    res.status(500).json({ error: 'Failed to checkout asset' });
  }
});

// Checkin endpoint
router.post('/checkin', async (req, res) => {
  try {
    const { assetId, userId, performedBy, notes } = req.body;
    
    // Create movement record
    const movement = await movementRepo.create({
      asset_id: assetId,
      user_id: userId,
      type: 'checkin',
      performed_by: performedBy,
      notes
    });
    
    // Update asset availability
    await assetRepo.updateAvailability(assetId, true);
    
    res.json({ success: true, movement });
  } catch (error) {
    res.status(500).json({ error: 'Failed to checkin asset' });
  }
});

// Stats endpoint
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await db.get('SELECT COUNT(*) as count FROM users');
    const totalAssets = await db.get('SELECT COUNT(*) as count FROM assets');
    const availableAssets = await db.get('SELECT COUNT(*) as count FROM assets WHERE is_available = 1');
    const checkedOutAssets = await db.get('SELECT COUNT(*) as count FROM assets WHERE is_available = 0');
    
    res.json({
      totalUsers: totalUsers.count,
      totalAssets: totalAssets.count,
      availableAssets: availableAssets.count,
      checkedOutAssets: checkedOutAssets.count
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;