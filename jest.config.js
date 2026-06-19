/**
 * @fileoverview Configuration Jest pour les tests unitaires du client HyperByke
 * @author Arnaud Ramirez
 * @date 24.04.2026
 */

export default {
    testEnvironment: 'node',
    roots: ['<rootDir>/tests_unitaires'],
    testMatch: ['**/*.spec.js'],
    collectCoverageFrom: [
        'client/service/**/*.js',
        '!client/service/config.js'
    ],
    transform: {}
};
