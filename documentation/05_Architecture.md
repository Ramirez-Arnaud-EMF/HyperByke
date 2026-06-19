# Architecture – HyperByke

_Version 1.0 — Arnaud Ramirez_

## 1. Vue d'ensemble

HyperByke repose sur une **architecture trois-tiers** classique, entièrement conteneurisée avec Docker :

```
┌─────────────────────────────────────────────────────────┐
│                     Navigateur client                   │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP (port 8080)
┌────────────────────────▼────────────────────────────────┐
│              Tier 1 – Frontend (Nginx)                  │
│         HTML / CSS / JavaScript vanilla                 │
│              Conteneur : hyperbyke-client               │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP REST (port 3000)
┌────────────────────────▼────────────────────────────────┐
│           Tier 2 – API REST (Node.js / Express)         │
│          JWT · Bcrypt · Swagger · Middlewares           │
│              Conteneur : hyperbyke-server               │
└────────────────────────┬────────────────────────────────┘
                         │ TCP (port 3306)
┌────────────────────────▼────────────────────────────────┐
│              Tier 3 – Base de données (MySQL 8.4)       │
│                Conteneur : hyperbyke-mysql              │
└─────────────────────────────────────────────────────────┘
```

Un quatrième conteneur **phpMyAdmin** (port 8081) est disponible en environnement de développement pour administrer la base de données.

---

## 2. Conteneurs Docker

| Conteneur | Image / Build | Port exposé | Rôle |
|---|---|---|---|
| `hyperbyke-mysql` | `mysql:8.4` | 3306 | Base de données persistante |
| `hyperbyke-server` | `./server` (Node.js) | 3000 | API REST + authentification |
| `hyperbyke-client` | `./client` (Nginx) | 8080 | Serveur statique frontend |
| `hyperbyke-phpmyadmin` | `phpmyadmin:latest` | 8081 | Interface administration BDD |

### Dépendances de démarrage

```
mysql (healthcheck OK)
    └── server (attend mysql)
            └── client (attend server)
```

### Variables d'environnement (`.env` à la racine)

| Variable | Valeur par défaut | Description |
|---|---|---|
| `DB_USER` | `root` | Utilisateur MySQL |
| `DB_PASSWORD` | `emf123` | Mot de passe MySQL |
| `DB_NAME` | `db_hyperbyke` | Nom de la base |
| `DB_HOST` | `mysql` | Hôte MySQL (réseau Docker interne) |
| `JWT_SECRET` | `ezForEnce` | Clé de signature JWT |
| `JWT_EXPIRATION` | `1h` | Durée de validité du token |

---

## 3. Frontend (Tier 1)

### Structure des fichiers

```
client/
├── index.html                  # Page d'accueil (redirection login)
├── html/
│   ├── login.html              # Page de connexion
│   ├── garage.html             # Liste des motos en production
│   ├── detail.html             # Détail d'une moto
│   └── logistique.html         # Gestion du stock
├── css/                        # Feuilles de style par page
├── controller/                 # Contrôleurs JS (logique UI)
│   ├── authentificationController.js
│   ├── garageController.js
│   ├── detailController.js
│   ├── logistiqueController.js
│   └── menuController.js
└── service/                    # Services JS (appels API)
    ├── config.js               # URL de base de l'API
    ├── serviceAuthetification.js
    ├── serviceGarage.js
    ├── serviceLogistique.js
    └── utils.js                # Fonctions utilitaires (formaterNomClient, formaterNomPiece)
```

### Flux de navigation

```
login.html
    │ (connexion réussie → token + rôle dans localStorage)
    ├── [garagiste]  → garage.html → detail.html
    └── [logisticien] → logistique.html
```

Le token JWT est stocké dans le `localStorage` et envoyé dans l'en-tête `Authorization: Bearer <token>` à chaque requête API.

---

## 4. Backend – API REST (Tier 2)

### Structure des fichiers

```
server/
├── server.js                   # Point d'entrée Express
├── app/
│   ├── swagger.js              # Configuration Swagger / OpenAPI
│   ├── routes/
│   │   ├── apiRoutes.js        # Routeur principal (/api)
│   │   ├── authentificationRoutes.js
│   │   ├── motoRoutes.js
│   │   └── stockRoutes.js
│   ├── controllers/
│   │   ├── authentificationController.js
│   │   ├── motoController.js
│   │   └── stockController.js
│   ├── middlewares/
│   │   ├── validateAuthentification.js  # Vérification JWT + rôle
│   │   ├── validateMoto.js
│   │   └── validateStock.js
│   └── services/
│       ├── motoService.js
│       ├── stockServices.js
│       └── utilisateurService.js
└── config/
    └── database.js             # Pool de connexions MySQL (mysql2/promise)
```

### Endpoints API

Tous les endpoints sont préfixés `/api`. La documentation interactive est disponible sur `/api-docs` (Swagger UI).

#### Authentification

| Méthode | Route | Auth requise | Rôles | Description |
|---|---|---|---|---|
| `POST` | `/api/authentification/login` | Non | — | Connexion et obtention du token JWT |

#### Motos

