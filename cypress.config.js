/**
 * @fileoverview Configuration Cypress pour les tests fonctionnels HyperByke
 * @author Arnaud Ramirez
 * @date 30.04.2026
 * @version 1.0.0
 */

import { defineConfig } from 'cypress';

export default defineConfig({
    e2e: {
        baseUrl: 'http://localhost:8080',
        specPattern: 'tests_fonctionnels/**/*.cy.js',
        supportFile: false,
        viewportWidth: 1280,
        viewportHeight: 720,
        defaultCommandTimeout: 8000,
        video: false,
        screenshotOnRunFailure: true,
    },
});
