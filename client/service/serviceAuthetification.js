/**
 * @fileoverview Service pour l'authentification (login) - communication avec l'API d'authentification
 * @author Arnaud Ramirez
 * @date 11.06.2025
 * @version 1.0.0
 */

/**
 * Point d'entrée de l'URL de l'API pour les services d'authentification.
 * @constant {string} API_BASE_URL
 * @see module:config
 */
import { API_BASE_URL } from "./config.js";

/**
 * Classe pour gérer l'authentification des utilisateurs.
 * Fournit des méthodes pour se connecter et interagir avec l'API d'authentification.
 * @class ServiceAuthentification
 * @classdesc Service gérant les opérations d'authentification avec le serveur backend.
 * @example
 * const authService = new ServiceAuthentification();
 * authService.login('utilisateur', 'motdepasse')
 *   .then(userData => console.log('Connecté:', userData))
 *   .catch(err => console.error('Erreur:', err));
 */
export class ServiceAuthentification {
    /**
     * Crée une instance du service d'authentification.
     * @constructor
     */
    constructor() {
        /**
         * URL de base de l'API utilisée pour toutes les requêtes d'authentification.
         * @private
         * @type {string}
         */
        this.apiUrl = API_BASE_URL;
    }

    /**
     * Envoie une requête de connexion à l'API.
     * @async
     * @param {string} username - Nom d'utilisateur.
     * @param {string} password - Mot de passe.
     * @returns {Promise<Object>} Données de l'utilisateur (token, rôle, username).
     * @throws {Error} Si la connexion échoue ou si l'API retourne une erreur.
     * @example
     * try {
     *   const authService = new ServiceAuthentification();
     *   const userData = await authService.login('user', 'pass');
     *   // Utiliser userData.token, userData.role, userData.username
     * } catch (e) {
     *   // Gérer l'erreur d'authentification
     * }
     */
    async login(username, password) {
        console.log("ServiceAuthetification: Envoi de la requête login", { username });
        try {
            const res = await fetch(API_BASE_URL + "authentification/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });
            console.log("ServiceAuthetification: Réponse reçue", res.status);
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "Erreur de connexion");
            }
            const data = await res.json();
            console.log("ServiceAuthetification: Données reçues", data);
            return data;
        } catch (error) {
            console.error("ServiceAuthetification: Erreur", error);
            throw error;
        }
    }
}