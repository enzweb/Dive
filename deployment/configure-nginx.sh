#!/bin/bash

# Configuration Nginx pour DiveManager
# Usage: sudo bash configure-nginx.sh [votre-domaine.com]

DOMAIN=${1:-localhost}
APP_DIR="/var/www/divemanager"

echo "🔧 Configuration de Nginx pour le domaine: $DOMAIN"

# Configuration Nginx
cat > /etc/nginx/sites-available/divemanager << EOF
server {
    listen 80;
    server_name $DOMAIN;
    
    # Redirection HTTPS (optionnel)
    # return 301 https://\$server_name\$request_uri;
    
    root $APP_DIR/dist;
    index index.html;
    
    # Gestion des fichiers statiques
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API routes (si vous ajoutez un backend)
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

# Test de la configuration
nginx -t

if [ $? -eq 0 ]; then
    systemctl reload nginx
    systemctl enable nginx
    echo "✅ Nginx configuré avec succès"
    echo "🌐 Site accessible sur: http://$DOMAIN"
else
    echo "❌ Erreur dans la configuration Nginx"
    exit 1
fi