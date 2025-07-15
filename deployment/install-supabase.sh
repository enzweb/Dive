#!/bin/bash

# Script d'installation DiveManager avec Supabase sur Debian
# Usage: sudo bash install-supabase.sh [votre-domaine.com]

DOMAIN=${1:-localhost}
APP_DIR="/var/www/divemanager"

echo "🚀 Installation de DiveManager avec Supabase pour le domaine: $DOMAIN"

# Mise à jour du système
echo "📦 Mise à jour du système..."
apt update && apt upgrade -y

# Installation de Node.js 20.x
echo "📦 Installation de Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Installation de Nginx
echo "📦 Installation de Nginx..."
apt install -y nginx

# Création de l'utilisateur
echo "👤 Création de l'utilisateur divemanager..."
useradd -m -s /bin/bash divemanager || true
usermod -aG sudo divemanager

# Création des répertoires
echo "📁 Création des répertoires..."
mkdir -p $APP_DIR
chown -R divemanager:divemanager $APP_DIR

# Installation des dépendances du projet
echo "📦 Installation des dépendances..."
cd $APP_DIR
npm install

# Build de l'application
echo "🔧 Build de l'application..."
npm run build

# Configuration Nginx
echo "🔧 Configuration de Nginx..."
cat > /etc/nginx/sites-available/divemanager << EOF
server {
    listen 80;
    server_name $DOMAIN;
    
    root $APP_DIR/dist;
    index index.html;
    
    # Gestion des fichiers statiques
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # QR Code routes - redirection vers l'application
    location ~ ^/(user|asset)/([a-zA-Z0-9-]+)$ {
        try_files \$uri /index.html;
    }
    
    # Toutes les autres routes vers React
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    # Optimisations
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Sécurité
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
}
EOF

# Activation du site
ln -sf /etc/nginx/sites-available/divemanager /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test et redémarrage de Nginx
nginx -t
if [ $? -eq 0 ]; then
    systemctl restart nginx
    systemctl enable nginx
    echo "✅ Nginx configuré avec succès"
else
    echo "❌ Erreur dans la configuration Nginx"
    exit 1
fi

# Permissions finales
chown -R divemanager:divemanager $APP_DIR
chmod -R 755 $APP_DIR/dist

echo ""
echo "✅ Installation terminée avec succès !"
echo ""
echo "📋 Étapes suivantes :"
echo "1. Créez un projet Supabase sur https://supabase.com"
echo "2. Copiez .env.example vers .env et configurez vos clés Supabase"
echo "3. Exécutez la migration SQL dans votre projet Supabase"
echo "4. Redémarrez l'application : npm run build && systemctl reload nginx"
echo ""
echo "🌐 Application disponible sur: http://$DOMAIN"
echo ""
echo "📖 Documentation complète dans le README.md"