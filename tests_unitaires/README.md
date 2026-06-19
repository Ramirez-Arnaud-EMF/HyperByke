# Tests Unitaires - HyperByke

## 📁 Contenu

Ce dossier contient tous les tests unitaires du client HyperByke.

### Fichiers

- **`utils.spec.js`** : Tests des fonctions utilitaires du client
  - `formaterNomClient()` - 18 tests
  - `formaterNomPiece()` - 18 tests
  - **Total : 36 tests**

## 🚀 Exécution

```bash
# À la racine du projet
npm install
npm test
```

## 📖 Documentation complète

Voir [02_TestsUnitaires.md](../documentation/02_TestsUnitaires.md) pour plus de détails.

## ✅ Tests actuels

| Fonction | Tests | État |
|----------|-------|------|
| `formaterNomClient` | 18 | ✅ |
| `formaterNomPiece` | 18 | ✅ |

## 🆕 Ajouter des tests

1. Créez un nouveau fichier `nomFichier.spec.js`
2. Importez les fonctions à tester
3. Structurez avec `describe()` et `it()`
4. Lancez `npm test`

Exemple :
```javascript
import { fonction } from '../client/service/utils.js';

describe('Mes tests', () => {
    it('test 1', () => {
        expect(fonction('input')).toBe('output');
    });
});
```

---

**Dernière mise à jour** : 24 avril 2026
