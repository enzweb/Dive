# DiveManager - Système de Gestion de Matériel de Plongée

## 🏊‍♂️ Description

DiveManager est un système complet de gestion de matériel de plongée avec scanner QR code intégré et architecture fullstack (Node.js + React), conçu spécialement pour les clubs de plongée.

## ✨ Fonctionnalités

- **Architecture Fullstack** : Backend Node.js + Frontend React
- **API REST** : Communication client-serveur sécurisée
- **Base de données SQLite** : Stockage persistant et fiable
- **Scanner QR Code** : Check-in/check-out automatique par scan
- **Gestion des utilisateurs** : Niveaux de certification FFESSM
- **Suivi des équipements** : Détendeurs, combinaisons, masques, palmes, gilets, bouteilles
- **Historique complet** : Tous les mouvements sont enregistrés
- **Sauvegarde automatique** : Scripts de backup/restore intégrés
- **Interface responsive** : Optimisée pour mobile et tablette

## 🏗️ Architecture

```
DiveManager/
├── server/                 # Backend Node.js + Express
│   ├── src/
│   │   ├── database/      # Gestion SQLite + Repositories
│   │   ├── routes/        # Routes API REST
│   │   └── server.ts      # Serveur principal
│   └── dist/              # Build du backend
├── src/                   # Frontend React
│   ├── components/        # Composants UI
│   ├── services/          # Services API
│   └── hooks/             # Hooks React
├── dist/                  # Build du frontend
└── deployment/            # Scripts de déploiement
```

## 🚀 Installation sur Serveur Debian/Raspberry Pi

### 1. Installation Automatique

```bash
# Télécharger et exécuter le script d'installation
wget https://raw.githubusercontent.com/enzweb/Dive/main/deployment/install-fullstack.sh
sudo bash install-fullstack.sh votre-domaine.com
```

### 2. Déploiement de l'Application

```bash
# Cloner le projet
cd /var/www/divemanager
git clone https://github.com/enzweb/Dive.git .

# Déployer l'application complète
sudo bash deployment/deploy-fullstack.sh votre-domaine.com
```

### 3. Vérification de l'Installation

```bash
# Vérifier le backend
pm2 status
curl http://localhost:3001/health

# Vérifier le frontend
curl http://votre-domaine.com

# Vérifier l'API
curl http://votre-domaine.com/api/stats
```

## 🔧 Développement Local

### Backend

```bash
cd server
npm install
npm run dev  # Démarre sur le port 3001
```

### Frontend

```bash
npm install
npm run dev  # Démarre sur le port 3000
```

### Variables d'Environnement

**Backend** (`server/.env`):
```env
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:3000
DB_PATH=./divemanager.db
```

**Frontend** (`.env`):
```env
VITE_API_URL=http://localhost:3001/api
VITE_APP_TITLE=DiveManager
VITE_BASE_URL=http://localhost:3000
```

## 📡 API REST

### Endpoints Principaux

- `GET /api/users` - Liste des utilisateurs
- `GET /api/assets` - Liste des équipements
- `GET /api/movements` - Historique des mouvements
- `POST /api/checkout` - Sortie d'équipement
- `POST /api/checkin` - Retour d'équipement
- `GET /api/stats` - Statistiques du tableau de bord
- `GET /health` - Santé du serveur

### Exemple d'utilisation

```javascript
// Checkout d'un équipement
const response = await fetch('/api/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    assetId: 'asset-123',
    userId: 'user-456',
    performedBy: 'Admin',
    notes: 'Sortie plongée épave'
  })
});
```

## 🗄️ Base de Données SQLite

### Avantages pour Debian/Raspberry Pi

- **Léger** : Idéal pour Raspberry Pi
- **Sans serveur** : Pas de daemon à gérer
- **Fiable** : Base de données éprouvée
- **Sauvegarde simple** : Un seul fichier
- **Performance** : Excellent pour applications moyennes

### Structure

- **users** : Utilisateurs et leurs certifications
- **assets** : Équipements de plongée
- **movements** : Historique des check-in/check-out
- **issues** : Problèmes signalés
- **notifications** : Alertes système

## 🔄 Gestion des Sauvegardes

```bash
# Sauvegarde manuelle
cd /var/www/divemanager/server
npm run backup

# Sauvegarde automatique (configurée par défaut à 2h du matin)
crontab -l

# Restaurer une sauvegarde
npm run restore backups/divemanager-backup-2024-01-15T10-30-00-000Z.db
```

## 📱 Workflow QR Code

1. **Générer les QR codes** : Via l'interface d'administration
2. **Imprimer les étiquettes** : Fonction d'impression intégrée
3. **Scanner utilisateur** : Premier scan obligatoire
4. **Scanner équipements** : Autant que nécessaire
5. **Validation automatique** : Sortie/retour selon l'état
6. **Sauvegarde automatique** : Tout est enregistré en base

## 🔒 Sécurité et Production

### Configuration HTTPS

```bash
# Installer Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtenir le certificat SSL
sudo certbot --nginx -d votre-domaine.com
```

### Firewall

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### Monitoring

```bash
# Logs du backend
pm2 logs divemanager-server

# Logs Nginx
sudo tail -f /var/log/nginx/access.log

# Statistiques de la base
curl http://localhost:3001/api/stats
```

## 🛠️ Maintenance

### Mise à jour

```bash
cd /var/www/divemanager

# Sauvegarder avant mise à jour
cd server && npm run backup

# Mettre à jour le code
git pull origin main

# Rebuilder et redémarrer
cd server && npm run build
pm2 restart divemanager-server

cd .. && npm run build
sudo systemctl reload nginx
```

### Optimisation de la Base

```bash
# Vérifier l'intégrité
sqlite3 divemanager.db "PRAGMA integrity_check;"

# Optimiser
sqlite3 divemanager.db "VACUUM;"
```

## 🎯 Points Clés de l'Architecture Fullstack

✅ **Séparation Frontend/Backend** : Architecture moderne et scalable  
✅ **API REST** : Communication standardisée  
✅ **Base SQLite** : Parfaite pour Raspberry Pi  
✅ **PM2** : Gestion robuste des processus  
✅ **Nginx** : Reverse proxy et serveur statique  
✅ **Sauvegardes automatiques** : Cron quotidien  
✅ **HTTPS** : Certificat Let's Encrypt gratuit  
✅ **Monitoring** : Logs et métriques intégrés  

L'application est maintenant **prête pour la production** avec une architecture fullstack robuste ! 🚀