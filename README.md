# 294 / 295 - HyperByke

---

## Introduction

HyperByke est une application de gestion destinée aux garages de motos, principalement utilisée par les garagistes et le personnel logistique. Elle a pour objectif d’optimiser la gestion de la fabrication des motos, des pièces détachées et des stocks. L’application permet de suivre en temps réel l’avancement des motos en cours de fabrication, avec une liste des pièces nécessaires et la possibilité de notifier leur assemblage. En ce qui concerne le stock, HyperByke se charge de la mise à jour automatique des inventaires à chaque consommation de pièces, garantissant ainsi une gestion simplifiée et fluide. De plus, elle permet de passer des commandes pour réapprovisionner les stocks lorsqu’un seuil critique est atteint.

---


## Utilisation

Voici le lien vers le site : https://arnaudramirez.emf-informatique.ch/index.html

Un compte Garagiste / username : jdupont    password : pass1234


Un compte Logistique / username : mleblanc    password : securepass

### Lancer avec Docker Compose (3 conteneurs)

Le projet peut etre lance avec 3 conteneurs:
- client: Nginx qui sert le frontend
- server: Node.js/Express pour l'API
- mysql: base de donnees MySQL

Prerequis:
- Docker Desktop installe et demarre

Commande de demarrage:

```bash
docker compose up --build -d
```

Acces:
- Frontend: http://localhost:8080
- API directe: http://localhost:3000/api
- Swagger: http://localhost:8080/api-docs
- MySQL: localhost:3306

Arret:

```bash
docker compose down
```

Configuration DB optionnelle:
- Les variables peuvent etre surchargees via un fichier .env a la racine (meme niveau que docker-compose.yml)
- Variables supportees: DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET, JWT_EXPIRATION
- DB_HOST est configure automatiquement sur le service mysql dans Docker Compose

## Analyse

### Diagramme de cas d'utilisation

#### Acteurs

- **Utilisateur** : représente toute personne utilisant l’application, avant d’être connectée à un compte.
- **Personnel Logistique** : responsable de la gestion des stocks et du suivi des pièces détachées.
- **Garagiste** : chargé de la production et de l’assemblage des motos.

#### Cas d’utilisation

- **Créer un compte** et **Se connecter**  
  Accessibles à tous les utilisateurs pour accéder à l’application.
- **Consulter la page d’accueil**  
  Point d’entrée commun à tous les utilisateurs.
- **Consulter la liste des pièces restantes à assembler**  
  Permet de suivre l’avancement de la production.
- **Consulter la liste des motos en production**  
  Permet de suivre l’avancement de la production.
- **Ajouter une moto à la production**  
  Fonctionnalité réservée au personnel logistique et aux garagistes pour gérer la fabrication.
- **Consulter une des motos de la liste de production**  
  Fonctionnalité réservée au personnel logistique et aux garagistes pour gérer la fabrication.
- **Marquer une pièce comme assemblée**  
  Permet de notifier l’avancement de l’assemblage.
- **Consulter le stock**  
  Action spécifique au personnel logistique pour assurer la disponibilité des pièces.
- **Modifier la quantité du stock**  
  Action spécifique au personnel logistique.
- **Faire une commande de stock**  
  Action spécifique au personnel logistique.

Cette structuration permet de mieux visualiser les responsabilités et les droits de chaque acteur dans l’application HyperByke.

---

### Maquettes

Chaque maquette correspond à une fonctionnalité clé :

- **Page d’accueil** : Vue générale accessible à tous les utilisateurs après connexion.
- **Liste des motos en production** : Permet de suivre l’avancement des fabrications en cours.
- **Détail d’une moto** : Affiche les pièces nécessaires à assembler et leur état d’avancement.
- **Gestion du stock** : Réservée au personnel logistique pour consulter, modifier et commander des pièces.
- **Ajout d’une moto à la production** : Formulaire pour lancer la fabrication d’une nouvelle moto.
- **Connexion** : Accès sécurisé à l’application.

Les captures suivantes présentent ces différents écrans :

![Page d’accueil](documentation/image-1.png)

![Liste des motos en production](documentation/image-2.png)

![Détail d’une moto](documentation/image-3.png)

![Gestion du stock](documentation/image-4.png)

![Ajout d’une moto à la production](documentation/image.png)

![Connexion](documentation/image-6.png)

![Création de compte](documentation/image-7.png)

---

