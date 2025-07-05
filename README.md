# DiveManager - Système de Gestion de Matériel de Plongée

## 🏊‍♂️ Description

DiveManager est un système complet de gestion de matériel de plongée avec scanner QR code intégré et base de données SQLite, conçu spécialement pour les clubs de plongée.

## ✨ Fonctionnalités

- **Scanner QR Code** : Check-in/check-out automatique par scan
- **Base de données SQLite** : Stockage persistant et fiable
- **Gestion des utilisateurs** : Niveaux de certification FFESSM
- **Suivi des équipements** : Détendeurs, combinaisons, masques, palmes, gilets, bouteilles
- **Historique complet** : Tous les mouvements sont enregistrés
- **Sauvegarde automatique** : Scripts de backup/restore intégrés
- **Interface responsive** : Optimisée pour mobile et tablette
- **Gestion des droits** : Admin, Gestionnaire, Utilisateur

## 🗄️ Base de Données

### SQLite - Parfait pour Debian/Raspberry Pi

- **Léger** : Idéal pour Raspberry Pi
- **Sans serveur** : Pas de daemon à gérer
- **Fiable** : Base de données éprouvée
- **Sauvegarde simple** : Un seul fichier
- **Performance** : Excellent pour applications moyennes

### Structure de la base

- **users** : Utilisateurs et leurs certifications
- **assets** : Équipements de plongée
- **movements** : Historique des check-in/check-out
- **issues** : Problèmes signalés
- **notifications** : Alertes système

## 🚀 Installation sur Serveur Debian/Raspberry Pi

### 1. Installation automatique

```bash
# Télécharger et exécuter le script d'installation
wget https://votre-domaine.com/install-debian.sh
sudo bash install-debian.sh
```

### 2. Déploiement de l'application

```bash
# Copier les fichiers dans /var/www/divemanager
cd /var/www/divemanager
git clone https://github.com/votre-repo/divemanager.git .

# Installer les dépendances et builder
npm ci
npm run build

# Configurer Nginx
sudo bash deployment/configure-nginx.sh votre-domaine.com

# Démarrer les services
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 3. Initialisation de la base de données

La base de données SQLite est automatiquement créée au premier lancement :

```bash
# La base sera créée dans : /var/www/divemanager/divemanager.db
# Les données de test sont automatiquement insérées
```

## 🔧 Gestion de la Base de Données

### Sauvegarde

```bash
# Sauvegarde manuelle
npm run backup

# Sauvegarde automatique (cron)
# Ajouter dans crontab : 0 2 * * * cd /var/www/divemanager && npm run backup
```

### Restauration

```bash
# Restaurer depuis une sauvegarde
npm run restore backups/divemanager-backup-2024-01-15T10-30-00-000Z.db
```

### Maintenance

```bash
# Vérifier l'état de la base
sqlite3 divemanager.db "PRAGMA integrity_check;"

# Optimiser la base
sqlite3 divemanager.db "VACUUM;"

# Voir les statistiques
sqlite3 divemanager.db "SELECT 
  (SELECT COUNT(*) FROM users) as users,
  (SELECT COUNT(*) FROM assets) as assets,
  (SELECT COUNT(*) FROM movements) as movements;"
```

## 📱 Utilisation Mobile

L'application est entièrement responsive et optimisée pour :

- **Smartphones** : Interface tactile adaptée
- **Tablettes** : Affichage optimisé pour les écrans moyens
- **Scanner QR** : Interface simplifiée pour scan rapide
- **Mode hors-ligne** : Données stockées localement

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env` :

```env
VITE_APP_TITLE=DiveManager
VITE_BASE_URL=https://votre-domaine.com
VITE_DB_PATH=./divemanager.db
```

### Nginx

La configuration Nginx inclut :

- **Compression gzip** pour les performances
- **Cache des assets** statiques
- **Redirection des routes** QR vers l'application
- **Sécurité** : Headers de sécurité

## 📋 Workflow QR Code

1. **Générer les QR codes** : Utiliser le composant `QRCodeDisplay`
2. **Imprimer les étiquettes** : Fonction d'impression intégrée
3. **Scanner utilisateur** : Premier scan obligatoire
4. **Scanner équipements** : Autant que nécessaire
5. **Validation automatique** : Sortie/retour selon l'état
6. **Sauvegarde automatique** : Tout est enregistré en base

## 🔒 Sécurité

- **HTTPS recommandé** : Certificat SSL/TLS
- **Firewall** : Ports 80/443 uniquement
- **Sauvegarde chiffrée** : Scripts de backup sécurisés
- **Logs** : Journalisation des actions
- **Base locale** : Pas d'exposition réseau de la DB

## 📊 Monitoring

```bash
# Vérifier le statut
sudo systemctl status nginx
sudo systemctl status divemanager

# Logs application
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Statistiques base de données
npm run backup  # Affiche aussi les stats
```

## 🔄 Mise à jour

```bash
cd /var/www/divemanager

# Sauvegarder avant mise à jour
npm run backup

# Mettre à jour le code
git pull origin main
npm ci
npm run build

# Redémarrer les services
sudo systemctl reload nginx
```

## 🛠️ Développement

### Structure du projet

```
src/
├── database/           # Gestion SQLite
│   ├── schema.sql     # Structure de la base
│   ├── database.ts    # Gestionnaire principal
│   └── repositories/ # Accès aux données
├── services/          # Logique métier
├── hooks/            # Hooks React pour la DB
└── components/       # Interface utilisateur
```

### Scripts disponibles

```bash
npm run dev          # Développement
npm run build        # Production
npm run backup       # Sauvegarde DB
npm run restore      # Restauration DB
```

## 📞 Support

Pour toute question ou problème :

1. Vérifier les logs Nginx et application
2. Tester la connectivité réseau
3. Valider la configuration DNS
4. Contrôler les permissions fichiers
5. Vérifier l'intégrité de la base SQLite

## 🎯 Roadmap

- [x] Base de données SQLite intégrée
- [x] Sauvegarde/restauration automatique
- [x] Interface responsive complète
- [ ] Authentification utilisateurs
- [ ] Notifications push
- [ ] Export/import données CSV
- [ ] Application mobile native
- [ ] Synchronisation multi-sites