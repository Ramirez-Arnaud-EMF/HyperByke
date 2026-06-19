/**
 * @fileoverview Service pour la gestion des utilisateurs et authentification
 * @author Arnaud Ramirez
 * @date 11.06.2025
 * @version 1.0.0
 */


const pool = require('../../config/database.js');
const bcrypt = require('bcryptjs');

/**
 * Vérifie les identifiants de connexion d'un utilisateur
 * @async
 * @function checkLogin
 * @param {string} username - Le nom d'utilisateur
 * @param {string} password - Le mot de passe en clair
 * @returns {Promise<Object|null>} Objet utilisateur sans mot de passe si authentification réussie, null sinon
 * @throws {Error} En cas d'erreur lors de la vérification
 * @example
 * const user = await checkLogin("garagiste1", "motdepasse123");
 * // Retourne: { pk_employer: 1, username: "garagiste1", role: "garagiste" } ou null
 */
const checkLogin = async (username, password) => {
    let connexion;
    try {
        try {
            connexion = await pool.getConnection();
        } catch (connErr) {
            console.error('Erreur de connexion à la base de données :', connErr);
            const dbError = new Error('DATABASE_CONNECTION_ERROR');
            dbError.original = connErr;
            throw dbError;
        }
        // Récupérer l'utilisateur avec son mot de passe haché
        const sql = 'SELECT pk_employer, username, role, password FROM Employer WHERE username = ?';
        const [rows] = await connexion.query(sql, [username]);
        
        if (rows.length === 0) {
            return null;
        }
        
        const user = rows[0];
        // Vérifier le mot de passe avec bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (isPasswordValid) {
            // Retourner l'utilisateur sans le mot de passe
            const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Erreur lors de la vérification de l\'utilisateur :', error);
        throw error;
    } finally {
        if (connexion) connexion.release();
    }
};



module.exports = {
    checkLogin
};