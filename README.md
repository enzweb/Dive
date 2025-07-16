# DiveManager - Système de Gestion de Matériel de Plongée Auto-hébergé

## 🏊‍♂️ Description

DiveManager est un système complet de gestion de matériel de plongée avec scanner QR code et NFC intégré, auto-hébergé avec base de données SQLite, conçu spécialement pour les clubs de plongée.

## ✨ Fonctionnalités

- **Architecture Moderne** : Frontend React + Backend Node.js/Express
- **Base de données SQLite** : Locale, robuste et performante
- **API REST** : Backend Express avec endpoints complets
- **Scanner QR Code & NFC** : Check-in/check-out automatique par scan ou NFC
- **Gestion des utilisateurs** : Niveaux de certification FFESSM
- **Suivi des équipements** : Détendeurs, combinaisons, masques, palmes, gilets, bouteilles
- **Historique complet** : Tous les mouvements sont enregistrés
- **Sauvegardes automatiques** : Scripts de sauvegarde SQLite
- **Interface responsive** : Optimisée pour mobile et tablette
- **Support NFC** : Lecture de tags NFC sur navigateurs compatibles

## 🏗️ Architecture

```
DiveManager/
├── src/                   # Frontend React
│   ├── components/        # Composants UI
│   ├── services/          # Services API
│   ├── utils/             # Utilitaires (NFC, QR)
│   └── hooks/             # Hooks React
├── server/                # Backend Node.js/Express
│   ├── src/               # Code source serveur
│   ├── database/          # Gestion base de données
│   └── routes/            # Routes API
├── dist/                  # Build du frontend
└── deployment/            # Scripts de déploiement
```

## 🚀 Installation sur Debian/Raspberry Pi

### 2. Installation Automatique

```bash
# Cloner le projet
git clone https://github.com/enzweb/Dive.git
cd Dive

# Installation automatique
sudo bash deployment/install-fullstack.sh votre-domaine.com
```

### 3. Configuration

```bash
# Copier le fichier de configuration
cp .env.example .env

# Éditer avec votre configuration
nano .env
```

**Contenu du fichier `.env` :**
```env
VITE_API_URL=http://localhost:3001/api
VITE_APP_TITLE=DiveManager
```

### 4. Déploiement

```bash
# Déployer l'application complète
sudo bash deployment/deploy-fullstack.sh votre-domaine.com

# Vérifier le statut
pm2 status
systemctl status nginx
```

### 6. Vérification

```bash
# Vérifier le frontend
curl http://votre-domaine.com

# Vérifier les logs Nginx
sudo tail -f /var/log/nginx/access.log
```

## 🔧 Développement Local

### Installation

```bash
npm install
npm run dev  # Démarre sur le port 5173
```

### Backend

```bash
cd server
npm install
npm run dev  # Démarre sur le port 3001
```

### Variables d'Environnement

**Fichier `.env` :**
```env
VITE_API_URL=http://localhost:3001/api
VITE_APP_TITLE=DiveManager
```

## 📡 API Backend

### Endpoints Disponibles
 
```javascript
// Utilisateurs
GET    /api/users
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id

// Équipements
GET    /api/assets
POST   /api/assets
PUT    /api/assets/:id

// QR Code & NFC
GET    /api/qr/user/:code
GET    /api/qr/asset/:code
GET    /api/nfc/user/:nfcId
GET    /api/nfc/asset/:nfcId

// Mouvements
POST   /api/checkout
POST   /api/checkin
GET    /api/movements
```

## 🗄️ Base de Données SQLite

### Avantages SQLite

- **Locale** : Pas de dépendance cloud
- **Performante** : Optimisée pour les applications locales
- **Fiable** : Base de données éprouvée
- **Portable** : Un seul fichier de base
- **Sauvegardes simples** : Copie de fichier

## 📱 Support NFC

### Fonctionnalités NFC

- **Lecture de tags** : Compatible avec les tags NFC programmés
- **Support navigateur** : Chrome Android, Samsung Internet
- **Programmation de tags** : Écriture de données sur les tags
- **Fallback QR** : Compatibilité avec les QR codes existants

### Utilisation NFC

```javascript
import { nfcReader } from './src/utils/nfcReader';

// Démarrer la lecture NFC
await nfcReader.startReading(
  (result) => console.log('Tag lu:', result),
  (error) => console.error('Erreur:', error)
);

// Programmer un tag
await nfcReader.writeNFC(
  'USER-001',
  () => console.log('Tag programmé'),
  (error) => console.error('Erreur:', error)
);
```

### Navigateurs Compatibles NFC

- **Chrome Android** : Support complet
- **Samsung Internet** : Support complet  
- **Edge Mobile** : Support partiel
- **Firefox** : En développement

## 📱 Workflow QR Code & NFC

1. **Générer les codes** : Via l'interface d'administration
2. **Programmer les tags NFC** : Fonction d'écriture intégrée
3. **Imprimer les étiquettes** : QR codes + tags NFC
4. **Scanner utilisateur** : QR ou NFC
5. **Scanner équipements** : QR ou NFC
6. **Synchronisation** : Mise à jour base locale
7. **Historique complet** : Tout est tracé

## 🔧 Scripts de Gestion

### Sauvegarde

```bash
# Sauvegarde manuelle
cd server && npm run backup

# Sauvegarde automatique (cron)
0 2 * * * cd /var/www/divemanager/server && npm run backup
```

### Restauration

```bash
# Restaurer depuis une sauvegarde
cd server && npm run restore backups/divemanager-backup-2024-01-15.db
```

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

## 🛠️ Maintenance

### Mise à jour

```bash
cd /var/www/divemanager

# Mettre à jour le code
git pull origin main

# Mettre à jour les dépendances
npm install
cd server && npm install

# Rebuilder et redémarrer
npm run build
pm2 restart divemanager-server
systemctl reload nginx
```

## 🎯 Points Clés de l'Architecture Locale

✅ **Auto-hébergé** : Contrôle total de vos données  
✅ **SQLite** : Base de données locale performante  
✅ **QR Code + NFC** : Double technologie de scan  
✅ **API REST** : Backend Express robuste  
✅ **Sauvegardes** : Scripts automatisés  
✅ **Mobile-first** : Interface optimisée  
✅ **Installation simple** : Scripts Debian inclus  
✅ **Pas de cloud** : Fonctionne hors ligne  

## 💡 Technologies NFC

- **Web NFC API** : Standard W3C pour navigateurs
- **NDEF** : Format de données NFC
- **Tags compatibles** : NTAG213, NTAG215, NTAG216
- **Portée** : 4cm maximum
- **Vitesse** : Lecture instantanée

L'application est maintenant **100% auto-hébergée** avec support QR Code et NFC ! 🚀