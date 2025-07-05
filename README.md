# DiveManager - Système de Gestion de Matériel de Plongée

## 🏊‍♂️ Description

DiveManager est un système complet de gestion de matériel de plongée avec scanner QR code intégré, conçu spécialement pour les clubs de plongée.

## ✨ Fonctionnalités

- **Scanner QR Code** : Check-in/check-out automatique par scan
- **Gestion des utilisateurs** : Niveaux de certification FFESSM
- **Suivi des équipements** : Détendeurs, combinaisons, masques, palmes, gilets, bouteilles
- **Notifications** : Alertes en temps réel pour les problèmes
- **Interface responsive** : Optimisée pour mobile et tablette
- **Gestion des droits** : Admin, Gestionnaire, Utilisateur

## 🚀 Installation sur Serveur Debian

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

### 3. Configuration des QR Codes

Les QR codes pointent automatiquement vers votre domaine :

- **Utilisateurs** : `https://votre-domaine.com/user/USER-001`
- **Équipements** : `https://votre-domaine.com/asset/DET-001`

## 📱 Utilisation Mobile

L'application est entièrement responsive et optimisée pour :

- **Smartphones** : Interface tactile adaptée
- **Tablettes** : Affichage optimisé pour les écrans moyens
- **Scanner QR** : Interface simplifiée pour scan rapide
- **Saisie manuelle** : Alternative au scan pour les tests

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env` :

```env
VITE_APP_TITLE=DiveManager
VITE_BASE_URL=https://votre-domaine.com
VITE_API_URL=https://votre-domaine.com/api
```

### Nginx

La configuration Nginx inclut :

- **Compression gzip** pour les performances
- **Cache des assets** statiques
- **Redirection des routes** QR vers l'application
- **Proxy API** pour le backend (optionnel)

## 📋 Workflow QR Code

1. **Générer les QR codes** : Utiliser le composant `QRCodeDisplay`
2. **Imprimer les étiquettes** : Fonction d'impression intégrée
3. **Scanner utilisateur** : Premier scan obligatoire
4. **Scanner équipements** : Autant que nécessaire
5. **Validation automatique** : Sortie/retour selon l'état

## 🔒 Sécurité

- **HTTPS recommandé** : Certificat SSL/TLS
- **Firewall** : Ports 80/443 uniquement
- **Sauvegarde** : Script de backup automatique
- **Logs** : Journalisation des actions

## 📊 Monitoring

```bash
# Vérifier le statut
sudo systemctl status nginx
sudo systemctl status divemanager

# Logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 🔄 Mise à jour

```bash
cd /var/www/divemanager
git pull origin main
npm ci
npm run build
sudo systemctl reload nginx
```

## 📞 Support

Pour toute question ou problème :

1. Vérifier les logs Nginx
2. Tester la connectivité réseau
3. Valider la configuration DNS
4. Contrôler les permissions fichiers

## 🎯 Roadmap

- [ ] Backend API avec base de données
- [ ] Authentification utilisateurs
- [ ] Notifications push
- [ ] Export/import données
- [ ] Application mobile native
- [ ] Intégration caméra native