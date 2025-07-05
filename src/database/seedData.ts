import { UserRepository } from './repositories/UserRepository';
import { AssetRepository } from './repositories/AssetRepository';
import { MovementRepository } from './repositories/MovementRepository';
import { mockUsers, mockAssets, mockMovements } from '../data/mockData';

export async function seedDatabase() {
  const userRepo = new UserRepository();
  const assetRepo = new AssetRepository();
  const movementRepo = new MovementRepository();

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
  }
}