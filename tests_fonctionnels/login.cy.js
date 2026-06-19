/**
 * @fileoverview Tests fonctionnels - Cas d'utilisation : Connexion (Login)
 * @author Arnaud Ramirez
 * @date 30.04.2026
 * @version 1.0.0
 *
 * @description
 * Teste le cas d'utilisation "Se connecter" de l'application HyperByke.
 * Prérequis : l'application doit être démarrée via :
 *   docker compose up -d --build
 * puis accessible sur http://localhost:8080
 */

describe('CU-01 : Se connecter', () => {

    beforeEach(() => {
        // Vider le localStorage avant chaque test
        cy.clearLocalStorage();
        cy.visit('/html/login.html');
    });

    // ========== Connexion réussie ==========
    it('FONC-LOGIN-01: connexion réussie avec un compte garagiste valide', () => {
        cy.get('#username').type('jdupont');
        cy.get('#password').type('pass1234');
        cy.get('#loginForm').submit();

        // Vérifie que le token est stocké dans le localStorage
        cy.window().its('localStorage').invoke('getItem', 'hyperbyke_token')
            .should('not.be.null')
            .and('match', /^[\w-]+\.[\w-]+\.[\w-]+$/); // format JWT
    });

    it('FONC-LOGIN-02: connexion réussie avec un compte logisticien valide', () => {
        cy.get('#username').type('mleblanc');
        cy.get('#password').type('securepass');
        cy.get('#loginForm').submit();

        cy.window().its('localStorage').invoke('getItem', 'hyperbyke_role')
            .should('eq', 'logisticien');
    });

    it('FONC-LOGIN-03: après connexion, le rôle garagiste est bien stocké', () => {
        cy.get('#username').type('jdupont');
        cy.get('#password').type('pass1234');
        cy.get('#loginForm').submit();

        cy.window().its('localStorage').invoke('getItem', 'hyperbyke_role')
            .should('eq', 'garagiste');

        cy.window().its('localStorage').invoke('getItem', 'hyperbyke_username')
            .should('eq', 'jdupont');
    });

    // ========== Connexion échouée ==========
    it('FONC-LOGIN-04: affiche un message d\'erreur avec un mauvais mot de passe', () => {
        cy.get('#username').type('jdupont');
        cy.get('#password').type('mauvaisMotDePasse');
        cy.get('#loginForm').submit();

        // Le message d'erreur doit être visible
        cy.get('#loginMessage').should('be.visible').and('not.be.empty');

        // Le token ne doit pas être stocké
        cy.window().its('localStorage').invoke('getItem', 'hyperbyke_token')
            .should('be.null');
    });

    it('FONC-LOGIN-05: affiche un message d\'erreur avec un utilisateur inexistant', () => {
        cy.get('#username').type('utilisateurInexistant');
        cy.get('#password').type('motdepasse');
        cy.get('#loginForm').submit();

        cy.get('#loginMessage').should('be.visible').and('not.be.empty');
    });

    // ========== Validation du formulaire ==========
    it('FONC-LOGIN-06: le champ username est requis (validation HTML)', () => {
        cy.get('#password').type('pass1234');
        cy.get('#loginForm').submit();

        // Le champ username a "required" → le formulaire ne se soumet pas
        cy.get('#username:invalid').should('exist');
    });

    it('FONC-LOGIN-07: le champ password est requis (validation HTML)', () => {
        cy.get('#username').type('jdupont');
        cy.get('#loginForm').submit();

        cy.get('#password:invalid').should('exist');
    });
});
