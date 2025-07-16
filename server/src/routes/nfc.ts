import { Router } from 'express';
import { UserRepository } from '../database/repositories/UserRepository';
import { AssetRepository } from '../database/repositories/AssetRepository';

const router = Router();
const userRepo = new UserRepository();
const assetRepo = new AssetRepository();

// Recherche utilisateur par NFC ID
router.get('/user/:nfcId', async (req, res) => {
  try {
    const { nfcId } = req.params;
    
    // Rechercher par NFC ID ou QR code (compatibilité)
    let user = await userRepo.findByNfcId(nfcId);
    
    if (!user) {
      // Fallback: rechercher par QR code si pas trouvé par NFC
      user = await userRepo.findByQrCode(nfcId);
    }
    
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Erreur recherche utilisateur NFC:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Recherche équipement par NFC ID
router.get('/asset/:nfcId', async (req, res) => {
  try {
    const { nfcId } = req.params;
    
    // Rechercher par NFC ID ou QR code (compatibilité)
    let asset = await assetRepo.findByNfcId(nfcId);
    
    if (!asset) {
      // Fallback: rechercher par QR code si pas trouvé par NFC
      asset = await assetRepo.findByQrCode(nfcId);
    }
    
    if (!asset) {
      return res.status(404).json({ error: 'Équipement non trouvé' });
    }
    
    res.json(asset);
  } catch (error) {
    console.error('Erreur recherche équipement NFC:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;