/**
 * @fileoverview Tests d'intégration - API Stock
 * @author Arnaud Ramirez
 * @date 30.04.2026
 * @version 1.0.0
 *
 * @description
 * Teste l'endpoint GET /api/stock/allstock du serveur de test (port 3001).
 * Prérequis : le serveur de test doit être démarré via :
 *   docker compose -f docker-compose.test.yml up -d
 */

import { describe, it, expect, beforeAll } from 'vitest';

const BASE_URL = 'http://localhost:3001/api';

/**
 * Obtient un token JWT valide pour les tests (utilisateur logisticien).
 * @returns {Promise<string>} Token JWT
 */
async function getToken(role = 'logisticien') {
    const credentials = role === 'garagiste'
        ? { username: 'jdupont', password: 'pass1234' }
        : { username: 'mleblanc', password: 'securepass' };

    const response = await fetch(`${BASE_URL}/authentification/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });
    const data = await response.json();
    return data.token;
}

describe('API Stock - GET /api/stock/allstock', () => {

    let tokenLogisticien;
    let tokenGaragiste;

    beforeAll(async () => {
        tokenLogisticien = await getToken('logisticien');
        tokenGaragiste = await getToken('garagiste');
    });

    // ========== Cas nominal ==========
    it('INT-STOCK-01: retourne la liste de toutes les pièces en stock (logisticien)', async () => {
        const response = await fetch(`${BASE_URL}/stock/allstock`, {
            headers: { 'Authorization': `Bearer ${tokenLogisticien}` },
        });

        expect(response.status).toBe(200);

        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBeGreaterThan(0);
    });

    it('INT-STOCK-02: chaque pièce contient les propriétés attendues', async () => {
        const response = await fetch(`${BASE_URL}/stock/allstock`, {
            headers: { 'Authorization': `Bearer ${tokenLogisticien}` },
        });

        const data = await response.json();
        const piece = data[0];

        expect(piece).toHaveProperty('pk_piece');
        expect(piece).toHaveProperty('nomPiece');
        expect(piece).toHaveProperty('quantiteStock');
        expect(typeof piece.pk_piece).toBe('number');
        expect(typeof piece.nomPiece).toBe('string');
        expect(typeof piece.quantiteStock).toBe('number');
    });

    it('INT-STOCK-03: retourne la liste de toutes les pièces en stock (garagiste)', async () => {
        const response = await fetch(`${BASE_URL}/stock/allstock`, {
            headers: { 'Authorization': `Bearer ${tokenGaragiste}` },
        });

        expect(response.status).toBe(200);

        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
    });

    // ========== Cas d'erreur - Sans authentification ==========
    it('INT-STOCK-04: retourne 401 sans token d\'authentification', async () => {
        const response = await fetch(`${BASE_URL}/stock/allstock`);

        expect(response.status).toBe(401);

        const data = await response.json();
        expect(data).toHaveProperty('error');
    });

    it('INT-STOCK-05: retourne 403 avec un token invalide', async () => {
        const response = await fetch(`${BASE_URL}/stock/allstock`, {
            headers: { 'Authorization': 'Bearer tokenInvalide' },
        });

        expect(response.status).toBe(403);

        const data = await response.json();
        expect(data).toHaveProperty('error');
    });

    // ========== Vérification du contenu ==========
    it('INT-STOCK-06: la liste contient les pièces de base attendues', async () => {
        const response = await fetch(`${BASE_URL}/stock/allstock`, {
            headers: { 'Authorization': `Bearer ${tokenLogisticien}` },
        });

        const data = await response.json();
        const noms = data.map(p => p.nomPiece);

        expect(noms).toContain('Guidon');
        expect(noms).toContain('Selle');
    });
});
