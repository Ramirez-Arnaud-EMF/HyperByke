/**
 * @fileoverview Middleware pour la validation de l'authentification JWT et des rôles utilisateur
 * @author Arnaud Ramirez
 * @date 11.06.2025
 * @version 1.0.0
 */

// filepath: c:\Users\RamirezA02\OneDrive - EDUETATFR\EMF\2e\295\Projet\HyperBikeServer\app\middlewares\validateAuthentification.js
const jwt = require('jsonwebtoken');

/**
 * Middleware pour valider le JWT et vérifier le rôle de l'utilisateur.
 * @function validateAuthentification
 * @param {string[]} [allowedRoles=[]] - Tableau des rôles autorisés pour cette route
 * @returns {Function} Middleware Express pour la validation d'authentification
 * @throws {Error} 401 - Si le token est manquant
 * @throws {Error} 403 - Si le token est invalide ou le rôle insuffisant
 * @example
 * // Autoriser seulement les garagistes
 * router.get('/motos', validateAuthentification(['garagiste']), controller.getMotos);
 * 
 * // Autoriser garagistes et logisticiens
 * router.get('/stock', validateAuthentification(['garagiste', 'logisticien']), controller.getStock);
 * 
 * // Autoriser tous les utilisateurs authentifiés
 * router.get('/profile', validateAuthentification(), controller.getProfile);
 */
function validateAuthentification(allowedRoles = []) {
    return (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Token manquant' });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ error: 'Token invalide' });
            }
            // Vérifie le role
            if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
                return res.status(403).json({ error: 'Accès refusé : rôle insuffisant' });
            }
            req.user = user;
            next();
        });
    };
}

module.exports = validateAuthentification;
