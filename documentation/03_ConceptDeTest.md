# Concept de Test – HyperByke

_Proposition de plan de test basé sur un modèle HERMES simplifié. Ce plan de test ne contient pas les résultats des test, mais bien tout le contexte, la stratégie, la planification_

## 1. Objectifs de test

### 1.1 Contexte

**HyperByke** est une application web de gestion destinée aux garages de motos. Elle couvre deux domaines métier principaux : le suivi des motos en cours de production (rôle garagiste) et la gestion du stock de pièces (rôle logisticien). L'application repose sur une architecture trois-tiers : un frontend HTML/CSS/JS servi par Nginx, une API REST Node.js/Express, et une base de données MySQL. L'ensemble est conteneurisé avec Docker.

### 1.2 Objectifs de test

-   Vérifier le respect des bonnes pratiques dans le code (conformité ESLint)
-   Vérifier le bon comportement des fonctions utilitaires côté client (cas limites inclus)
-   Vérifier la conformité aux critères d'acceptation des API REST
-   Valider le fonctionnement attendu pour les utilisateurs finaux (garagiste, logisticien)
-   Fournir une information fiable pour la décision de mise en production

### 1.2 Références

-   Cas d'utilisation et architecture : [README.md](../README.md)
-   Installation et configuration : [01_InstallationEtConfiguration.md](./01_InstallationEtConfiguration.md)
-   Standards EMF : [emfinfo.notion.site](https://emfinfo.notion.site/standards-d-entreprise-2763af38719780a79fb4ce85b455eda0)

## 2. Stratégie

Dans ce projet, les tests sont répartis selon la pyramide des tests : beaucoup de tests unitaires (rapides, isolés), moins de tests d'intégration (API + BD réelle), et peu de tests fonctionnels end-to-end (lents, dans un vrai navigateur). L'analyse statique ESLint est exécutée sans coût supplémentaire à chaque analyse.

Pour éviter la redondance, les cas d'erreur de type et de valeur nulle sont couverts exhaustivement au niveau unitaire et ne sont pas répétés au niveau intégration. Les tests fonctionnels Cypress valident uniquement le parcours utilisateur global, sans répéter les règles métier déjà vérifiées par Vitest.

L'environnement de test est isolé de la production grâce à une base de données distincte (`db_hyperbyke_test`) et un serveur de test sur un port séparé (3001). Tous les tests sont automatisés et peuvent être exécutés en une seule commande par type.

## 3. Objet testé

-   Application / système : HyperByke
-   Version / release : 1.0.0
-   Environnement cible : local via Docker Compose (Windows 11 / Linux)
-   Données : `server/data/database-test.sql` (base `db_hyperbyke_test`)

## 4 Types de tests

### 4.1 Types et niveaux de test

Quels seront concrètement les tests réalisés ?

-   Fonctionnels
    -   Tests unitaires (Jest) — fonctions pures `formaterNomClient` et `formaterNomPiece`
    -   Tests d'intégration (Vitest) — endpoints REST `POST /api/authentification/login` et `GET /api/stock/allstock`
    -   Tests end-to-end (Cypress) — CU-01 Se connecter et CU-02 Consulter les motos
-   Non fonctionnels :
    -   Conformité (ESLint) — règles `no-var` et `eqeqeq`

### 4.2 Périmètre exclu (Out of Scope)

-   Fonctionnalités exclues :
    -   Pages logistique et accueil (non couvertes par les tests automatisés)
    -   Endpoints `/api/moto/` (ajout, détail de moto)
-   Tests explicitement non réalisés :
    -   Tests de performance
    -   Tests de sécurité
    -   Tests d'acceptation utilisateurs

## 5. Environnement de test

L'environnement de test est local, reproductible et isolé : une base de données distincte est utilisée pour les tests d'intégration afin de ne jamais polluer les données de production.

### 5.1 Infrastructure et Outils

| Composant | Description |
|---|---|
| Système d'exploitation | Windows 11 |
| Runtime applicatif | Node.js 20 LTS |
| Conteneurisation | Docker Desktop 24+ / Docker Compose v2 |
| Tests de conformité | ESLint 9.x |
| Tests unitaires | Jest 29.x |
| Tests d'intégration | Vitest 3.x |
| Tests fonctionnels E2E | Cypress 13.x |
| Base de données production | MySQL 8.4 – port 3306 – `db_hyperbyke` |
| Base de données test | MySQL 8.4 – port 3307 – `db_hyperbyke_test` |
| Navigateur E2E | Electron headless (embarqué dans Cypress) |

### 5.2 Données de test

Les données de test sont définies dans `server/data/database-test.sql`. La base est initialisée automatiquement au démarrage du conteneur de test (`docker compose -f docker-compose.test.yml up`).

| Table | Données disponibles |
|---|---|
| `Employer` | `jdupont` (garagiste / pass1234), `mleblanc` (logisticien / securepass), `afernandez` (garagiste) |
| `Piece` | 10 pièces : Guidon, Selle, Rétroviseur, Pneu avant, Pneu arrière, Frein avant, Frein arrière, Amortisseur, Phare avant, Batterie |
| `ConfigurationMoto` | yamaha R1, yamaha MT-07, kawasaki ZX-6R |
| `Moto` | 3 motos en production |

### 5.3 Automatisation

Tous les tests sont automatisés et déclenchés manuellement depuis la racine du projet. Une pipeline GitHub Actions est configurée pour les exécuter automatiquement à chaque push sur `main` ou `develop`.

| Type de test | Commande |
|---|---|
| Conformité | `npm run lint` |
| Tests unitaires | `npm test` |
| Tests d'intégration | `npm run test:integration` |
| Tests fonctionnels | `npm run test:fonctionnel` (headless) ou `npm run test:fonctionnel:open` |

## 6. Decription des cas de test

### 6.1 Tests de conformité (ESLint)

| ID | Suite / Fichier (logique) | Type | Cible | Cas de test | Préconditions / Entrées | Résultat attendu |
|---|---|---|---|---|---|---|
| TC-01 | Conformité ESLint (`eslint.config.js`) | Conformité (ESLint) | Code source | Détecter tout usage de `var` dans le code source | Analyse `client/service/**/*.js` et `server/app/**/*.js` | Aucune occurrence de `var` — exit code 0 |
| TC-02 | Conformité ESLint (`eslint.config.js`) | Conformité (ESLint) | Code source | Détecter toute comparaison avec `==` ou `!=` | Idem | Aucune égalité lâche — exit code 0 |

Justification : `var` a une portée de fonction et est sujet au *hoisting*, sources de bugs. `==` effectue des conversions de types implicites imprévisibles. `let`/`const` et `===` sont plus sûrs.

### 6.2 Tests unitaires (Jest) — `tests_unitaires/utils.spec.js`

Cible : `client/service/utils.js`

#### `formaterNomClient(prenom, nom)`

| ID | Suite / Fichier (logique) | Type | Cible | Cas de test | Préconditions / Entrées | Résultat attendu |
|---|---|---|---|---|---|---|
| UNIT-UTILS-01 | `formaterNomClient` (`tests_unitaires/utils.spec.js`) | Unitaire (Jest) | Utilitaire JS | Formate prénom et nom standard | `('jean', 'dupont')` | `'Jean DUPONT'` |
| UNIT-UTILS-02 | `formaterNomClient` (`tests_unitaires/utils.spec.js`) | Unitaire (Jest) | Utilitaire JS | Casse correcte si input en majuscules | `('MARIE', 'LEBLANC')` | `'Marie LEBLANC'` |
| UNIT-UTILS-03 | `formaterNomClient` (`tests_unitaires/utils.spec.js`) | Unitaire (Jest) | Utilitaire JS | Gère les cas mixtes | `('PiErRe', 'MaRtIn')` | `'Pierre MARTIN'` |
| UNIT-UTILS-04 | `formaterNomClient` (`tests_unitaires/utils.spec.js`) | Unitaire (Jest) | Utilitaire JS | Ignore les espaces début/fin | `('  jean  ', '  dupont  ')` | `'Jean DUPONT'` |
| UNIT-UTILS-05 | `formaterNomClient` (`tests_unitaires/utils.spec.js`) | Unitaire (Jest) | Utilitaire JS | Gère les espacements multiples internes | `('   alice   ', '   martin   ')` | `'Alice MARTIN'` |
| UNIT-UTILS-06 | `formaterNomClient` (`tests_unitaires/utils.spec.js`) | Unitaire (Jest) | Utilitaire JS | Retourne null si prénom est null | `(null, 'dupont')` | `null` |
| UNIT-UTILS-07 | `formaterNomClient` (`tests_unitaires/utils.spec.js`) | Unitaire (Jest) | Utilitaire JS | Retourne null si nom est null | `('jean', null)` | `null` |
| UNIT-UTILS-08 | `formaterNomClient` (`tests_unitaires/utils.spec.js`) | Unitaire (Jest) | Utilitaire JS | Retourne null si prénom est undefined | `(undefined, 'dupont')` | `null` |
| UNIT-UTILS-09 | `formaterNomClient` (`tests_unitaires/utils.spec.js`) | Unitaire (Jest) | Utilitaire JS | Retourne null si nom est undefined | `('jean', undefined)` | `null` |
| UNIT-UTILS-10 | `formaterNomClient` (`tests_unitaires/utils.spec.js`) | Unitaire (Jest) | Utilitaire JS | Retourne null si prénom est un nombre | `(123, 'dupont')` | `null` |
| UNIT-UTILS-11 | `formaterNomClient` (`tests_unitaires/utils.spec.js`) | Unitaire (Jest) | Utilitaire JS | Retourne null si nom est un nombre | `('jean', 456)` | `null` |
| UNIT-UTILS-12 | `formaterNomClient` (`tests_unitaires/utils.spec.js`) | Unitaire (Jest) | Utilitaire JS | Retourne null si prénom est un objet | `({}, 'dupont')` | `null` |
| UNIT-UTILS-13 | `formaterNomClient` (`tests_unitaires/utils.spec.js`) | Unitaire (Jest) | Utilitaire JS | Retourne null si nom est un tableau | `('jean', [])` | `null` |
| UNIT-UTILS-14 | `formaterNomClient` (`tests_unitaires/utils.spec.js`) | Unitaire (Jest) | Utilitaire JS | Retourne null si prénom vide après trim | `('   ', 'dupont')` | `null` |
| UNIT-UTILS-15 | `formaterNomClient` (`tests_unitaires/utils.spec.js`) | Unitaire (Jest) | Utilitaire JS | Retourne null si nom vide après trim | `('jean', '   ')` | `null` |
| UNIT-UTILS-16 | `formaterNomClient` (`tests_unitaires/utils.spec.js`) | Unitaire (Jest) | Utilitaire JS | Retourne null si les deux vides | `('   ', '   ')` | `null` |
| UNIT-UTILS-17 | `formaterNomClient` (`tests_unitaires/utils.spec.js`) | Unitaire (Jest) | Utilitaire JS | Retourne null si prénom chaîne vide | `('', 'dupont')` | `null` |
| UNIT-UTILS-18 | `formaterNomClient` (`tests_unitaires/utils.spec.js`) | Unitaire (Jest) | Utilitaire JS | Retourne null si nom chaîne vide | `('jean', '')` | `null` |

#### `formaterNomPiece(nomPiece)`

| ID | Suite / Fichier (logique) | Type | Cible | Cas de test | Préconditions / Entrées | Résultat attendu |
|---|---|---|---|---|---|---|
| UNIT-PIECE-01 | `formaterNomPiece` (`tests_unitaires/utils.spec.js`) | Unitaire (Jest) | Utilitaire JS | Formate nom en minuscules | `'guidon'` | `'Guidon'` |
| UNIT-PIECE-02 | `formaterNomPiece` (`tests_unitaires/utils.spec.js`) | Unitaire (Jest) | Utilitaire JS | Formate nom en majuscules | `'SELLE'` | `'Selle'` |
| UNIT-PIECE-03 | `formaterNomPiece` (`tests_unitaires/utils.spec.js`) | Unitaire (Jest) | Utilitaire JS | Formate nom en casse mixte | `'rETROVISEUR'` | `'Retroviseur'` |
| UNIT-PIECE-04 | `formaterNomPiece` (`tests_unitaires/utils.spec.js`) | Unitaire (Jest) | Utilitaire JS | Ignore les espaces début/fin | `'  guidon  '` | `'Guidon'` |
| UNIT-PIECE-05 | `formaterNomPiece` (`tests_unitaires/utils.spec.js`) | Unitaire (Jest) | Utilitaire JS | Formate les noms composés | `'pneu avant'` | `'Pneu avant'` |
| UNIT-PIECE-06 | `formaterNomPiece` (`tests_unitaires/utils.spec.js`) | Unitaire (Jest) | Utilitaire JS | Formate "pneu arrière" | `'pneu arrière'` | `'Pneu arrière'` |
| UNIT-PIECE-07 | `formaterNomPiece` (`tests_unitaires/utils.spec.js`) | Unitaire (Jest) | Utilitaire JS | Formate "frein avant" | `'frein avant'` | `'Frein avant'` |
| UNIT-PIECE-08 | `formaterNomPiece` (`tests_unitaires/utils.spec.js`) | Unitaire (Jest) | Utilitaire JS | Formate "batterie" | `'batterie'` | `'Batterie'` |
| UNIT-PIECE-09 | `formaterNomPiece` (`tests_unitaires/utils.spec.js`) | Unitaire (Jest) | Utilitaire JS | Retourne null si null | `null` | `null` |
| UNIT-PIECE-10 | `formaterNomPiece` (`tests_unitaires/utils.spec.js`) | Unitaire (Jest) | Utilitaire JS | Retourne null si undefined | `undefined` | `null` |
| UNIT-PIECE-11 | `formaterNomPiece` (`tests_unitaires/utils.spec.js`) | Unitaire (Jest) | Utilitaire JS | Retourne null si nombre | `123` | `null` |
| UNIT-PIECE-12 | `formaterNomPiece` (`tests_unitaires/utils.spec.js`) | Unitaire (Jest) | Utilitaire JS | Retourne null si objet | `{}` | `null` |
| UNIT-PIECE-13 | `formaterNomPiece` (`tests_unitaires/utils.spec.js`) | Unitaire (Jest) | Utilitaire JS | Retourne null si tableau | `['Guidon']` | `null` |
| UNIT-PIECE-14 | `formaterNomPiece` (`tests_unitaires/utils.spec.js`) | Unitaire (Jest) | Utilitaire JS | Retourne null si booléen | `true` | `null` |
| UNIT-PIECE-15 | `formaterNomPiece` (`tests_unitaires/utils.spec.js`) | Unitaire (Jest) | Utilitaire JS | Retourne null si chaîne vide | `''` | `null` |
| UNIT-PIECE-16 | `formaterNomPiece` (`tests_unitaires/utils.spec.js`) | Unitaire (Jest) | Utilitaire JS | Retourne null si chaîne d'espaces | `'   '` | `null` |
| UNIT-PIECE-17 | `formaterNomPiece` (`tests_unitaires/utils.spec.js`) | Unitaire (Jest) | Utilitaire JS | Formate "AMORTISSEUR" | `'AMORTISSEUR'` | `'Amortisseur'` |
| UNIT-PIECE-18 | `formaterNomPiece` (`tests_unitaires/utils.spec.js`) | Unitaire (Jest) | Utilitaire JS | Formate casse mixte avec espace | `'phare AVANT'` | `'Phare avant'` |

### 6.3 Tests d'intégration (Vitest)

Précondition commune : serveur de test démarré sur le port 3001 (`docker compose -f docker-compose.test.yml up -d`).

#### `POST /api/authentification/login` — `tests_integration/login.spec.js`

| ID | Suite / Fichier (logique) | Type | Cible | Cas de test | Préconditions / Entrées | Résultat attendu |
|---|---|---|---|---|---|---|
| INT-AUTH-01 | `POST /api/authentification/login` (`tests_integration/login.spec.js`) | Intégration API + DB | API authentification | Connexion réussie – garagiste | `{ username: 'jdupont', password: 'pass1234' }` | HTTP 200, body contient `token`, `role:'garagiste'` |
| INT-AUTH-02 | `POST /api/authentification/login` (`tests_integration/login.spec.js`) | Intégration API + DB | API authentification | Connexion réussie – logisticien | `{ username: 'mleblanc', password: 'securepass' }` | HTTP 200, body contient `token`, `role:'logisticien'` |
| INT-AUTH-03 | `POST /api/authentification/login` (`tests_integration/login.spec.js`) | Intégration API | API authentification | Mauvais mot de passe | `{ username: 'jdupont', password: 'wrong' }` | HTTP 401, body contient `error` |
| INT-AUTH-04 | `POST /api/authentification/login` (`tests_integration/login.spec.js`) | Intégration API | API authentification | Utilisateur inexistant | `{ username: 'nobody', password: 'pass1234' }` | HTTP 401, body contient `error` |
| INT-AUTH-05 | `POST /api/authentification/login` (`tests_integration/login.spec.js`) | Intégration API | API authentification | Username manquant | `{ password: 'pass1234' }` | HTTP 400, body contient `error` |
| INT-AUTH-06 | `POST /api/authentification/login` (`tests_integration/login.spec.js`) | Intégration API | API authentification | Password manquant | `{ username: 'jdupont' }` | HTTP 400, body contient `error` |
| INT-AUTH-07 | `POST /api/authentification/login` (`tests_integration/login.spec.js`) | Intégration API | API authentification | Body vide | `{}` | HTTP 400, body contient `error` |
| INT-AUTH-08 | `POST /api/authentification/login` (`tests_integration/login.spec.js`) | Intégration API + DB | API authentification | Format JWT valide | `{ username: 'jdupont', password: 'pass1234' }` | HTTP 200, `token` contient exactement 2 points (format `header.payload.signature`) |

#### `GET /api/stock/allstock` — `tests_integration/stock.spec.js`

| ID | Suite / Fichier (logique) | Type | Cible | Cas de test | Préconditions / Entrées | Résultat attendu |
|---|---|---|---|---|---|---|
| INT-STOCK-01 | `GET /api/stock/allstock` (`tests_integration/stock.spec.js`) | Intégration API + DB | API stock | Liste des pièces accessible (logisticien) | `Authorization: Bearer <token logisticien>` | HTTP 200, tableau non vide |
| INT-STOCK-02 | `GET /api/stock/allstock` (`tests_integration/stock.spec.js`) | Intégration API + DB | API stock | Propriétés présentes sur chaque pièce | Idem | Chaque objet contient `pk_piece` (number), `nomPiece` (string), `quantiteStock` (number) |
| INT-STOCK-03 | `GET /api/stock/allstock` (`tests_integration/stock.spec.js`) | Intégration API + DB | API stock | Accessible pour un garagiste | `Authorization: Bearer <token garagiste>` | HTTP 200, tableau |
| INT-STOCK-04 | `GET /api/stock/allstock` (`tests_integration/stock.spec.js`) | Intégration API | API stock | Accès refusé sans token | Aucun header Authorization | HTTP 401 |
| INT-STOCK-05 | `GET /api/stock/allstock` (`tests_integration/stock.spec.js`) | Intégration API | API stock | Accès refusé avec token invalide | `Authorization: Bearer tokenInvalide` | HTTP 403 |
| INT-STOCK-06 | `GET /api/stock/allstock` (`tests_integration/stock.spec.js`) | Intégration API + DB | API stock | Pièces de base présentes dans la BD de test | `Authorization: Bearer <token logisticien>` | Body contient 'Guidon' et 'Selle' |

### 6.4 Tests end-to-end (Cypress)

Précondition commune : application démarrée (`docker compose up -d --build`), client sur `http://localhost:8080`.

#### CU-01 : Se connecter — `tests_fonctionnels/login.cy.js`

| ID | Suite / Fichier (logique) | Type | Cible | Cas de test | Étapes / Entrées | Résultat attendu |
|---|---|---|---|---|---|---|
| FONC-LOGIN-01 | Cypress – Login (`tests_fonctionnels/login.cy.js`) | Fonctionnel UI (E2E) | Page de connexion | Connexion réussie – garagiste | Saisir `jdupont` / `pass1234`, soumettre | Token JWT présent dans `localStorage` |
| FONC-LOGIN-02 | Cypress – Login (`tests_fonctionnels/login.cy.js`) | Fonctionnel UI (E2E) | Page de connexion | Connexion réussie – logisticien | Saisir `mleblanc` / `securepass`, soumettre | `role:'logisticien'` dans `localStorage` |
| FONC-LOGIN-03 | Cypress – Login (`tests_fonctionnels/login.cy.js`) | Fonctionnel UI (E2E) | Page de connexion | Rôle et username correctement stockés | Connexion garagiste | `role='garagiste'` et `username='jdupont'` dans `localStorage` |
| FONC-LOGIN-04 | Cypress – Login (`tests_fonctionnels/login.cy.js`) | Fonctionnel UI (E2E) | Page de connexion | Mauvais mot de passe → message d'erreur | Saisir `jdupont` / `mauvais`, soumettre | `#loginMessage` visible et non vide ; pas de token |
| FONC-LOGIN-05 | Cypress – Login (`tests_fonctionnels/login.cy.js`) | Fonctionnel UI (E2E) | Page de connexion | Utilisateur inexistant → message d'erreur | Saisir `inconnu` / `pass`, soumettre | `#loginMessage` visible et non vide |
| FONC-LOGIN-06 | Cypress – Login (`tests_fonctionnels/login.cy.js`) | Fonctionnel UI (E2E) | Page de connexion | Validation HTML : username requis | Laisser username vide, soumettre | `#username:invalid` présent, formulaire non soumis |
| FONC-LOGIN-07 | Cypress – Login (`tests_fonctionnels/login.cy.js`) | Fonctionnel UI (E2E) | Page de connexion | Validation HTML : password requis | Laisser password vide, soumettre | `#password:invalid` présent, formulaire non soumis |

#### CU-02 : Consulter la liste des motos — `tests_fonctionnels/garage.cy.js`

| ID | Suite / Fichier (logique) | Type | Cible | Cas de test | Étapes / Entrées | Résultat attendu |
|---|---|---|---|---|---|---|
| FONC-GARAGE-01 | Cypress – Garage (`tests_fonctionnels/garage.cy.js`) | Fonctionnel UI (E2E) | Page garage | Page garage se charge correctement | Connexion API, visiter `/html/garage.html` | `<title>` contient "Garage" ; `<header>` visible |
| FONC-GARAGE-02 | Cypress – Garage (`tests_fonctionnels/garage.cy.js`) | Fonctionnel UI (E2E) | Page garage | Titre de section visible | Page chargée | `<h2>` "Motos en cours de production" visible |
| FONC-GARAGE-03 | Cypress – Garage (`tests_fonctionnels/garage.cy.js`) | Fonctionnel UI (E2E) | Page garage | Bouton "Ajouter une moto" visible | Page chargée | `#btn-ajouter-moto` présent et visible |
| FONC-GARAGE-04 | Cypress – Garage (`tests_fonctionnels/garage.cy.js`) | Fonctionnel UI (E2E) | Page garage | Des motos sont affichées | Attendre le chargement | Au moins 1 élément `.carte-moto` présent |
| FONC-GARAGE-05 | Cypress – Garage (`tests_fonctionnels/garage.cy.js`) | Fonctionnel UI (E2E) | Page garage | Chaque moto affiche un modèle | Inspecter la première carte | `.carte-moto-nom` présent dans la carte |
| FONC-GARAGE-06 | Cypress – Garage (`tests_fonctionnels/garage.cy.js`) | Fonctionnel UI (E2E) | Page garage | Formulaire d'ajout masqué par défaut | Page chargée | `#form-ajouter-moto` non visible |
| FONC-GARAGE-07 | Cypress – Garage (`tests_fonctionnels/garage.cy.js`) | Fonctionnel UI (E2E) | Page garage | Clic sur "Ajouter" affiche le formulaire | Cliquer sur `#btn-ajouter-moto` | Formulaire visible avec les champs requis |
| FONC-GARAGE-08 | Cypress – Garage (`tests_fonctionnels/garage.cy.js`) | Fonctionnel UI (E2E) | Page garage | Formulaire contient les modèles disponibles | Ouvrir le formulaire | `<select>` contient au moins 1 `<option>` |

## 7 Cadre du test

### 7.1 Conditions de test

-   Docker Desktop installé et démarré
-   Node.js 20+ et npm installés
-   Dépendances installées : `npm install`
-   Pour les tests d'intégration : ports 3001 (API test) et 3307 (MySQL test) libres
-   Pour les tests fonctionnels : ports 8080 (client) et 3000 (API) libres
-   Base de données de test initialisée avec `server/data/database-test.sql`

### 7.2 Classification des défauts

Les défauts constatés seront classés selon leur gravité d'après l'échelle suivante:

| No | Catégorie de défauts | Description |
| --- | --- | --- |
| <span style="color:green">0</span> | Sans erreur | Irréprochable et conforme aux exigences |
| 1 | Défaut insignifiant | Utilisation possible et utilité avérée ; aucun défaut ne devrait toutefois survenir |
| 2 | Défaut léger | Utilisation possible ; l'utilité n'est que légèrement réduite |
| 3 | Défaut grave | Utilisation encore possible ; l'utilité est très limitée |
| <span style="color:red">4</span> | Défaut critique | Inutilisable ; les fonctionnalités principales ne sont pas assurées ; impossibilité d'assumer la responsabilité de la mise en service |

## 8. Clôture des tests

### 8.1 Critères de sortie

-   100 % des critères d'acceptation couverts (tests unitaires, intégration, E2E, conformité)
-   Aucun défaut bloquant ou critique (niveau 3 ou 4) ouvert
-   Protocole de test rédigé et daté
-   Risque résiduel accepté

### 8.2 Suivi et métriques

-   Taux de succès/échec par type de test
-   Nombre de défauts par sévérité
-   Couverture des cas d'utilisation (CU-01 et CU-02)
-   Nombre de violations ESLint

### 8.3 Livrables finaux

-   [Concept de test](./03_ConceptDeTest.md) (ce document)
-   [Protocole de test](./04_ProtocoleDeTest.md) — résultats datés
-   Code des tests : `tests_unitaires/`, `tests_integration/`, `tests_fonctionnels/`
-   Configuration de conformité : `eslint.config.js`