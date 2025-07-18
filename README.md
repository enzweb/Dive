# DiveManager - Système Complet de Gestion de Matériel de Plongée

## 🏊‍♂️ Description

DiveManager est un système complet de gestion de matériel de plongée avec scanner QR code et NFC intégré, backend Node.js/Express, base de données SQLite locale, conçu spécialement pour les clubs de plongée.

## ✨ Fonctionnalités

- **Architecture Complète** : Frontend React + Backend Node.js/Express + SQLite
- **Base de données SQLite** : Locale, robuste, performante et persistante
- **API REST Complète** : Backend Express avec tous les endpoints
- **Scanner QR Code & NFC** : Check-in/check-out automatique par scan ou NFC
- **Gestion des utilisateurs** : Niveaux de certification FFESSM
- **Suivi des équipements** : Détendeurs, combinaisons, masques, palmes, gilets, bouteilles
- **Historique complet** : Tous les mouvements sont enregistrés
- **Sauvegardes automatiques** : Scripts de sauvegarde SQLite
- **Interface responsive** : Optimisée pour mobile et tablette
- **Support NFC** : Lecture de tags NFC sur navigateurs compatibles
- **Installation automatisée** : Scripts Debian inclus
- **Production ready** : PM2, Nginx, SSL, sauvegardes

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

## 🚀 Installation Simple sur Debian

### Installation Automatique (2 commandes)

```bash
# 1. Installation système
sudo bash deployment/install-complete.sh

# 2. Configuration (après avoir copié les fichiers)
sudo bash deployment/configure-production.sh
```

**C'est tout !** L'application sera accessible sur `http://[IP-de-votre-serveur]`

### Détails d'Installation

```bash
# Trouver l'IP de votre serveur
hostname -I

# Exemple d'accès
# Si IP = 192.168.1.100, alors : http://192.168.1.100
```

### Avec Nom de Serveur (Optionnel)

```bash
# Si vous voulez un nom personnalisé
sudo bash deployment/install-complete.sh monserveur.local
sudo bash deployment/configure-production.sh monserveur.local

# Accès : http://monserveur.local
```

### Vérification

```bash
# Vérifier le backend
sudo -u divemanager pm2 status

# Vérifier Nginx
systemctl status nginx

# Tester l'API
curl http://localhost/api/health

# Voir les logs
tail -f /var/log/divemanager/combined.log
```

## 🗄️ Base de Données SQLite

### Structure de la Base

- **users** : Utilisateurs et leurs certifications
- **assets** : Équipements de plongée
- **movements** : Historique des sorties/retours
- **issues** : Problèmes signalés
- **notifications** : Alertes système

### Gestion de la Base

```bash
# Initialiser la base (fait automatiquement)
cd /var/www/divemanager/server
node scripts/init-db.js

# Sauvegarde manuelle
node scripts/backup-db.js

# Restaurer une sauvegarde
node scripts/restore-db.js backups/divemanager-backup-2024-01-15.db

# Accès direct SQLite (debug)
sqlite3 divemanager.db
```

## 📡 API Backend Complète

### Endpoints Disponibles

```javascript
// === UTILISATEURS ===
GET    /api/users              // Liste des utilisateurs
POST   /api/users              // Créer un utilisateur
PUT    /api/users/:id          // Modifier un utilisateur

// === ÉQUIPEMENTS ===
GET    /api/assets             // Liste des équipements
POST   /api/assets             // Créer un équipement
PUT    /api/assets/:id         // Modifier un équipement

// === QR CODE & NFC ===
GET    /api/qr/user/:code      // Recherche utilisateur par QR
GET    /api/qr/asset/:code     // Recherche équipement par QR
GET    /api/nfc/user/:nfcId    // Recherche utilisateur par NFC
GET    /api/nfc/asset/:nfcId   // Recherche équipement par NFC

// === MOUVEMENTS ===
POST   /api/checkout           // Sortie d'équipement
POST   /api/checkin            // Retour d'équipement
GET    /api/movements          // Historique des mouvements

// === STATISTIQUES ===
GET    /api/stats              // Statistiques du tableau de bord

// === SANTÉ ===
GET    /api/health             // État du serveur et de la base
```

### Exemples d'Utilisation API

```bash
# Récupérer tous les utilisateurs
curl http://localhost/api/users

# Rechercher un équipement par QR code
curl http://localhost/api/qr/asset/DET-001-QR

# Effectuer un checkout
curl -X POST http://localhost/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"assetId":"1","userId":"1","performedBy":"Admin","notes":"Sortie plongée"}'

# Statistiques
curl http://localhost/api/stats
```

## 🔧 Développement Local

### Backend