### Diagramme d'activité

Voici le Diagramme d'activité. Il montre la connexion avec la partie client, serveur et la base de données :

![Diagramme d'activité](documentation/image-8.png)

---

### Diagramme ER

Voici le Diagramme Entité-Relation de la base de données de HyperByke :

![Diagramme ER](documentation/image-5.png)

**Explication des tables**

- **ConfigurationMoto** : définit les pièces nécessaires par type de moto (modèle).
- **ConstructionMotoPiece** : enregistre les pièces réellement utilisées pour une moto donnée.
- **Moto** : moto réelle en construction ou terminée.
- **Pièce** : stock des pièces.
- **Employé** : avec rôle (logisticien ou garagiste).

**Relations entre les entités**

- **Moto – ConstructionMotoPiece**
  - Une moto utilise plusieurs pièces pour sa construction.
  - Chaque enregistrement de pièce utilisée appartient à une seule moto.
- **Pièce – ConstructionMotoPiece**
  - Une pièce peut être utilisée dans la construction de plusieurs motos.
  - Chaque ligne de ConstructionMotoPiece fait référence à une seule pièce.
- **ConfigurationMoto – Pièce**
  - Une configuration de moto référence une pièce nécessaire à un modèle.
  - Une pièce peut être présente dans plusieurs configurations de motos.
- **ConfigurationMoto – Moto**
  - Une configuration est liée à un type de moto générique (modèle).
  - Un type de moto peut avoir plusieurs lignes de configuration (une par pièce nécessaire).

---

## Conception

### Diagramme de classes client

Voici le Diagramme de classes client, on peut retrouver tous les fichiers HTML, les controllers et les services :

![Diagramme de classes client](documentation/image-9.png)

### Diagramme de classes serveur

Voici le Diagramme de classes serveur qui permet de voir la structure générale du projet avec les différentes routes, services et controllers.

![Diagramme de classes serveur](documentation/image-10.png)

### Diagramme d'interaction

Voici le Diagramme d'interaction. Il montre un garagiste qui veut afficher la liste des motos en production :

![Diagramme d'interaction](documentation/image-11.png)

### Schéma relationnel

Voici le Schéma relationnel réalisé avec MySQL. Il permet de voir les différentes tables.

![Schéma relationnel](documentation/image-12.png)

---

### Conception des tests

Voici la liste des tests que je vais effectuer :

| N°  | Date      | Objectif / Fonctionnalité testée                                 | Méthode / Étapes principales                                                                 | Résultat attendu                                      |
|-----|-----------|-------------------------------------------------------------------|---------------------------------------------------------------------------------------------|-------------------------------------------------------|
| 1   | 11.06.25  | Se connecter en tant que garagiste                               | Saisir identifiants garagiste, valider                                                      | Accès à l’interface garagiste, message de bienvenue   |
| 2   | 11.06.25  | Se connecter en tant que logisticien                             | Saisir identifiants logisticien, valider                                                    | Accès à l’interface logisticien, message de bienvenue |
| 3   | 11.06.25  | Ajouter du stock (logisticien)                                  | Aller sur la page stock, cliquer « Ajouter », remplir formulaire, valider                   | Nouvelle pièce ajoutée au stock, confirmation         |
| 4   | 11.06.25  | Modifier la quantité de stock (logisticien)                     | Aller sur la page stock, sélectionner une pièce, modifier quantité, valider                 | Quantité mise à jour, confirmation affichée           |
| 5   | 11.06.25  | Voir la sous-page des motos (garagiste)                         | Aller sur la liste des motos, cliquer sur une moto                                          | Affichage du détail de la moto sélectionnée           |
| 6   | 11.06.25  | Notifier le montage d’une pièce sur une moto (garagiste)        | Sur le détail d’une moto, cliquer « Marquer comme assemblée » sur une pièce                 | Pièce marquée comme assemblée, état mis à jour        |
| 7   | 11.06.25  | Ajouter une moto à la liste des motos (garagiste)               | Aller sur la page d’ajout, remplir le formulaire, valider                                   | Nouvelle moto ajoutée à la liste, confirmation        |
| 8   | 11.06.25  | Afficher le stock (garagiste et logisticien)                    | Aller sur la page stock                                                                     | Liste des pièces et quantités affichée correctement    |

---

## Réalisation

### Descente de code

_Vous décrivez et expliquez une action réalisable dans votre application. Vous pouvez notamment prendre un des cas de votre diagramme des cas d'utilisation. Vous expliquez toutes les étapes du client jusqu'au serveur et la base de données ainsi que le retour vers le client. Vos explications contiennent des extraits de codes pertinents – il ne sert surtout à rien de mettre tout le code dans votre rapport ! Utilisez la Markdown pour vos extraits de code. Côté client, la descente de code illustre les différents éléments de la structure MVC de votre application, les éléments de l'interface, les différents événements, la validation des données et leurs transmissions à la partie serveur. Pour le serveur, la descente de code doit illustrer : les routes, la méthode http utilisée, les codes de retours, la vérification du token JWT, l'accès à la base de données, la validation des données côté serveur._

### Descente de code : Suppression d'une moto

Prenons l’exemple du cas d’utilisation « Supprimer une moto » pour le garagiste. Voici le cheminement complet de la requête, du client jusqu’à la base de données, en passant par le serveur, avec des extraits de code illustratifs.

#### 1. Côté client (garagiste)

Dans l’interface, chaque moto de la liste possède un bouton « Supprimer » :

```html
<!-- Extrait HTML pour chaque moto -->
<li>
  <span>Nom de la moto</span>
  <button class="btn-supprimer" data-id="1">Supprimer</button>
</li>
```

Le contrôleur JS gère l’événement de clic sur le bouton :

```js
// Contrôleur côté client (exemple : client/controllers/motoController.js)
document.querySelectorAll('.btn-supprimer').forEach(btn => {
  btn.addEventListener('click', function() {
    const id = this.getAttribute('data-id');
    if (confirm('Voulez-vous vraiment supprimer cette moto ?')) {
      fetch(`/api/moto/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
      .then(res => {
        if (!res.ok) throw new Error('Erreur lors de la suppression');
        return res.json();
      })
      .then(() => {
        // Rafraîchir la liste des motos après suppression
        getAllMotos();
      })
      .catch(err => alert(err.message));
    }
  });
});

