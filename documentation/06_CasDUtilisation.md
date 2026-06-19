# Cas d'utilisation – HyperByke

_Version 1.0 — Arnaud Ramirez_

## 1. Acteurs

| Acteur | Description |
|---|---|
| **Utilisateur non connecté** | Toute personne accédant à l'application sans session active. Peut uniquement se connecter. |
| **Garagiste** | Employé chargé de la production et de l'assemblage des motos. Accède aux pages garage et détail. |
| **Logisticien** | Employé responsable de la gestion du stock de pièces. Accède à la page logistique. |

> Les rôles `garagiste` et `logisticien` sont définis en base de données dans la table `Employer` et transmis dans le token JWT à la connexion.

---

## 2. Diagramme des cas d'utilisation

```
                     ┌───────────────────────────────────────────┐
                     │              Application HyperByke         │
                     │                                           │
  ┌──────────┐       │  ┌─────────────────────┐                  │
  │Utilisateur│──────►  │  CU-00 Se connecter  │                  │
  │   non    │       │  └─────────────────────┘                  │
  │ connecté │       │                                           │
  └──────────┘       │                                           │
                     │  ┌───────────────────────────────────┐    │
  ┌──────────┐       │  │         Espace Garagiste           │    │
  │          │──────►│  │  CU-01 Consulter liste motos       │    │
  │Garagiste │──────►│  │  CU-02 Consulter détail moto       │    │
  │          │──────►│  │  CU-03 Ajouter une moto            │    │
  │          │──────►│  │  CU-04 Marquer une pièce assemblée │    │
  └──────────┘       │  │  CU-05 Consulter le stock          │    │
                     │  └───────────────────────────────────┘    │
                     │                                           │
                     │  ┌───────────────────────────────────┐    │
  ┌──────────┐       │  │        Espace Logisticien          │    │
  │Logisti-  │──────►│  │  CU-05 Consulter le stock          │    │
  │ cien     │──────►│  │  CU-06 Modifier la quantité stock  │    │
  │          │──────►│  │  CU-07 Commander du stock          │    │
  └──────────┘       │  └───────────────────────────────────┘    │
                     └───────────────────────────────────────────┘
```

---

## 3. Récapitulatif des cas d'utilisation

| ID | Cas d'utilisation | Acteur(s) | Endpoint(s) impliqué(s) |
|---|---|---|---|
| CU-00 | Se connecter | Utilisateur non connecté | `POST /api/authentification/login` |
| CU-01 | Consulter la liste des motos en production | Garagiste | `GET /api/moto/allmotos` |
| CU-02 | Consulter le détail d'une moto | Garagiste | `GET /api/moto/moto/:id` |
| CU-03 | Ajouter une moto à la production | Garagiste | `POST /api/moto/addmoto` |
| CU-04 | Marquer une pièce comme assemblée | Garagiste | `DELETE /api/moto/moto/:id/piece/:pieceId` |
| CU-05 | Consulter le stock de pièces | Garagiste, Logisticien | `GET /api/stock/allstock` |
| CU-06 | Modifier la quantité d'une pièce en stock | Logisticien | `PUT /api/stock/updatestock/:id` |
| CU-07 | Commander du stock (réapprovisionner) | Logisticien | `PUT /api/stock/addstock/:id` |

---

## 4. Description détaillée des cas d'utilisation

---

### CU-00 – Se connecter

| Champ | Valeur |
|---|---|
| **Acteur principal** | Utilisateur non connecté |
| **Précondition** | L'utilisateur n'est pas connecté ; l'application est démarrée |
| **Déclencheur** | L'utilisateur accède à `login.html` |

**Scénario nominal :**

1. L'utilisateur saisit son `username` et son `password` dans le formulaire de connexion.
2. Le système envoie une requête `POST /api/authentification/login`.
3. Le serveur vérifie les identifiants contre la table `Employer` (bcrypt).
4. Le serveur retourne un token JWT contenant le `username` et le `role`.
5. Le client stocke le token, le rôle et le username dans le `localStorage`.
6. L'utilisateur est redirigé vers la page correspondant à son rôle (`garage.html` ou `logistique.html`).

**Scénarios alternatifs :**

| Condition | Résultat |
|---|---|
| Identifiants incorrects | HTTP 401 — message d'erreur affiché, aucune redirection |
| Champs manquants | HTTP 400 — message d'erreur, formulaire non soumis |
| Utilisateur inexistant | HTTP 401 — message d'erreur générique |

---

### CU-01 – Consulter la liste des motos en production

| Champ | Valeur |
|---|---|
| **Acteur principal** | Garagiste |
| **Précondition** | Garagiste connecté (token JWT valide dans `localStorage`) |
| **Déclencheur** | Chargement de `garage.html` |

**Scénario nominal :**

1. La page `garage.html` se charge et le contrôleur récupère le token depuis le `localStorage`.
2. Le système envoie une requête `GET /api/moto/allmotos` avec le token en en-tête.
3. Le middleware vérifie le token et le rôle (`garagiste`).
4. Le serveur interroge la table `Moto` et retourne la liste des motos.
5. Le client affiche les motos sous forme de cartes (modèle, client, date de livraison).

**Scénarios alternatifs :**

| Condition | Résultat |
|---|---|
| Token absent ou expiré | HTTP 401 — redirection vers `login.html` |
| Rôle non autorisé | HTTP 403 — message d'erreur |

---

### CU-02 – Consulter le détail d'une moto

