/**
 * @fileoverview Contrôleur pour la gestion de l'authentification des utilisateurs
 * @author HyperBike Team
 * @version 1.0.0
 */

// filepath: c:\Users\RamirezA02\OneDrive - EDUETATFR\EMF\2e\295\Projet\HyperBikeServer\app\controllers\authentificationController.js
const jwt = require('jsonwebtoken');
const utilisateurService = require('../services/utilisateurService');

/**
 * Authentifie un utilisateur et génère un token JWT
 * @async
 * @function login
 * @param {Object} req - Objet de requête Express
 * @param {Object} req.body - Corps de la requête
 * @param {string} req.body.username - Nom d'utilisateur
 * @param {string} req.body.password - Mot de passe
 * @param {Object} res - Objet de réponse Express
 * @returns {Promise<void>} Réponse JSON avec le token et les informations utilisateur
 * @throws {Error} 400 - Si les paramètres requis sont manquants
 * @throws {Error} 401 - Si les identifiants sont incorrects
 * @throws {Error} 500 - En cas d'erreur serveur interne
 * @example
 * POST /api/authentification/login
 * {
 *   "username": "garagiste1",
 *   "password": "motdepasse123"
 * }
 * 
 * Response:
 * {
 *   "token": "eyJhbGciOiJIUzI1NiIs...",
 *   "username": "garagiste1",
 *   "role": "garagiste"
 * }
 */
const login = async (req, res) => {
    const { username, password } = req.body || {};
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }
    try {
        const user = await utilisateurService.checkLogin(username, password);
        if (user) {
            const token = jwt.sign(
                { id: user.pk_employer, username: user.username, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRATION || '1h' }
            );
            res.json({ token, username: user.username, role: user.role });
        } else {
            res.status(401).json({ error: 'Username or password incorrect' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
};

module.exports = {
    login
};
