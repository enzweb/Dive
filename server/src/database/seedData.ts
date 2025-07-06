import { UserRepository } from './repositories/UserRepository.js';
import { AssetRepository } from './repositories/AssetRepository.js';
import { MovementRepository } from './repositories/MovementRepository.js';
import { mockUsers, mockAssets, mockMovements } from '../../src/data/mockData.js';
import { DatabaseManager } from './database.js';

export async function seedDatabase() {
  const db = new DatabaseManager();
  const database = db.getDatabase();
  
  const userRepo = new UserRepository(database);
  const assetRepo = new AssetRepository(database);
  const movementRepo = new MovementRepository(database);

  try {
    console.log('🌱 Début du peuplement de la base de données...');

    // Vérifier si des données existent déjà
    const existingUsers = userRepo.findAll();
    if (existingUsers.length > 0) {
      console.log('ℹ️  Des données existent déjà, arrêt du peuplement');
      return;
    }

    // Insérer les utilisateurs
    console.log('👥 Insertion des utilisateurs...');
    for (const user of mockUsers) {
      userRepo.create(user);
    }

    // Insérer les équipements
    console.log('📦 Insertion des équipements...');
    for (const asset of mockAssets) {
      assetRepo.create(asset);
    }

    // Insérer les mouvements
    console.log('📋 Insertion des mouvements...');
    for (const movement of mockMovements) {
      movementRepo.create(movement);
    }

    console.log('✅ Base de données peuplée avec succès !');
    
    // Afficher les statistiques
    const stats = {
      users: userRepo.findAll().length,
      assets: assetRepo.findAll().length,
      movements: movementRepo.findAll().length
    };
    
    console.log(`📊 Statistiques: ${stats.users} utilisateurs, ${stats.assets} équipements, ${stats.movements} mouvements`);

  } catch (error) {
    console.error('❌ Erreur lors du peuplement:', error);
    throw error;
  } finally {
    db.close();
  }
}