#!/bin/bash

# Script de déploiement
# Usage: bash deploy.sh

APP_DIR="/var/www/divemanager"
BACKUP_DIR="/var/backups/divemanager"

echo "🚀 Déploiement de DiveManager..."

# Sauvegarde de l'ancienne version
if [ -d "$APP_DIR/dist" ]; then
    mkdir -p $BACKUP_DIR
    cp -r $APP_DIR/dist $BACKUP_DIR/dist-$(date +%Y%m%d-%H%M%S)
    echo "💾 Sauvegarde créée"
fi

# Installation des dépendances
cd $APP_DIR
npm ci --production=false

# Build de l'application
npm run build

# Permissions
chown -R divemanager:divemanager $APP_DIR
chmod -R 755 $APP_DIR/dist

echo "✅ Déploiement terminé"
echo "🌐 Application disponible sur votre domaine"