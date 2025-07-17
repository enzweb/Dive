#!/bin/bash

# Script d'installation complète DiveManager sur Debian
# Usage: sudo bash install-complete.sh [votre-domaine.com]

DOMAIN=${1:-localhost}
APP_DIR="/var/www/divemanager"
SERVER_DIR="$APP_DIR/server"

echo "🚀 Installation complète de DiveManager pour le domaine: $DOMAIN"

# Vérification des droits root
if [ "$EUID" -ne 0 ]; then
  echo "❌ Ce script doit être exécuté en tant que root (sudo)"
  exit 1
fi

# Mise à jour du système
echo "📦 Mise à jour du système..."
apt update && apt upgrade -y

# Installation de Node.js 20.x
echo "📦 Installation de Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Installation de Nginx et PM2
echo "📦 Installation de Nginx et PM2..."
apt install -y nginx
npm install -g pm2

# Installation de SQLite3 (optionnel pour debug)
apt install -y sqlite3

# Création de l'utilisateur divemanager
echo "👤 Création de l'utilisateur divemanager..."
useradd -m -s /bin/bash divemanager || true
usermod -aG sudo divemanager

# Création des répertoires
echo "📁 Création des répertoires..."
mkdir -p $APP_DIR
mkdir -p $SERVER_DIR
mkdir -p /var/log/divemanager
mkdir -p /var/backups/divemanager

# Permissions
chown -R divemanager:divemanager $APP_DIR
chown -R divemanager:divemanager /var/log/divemanager
chown -R divemanager:divemanager /var/backups/divemanager

echo "✅ Installation des dépendances système terminée"
echo ""
echo "📋 Étapes suivantes :"
echo "1. Copiez les fichiers de l'application dans $APP_DIR"
echo "2. Exécutez en tant qu'utilisateur divemanager :"
echo "   cd $APP_DIR && npm install"
echo "   cd $SERVER_DIR && npm install && npm run build"
echo "   npm run build"
echo "3. Configurez avec : sudo bash deployment/configure-production.sh $DOMAIN"
echo ""
echo "📖 Consultez le README.md pour plus de détails"