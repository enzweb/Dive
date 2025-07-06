import express from 'express';
import { getDatabase } from '../database/database';

const router = express.Router();
const db = getDatabase();

// Get asset by QR code
router.get('/asset/:qrCode', async (req, res) => {
  try {
    const asset = await db.get(
      'SELECT * FROM assets WHERE qr_code = ?',
      [req.params.qrCode]
    );
    
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    
    res.json(asset);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch asset by QR code' });
  }
});

// Get user by QR code (assuming users also have QR codes)
router.get('/user/:qrCode', async (req, res) => {
  try {
    const user = await db.get(
      'SELECT * FROM users WHERE id = ?',
      [req.params.qrCode]
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user by QR code' });
  }
});

export default router;