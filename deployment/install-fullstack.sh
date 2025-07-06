#!/bin/bash

# Script d'installation fullstack pour DiveManager
# Usage: sudo bash install-fullstack.sh [votre-domaine.com]

DOMAIN=${1:-localhost}
APP_DIR="/var/www/divemanager"
SERVER_DIR="$APP_DIR/server"
CLIENT_DIR="$APP_DIR"

echo "🚀 Installation fullstack de DiveManager pour le domaine: $DOMAIN"

# Mise à jour du système
echo "📦 Mise à jour du système..."
apt update && apt upgrade -y

# Installation de Node.js 20.x
echo "📦 Installation de Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Installation de Nginx et PM2
echo "📦 Installation de Nginx et PM2..."
apt install -y nginx
npm install -g pm2

# Création de l'utilisateur
echo "👤 Création de l'utilisateur divemanager..."
useradd -m -s /bin/bash divemanager
usermod -aG sudo divemanager

# Création des répertoires
echo "📁 Création des répertoires..."
mkdir -p $APP_DIR
mkdir -p /var/log/divemanager
mkdir -p /var/backups/divemanager
chown -R divemanager:divemanager $APP_DIR
chown -R divemanager:divemanager /var/log/divemanager
chown -R divemanager:divemanager /var/backups/divemanager

echo "✅ Installation des dépendances terminée"
echo "📋 Étapes suivantes:"
echo "1. Copiez les fichiers de l'application dans $APP_DIR"
echo "2. Exécutez: sudo bash deployment/deploy-fullstack.sh $DOMAIN"