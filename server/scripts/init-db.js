#!/usr/bin/env node

// Script d'initialisation de la base de données
const { DatabaseManager } = require('../dist/database/database');

console.log('🔧 Initialisation de la base de données DiveManager...');

try {
  const db = new DatabaseManager();
  const stats = db.getStats();
  
  console.log('✅ Base de données initialisée avec succès !');
  console.log('\n📊 Statistiques:');
  console.log(`   👥 Utilisateurs: ${stats.totalUsers}`);
  console.log(`   📦 Équipements: ${stats.totalAssets}`);
  console.log(`   📋 Mouvements: ${stats.totalMovements}`);
  console.log(`   ⚠️  Problèmes ouverts: ${stats.openIssues}`);
  
  db.close();
} catch (error) {
  console.error('❌ Erreur lors de l\'initialisation:', error);
  process.exit(1);
}