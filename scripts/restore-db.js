#!/usr/bin/env node

// Script de restauration de la base de données SQLite
// Usage: node scripts/restore-db.js <chemin-vers-sauvegarde>

const { DatabaseManager } = require('../src/database/database');
const path = require('path');
const fs = require('fs');

function restoreBackup(backupPath) {
  try {
    // Vérifier que le fichier de sauvegarde existe
    if (!fs.existsSync(backupPath)) {
      console.error(`❌ Fichier de sauvegarde non trouvé: ${backupPath}`);
      process.exit(1);
    }

    // Chemin de la base de données principale
    const mainDbPath = path.join(__dirname, '..', 'divemanager.db');

    // Créer une sauvegarde de la base actuelle avant restauration
    if (fs.existsSync(mainDbPath)) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const currentBackupPath = path.join(__dirname, '..', 'backups', `divemanager-before-restore-${timestamp}.db`);
      
      // Créer le dossier de sauvegarde s'il n'existe pas
      const backupDir = path.dirname(currentBackupPath);
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      fs.copyFileSync(mainDbPath, currentBackupPath);
      console.log(`💾 Sauvegarde de la base actuelle: ${currentBackupPath}`);
    }

    // Restaurer la sauvegarde
    fs.copyFileSync(backupPath, mainDbPath);
    console.log(`✅ Base de données restaurée depuis: ${backupPath}`);

    // Vérifier la base restaurée
    const db = new DatabaseManager();
    const stats = db.getStats();
    
    console.log('\n📊 Statistiques de la base restaurée:');
    console.log(`   👥 Utilisateurs: ${stats.totalUsers}`);
    console.log(`   📦 Équipements: ${stats.totalAssets}`);
    console.log(`   📋 Mouvements: ${stats.totalMovements}`);
    console.log(`   ⚠️  Problèmes ouverts: ${stats.openIssues}`);

    db.close();

  } catch (error) {
    console.error('❌ Erreur lors de la restauration:', error);
    process.exit(1);
  }
}

// Vérifier les arguments
const backupPath = process.argv[2];

if (!backupPath) {
  console.error('❌ Usage: node scripts/restore-db.js <chemin-vers-sauvegarde>');
  console.log('\nExemple:');
  console.log('  node scripts/restore-db.js backups/divemanager-backup-2024-01-15T10-30-00-000Z.db');
  process.exit(1);
}

// Exécuter la restauration
restoreBackup(path.resolve(backupPath));