| Méthode | Route | Auth requise | Rôles | Description |
|---|---|---|---|---|
| `GET` | `/api/moto/allmotos` | Oui | `garagiste` | Liste de toutes les motos en production |
| `GET` | `/api/moto/moto/:id` | Oui | `garagiste` | Détail d'une moto et ses pièces |
| `POST` | `/api/moto/addmoto` | Oui | `garagiste` | Ajouter une moto à la production |
| `DELETE` | `/api/moto/moto/:id/piece/:pieceId` | Oui | `garagiste` | Marquer une pièce comme assemblée (décrémente le stock) |

#### Stock

| Méthode | Route | Auth requise | Rôles | Description |
|---|---|---|---|---|
| `GET` | `/api/stock/allstock` | Oui | `garagiste`, `logisticien` | Liste de toutes les pièces et leur stock |
| `PUT` | `/api/stock/addstock/:id` | Oui | `logisticien` | Ajouter de la quantité au stock d'une pièce |
| `PUT` | `/api/stock/updatestock/:id` | Oui | `logisticien` | Mettre à jour la quantité du stock d'une pièce |

### Middlewares

| Middleware | Rôle |
|---|---|
| `validateAuthentification(roles)` | Vérifie la présence et la validité du token JWT. Contrôle que le rôle de l'utilisateur figure dans la liste des rôles autorisés. Retourne 401 si token absent, 403 si invalide ou rôle insuffisant. |
| `validateMoto` | Valide les données du body pour la création d'une moto (champs requis, types). |
| `validateStock` | Valide les données du body pour la modification du stock (quantité positive, type numérique). |

### Sécurité

- Les mots de passe sont hachés avec **bcrypt** (facteur 10).
- L'authentification repose sur des tokens **JWT** (HS256), signés avec `JWT_SECRET`, expiration configurable.
- Chaque route protégée passe par le middleware `validateAuthentification` qui vérifie le token et le rôle avant d'accéder au contrôleur.

---

## 5. Base de données (Tier 3)

### Schéma

```
┌─────────────────────┐        ┌──────────────────────────────┐
│      Employer       │        │       ConfigurationMoto       │
│─────────────────────│        │──────────────────────────────│
│ pk_employer (PK)    │        │ pk_configurationMoto (PK)    │
│ username (UNIQUE)   │        │ nomModele                    │
│ password (bcrypt)   │        └──────────────┬───────────────┘
│ role (ENUM)         │                       │ 1
└─────────────────────┘                       │
                                              │ N
                          ┌───────────────────▼──────────────────┐
                          │      tr_configurationMoto_piece       │
                          │──────────────────────────────────────│
                          │ fk_configurationMoto (FK)            │
                          │ fk_piece (FK)                        │
                          │ quantite                             │
                          └───────────────────┬──────────────────┘
                                              │ N
┌──────────────────┐                          │ 1
│      Moto        │    ┌─────────────────────▼──────┐
│──────────────────│    │           Piece             │
│ pk_moto (PK)     │    │────────────────────────────│
│ fk_configMoto(FK)│    │ pk_piece (PK)              │
│ nomClient        │    │ nomPiece                   │
│ dateLivraison    │    │ quantiteStock              │
└────────┬─────────┘    └─────────────┬──────────────┘
         │ 1                          │ N
         │                            │
         │ N          ┌───────────────▼──────────────┐
         └────────────►       tr_moto_piece           │
                      │──────────────────────────────│
                      │ fk_moto (FK)                 │
                      │ fk_piece (FK)                │
                      │ quantite                     │
                      └──────────────────────────────┘
```

### Description des tables

| Table | Description |
|---|---|
| `Employer` | Employés de l'application avec leur rôle (`garagiste` ou `logisticien`). Mots de passe hachés bcrypt. |
| `ConfigurationMoto` | Modèles de motos disponibles (ex. yamaha R1, kawasaki ZX-6R). |
| `Piece` | Catalogue de pièces avec leur quantité en stock. |
| `Moto` | Motos en cours de production, associées à un modèle (`ConfigurationMoto`) et à un client. |
| `tr_configurationMoto_piece` | Liste des pièces nécessaires pour chaque modèle de moto avec la quantité requise. |
| `tr_moto_piece` | Pièces effectivement montées sur chaque moto en production. |

---

## 6. Flux de données typiques

### Connexion

```
Client (login.html)
  → POST /api/authentification/login { username, password }
  ← 200 { token, role, username }
  → Stockage dans localStorage
```

### Consultation des motos (garagiste)

```
Client (garage.html)
  → GET /api/moto/allmotos  [Authorization: Bearer <token>]
  ← 200 [ { pk_moto, nomModele, nomClient, dateLivraison } ]
  → Affichage des cartes motos
```

### Marquage d'une pièce assemblée

```
Client (detail.html)
  → DELETE /api/moto/moto/:id/piece/:pieceId  [Authorization: Bearer <token>]
  ← 200 (pièce supprimée de tr_moto_piece + stock décrémenté dans Piece)
```

### Modification du stock (logisticien)

```
Client (logistique.html)
  → PUT /api/stock/updatestock/:id { quantiteStock }  [Authorization: Bearer <token>]
  ← 200 (quantiteStock mis à jour dans Piece)
```
