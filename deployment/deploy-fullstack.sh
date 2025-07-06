#!/bin/bash

# Script de déploiement fullstack
# Usage: bash deploy-fullstack.sh [votre-domaine.com]

DOMAIN=${1:-localhost}
APP_DIR="/var/www/divemanager"
SERVER_DIR="$APP_DIR/server"

echo "🚀 Déploiement fullstack de DiveManager..."

# Aller dans le répertoire de l'application
cd $APP_DIR

# Installation et build du backend
echo "🔧 Installation du backend..."
cd $SERVER_DIR
npm ci
npm run build

# Installation et build du frontend
echo "🔧 Installation du frontend..."
cd $APP_DIR
npm ci
npm run build

# Configuration des variables d'environnement
echo "⚙️ Configuration des variables d'environnement..."
if [ ! -f "$SERVER_DIR/.env" ]; then
    cp $SERVER_DIR/.env.example $SERVER_DIR/.env
    sed -i "s|http://localhost:3000|https://$DOMAIN|g" $SERVER_DIR/.env
fi

if [ ! -f "$APP_DIR/.env" ]; then
    cp $APP_DIR/.env.example $APP_DIR/.env
    sed -i "s|http://localhost:3001/api|https://$DOMAIN/api|g" $APP_DIR/.env
fi

# Configuration PM2 pour le backend
echo "🔧 Configuration PM2..."
cat > $APP_DIR/ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'divemanager-server',
    script: './server/dist/server.js',
    cwd: '$APP_DIR',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: '/var/log/divemanager/error.log',
    out_file: '/var/log/divemanager/out.log',
    log_file: '/var/log/divemanager/combined.log',
    time: true
  }]
};
EOF

# Démarrer le backend avec PM2
echo "🚀 Démarrage du backend..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Configuration Nginx
echo "🔧 Configuration de Nginx..."
cat > /etc/nginx/sites-available/divemanager << EOF
server {
    listen 80;
    server_name $DOMAIN;
    
    # Frontend (React)
    root $APP_DIR/dist;
    index index.html;
    
    # API Backend
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # Health check
    location /health {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # QR Code routes - redirection vers l'application
    location ~ ^/(user|asset)/([a-zA-Z0-9-]+)$ {
        try_files \$uri /index.html;
    }
    
    # Fichiers statiques avec cache
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
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

# Configuration des sauvegardes automatiques
echo "💾 Configuration des sauvegardes..."
(crontab -l 2>/dev/null; echo "0 2 * * * cd $SERVER_DIR && npm run backup >> /var/log/divemanager/backup.log 2>&1") | crontab -

# Permissions finales
chown -R divemanager:divemanager $APP_DIR
chmod -R 755 $APP_DIR/dist

echo "✅ Déploiement fullstack terminé"
echo "🌐 Application disponible sur: http://$DOMAIN"
echo "📊 API disponible sur: http://$DOMAIN/api"
echo "🏥 Health check: http://$DOMAIN/health"
echo ""
echo "📋 Commandes utiles:"
echo "  pm2 status                    # Statut du backend"
echo "  pm2 logs divemanager-server   # Logs du backend"
echo "  pm2 restart divemanager-server # Redémarrer le backend"
echo "  systemctl status nginx        # Statut de Nginx"