function getAllMotos() {
  fetch('/api/moto/allmotos', {
    headers: { 'Authorization': 'Bearer ' + token }
  })
    .then(res => res.json())
    .then(motos => afficherMotos(motos));
}

function afficherMotos(motos) {
  // Met à jour dynamiquement la liste des motos dans l’interface
}
```

#### 2. Route Express côté serveur

Dans `server/app/routes/motoRoutes.js` :

```js
router.delete("/:id", validateAuthentification(['garagiste']), motoController.deleteMoto);
```

- La route `/api/moto/:id` est protégée par le middleware d’authentification et de rôle.

#### 3. Middleware d’authentification

Dans `server/app/middlewares/validateAuthentification.js` :

```js
// ...existing code...
if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return res.status(403).json({ error: 'Accès refusé : rôle insuffisant' });
}
// ...existing code...
```

#### 4. Contrôleur moto

Dans `server/app/controllers/motoController.js` :

```js
const deleteMoto = async (req, res) => {
  try {
    await motoService.deleteMoto(req.params.id);
    res.status(200).json({ message: 'Moto supprimée' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur lors de la suppression' });
  }
};
```

#### 5. Service moto

Dans `server/app/services/motoService.js` :

```js
const deleteMoto = async (id) => {
  const connexion = await pool.getConnection();
  try {
    await connexion.query('DELETE FROM Moto WHERE pk_moto = ?', [id]);
  } finally {
    if (connexion) connexion.release();
  }
};
```

#### 6. Retour au client

Après la suppression, le client relance la fonction `getAllMotos()` pour rafraîchir la liste. La moto supprimée n’apparaît plus dans l’interface.

---

### Différence entre la conception et l’implémentation

Je trouve le projet plus proche des concepteurs pensés mais il y a quelques différences comme dans le client la barre de progression des motos n'a pas eu le temps d'être finalisée et je n'ai pas eu le temps d'ajouter des couleurs dans tous les tableaux pour alerter quand les valeurs sont basses.

Dans mon client j'ai des contrôleurs en plus que je n'avais pas prévus.
Le serveur est très proche de la conception, il y a juste un ou deux GET ou POST que j'ai dû ajouter.

### Problèmes rencontrés

J'ai eu un problème pour la suppression des pièces dans le client : dans le GET d'une moto dans la liste des pièces, je n'envoyais pas le PK donc je ne pouvais pas savoir le PK de la pièce pour l'utiliser dans la requête pour monter la pièce. J'ai dû ajouter dans le serveur cette partie.

J'ai eu un problème lors de l'hébergement du serveur : j'avais bcrypt d'installé et pas bcryptjs, ce qui a donc posé une erreur.

Sinon je n'ai pas eu d'autre problème majeur.

---

## Réalisation des tests

Voici les tests réalisés :

| N°  | Date      | Objectif / Fonctionnalité testée                                 | Méthode / Étapes principales                                                                 | Résultat attendu                                      | État  | Commentaires / Conclusion                                                                                 | Visa              |
|-----|-----------|-------------------------------------------------------------------|---------------------------------------------------------------------------------------------|-------------------------------------------------------|-------|----------------------------------------------------------------------------------------------------------|-------------------|
| 1   | 11.06.25  | Se connecter en tant que garagiste                               | Saisir identifiants garagiste, valider                                                      | Accès à l’interface garagiste, message de bienvenue   | ✅    | Connexion réussie, interface adaptée au rôle garagiste.                                                  | Arnaud Ramirez    |
| 2   | 11.06.25  | Se connecter en tant que logisticien                             | Saisir identifiants logisticien, valider                                                    | Accès à l’interface logisticien, message de bienvenue | ✅    | Connexion réussie, interface adaptée au rôle logisticien.                                                | Arnaud Ramirez    |
| 3   | 11.06.25  | Ajouter du stock (logisticien)                                  | Aller sur la page stock, cliquer « Ajouter », remplir formulaire, valider                   | Nouvelle pièce ajoutée au stock, confirmation         | ✅    | Ajout de stock fonctionnel, pièce visible dans la liste.                                                  | Arnaud Ramirez    |
| 4   | 11.06.25  | Modifier la quantité de stock (logisticien)                     | Aller sur la page stock, sélectionner une pièce, modifier quantité, valider                 | Quantité mise à jour, confirmation affichée           | ✅    | Modification prise en compte, quantité correcte affichée.                                                 | Arnaud Ramirez    |
| 5   | 11.06.25  | Voir la sous-page des motos (garagiste)                         | Aller sur la liste des motos, cliquer sur une moto                                          | Affichage du détail de la moto sélectionnée           | ✅    | Navigation et affichage des détails de la moto OK.                                                        | Arnaud Ramirez    |
| 6   | 11.06.25  | Notifier le montage d’une pièce sur une moto (garagiste)        | Sur le détail d’une moto, cliquer « Marquer comme assemblée » sur une pièce                 | Pièce marquée comme assemblée, état mis à jour        | ✅    | L’état de la pièce est bien mis à jour dans l’interface.                                                  | Arnaud Ramirez    |
| 7   | 11.06.25  | Ajouter une moto à la liste des motos (garagiste)               | Aller sur la page d’ajout, remplir le formulaire, valider                                   | Nouvelle moto ajoutée à la liste, confirmation        | ✅    | Moto ajoutée, visible dans la liste des motos en production.                                              | Arnaud Ramirez    |
| 8   | 11.06.25  | Afficher le stock (garagiste et logisticien)                    | Aller sur la page stock                                                                     | Liste des pièces et quantités affichée correctement    | ✅    | Affichage correct pour les deux rôles, informations cohérentes.                                            | Arnaud Ramirez    |

---

Screen test 1

![Screen test 1](documentation/image-14.png)

Screen test 2

![Screen test 2](documentation/image-15.png)

Screen test 3

![Screen test 3-1](documentation/image-16.png)
![Screen test 3-2](documentation/image-17.png)

Screen test 4

![Screen test 4-1](documentation/image-18.png)
![Screen test 4-2](documentation/image-19.png)

Screen test 5

![Screen test 5](documentation/image-20.png)

Screen test 6

![Screen test 6-1](documentation/image-20.png)
![Screen test 6-2](documentation/image-21.png)

Screen test 7

![Screen test 7-1](documentation/image-22.png)
![Screen test 7-2](documentation/image-23.png)

Screen test 8

![Screen test 8](documentation/image-24.png)

---

## Conclusion

Dans ce projet j'ai créé un site avec le backend et le frontend pour la gestion d'un garage de motos avec la gestion du stock et la gestion des motos en production. Tout fonctionne sauf certaines couleurs dans les tableaux et les barres de progression sur l'assemblage des motos, je n'ai pas eu le temps de finaliser. Je pense que mon projet n'est pas mauvais mais je me suis mal organisé et j'ai pris pas mal de temps à faire les schémas, ce qui a fait que j'ai dû faire beaucoup de choses en peu de temps. Je trouve que j'ai trop utilisé de l'IA pour ce projet en ayant conscience de ce que l'IA a fait et que je suis capable de le faire moi aussi. Pour améliorer cela, j'aurais dû me faire un planning et travailler à la maison, ce qui m'aurait permis d'avoir plus de temps et d'être tranquille pour réaliser le projet. Ce projet était très intéressant et m'a permis de comprendre beaucoup de choses entre les API, les serveurs, la création de client et même sur l'hébergement.

---

## Conclusions du module 295 – Tests et qualité logicielle

### Ce que j'ai aimé

J'ai vraiment apprécié **Cypress** pour les tests fonctionnels. Le fait de voir le navigateur s'ouvrir, de pouvoir observer chaque action comme si c'était un vrai utilisateur, et de voir les tests passer en temps réel, c'est très satisfaisant. On comprend immédiatement ce qui se passe et pourquoi un test échoue.

J'ai aussi beaucoup aimé le concept de la **séparation des environnements** avec deux bases de données distinctes (production et test). C'est une approche que je retrouverai forcément dans le monde professionnel et qui évite de nombreux problèmes.

Enfin, les **tests d'intégration avec Vitest** m'ont plu parce qu'ils testent vraiment l'application réelle : un vrai appel HTTP vers un vrai serveur avec une vraie base de données. On est sûr que l'application fonctionne, pas seulement que le code compilerait.

### Ce que j'ai moins aimé

La partie la plus difficile a été la **configuration de l'environnement Docker pour les tests**. Quand il y a une erreur (comme le mauvais port ou le mauvais fichier SQL), les messages d'erreur ne sont pas toujours clairs et il faut investiguer longtemps pour trouver la source du problème. Par exemple, l'erreur ECONNRESET était causée par un simple `PORT: 3001` alors qu'il fallait `PORT: 3000` – ce genre de bug de configuration est très frustrant.

J'ai aussi trouvé que la documentation des tests (concept de test HERMES, protocole) demande beaucoup de rigueur et de temps. Écrire des tableaux de cas de test détaillés avec préconditions et résultats attendus est nécessaire mais fastidieux.

### Ce que j'ai appris

- La **pyramide des tests** et pourquoi on a beaucoup de tests unitaires, moins d'intégration, et peu de tests E2E : c'est une question de vitesse, de coût et de fiabilité.
- La différence concrète entre **Jest** (tests unitaires, fonctions pures) et **Vitest** (tests d'intégration avec HTTP) et **Cypress** (tests E2E dans un navigateur réel).
- Comment isoler un environnement de test avec **Docker** : une deuxième base de données, un deuxième serveur sur un port différent, initialisé avec des données de test contrôlées.
- L'importance de l'**analyse statique** (ESLint) : les règles `no-var` et `eqeqeq` semblent simples, mais elles évitent des catégories entières de bugs causés par le comportement particulier de JavaScript avec les types et la portée.
- Comment structurer une documentation de test professionnelle selon le modèle **HERMES** avec un concept de test (stratégie, cas de test) et un protocole (résultats datés, interprétation, conclusions).

### Estimation de mon propre travail

Je pense que mon travail sur ce module est **correct**. Les 65 tests passent tous (36 unitaires, 14 intégration, 15 fonctionnels, 0 violation de conformité) et la documentation est complète et structurée.

Les points positifs :
- Tous les tests fonctionnent et couvrent les deux cas d'utilisation principaux.
- La séparation des environnements est bien faite avec une base de données de test dédiée.
- La documentation suit le modèle HERMES demandé en cours.

Les points à améliorer :
- La couverture des tests pourrait être plus étendue : je n'ai testé que 2 endpoints sur les routes disponibles (login et stock), et pas les routes moto.
- J'aurais pu écrire plus de tests d'intégration couvrant des cas d'erreur plus variés (ex : token expiré, erreur base de données).
- Avec plus de temps, j'aurais ajouté une pipeline CI/CD pour automatiser l'exécution des tests à chaque push.

Dans l'ensemble, je me donne une note de **4/6** : le travail demandé est réalisé et fonctionnel, mais la couverture de tests pourrait être plus ambitieuse.