| Champ | Valeur |
|---|---|
| **Acteur principal** | Garagiste |
| **Précondition** | Garagiste connecté ; au moins une moto en production |
| **Déclencheur** | Clic sur une carte moto dans `garage.html` |

**Scénario nominal :**

1. Le garagiste clique sur une moto dans la liste.
2. L'application navigue vers `detail.html?id=<pk_moto>`.
3. Le système envoie une requête `GET /api/moto/moto/:id`.
4. Le serveur retourne les informations de la moto ainsi que la liste des pièces à assembler (issues de `tr_configurationMoto_piece` moins celles déjà dans `tr_moto_piece`).
5. Le client affiche le détail : modèle, client, date de livraison et la liste des pièces restantes.

---

### CU-03 – Ajouter une moto à la production

| Champ | Valeur |
|---|---|
| **Acteur principal** | Garagiste |
| **Précondition** | Garagiste connecté ; au moins un modèle (`ConfigurationMoto`) disponible |
| **Déclencheur** | Clic sur « Ajouter une moto » dans `garage.html` |

**Scénario nominal :**

1. Le garagiste clique sur « Ajouter une moto ».
2. Le formulaire d'ajout s'affiche (sélection du modèle, nom du client, date de livraison).
3. Le garagiste remplit le formulaire et le soumet.
4. Le middleware `validateMoto` valide les champs.
5. Le système envoie une requête `POST /api/moto/addmoto`.
6. Le serveur insère la moto dans la table `Moto` et initialise les pièces à assembler dans `tr_moto_piece`.
7. La liste des motos est rafraîchie.

**Scénarios alternatifs :**

| Condition | Résultat |
|---|---|
| Champs manquants ou invalides | HTTP 400 — message de validation affiché |

---

### CU-04 – Marquer une pièce comme assemblée

| Champ | Valeur |
|---|---|
| **Acteur principal** | Garagiste |
| **Précondition** | Garagiste connecté ; détail d'une moto ouvert (`detail.html`) ; pièces restantes à assembler |
| **Déclencheur** | Clic sur le bouton « Assembler » d'une pièce |

**Scénario nominal :**

1. Le garagiste visualise les pièces restantes à assembler sur la moto.
2. Il clique sur « Assembler » pour une pièce.
3. Le système envoie une requête `DELETE /api/moto/moto/:id/piece/:pieceId`.
4. Le serveur supprime l'entrée dans `tr_moto_piece` et décrémente `quantiteStock` dans la table `Piece`.
5. La liste des pièces est mise à jour ; la pièce assemblée disparaît.

**Scénarios alternatifs :**

| Condition | Résultat |
|---|---|
| Stock insuffisant | HTTP 400 — message d'erreur, action annulée |
| Pièce déjà assemblée | HTTP 400 — message d'erreur |

---

### CU-05 – Consulter le stock de pièces

| Champ | Valeur |
|---|---|
| **Acteur principal** | Garagiste, Logisticien |
| **Précondition** | Utilisateur connecté avec un rôle autorisé |
| **Déclencheur** | Chargement de `logistique.html` (logisticien) ou consultation depuis le contexte garagiste |

**Scénario nominal :**

1. Le système envoie une requête `GET /api/stock/allstock` avec le token.
2. Le middleware vérifie le token et accepte les rôles `garagiste` et `logisticien`.
3. Le serveur interroge la table `Piece` et retourne la liste des pièces avec leur `quantiteStock`.
4. Le client affiche le tableau des pièces (nom, quantité en stock).

---

### CU-06 – Modifier la quantité d'une pièce en stock

| Champ | Valeur |
|---|---|
| **Acteur principal** | Logisticien |
| **Précondition** | Logisticien connecté ; page `logistique.html` affichée |
| **Déclencheur** | Saisie d'une nouvelle quantité et validation dans le tableau des stocks |

**Scénario nominal :**

1. Le logisticien saisit la nouvelle quantité pour une pièce dans le champ dédié.
2. Il valide la modification.
3. Le middleware `validateStock` vérifie que la valeur est un nombre positif.
4. Le système envoie une requête `PUT /api/stock/updatestock/:id { quantiteStock }`.
5. Le serveur met à jour `quantiteStock` dans la table `Piece`.
6. Le tableau est rafraîchi avec la nouvelle valeur.

**Scénarios alternatifs :**

| Condition | Résultat |
|---|---|
| Valeur non numérique ou négative | HTTP 400 — message de validation |
| Pièce inexistante | HTTP 404 — message d'erreur |

---

### CU-07 – Commander du stock (réapprovisionner)

| Champ | Valeur |
|---|---|
| **Acteur principal** | Logisticien |
| **Précondition** | Logisticien connecté ; une pièce présente un stock insuffisant |
| **Déclencheur** | Clic sur « Commander » pour une pièce dans `logistique.html` |

**Scénario nominal :**

1. Le logisticien identifie une pièce dont le stock est bas.
2. Il saisit la quantité à commander et confirme.
3. Le middleware `validateStock` valide la quantité.
4. Le système envoie une requête `PUT /api/stock/addstock/:id { quantiteStock }`.
5. Le serveur additionne la quantité commandée au `quantiteStock` existant dans la table `Piece`.
6. Le tableau est rafraîchi avec le nouveau stock.

**Scénarios alternatifs :**

| Condition | Résultat |
|---|---|
| Quantité invalide (≤ 0 ou non numérique) | HTTP 400 — message de validation |
