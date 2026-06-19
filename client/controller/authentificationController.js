/**
 * @fileoverview Contrôleur d'authentification MVC pour le login - gestion connexion, déconnexion, rôle utilisateur
 * @author Arnaud Ramirez
 * @date 11.06.2025
 * @version 1.0.0
 */

import { ServiceAuthentification } from "../service/serviceAuthetification.js";

/**
 * Contrôleur d'authentification MVC pour le login.
 * Gère la connexion, la déconnexion et l'affichage du rôle utilisateur.
 * @class
 */
class AuthentificationController {    /**
     * Initialise les clés de stockage local.
     * Définit les constantes pour les noms des clés utilisées dans le localStorage.
     */
    constructor() {
        this.tokenKey = "hyperbyke_token";
        this.roleKey = "hyperbyke_role";
        this.usernameKey = "hyperbyke_username";
        this.authService = new ServiceAuthentification();
    }

    /**
     * Tente de connecter l'utilisateur et stocke le token JWT.
     * @async
     * @param {string} username - Nom d'utilisateur
     * @param {string} password - Mot de passe
     * @returns {Promise<Object>} Données utilisateur (token, rôle, username)
     */
    async login(username, password) {
        const data = await this.authService.login(username, password);
        localStorage.setItem(this.tokenKey, data.token);
        localStorage.setItem(this.roleKey, data.role);
        localStorage.setItem(this.usernameKey, data.username);
        return data;
    }

    /**
     * Récupère le rôle de l'utilisateur connecté.
     * @static
     * @returns {string|null} Rôle de l'utilisateur ou null si non connecté
     */
    static getRole() {
        return localStorage.getItem("hyperbyke_role");
    }
    
    /**
     * Récupère le nom d'utilisateur connecté.
     * @static
     * @returns {string|null} Nom d'utilisateur ou null si non connecté
     */
    static getUsername() {
        return localStorage.getItem("hyperbyke_username");
    }
    
    /**
     * Vérifie si l'utilisateur est connecté.
     * @static
     * @returns {boolean} True si l'utilisateur est connecté, sinon false
     */
    static isLoggedIn() {
        return !!localStorage.getItem("hyperbyke_token");
    }
    
    /**
     * Déconnecte l'utilisateur (supprime les données de session).
     * Supprime le token, le rôle et le nom d'utilisateur du localStorage.
     * @static
     */
    static logout() {
        localStorage.removeItem("hyperbyke_token");
        localStorage.removeItem("hyperbyke_role");
        localStorage.removeItem("hyperbyke_username");
    }

    /**
     * Initialise la gestion du formulaire de login et l'affichage du rôle/menu.
     * Point d'entrée principal pour toutes les fonctionnalités d'authentification.
     * @static
     */
    static init() {
        // Gestion du formulaire de login (login.html)
        document.addEventListener("DOMContentLoaded", () => {
            AuthentificationController.handleLoginForm();
            AuthentificationController.displayUserHeader();
            AuthentificationController.updateMenuByRole();
        });
    }

    /**
     * Gère le formulaire de connexion.
     * Configure les événements pour traiter la soumission du formulaire.
     * @static
     */
    static handleLoginForm() {
        const form = document.getElementById("loginForm");
        if (form) {
            form.addEventListener("submit", async (e) => {
                e.preventDefault();
                const username = document.getElementById("username").value;
                const password = document.getElementById("password").value;
                const msg = document.getElementById("loginMessage");
                msg.textContent = "Connexion...";
                try {
                    const ctrl = new AuthentificationController();
                    await ctrl.login(username, password);
                    msg.textContent = "Connecté avec succès!";
                    setTimeout(() => {
                        window.location.href = "../index.html";
                    }, 1000);
                } catch (err) {
                    msg.textContent = `Erreur: ${err.message}`;
                }
            });
        }
    }

    /**
     * Affiche le rôle et le bouton de déconnexion dans le header.
     * Crée ou met à jour le conteneur utilisateur selon le statut de connexion.
     * @static
     */
    static displayUserHeader() {
        const header = document.querySelector("header section");
        if (header) {
            let userContainer = document.getElementById("user-container");
            if (!userContainer) {
                userContainer = document.createElement("div");
                userContainer.id = "user-container";
                userContainer.className = "user-container";
                header.appendChild(userContainer);
            }
            if (AuthentificationController.isLoggedIn()) {
                const role = AuthentificationController.getRole();
                const username = AuthentificationController.getUsername();
                const roleText = role ? `Connecté : ${role.charAt(0).toUpperCase() + role.slice(1)}` + (username ? ` (${username})` : "") : "";
                userContainer.innerHTML = `
                    <span id="role-connecte">${roleText}</span>
                    <button id="btn-deconnexion" class="btn-deconnexion">Déconnexion</button>
                `;
                document.getElementById("btn-deconnexion").addEventListener("click", () => {
                    AuthentificationController.logout();
                    window.location.reload();
                });
            } else {
                userContainer.innerHTML = "";
            }
        }
    }

    /**
     * Met à jour dynamiquement le menu selon le rôle de l'utilisateur.
     * Affiche ou masque les liens de navigation selon les permissions.
     * @static
     */
    static updateMenuByRole() {
        const nav = document.getElementById("nav");
        if (nav) {
            const token = localStorage.getItem("hyperbyke_token");
            const role = localStorage.getItem("hyperbyke_role");
            nav.querySelectorAll("a").forEach(a => a.style.display = "none");
            nav.querySelectorAll("a").forEach(a => {
                if (a.href.includes("index.html")) a.style.display = "block";
                if (a.href.includes("login.html")) a.style.display = token ? "none" : "block";
            });
            if (token && role === "garagiste") {
                nav.querySelectorAll("a").forEach(a => {
                    if (a.href.includes("garage.html")) a.style.display = "block";
                });
            }
            if (token && role === "logisticien") {
                nav.querySelectorAll("a").forEach(a => {
                    if (a.href.includes("logistique.html")) a.style.display = "block";
                });
            }
        }
    }
}


AuthentificationController.init();