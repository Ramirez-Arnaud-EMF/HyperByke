/**
 * @fileoverview Configuration Vitest pour les tests d'intégration HyperByke
 * @author Arnaud Ramirez
 * @date 30.04.2026
 * @version 1.0.0
 */

import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        include: ['tests_integration/**/*.spec.js'],
        testTimeout: 10000,
        reporters: ['verbose'],
    },
});
