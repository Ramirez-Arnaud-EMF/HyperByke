/**
 * @fileoverview Tests d'intégration - API Authentification
 * @author Arnaud Ramirez
 * @date 30.04.2026
 * @version 1.0.0
 *
 * @description
 * Teste l'endpoint POST /api/authentification/login du serveur de test (port 3001).
 * Prérequis : le serveur de test doit être démarré via :
 *   docker compose -f docker-compose.test.yml up -d
 */

import { describe, it, expect } from 'vitest';

const BASE_URL = 'http://localhost:3001/api';

describe('API Authentification - POST /api/authentification/login', () => {

    // ========== Cas nominal ==========
    it('INT-AUTH-01: connexion réussie avec des identifiants valides (garagiste)', async () => {
        const response = await fetch(`${BASE_URL}/authentification/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'jdupont', password: 'pass1234' }),
        });

        expect(response.status).toBe(200);

        const data = await response.json();
        expect(data).toHaveProperty('token');
        expect(data).toHaveProperty('username', 'jdupont');
        expect(data).toHaveProperty('role', 'garagiste');
        expect(typeof data.token).toBe('string');
        expect(data.token.length).toBeGreaterThan(0);
    });

    it('INT-AUTH-02: connexion réussie avec des identifiants valides (logisticien)', async () => {
        const response = await fetch(`${BASE_URL}/authentification/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'mleblanc', password: 'securepass' }),
        });

        expect(response.status).toBe(200);

        const data = await response.json();
        expect(data).toHaveProperty('token');
        expect(data).toHaveProperty('username', 'mleblanc');
        expect(data).toHaveProperty('role', 'logisticien');
    });

    // ========== Cas d'erreur - Mauvais identifiants ==========
    it('INT-AUTH-03: retourne 401 avec un mot de passe incorrect', async () => {
        const response = await fetch(`${BASE_URL}/authentification/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'jdupont', password: 'mauvaisMotDePasse' }),
        });

        expect(response.status).toBe(401);

        const data = await response.json();
        expect(data).toHaveProperty('error');
    });

    it('INT-AUTH-04: retourne 401 avec un utilisateur inexistant', async () => {
        const response = await fetch(`${BASE_URL}/authentification/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'utilisateurInexistant', password: 'pass1234' }),
        });

        expect(response.status).toBe(401);

        const data = await response.json();
        expect(data).toHaveProperty('error');
    });

    // ========== Cas d'erreur - Champs manquants ==========
    it('INT-AUTH-05: retourne 400 si le username est manquant', async () => {
        const response = await fetch(`${BASE_URL}/authentification/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: 'pass1234' }),
        });

        expect(response.status).toBe(400);

        const data = await response.json();
        expect(data).toHaveProperty('error');
    });

    it('INT-AUTH-06: retourne 400 si le password est manquant', async () => {
        const response = await fetch(`${BASE_URL}/authentification/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'jdupont' }),
        });

        expect(response.status).toBe(400);

        const data = await response.json();
        expect(data).toHaveProperty('error');
    });

    it('INT-AUTH-07: retourne 400 si le body est vide', async () => {
        const response = await fetch(`${BASE_URL}/authentification/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}),
        });

        expect(response.status).toBe(400);

        const data = await response.json();
        expect(data).toHaveProperty('error');
    });

    // ========== Format de la réponse ==========
    it('INT-AUTH-08: le token retourné est un JWT valide (3 parties séparées par des points)', async () => {
        const response = await fetch(`${BASE_URL}/authentification/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'jdupont', password: 'pass1234' }),
        });

        const data = await response.json();
        const parts = data.token.split('.');
        expect(parts).toHaveLength(3);
    });
});
