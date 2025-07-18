#!/bin/bash

# Script de configuration production pour DiveManager
# Usage: 
#   Configuration locale : sudo bash configure-production.sh
#   Avec nom/IP         : sudo bash configure-production.sh monserveur.local

DOMAIN=${1:-$(hostname -I | awk '{print $1}')}
APP_DIR="/var/www/divemanager"
SERVER_DIR="$APP_DIR/server"


# Vérification que l'application est installée
if [ ! -d "$APP_DIR" ] || [ ! -d "$SERVER_DIR" ]; then
    echo "❌ Application non trouvée. Exécutez d'abord install-complete.sh"
    exit 1
fi

cd $APP_DIR

# Installation des dépendances si nécessaire
echo "📦 Vérification des dépendances..."
if [ ! -d "node_modules" ]; then
    echo "Installation des dépendances frontend..."
    sudo -u divemanager npm install
fi

if [ ! -d "$SERVER_DIR/node_modules" ]; then
    echo "Installation des dépendances backend..."
    cd $SERVER_DIR
    sudo -u divemanager npm install
    cd $APP_DIR
fi

# Build du backend
echo "🔧 Build du backend..."
cd $SERVER_DIR
sudo -u divemanager npm run build
cd $APP_DIR

# Build du frontend
echo "🔧 Build du frontend..."
sudo -u divemanager npm run build

# Configuration des variables d'environnement
echo "⚙️ Configuration des variables d'environnement..."

# Backend .env
if [ ! -f "$SERVER_DIR/.env" ]; then
    cp $SERVER_DIR/.env.example $SERVER_DIR/.env
    sed -i "s|NODE_ENV=.*|NODE_ENV=production|g" $SERVER_DIR/.env
    sed -i "s|FRONTEND_URL=.*|FRONTEND_URL=https://$DOMAIN|g" $SERVER_DIR/.env
    chown divemanager:divemanager $SERVER_DIR/.env
fi

# Frontend .env
if [ ! -f "$APP_DIR/.env" ]; then
    echo "VITE_API_URL=/api" > $APP_DIR/.env
    echo "VITE_APP_TITLE=DiveManager" >> $APP_DIR/.env
    chown divemanager:divemanager $APP_DIR/.env
fi

# Initialisation de la base de données
echo "🗄️ Initialisation de la base de données..."
cd $SERVER_DIR
sudo -u divemanager node scripts/init-db.js
cd $APP_DIR

# Configuration PM2
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

chown divemanager:divemanager $APP_DIR/ecosystem.config.js

# Démarrage du backend avec PM2
echo "🚀 Démarrage du backend..."
sudo -u divemanager pm2 start ecosystem.config.js
sudo -u divemanager pm2 save

# Configuration du démarrage automatique PM2
pm2 startup systemd -u divemanager --hp /home/divemanager

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
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
    
    # QR Code routes - redirection vers l'application
    location ~ ^/(user|asset)/([a-zA-Z0-9-]+)$ {
        try_files \$uri /index.html;
    }
    
    # Fichiers statiques avec cache
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files \$uri =404;
    }
    
    # Toutes les autres routes vers React
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    # Optimisations
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types 
        text/plain 
        text/css 
        text/xml 
        text/javascript 
        application/javascript 
        application/xml+rss 
        application/json;
    
    # Sécurité
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    
    # Taille max des uploads
    client_max_body_size 10M;
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
(crontab -u divemanager -l 2>/dev/null; echo "0 2 * * * cd $SERVER_DIR && node scripts/backup-db.js >> /var/log/divemanager/backup.log 2>&1") | crontab -u divemanager -

# Configuration du firewall (optionnel)
if command -v ufw &> /dev/null; then
    echo "🔥 Configuration du firewall..."
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw --force enable
fi

# Permissions finales
chown -R divemanager:divemanager $APP_DIR
chmod -R 755 $APP_DIR/dist

echo ""
echo "✅ Configuration de production terminée !"
echo ""
echo "🌐 Application disponible sur: http://$DOMAIN"
echo "📊 API disponible sur: http://$DOMAIN/api"
echo "🏥 Health check: http://$DOMAIN/api/health"
echo ""
echo "📋 Commandes utiles :"
echo "  sudo -u divemanager pm2 status                    # Statut du backend"
echo "  sudo -u divemanager pm2 logs divemanager-server   # Logs du backend"
echo "  sudo -u divemanager pm2 restart divemanager-server # Redémarrer le backend"
echo "  systemctl status nginx                            # Statut de Nginx"
echo "  tail -f /var/log/divemanager/combined.log         # Logs en temps réel"
echo ""
echo "🔒 Pour HTTPS, installez Certbot :"
echo "  apt install certbot python3-certbot-nginx"
echo "  certbot --nginx -d $DOMAIN"
echo ""
echo "📖 Consultez le README.md pour plus d'informations"