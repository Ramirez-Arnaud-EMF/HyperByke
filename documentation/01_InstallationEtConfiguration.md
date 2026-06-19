# HyperByke - Installation et Configuration

## 📋 Table des matières
1. [Prérequis](#prérequis)
2. [Installation](#installation)
3. [Démarrage du projet](#démarrage-du-projet)
4. [Accès à l'application](#accès-à-lapplication)
5. [Comptes de test](#comptes-de-test)
6. [Arrêt du projet](#arrêt-du-projet)
7. [Dépannage](#dépannage)

---

## 📦 Prérequis

### Système d'exploitation
- **Windows** 10/11 ou **macOS** ou **Linux**

### Logiciels requis
- **Docker Desktop** (incluant Docker Compose)
- **Git** (optionnel, pour cloner le projet)

### Vérification des prérequis

#### Vérifier Docker
Ouvrez un terminal (PowerShell, Bash ou cmd) et exécutez :
```bash
docker --version
docker compose version
```

Vous devez voir une version de Docker installée (ex: Docker version 24.0+)

---

## 🔧 Installation

### Étape 1 : Installer Docker Desktop

#### Windows
1. Téléchargez [Docker Desktop pour Windows](https://www.docker.com/products/docker-desktop)
2. Exécutez l'installateur
3. Acceptez les conditions et complétez l'installation
4. Redémarrez votre ordinateur
5. Lancez Docker Desktop depuis le menu Démarrer

#### macOS
1. Téléchargez [Docker Desktop pour Mac](https://www.docker.com/products/docker-desktop)
2. Ouvrez le fichier `.dmg` et glissez Docker dans Applications
3. Lancez Docker depuis Applications

#### Linux
Suivez la documentation officielle : https://docs.docker.com/engine/install/

### Étape 2 : Cloner ou récupérer le projet

```bash
git clone <url-du-repo> HyperByke
cd HyperByke
```

Ou si vous avez déjà le projet en local :
```bash
cd chemin/vers/HyperByke
```

### Étape 3 : Vérifier la structure du projet

Assurez-vous d'avoir cette structure :
```
HyperByke/
├── client/           # Frontend (Nginx)
├── server/           # API Backend (Node.js)
├── bd/               # Base de données
├── docker-compose.yml
├── docker-compose.test.yml
└── README.md
```

---

## 🚀 Démarrage du projet

### Configuration optionnelle (variables d'environnement)

Si vous souhaitez personnaliser les variables (ports, mots de passe, etc.), créez un fichier `.env` à la racine du projet :

```env
DB_USER=root
DB_PASSWORD=emf123
DB_NAME=db_hyperbyke
JWT_SECRET=ezForEnce
JWT_EXPIRATION=1h
```

### Démarrage - Version PRODUCTION (Normal)

**Démarrer tous les services :**
```bash
docker compose up -d --build
```

**Ou sans reconstruction :**
```bash
docker compose up -d
```

Attendre 10-15 secondes le temps que tous les services démarrent.

### Démarrage - Version TEST

**Démarrer les services de test :**
```bash
docker compose -f docker-compose.test.yml up -d --build
```

**Ou sans reconstruction :**
```bash
docker compose -f docker-compose.test.yml up -d
```

### Démarrer LES DEUX (Production + Test)

**En deux commandes :**
```bash
docker compose up -d --build
docker compose -f docker-compose.test.yml up -d --build
```

**Ou en une ligne (Windows PowerShell) :**
```bash
docker compose up -d --build; docker compose -f docker-compose.test.yml up -d --build
```

**Vérifier les services :**
```bash
docker compose ps
docker compose -f docker-compose.test.yml ps
```

---

## 🌐 Accès à l'application

### Version PRODUCTION

Après le démarrage, accédez à :

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:8080 | Application web HyperByke |
| **API** | http://localhost:3000/api | API REST |
| **Swagger** | http://localhost:8080/api-docs | Documentation API (si disponible) |
| **phpMyAdmin** | http://localhost:8081 | Gestion de la base de données |
| **MySQL** | localhost:3306 | Accès direct à la DB |

### Version TEST

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | (voir version prod) | Pas de client de test |
| **API** | http://localhost:3001/api | API REST de test |
| **MySQL Test** | localhost:3307 | Base de test (port différent) |

---

## 👤 Comptes de test

### Compte Garagiste
```
Identifiant : jdupont
Mot de passe : pass1234
Rôle : Garagiste
Fonctions : Gestion des motos, suivi de production
```

### Compte Logisticien
```
Identifiant : mleblanc
Mot de passe : securepass
Rôle : Logisticien
Fonctions : Gestion des stocks, commandes de pièces
```

### Se connecter

1. Accédez à http://localhost:8080
2. Vous êtes redirigé automatiquement vers la page de connexion
3. Entrez l'un des comptes de test
4. Cliquez sur "Connexion"

---

## 🛑 Arrêt du projet

### Arrêter TOUS les services

```bash
docker compose down
```

### Arrêter AUSSI les volumes (attention : supprime les données)

```bash
docker compose down -v
```

### Arrêter la version TEST

```bash
docker compose -f docker-compose.test.yml down
```

### Arrêter TOUT (Production + Test)

```bash
docker compose down
docker compose -f docker-compose.test.yml down
```

---

## 📊 Ports utilisés

| Service | Port | Type |
|---------|------|------|
| Client (Frontend) | 8080 | HTTP |
| Server (API) | 3000 | HTTP |
| MySQL | 3306 | TCP |
| phpMyAdmin | 8081 | HTTP |
| **Server Test** | 3001 | HTTP |
| **MySQL Test** | 3307 | TCP |

**⚠️ Assurez-vous que ces ports sont disponibles avant de démarrer !**

---

## 🔍 Vérifier le statut

### Voir les conteneurs actifs

```bash
docker compose ps
```

Résultat attendu :
```
NAME                      STATUS      PORTS
hyperbyke-client          Up 2 mins   0.0.0.0:8080->80/tcp
hyperbyke-server          Up 2 mins   0.0.0.0:3000->3000/tcp
hyperbyke-mysql           Up 2 mins   0.0.0.0:3306->3306/tcp
hyperbyke-phpmyadmin      Up 2 mins   0.0.0.0:8081->80/tcp
```

### Voir les logs

**Logs du serveur :**
```bash
docker compose logs server -f
```

**Logs de MySQL :**
```bash
docker compose logs mysql -f
```

**Tous les logs :**
```bash
docker compose logs -f
```

---

## 🆘 Dépannage

### ❌ Port déjà utilisé

**Erreur :**
```
Error response from daemon: Ports are not available: exposing port TCP 0.0.0.0:3000 -> 0.0.0.0:3000: listen tcp 0.0.0.0:3000: bind: An attempt was made to access a socket in a way forbidden by access rights.
```

**Solution :**
1. Trouvez ce qui utilise le port :
```bash
# Windows
netstat -ano | findstr :3000

# macOS/Linux
lsof -i :3000
```

2. Arrêtez le processus ou modifiez les ports dans `docker-compose.yml`

### ❌ Docker n'est pas démarré

**Erreur :**
```
Cannot connect to Docker daemon
```

**Solution :** Lancez Docker Desktop

### ❌ Base de données qui ne démarre pas

**Erreur :**
```
healthcheck failed: exit code 1
```

**Solution :**
```bash
# Nettoyer les volumes
docker compose down -v

# Redémarrer
docker compose up -d --build
```

### ❌ L'application ne répond pas

**Vérifications :**
1. Attendez 30 secondes (première démarrage)
2. Vérifiez les logs :
```bash
docker compose logs server
docker compose logs mysql
```

3. Redémarrez les services :
```bash
docker compose restart
```

### ❌ Erreur de connexion à la base de données

**Vérifier la configuration :**
1. Vérifiez le fichier `.env` (s'il existe)
2. Assurez-vous que MySQL est en bonne santé :
```bash
docker compose ps
# Le statut de "mysql" doit être "Up"
```

3. Redémarrez la base de données :
```bash
docker compose restart mysql
```

---

## 📝 Notes importantes

- **Première démarrage** : Les conteneurs prennent 20-30 secondes à se lancer
- **Base de données** : Elle est initialisée automatiquement au premier démarrage
- **Volume persistent** : Les données MySQL sont conservées même après `docker compose down` (sauf avec `-v`)
- **Développement** : Les modifications de code côté serveur nécessitent un `--build`

---

## ✅ Checklist de vérification

- [ ] Docker Desktop est installé et en cours d'exécution
- [ ] Les ports 8080, 3000, 3306, 8081 sont disponibles
- [ ] Le projet est dans le bon répertoire
- [ ] `docker compose up -d --build` s'est exécuté sans erreur
- [ ] Tous les conteneurs sont "Up" (`docker compose ps`)
- [ ] http://localhost:8080 est accessible
- [ ] La page de connexion s'affiche
- [ ] Vous pouvez vous connecter avec jdupont / pass1234

---

## 🆘 Besoin d'aide supplémentaire ?

- **Documentation Docker** : https://docs.docker.com/
- **Logs détaillés** : `docker compose logs -f`
- **Réinitialiser tout** : `docker compose down -v && docker compose up -d --build`

---

**Date de création** : 24 avril 2026  
**Dernière mise à jour** : 24 avril 2026  
**Testé sur** : Poste neutre
