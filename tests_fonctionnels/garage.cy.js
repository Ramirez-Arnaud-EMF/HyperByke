/**
 * @fileoverview Tests fonctionnels - Cas d'utilisation : Gestion du garage (liste des motos)
 * @author Arnaud Ramirez
 * @date 30.04.2026
 * @version 1.0.0
 *
 * @description
 * Teste le cas d'utilisation "Consulter la liste des motos" de l'application HyperByke.
 * Prérequis : l'application doit être démarrée via :
 *   docker compose up -d --build
 * puis accessible sur http://localhost:8080
 */

describe('CU-02 : Consulter la liste des motos (Garage)', () => {

    /**
     * Effectue une connexion via l'API et stocke le token dans le localStorage.
     * Méthode programmatique plus fiable que la connexion via l'interface.
     */
    const loginAsGaragiste = () => {
        cy.request({
            method: 'POST',
            url: 'http://localhost:3000/api/authentification/login',
            body: { username: 'jdupont', password: 'pass1234' },
        }).then((response) => {
            cy.window().then((win) => {
                win.localStorage.setItem('hyperbyke_token', response.body.token);
                win.localStorage.setItem('hyperbyke_role', response.body.role);
                win.localStorage.setItem('hyperbyke_username', response.body.username);
            });
        });
    };

    beforeEach(() => {
        cy.clearLocalStorage();
        loginAsGaragiste();
        cy.visit('/html/garage.html');
    });

    // ========== Affichage de la page ==========
    it('FONC-GARAGE-01: la page garage se charge correctement', () => {
        cy.title().should('include', 'Garage');
        cy.get('header').should('be.visible');
        cy.get('h1').contains('HyperByke').should('be.visible');
    });

    it('FONC-GARAGE-02: le titre "Motos en cours de production" est visible', () => {
        cy.get('h2').contains('Motos en cours de production').should('be.visible');
    });

    it('FONC-GARAGE-03: le bouton "Ajouter une moto" est visible', () => {
        cy.get('#btn-ajouter-moto').should('be.visible').and('contain', 'Ajouter une moto');
    });

    // ========== Données des motos ==========
    it('FONC-GARAGE-04: des motos sont affichées dans la liste', () => {
        // Attendre que la liste des motos soit chargée
        cy.get('.carte-moto', { timeout: 8000 }).should('have.length.greaterThan', 0);
    });

    it('FONC-GARAGE-05: chaque moto affiche au moins un nom de modèle', () => {
        cy.get('.carte-moto', { timeout: 8000 }).first().within(() => {
            cy.get('.carte-moto-nom, .carte-moto-modele, h3, h4, [class*="modele"], [class*="nom"]').should('exist');
        });
    });

    // ========== Formulaire d'ajout ==========
    it('FONC-GARAGE-06: le formulaire d\'ajout est masqué par défaut', () => {
        cy.get('#form-ajouter-moto').should('not.be.visible');
    });

    it('FONC-GARAGE-07: cliquer sur "Ajouter une moto" affiche le formulaire', () => {
        cy.get('#btn-ajouter-moto').click();
        cy.get('#form-ajouter-moto').should('be.visible');
        cy.get('#input-nom-client').should('be.visible');
        cy.get('#input-nom-modele').should('be.visible');
        cy.get('#input-date-livraison').should('be.visible');
    });

    it('FONC-GARAGE-08: le formulaire d\'ajout contient les modèles de moto disponibles', () => {
        cy.get('#btn-ajouter-moto').click();
        cy.get('#input-nom-modele option').should('have.length.greaterThan', 0);
    });
});
