/**
 * @fileoverview Configuration ESLint (flat config) pour le projet HyperByke
 * @author Arnaud Ramirez
 * @date 30.04.2026
 * @version 1.0.0
 *
 * @description
 * Deux vérifications spécifiques de conformité du code :
 *
 * 1. no-var   : Interdit l'utilisation de `var`. Impose `let` ou `const`.
 *               Raison : `var` a une portée de fonction et est source de bugs ;
 *               `let`/`const` ont une portée de bloc, plus sûrs et modernes.
 *
 * 2. eqeqeq  : Interdit `==` et `!=`. Impose `===` et `!==`.
 *               Raison : l'opérateur `==` effectue des conversions de types implicites
 *               pouvant causer des comportements inattendus (ex: 0 == false → true).
 */

export default [
    {
        // Fichiers concernés par les règles
        files: [
            'client/service/**/*.js',
            'client/controller/**/*.js',
            'server/app/**/*.js',
            'server/server.js',
        ],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
        },
        rules: {
            /**
             * Règle 1 : Interdire var
             * Niveau : error (le code doit être corrigé, pas seulement avertissement)
             * Documentation : https://eslint.org/docs/rules/no-var
             */
            'no-var': 'error',

            /**
             * Règle 2 : Imposer l'égalité stricte (=== et !==)
             * Niveau : error
             * Option "always" : toujours utiliser === sauf pour null (comparaison null == undefined)
             * Documentation : https://eslint.org/docs/rules/eqeqeq
             */
            'eqeqeq': ['error', 'always'],
        },
    },
];
