import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { DatabaseManager } from './database/database.js';
import { seedDatabase } from './database/seedData.js';
import { apiRoutes } from './routes/api.js';
import { qrRoutes } from './routes/qr.js';

// Configuration ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// Middleware de sécurité
app.use(helmet({
  contentSecurityPolicy: false, // Désactivé pour le développement
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors({
  origin: [CLIENT_URL, 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware de compression
app.use(compression());

// Middleware pour parser JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialisation de la base de données
let db: DatabaseManager;

async function initializeDatabase() {
  try {
    db = new DatabaseManager();
    console.log('✅ Base de données SQLite initialisée');
    
    // Peupler la base avec des données de test si vide
    await seedDatabase();
    
    return db;
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de la base:', error);
    process.exit(1);
  }
}

// Routes API
app.use('/api', apiRoutes);

// Routes QR Code (redirection vers le frontend)
app.use('/', qrRoutes);

// Route de santé
app.get('/health', (req, res) => {
  const stats = db?.getStats();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: stats || null
  });
});

// Middleware de gestion d'erreurs
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erreur serveur:', err);
  res.status(500).json({
    error: 'Erreur interne du serveur',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue'
  });
});

// Route 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route non trouvée',
    path: req.originalUrl
  });
});

// Démarrage du serveur
async function startServer() {
  try {
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 Serveur DiveManager démarré sur le port ${PORT}`);
      console.log(`📊 API disponible sur: http://localhost:${PORT}/api`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
      console.log(`🌐 Frontend attendu sur: ${CLIENT_URL}`);
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
}

// Gestion propre de l'arrêt
process.on('SIGINT', () => {
  console.log('\n🛑 Arrêt du serveur...');
  if (db) {
    db.close();
  }
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Arrêt du serveur...');
  if (db) {
    db.close();
  }
  process.exit(0);
});

startServer();

export { app, db };