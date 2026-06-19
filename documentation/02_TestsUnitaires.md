# Tests Unitaires - HyperByke

## 📋 Table des matières
1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Exécuter les tests](#exécuter-les-tests)
4. [Structure des tests](#structure-des-tests)
5. [Tests inclus](#tests-inclus)
6. [Ajouter de nouveaux tests](#ajouter-de-nouveaux-tests)

---

## 📖 Introduction

Ce document explique comment configurer et exécuter les tests unitaires du projet **HyperByke** avec **Jest**.

Les tests unitaires valident les fonctions côté client (utilitaires) en testant chaque fonction avec différentes entrées (input/output) pour s'assurer qu'elles fonctionnent correctement.

**Outil utilisé** : Jest (framework de test JavaScript)

---

## 🔧 Installation

### Prérequis
- **Node.js** (version 16+) et **npm**

### Étapes d'installation

#### 1. Installer les dépendances

À la racine du projet :
```bash
npm install
```

Cela installe Jest et les dépendances nécessaires.

#### 2. Vérifier l'installation

```bash
npx jest --version
```

Vous devez voir la version de Jest (ex: `29.7.0`)

---

## 🚀 Exécuter les tests

### Exécuter tous les tests

```bash
npm test
```

### Exécuter les tests en mode watch (recharge automatique)

```bash
npm run test:watch
```

Idéal pendant le développement : les tests se relancent automatiquement à chaque modification de fichier.

### Exécuter avec couverture de code

```bash
npm run test:coverage
```

Affiche le pourcentage de code testé (lignes couvertes, branches, fonctions).

### Exécuter avec détails verbeux

```bash
npm run test:verbose
```

Affiche plus de détails sur chaque test.

---

## 📁 Structure des tests

```
HyperByke/
├── jest.config.js                 # Configuration Jest
├── package.json                   # Dépendances npm
├── client/
│   └── service/
│       └── utils.js               # Fonctions utilitaires à tester
├── tests_unitaires/
│   └── utils.spec.js              # Tests des utilitaires
└── documentation/
    └── 02_TestsUnitaires.md       # Ce fichier
```

### Conventions de nommage

- **Fichiers de test** : `*.spec.js` (ex: `utils.spec.js`)
- **Fichiers testés** : dans `client/service/` ou autre répertoire source
- **Dossier des tests** : `tests_unitaires/`

---

## ✅ Tests inclus

### Fonction 1 : `formaterNomClient(prenom, nom)`

**Localisation** : [client/service/utils.js](../client/service/utils.js)

**Description** : Formate un prénom et un nom au format "Prenom NOM".

**Tests** :
- ✅ Cas nominal (prénom et nom corrects)
- ✅ Gestion de la casse (majuscules, minuscules, mixte)
- ✅ Gestion des espaces (trim, espaces multiples)
- ✅ Types invalides (null, undefined, nombre, objet)
- ✅ Chaînes vides (vides ou espaces uniquement)

**Exemples de tests** :
```javascript
formaterNomClient('jean', 'dupont')        // ✅ 'Jean DUPONT'
formaterNomClient('MARIE', 'LEBLANC')      // ✅ 'Marie LEBLANC'
formaterNomClient('  pierre  ', 'martin')  // ✅ 'Pierre MARTIN'
formaterNomClient(null, 'dupont')          // ✅ null
formaterNomClient('jean', 123)             // ✅ null
formaterNomClient('   ', 'dupont')         // ✅ null
```

### Fonction 2 : `extraireNumeroSerieMoto(input)`

**Localisation** : [client/service/utils.js](../client/service/utils.js)

### Fonction 2 : `formaterNomPiece(nomPiece)`

**Description** : Formate le nom d'une pièce de moto (première lettre majuscule, reste minuscules). Utilisé pour les pièces de la base de données.

**Tests** :
- ✅ Cas nominal (minuscules, majuscules, casse mixte)
- ✅ Noms composés (pneu avant, frein arrière)
- ✅ Gestion des espaces et trim
- ✅ Types invalides (null, undefined, nombre, objet, tableau)
- ✅ Chaînes vides

**Exemples de tests** :
```javascript
formaterNomPiece('guidon')            // ✅ 'Guidon'
formaterNomPiece('SELLE')             // ✅ 'Selle'
formaterNomPiece('  pneu avant  ')    // ✅ 'Pneu avant'
formaterNomPiece(null)                // ✅ null
```

---

## 📝 Résumé des tests

| Test | Fonction | ID | Résultat |
|------|----------|-------|----------|
| Cas nominal - formatage simple | `formaterNomClient` | UNIT-UTILS-01 | ✅ |
| Gestion de la casse | `formaterNomClient` | UNIT-UTILS-02/03 | ✅ |
| Gestion des espaces | `formaterNomClient` | UNIT-UTILS-04/05 | ✅ |
| Types invalides | `formaterNomClient` | UNIT-UTILS-06-13 | ✅ |
| Chaînes vides | `formaterNomClient` | UNIT-UTILS-14-18 | ✅ |
| **Total formaterNomClient** | | **18 tests** | ✅ |
| | | | |
| Cas nominal - pièces | `formaterNomPiece` | UNIT-PIECE-01 | ✅ |
| Gestion de la casse | `formaterNomPiece` | UNIT-PIECE-02/03 | ✅ |
| Noms composés | `formaterNomPiece` | UNIT-PIECE-04/08 | ✅ |
| Types invalides | `formaterNomPiece` | UNIT-PIECE-09-14 | ✅ |
| Chaînes vides | `formaterNomPiece` | UNIT-PIECE-15/16 | ✅ |
| **Total formaterNomPiece** | | **18 tests** | ✅ |
| | | | |
| **TOTAL GÉNÉRAL** | | **36 tests** | ✅ |

---

## 🆕 Ajouter de nouveaux tests

### Créer un fichier de test

1. Créez un fichier dans `tests_unitaires/` nommé `monFichier.spec.js`

2. Importez les fonctions à tester :
```javascript
import { maFonction } from '../client/service/utils.js';
```

3. Structurez vos tests avec `describe()` et `it()` :
```javascript
describe('Ma fonction', () => {
    it('devrait faire quelque chose', () => {
        expect(maFonction('input')).toBe('output');
    });
});
```

### Exemple complet

```javascript
import { formaterNomClient } from '../client/service/utils.js';

describe('formaterNomClient - Cas supplémentaires', () => {

    it('UNIT-UTILS-19: gère les accents correctement', () => {
        expect(formaterNomClient('josé', 'garcía')).toBe('José GARCÍA');
    });

    it('UNIT-UTILS-20: gère les tirets dans les noms', () => {
        expect(formaterNomClient('jean-paul', 'dupont-martin')).toBe('Jean-paul DUPONT-MARTIN');
    });

});
```

### Matchers Jest courants

```javascript
expect(valeur).toBe(valeur_exacte);              // Égalité stricte
expect(valeur).toEqual(objet);                   // Égalité profonde
expect(valeur).toBeNull();                       // est null
expect(valeur).toBeUndefined();                  // est undefined
expect(valeur).toBeDefined();                    // n'est pas undefined
expect(tableau).toContain(element);              // contient élément
expect(fonction).toThrow();                      // lève une exception
expect(string).toMatch(/regex/);                 // correspond à regex
```

---

## 🐛 Dépannage

### Jest ne trouve pas les fichiers

**Erreur** :
```
Cannot find module '../client/service/utils.js'
```

**Solution** :
- Vérifiez les chemins relatifs dans les imports
- Utilisez des chemins relatifs depuis `tests_unitaires/`

### Tests ne s'exécutent pas

**Erreur** :
```
No tests found
```

**Solution** :
- Vérifiez que les fichiers finissent par `.spec.js`
- Vérifiez que `jest.config.js` pointe le bon dossier (`roots: ['<rootDir>/tests_unitaires']`)

### Module ES6 non supporté

**Erreur** :
```
SyntaxError: Cannot use import statement outside a module
```

**Solution** :
- Vérifiez que `"type": "module"` est dans `package.json`
- Vérifiez que `jest.config.js` exporte avec `export default`

---

## 📚 Ressources

- **Jest Documentation** : https://jestjs.io/docs/getting-started
- **Jest Matchers** : https://jestjs.io/docs/expect
- **Testing Best Practices** : https://jestjs.io/docs/testing-frameworks

---

## 📋 Checklist de vérification

- [ ] Node.js et npm sont installés (`node --version`)
- [ ] Jest est installé (`npx jest --version`)
- [ ] Les fichiers `*.spec.js` sont dans `tests_unitaires/`
- [ ] Le fichier `jest.config.js` existe à la racine
- [ ] Le fichier `package.json` existe à la racine avec `"type": "module"`
- [ ] Les imports utilisent les bons chemins relatifs
- [ ] `npm test` s'exécute sans erreur
- [ ] Tous les tests passent (36/36 ✅)

---

**Date de création** : 24 avril 2026  
**Dernière mise à jour** : 24 avril 2026  
**Auteur** : Arnaud Ramirez
