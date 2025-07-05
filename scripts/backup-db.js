#!/usr/bin/env node

// Script de sauvegarde de la base de données SQLite
// Usage: node scripts/backup-db.js

const { DatabaseManager } = require('../src/database/database');
const path = require('path');
const fs = require('fs');

function createBackup() {
  try {
    // Créer le dossier de sauvegarde s'il n'existe pas
    const backupDir = path.join(__dirname, '..', 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Nom du fichier de sauvegarde avec timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `divemanager-backup-${timestamp}.db`);

    // Créer la sauvegarde
    const db = new DatabaseManager();
    db.backup(backupPath);

    // Afficher les statistiques
    const stats = db.getStats();
    console.log('\n📊 Statistiques de la base de données:');
    console.log(`   👥 Utilisateurs: ${stats.totalUsers}`);
    console.log(`   📦 Équipements: ${stats.totalAssets}`);
    console.log(`   📋 Mouvements: ${stats.totalMovements}`);
    console.log(`   ⚠️  Problèmes ouverts: ${stats.openIssues}`);

    db.close();

    console.log(`\n✅ Sauvegarde créée avec succès: ${backupPath}`);
    
    // Nettoyer les anciennes sauvegardes (garder les 10 dernières)
    cleanOldBackups(backupDir);

  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde:', error);
    process.exit(1);
  }
}

function cleanOldBackups(backupDir) {
  try {
    const files = fs.readdirSync(backupDir)
      .filter(file => file.startsWith('divemanager-backup-') && file.endsWith('.db'))
      .map(file => ({
        name: file,
        path: path.join(backupDir, file),
        mtime: fs.statSync(path.join(backupDir, file)).mtime
      }))
      .sort((a, b) => b.mtime - a.mtime);

    // Garder les 10 dernières sauvegardes
    const filesToDelete = files.slice(10);
    
    filesToDelete.forEach(file => {
      fs.unlinkSync(file.path);
      console.log(`🗑️  Ancienne sauvegarde supprimée: ${file.name}`);
    });

    if (filesToDelete.length > 0) {
      console.log(`\n🧹 ${filesToDelete.length} ancienne(s) sauvegarde(s) supprimée(s)`);
    }

  } catch (error) {
    console.warn('⚠️  Erreur lors du nettoyage des anciennes sauvegardes:', error.message);
  }
}

// Exécuter la sauvegarde
createBackup();