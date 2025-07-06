import { Router } from 'express';

const router = Router();
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// Routes QR Code - redirection vers le frontend
router.get('/user/:id', (req, res) => {
  const { id } = req.params;
  res.redirect(`${CLIENT_URL}/scanner?type=user&id=${id}`);
});

router.get('/asset/:id', (req, res) => {
  const { id } = req.params;
  res.redirect(`${CLIENT_URL}/scanner?type=asset&id=${id}`);
});

export { router as qrRoutes };