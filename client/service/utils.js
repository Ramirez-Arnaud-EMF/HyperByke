/**
 * @fileoverview Utilitaires pour le traitement des données du client HyperByke
 * @author Arnaud Ramirez
 * @date 24.04.2026
 * @version 1.0.0
 */

/**
 * Formate le nom et prénom d'une personne au format: "Prenom NOM".
 * Applique la casse appropriée : première lettre du prénom en majuscule,
 * toutes les autres en minuscule pour le prénom ; tout en majuscules pour le nom.
 * 
 * @function formaterNomClient
 * @param {string} prenom - Le prénom de la personne.
 * @param {string} nom - Le nom de la personne.
 * @returns {string|null} Chaîne formatée "Prenom NOM" ou null si les paramètres sont invalides.
 * 
 * @throws {TypeError} Aucune - retourne null en cas d'erreur
 * 
 * @example
 * // Cas normal
 * formaterNomClient('jean', 'dupont'); // retourne 'Jean DUPONT'
 * formaterNomClient('MARIE', 'LEBLANC'); // retourne 'Marie LEBLANC'
 * 
 * @example
 * // Avec espaces
 * formaterNomClient('  pierre  ', '  martin  '); // retourne 'Pierre MARTIN'
 * 
 * @example
 * // Cas d'erreur
 * formaterNomClient(null, 'dupont'); // retourne null
 * formaterNomClient('jean', 123); // retourne null
 * formaterNomClient('   ', 'dupont'); // retourne null (vide après trim)
 */
export function formaterNomClient(prenom, nom) {
    // Vérification que les deux paramètres sont des strings
    if (typeof prenom !== 'string' || typeof nom !== 'string') {
        return null;
    }

    // Trim et vérification que les chaînes ne sont pas vides après nettoyage
    const prenomTrim = prenom.trim();
    const nomTrim = nom.trim();

    if (prenomTrim === '' || nomTrim === '') {
        return null;
    }

    // Formatage : première lettre majuscule pour le prénom, reste minuscule
    // Toutes les lettres en majuscules pour le nom
    const prenomFormate = prenomTrim.charAt(0).toUpperCase() + prenomTrim.slice(1).toLowerCase();
    const nomFormate = nomTrim.toUpperCase();

    return `${prenomFormate} ${nomFormate}`;
}

/**
        * Formate le nom d'une pièce de moto au format standard : "Première lettre majuscule".
        * Tous les autres caractères en minuscules, première lettre en majuscule.
        * Utilisé pour les pièces présentes dans la base de données (Guidon, Selle, Rétroviseur, etc.).
        * 
        * @function formaterNomPiece
        * @param {string} nomPiece - Le nom de la pièce de moto.
        * @returns {string|null} Le nom formaté ou null si invalide.
        * 
        * @example
        * formaterNomPiece('guidon'); // retourne 'Guidon'
        * formaterNomPiece('SELLE'); // retourne 'Selle'
        * formaterNomPiece('  rétroviseur  '); // retourne 'Rétroviseur'
        * formaterNomPiece('pneu avant'); // retourne 'Pneu avant'
        * formaterNomPiece(null); // retourne null
        * formaterNomPiece('   '); // retourne null (vide après trim)
        */
       export function formaterNomPiece(nomPiece) {
           // Vérification que c'est une string
           if (typeof nomPiece !== 'string') {
               return null;
           }
       
           // Trim la chaîne
           const trimmed = nomPiece.trim();
       
           // Vérification que la chaîne n'est pas vide
           if (trimmed === '') {
               return null;
           }
       
           // Formatage : première lettre majuscule, reste en minuscules
           const formatted = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
       
           return formatted;
       }
