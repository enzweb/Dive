# 🚀 Guide d'Installation DiveManager sur Debian

## 📋 Prérequis
- Serveur Debian 11/12 ou Ubuntu 20.04+
- Accès root (sudo)
- Connexion internet

## 🎯 Scénarios d'Installation

### **Scénario 1 : Installation Locale (Recommandé)**
Pour tester sur votre machine locale :

```bash
# Télécharger les fichiers du projet
git clone [votre-repo] /tmp/divemanager
cd /tmp/divemanager

# Installation automatique
sudo bash deployment/install-complete.sh

# Configuration
sudo bash deployment/configure-production.sh
```

**Accès :** `http://[IP-de-votre-machine]` (affichée à la fin de l'installation)

### **Scénario 2 : Serveur avec Nom/IP Spécifique**
Si vous avez un nom de serveur ou IP fixe :

```bash
# Avec nom de serveur
sudo bash deployment/install-complete.sh monserveur.local
sudo bash deployment/configure-production.sh monserveur.local

# Ou avec IP fixe
sudo bash deployment/install-complete.sh 192.168.1.100
sudo bash deployment/configure-production.sh 192.168.1.100
```

### **Scénario 3 : Serveur Public avec Domaine**
Si vous avez acheté un domaine (optionnel) :

```bash
sudo bash deployment/install-complete.sh mondomaine.com
sudo bash deployment/configure-production.sh mondomaine.com

# Puis configurer HTTPS
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d mondomaine.com
```

## 🔧 Installation Étape par Étape

### 1. Préparation
```bash
# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Télécharger le projet
wget -O divemanager.zip [lien-vers-votre-zip]
unzip divemanager.zip
cd divemanager
```

### 2. Installation Automatique
```bash
# Installation complète (système + dépendances)
sudo bash deployment/install-complete.sh

# Copier les fichiers de l'application
sudo cp -r * /var/www/divemanager/
sudo chown -R divemanager:divemanager /var/www/divemanager

# Configuration et démarrage
sudo bash deployment/configure-production.sh
```

### 3. Vérification
```bash
# Vérifier le backend
sudo -u divemanager pm2 status

# Vérifier Nginx
systemctl status nginx

# Tester l'API
curl http://localhost/api/health
```

## 🌐 Accès à l'Application

Après installation, l'application est accessible sur :
- **Interface web :** `http://[IP-du-serveur]`
- **API :** `http://[IP-du-serveur]/api`
- **QR Codes :** `http://[IP-du-serveur]/user/ID` et `http://[IP-du-serveur]/asset/ID`

## 🔍 Trouver l'IP de votre Serveur

```bash
# IP locale
hostname -I

# IP publique (si serveur distant)
curl ifconfig.me
```

## 🛠️ Commandes Utiles

```bash
# Statut des services
sudo -u divemanager pm2 status
systemctl status nginx

# Logs
sudo -u divemanager pm2 logs divemanager-server
tail -f /var/log/divemanager/combined.log

# Redémarrage
sudo -u divemanager pm2 restart divemanager-server
systemctl restart nginx

# Sauvegarde manuelle
cd /var/www/divemanager/server
sudo -u divemanager node scripts/backup-db.js
```

## 🔒 Sécurité (Optionnel)

```bash
# Firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# HTTPS avec Let's Encrypt (si domaine public)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d votre-domaine.com
```

## 🆘 Dépannage

### Backend ne démarre pas
```bash
sudo -u divemanager pm2 logs divemanager-server
sudo -u divemanager pm2 restart divemanager-server
```

### Nginx erreur 502
```bash
curl http://localhost:3001/api/health
systemctl restart nginx
```

### Base de données corrompue
```bash
cd /var/www/divemanager/server
sudo -u divemanager node scripts/restore-db.js backups/derniere-sauvegarde.db
```

## 📞 Support

L'application inclut :
- ✅ Base de données SQLite locale
- ✅ API REST complète
- ✅ Interface web responsive
- ✅ QR Code et NFC
- ✅ Sauvegardes automatiques
- ✅ Monitoring PM2
- ✅ Logs centralisés

**Aucun domaine externe requis !** L'application fonctionne entièrement en local.