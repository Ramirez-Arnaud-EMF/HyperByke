/**
 * @fileoverview Tests unitaires pour les utilitaires du client HyperByke
 * @author Arnaud Ramirez
 * @date 24.04.2026
 * @version 1.0.0
 */

import { formaterNomClient, formaterNomPiece } from '../client/service/utils.js';

describe('formaterNomClient', () => {

    // ========== Cas nominal ==========
    it('UNIT-UTILS-01: formate correctement un prénom et un nom standard', () => {
        expect(formaterNomClient('jean', 'dupont')).toBe('Jean DUPONT');
    });

    it('UNIT-UTILS-02: applique la casse correcte même si l\'input est en majuscules', () => {
        expect(formaterNomClient('MARIE', 'LEBLANC')).toBe('Marie LEBLANC');
    });

    it('UNIT-UTILS-03: gère les cas mixtes (PaScAlE)', () => {
        expect(formaterNomClient('PiErRe', 'MaRtIn')).toBe('Pierre MARTIN');
    });

    // ========== Gestion des espaces ==========
    it('UNIT-UTILS-04: ignore les espaces inutiles au début et à la fin', () => {
        expect(formaterNomClient('  jean  ', '  dupont  ')).toBe('Jean DUPONT');
    });

    it('UNIT-UTILS-05: gère les espacements multiples', () => {
        expect(formaterNomClient('   alice   ', '   martin   ')).toBe('Alice MARTIN');
    });

    // ========== Cas d'erreur - Types invalides ==========
    it('UNIT-UTILS-06: retourne null si le prénom est null', () => {
        expect(formaterNomClient(null, 'dupont')).toBeNull();
    });

    it('UNIT-UTILS-07: retourne null si le nom est null', () => {
        expect(formaterNomClient('jean', null)).toBeNull();
    });

    it('UNIT-UTILS-08: retourne null si le prénom est undefined', () => {
        expect(formaterNomClient(undefined, 'dupont')).toBeNull();
    });

    it('UNIT-UTILS-09: retourne null si le nom est undefined', () => {
        expect(formaterNomClient('jean', undefined)).toBeNull();
    });

    it('UNIT-UTILS-10: retourne null si le prénom est un nombre', () => {
        expect(formaterNomClient(123, 'dupont')).toBeNull();
    });

    it('UNIT-UTILS-11: retourne null si le nom est un nombre', () => {
        expect(formaterNomClient('jean', 456)).toBeNull();
    });

    it('UNIT-UTILS-12: retourne null si le prénom est un objet', () => {
        expect(formaterNomClient({}, 'dupont')).toBeNull();
    });

    it('UNIT-UTILS-13: retourne null si le nom est un tableau', () => {
        expect(formaterNomClient('jean', [])).toBeNull();
    });

    // ========== Cas d'erreur - Chaînes vides ==========
    it('UNIT-UTILS-14: retourne null si le prénom est vide après trim', () => {
        expect(formaterNomClient('   ', 'dupont')).toBeNull();
    });

    it('UNIT-UTILS-15: retourne null si le nom est vide après trim', () => {
        expect(formaterNomClient('jean', '   ')).toBeNull();
    });

    it('UNIT-UTILS-16: retourne null si les deux sont vides après trim', () => {
        expect(formaterNomClient('   ', '   ')).toBeNull();
    });

    it('UNIT-UTILS-17: retourne null si le prénom est une chaîne vide', () => {
        expect(formaterNomClient('', 'dupont')).toBeNull();
    });

    it('UNIT-UTILS-18: retourne null si le nom est une chaîne vide', () => {
        expect(formaterNomClient('jean', '')).toBeNull();
    });

});

describe('formaterNomPiece', () => {

    // ========== Cas nominal ==========
    it('UNIT-PIECE-01: formate correctement un nom de pièce en minuscules', () => {
        expect(formaterNomPiece('guidon')).toBe('Guidon');
    });

    it('UNIT-PIECE-02: formate correctement un nom de pièce en majuscules', () => {
        expect(formaterNomPiece('SELLE')).toBe('Selle');
    });

    it('UNIT-PIECE-03: formate correctement un nom de pièce en casse mixte', () => {
        expect(formaterNomPiece('rETROVISEUR')).toBe('Retroviseur');
    });

    // ========== Gestion des espaces ==========
    it('UNIT-PIECE-04: ignore les espaces au début et à la fin', () => {
        expect(formaterNomPiece('  guidon  ')).toBe('Guidon');
    });

    it('UNIT-PIECE-05: ignore les espacements multiples', () => {
        expect(formaterNomPiece('   pneu avant   ')).toBe('Pneu avant');
    });

    // ========== Cas d'erreur - Format invalide ==========
    it('UNIT-PIECE-06: formate correctement les noms composés', () => {
        expect(formaterNomPiece('pneu arrière')).toBe('Pneu arrière');
    });

    it('UNIT-PIECE-07: formate correctement "frein avant"', () => {
        expect(formaterNomPiece('frein avant')).toBe('Frein avant');
    });

    it('UNIT-PIECE-08: formate correctement "batterie"', () => {
        expect(formaterNomPiece('batterie')).toBe('Batterie');
    });

    // ========== Cas d'erreur - Types invalides ==========
    it('UNIT-PIECE-09: retourne null si l\'input est null', () => {
        expect(formaterNomPiece(null)).toBeNull();
    });

    it('UNIT-PIECE-10: retourne null si l\'input est undefined', () => {
        expect(formaterNomPiece(undefined)).toBeNull();
    });

    it('UNIT-PIECE-11: retourne null si l\'input est un nombre', () => {
        expect(formaterNomPiece(123)).toBeNull();
    });

    it('UNIT-PIECE-12: retourne null si l\'input est un objet', () => {
        expect(formaterNomPiece({})).toBeNull();
    });

    // ========== Cas d'erreur - Types invalides ==========
    it('UNIT-PIECE-13: retourne null si l\'input est un tableau', () => {
        expect(formaterNomPiece(['Guidon'])).toBeNull();
    });

    it('UNIT-PIECE-14: retourne null si l\'input est un booléen', () => {
        expect(formaterNomPiece(true)).toBeNull();
    });

    it('UNIT-PIECE-15: retourne null si la chaîne est vide', () => {
        expect(formaterNomPiece('')).toBeNull();
    });

    it('UNIT-PIECE-16: retourne null si la chaîne ne contient que des espaces', () => {
        expect(formaterNomPiece('   ')).toBeNull();
    });

    it('UNIT-PIECE-17: formate correctement "AMORTISSEUR"', () => {
        expect(formaterNomPiece('AMORTISSEUR')).toBe('Amortisseur');
    });

    it('UNIT-PIECE-18: formate correctement "phare AVANT"', () => {
        expect(formaterNomPiece('phare AVANT')).toBe('Phare avant');
    });

    
});