```bash
cd server
npm install
npm run dev  # Démarre sur le port 3001 avec hot-reload
```

### Frontend

```bash
npm install
npm run dev  # Démarre sur le port 3000
```

### Base de Données de Développement

```bash
# La base SQLite est créée automatiquement avec des données de démonstration
# Fichier : server/divemanager.db
```

## 🚀 Déploiement et Production

### Gestion avec PM2

```bash
# Statut des processus
sudo -u divemanager pm2 status

# Redémarrer l'application
sudo -u divemanager pm2 restart divemanager-server

# Voir les logs en temps réel
sudo -u divemanager pm2 logs divemanager-server

# Monitoring
sudo -u divemanager pm2 monit
```

### Configuration Nginx

Le serveur Nginx est configuré pour :
- Servir le frontend React sur `/`
- Proxifier l'API sur `/api/`
- Gérer les routes QR codes `/user/:id` et `/asset/:id`
- Optimisations (gzip, cache, sécurité)

### Sauvegardes Automatiques

```bash
# Sauvegarde quotidienne à 2h du matin (configurée automatiquement)
0 2 * * * cd /var/www/divemanager/server && node scripts/backup-db.js

# Localisation des sauvegardes
ls -la /var/www/divemanager/server/backups/
```

## 🔒 Sécurité et HTTPS

### Installation SSL avec Certbot

```bash
# Installer Certbot
sudo apt install certbot python3-certbot-nginx

# Obtenir le certificat SSL
sudo certbot --nginx -d votre-domaine.com

# Renouvellement automatique (déjà configuré)
sudo certbot renew --dry-run
```

### Firewall

```bash
# Configuration automatique lors de l'installation
sudo ufw status
```

## 🛠️ Maintenance et Monitoring

### Logs Système

```bash
# Logs de l'application
tail -f /var/log/divemanager/combined.log

# Logs Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Logs système
journalctl -u nginx -f
```

### Mise à jour de l'Application

```bash
# 1. Sauvegarder la base de données
cd /var/www/divemanager/server
sudo -u divemanager node scripts/backup-db.js

# 2. Mettre à jour le code
cd /var/www/divemanager
git pull origin main

# 3. Installer les nouvelles dépendances
npm install
cd server && npm install && npm run build && cd ..

# 4. Rebuilder le frontend
npm run build

# 5. Redémarrer l'application
sudo -u divemanager pm2 restart divemanager-server
systemctl reload nginx
```

### Monitoring des Performances

```bash
# Utilisation des ressources
sudo -u divemanager pm2 monit

# Espace disque
df -h

# Taille de la base de données
ls -lh /var/www/divemanager/server/divemanager.db
```

## 🎯 Points Clés de l'Architecture Complète

✅ **Backend Complet** : API REST Node.js/Express avec SQLite  
✅ **Frontend React** : Interface moderne et responsive  
✅ **Base SQLite** : Persistance locale des données  
✅ **QR Code + NFC** : Double technologie de scan  
✅ **Installation automatisée** : Scripts Debian inclus  
✅ **Production ready** : PM2, Nginx, SSL, monitoring  
✅ **Sauvegardes** : Scripts automatisés  
✅ **Sécurité** : Firewall, HTTPS, headers sécurisés  
✅ **Maintenance** : Logs, monitoring, mise à jour  

## 🆘 Dépannage

### Problèmes Courants

**Backend ne démarre pas :**
```bash
# Vérifier les logs
sudo -u divemanager pm2 logs divemanager-server

# Redémarrer
sudo -u divemanager pm2 restart divemanager-server
```

**Base de données corrompue :**
```bash
# Restaurer depuis une sauvegarde
cd /var/www/divemanager/server
sudo -u divemanager node scripts/restore-db.js backups/derniere-sauvegarde.db
```

**Nginx erreur 502 :**
```bash
# Vérifier que le backend fonctionne
curl http://localhost:3001/api/health

# Redémarrer Nginx
systemctl restart nginx
```

### Support et Logs

```bash
# Diagnostic complet
echo "=== STATUS PM2 ===" && sudo -u divemanager pm2 status
echo "=== STATUS NGINX ===" && systemctl status nginx
echo "=== HEALTH CHECK ===" && curl -s http://localhost/api/health | jq
echo "=== DISK SPACE ===" && df -h
echo "=== MEMORY ===" && free -h
```

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

## 💡 Technologies NFC

- **Web NFC API** : Standard W3C pour navigateurs
- **NDEF** : Format de données NFC
- **Tags compatibles** : NTAG213, NTAG215, NTAG216
- **Portée** : 4cm maximum
- **Vitesse** : Lecture instantanée

L'application est maintenant **100% auto-hébergée** avec support QR Code et NFC ! 🚀