# DiveManager - Système de Gestion de Matériel de Plongée avec Supabase

## 🏊‍♂️ Description

DiveManager est un système complet de gestion de matériel de plongée avec scanner QR code intégré et base de données Supabase, conçu spécialement pour les clubs de plongée.

## ✨ Fonctionnalités

- **Architecture Moderne** : Frontend React + Supabase Backend
- **Base de données PostgreSQL** : Via Supabase, robuste et scalable
- **API REST automatique** : Générée par Supabase
- **Authentification intégrée** : Système d'auth Supabase
- **Scanner QR Code** : Check-in/check-out automatique par scan
- **Gestion des utilisateurs** : Niveaux de certification FFESSM
- **Suivi des équipements** : Détendeurs, combinaisons, masques, palmes, gilets, bouteilles
- **Historique complet** : Tous les mouvements sont enregistrés
- **Sauvegardes automatiques** : Gérées par Supabase
- **Temps réel** : Synchronisation instantanée
- **Interface responsive** : Optimisée pour mobile et tablette

## 🏗️ Architecture

```
DiveManager/
├── src/                   # Frontend React
│   ├── components/        # Composants UI
│   ├── lib/               # Configuration Supabase
│   ├── services/          # Services Supabase
│   └── hooks/             # Hooks React + Supabase
├── supabase/
│   └── migrations/        # Migrations SQL
├── dist/                  # Build du frontend
└── deployment/            # Scripts de déploiement
```

## 🚀 Installation Rapide sur Debian/Raspberry Pi

### 1. Prérequis Supabase

1. **Créez un compte** sur [supabase.com](https://supabase.com)
2. **Créez un nouveau projet**
3. **Notez vos clés** : URL du projet + clé anonyme

### 2. Installation Automatique

```bash
# Cloner le projet
git clone https://github.com/enzweb/Dive.git
cd Dive

# Installation automatique
sudo bash deployment/install-supabase.sh votre-domaine.com
```

### 3. Configuration Supabase

```bash
# Copier le fichier de configuration
cp .env.example .env

# Éditer avec vos clés Supabase
nano .env
```

**Contenu du fichier `.env` :**
```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anonyme
VITE_APP_TITLE=DiveManager
```

### 4. Migration de la Base de Données

1. **Ouvrez votre projet Supabase**
2. **Allez dans SQL Editor**
3. **Exécutez le contenu** du fichier `supabase/migrations/20250705134321_bold_sound.sql`

### 5. Finalisation

```bash
# Rebuild avec la configuration
npm run build

# Redémarrer Nginx
sudo systemctl reload nginx
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

### Variables d'Environnement

**Fichier `.env` :**
```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anonyme
VITE_APP_TITLE=DiveManager
```

## 📡 API Supabase

### Accès Direct aux Tables
 
```javascript
// Récupérer tous les utilisateurs
const { data: users } = await supabase
  .from('users')
  .select('*');

// Créer un équipement
const { data: asset } = await supabase
  .from('assets')
  .insert({
    name: 'Détendeur Scubapro',
    category: 'Détendeurs',
    qr_code: 'DET-001'
  });
```

### Service Intégré

```javascript
import { supabaseService } from './src/services/supabaseService';

// Checkout d'un équipement
await supabaseService.checkout({
  assetId: 'asset-123',
  userId: 'user-456',
  performedBy: 'Admin'
});
```

## 🗄️ Base de Données PostgreSQL (Supabase)

### Avantages de Supabase

- **PostgreSQL** : Base de données robuste et performante
- **API REST automatique** : Pas besoin de coder l'API
- **Interface d'administration** : Dashboard web intégré
- **Sauvegardes automatiques** : Point-in-time recovery
- **Authentification** : Système d'auth complet
- **Temps réel** : WebSockets intégrés
- **Scalabilité** : Croît avec vos besoins

### Structure

- **users** : Utilisateurs et leurs certifications
- **assets** : Équipements de plongée
- **movements** : Historique des check-in/check-out
- **issues** : Problèmes signalés
- **notifications** : Alertes système

## 🔄 Gestion des Données

### Sauvegardes Automatiques
 
- **Point-in-time recovery** : Restauration à n'importe quel moment
- **Sauvegardes quotidiennes** : Automatiques via Supabase
- **Réplication** : Données répliquées automatiquement

### Export/Import

- **Export CSV** : Via l'interface Supabase
- **API REST** : Pour intégrations externes
- **SQL direct** : Accès complet à PostgreSQL

## 📱 Workflow QR Code

1. **Générer les QR codes** : Via l'interface d'administration
2. **Imprimer les étiquettes** : Fonction d'impression intégrée
3. **Scanner utilisateur** : Premier scan obligatoire
4. **Scanner équipements** : Autant que nécessaire
5. **Synchronisation temps réel** : Mise à jour instantanée
6. **Historique complet** : Tout est tracé automatiquement

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

### Sécurité Supabase
 
- **Row Level Security (RLS)** : Sécurité au niveau des lignes
- **Authentification JWT** : Tokens sécurisés
- **HTTPS obligatoire** : Chiffrement des communications
- **Audit logs** : Traçabilité complète

### Monitoring

- **Dashboard Supabase** : Métriques en temps réel
- **Logs d'API** : Toutes les requêtes tracées
- **Alertes** : Notifications automatiques

## 🛠️ Maintenance

### Mise à jour

```bash
cd /var/www/divemanager

# Mettre à jour le code
git pull origin main

# Installer les nouvelles dépendances
npm install

# Rebuilder
npm run build

# Redémarrer Nginx
sudo systemctl reload nginx
```

### Migrations Supabase
 
1. **Nouvelles migrations** dans `supabase/migrations/`
2. **Exécution via SQL Editor** dans Supabase
3. **Pas de downtime** : Migrations en ligne

## 🎯 Points Clés de l'Architecture Supabase

✅ **Simplicité** : Plus de serveur backend à gérer  
✅ **Scalabilité** : PostgreSQL + infrastructure cloud  
✅ **Temps réel** : Synchronisation instantanée  
✅ **Sécurité** : RLS + authentification intégrée  
✅ **Monitoring** : Dashboard et métriques inclus  
✅ **Sauvegardes** : Automatiques et fiables  
✅ **API REST** : Générée automatiquement  
✅ **Installation simple** : Un seul script sur Debian  

## 💰 Coûts Supabase

- **Gratuit jusqu'à 50 000 requêtes/mois**
- **2 Go de stockage inclus**
- **Parfait pour un club de plongée**
- **Upgrade possible si nécessaire**

L'application est maintenant **prête pour la production** avec Supabase ! 🚀