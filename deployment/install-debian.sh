#!/bin/bash

# Script d'installation pour serveur Debian
# Usage: sudo bash install-debian.sh

echo "🚀 Installation de DiveManager sur Debian..."

# Mise à jour du système
apt update && apt upgrade -y

# Installation de Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Installation de Nginx
apt install -y nginx

# Installation de PM2 pour la gestion des processus
npm install -g pm2

# Création de l'utilisateur divemanager
useradd -m -s /bin/bash divemanager
usermod -aG sudo divemanager

# Création du répertoire de l'application
mkdir -p /var/www/divemanager
chown divemanager:divemanager /var/www/divemanager

echo "✅ Installation des dépendances terminée"
echo "📁 Copiez maintenant les fichiers de l'application dans /var/www/divemanager"
echo "🔧 Puis exécutez: sudo bash configure-nginx.sh"