/**
 * @fileoverview Point d'entrée unique pour l'API (configuration de l'URL de base)
 * @author Arnaud Ramirez
 * @date 11.06.2025
 * @version 1.0.0
 */

/**
 * URL de base pour toutes les API du backend.
 * Permet de centraliser la configuration des endpoints et faciliter les changements d'environnement.
 * 
 * @constant {string} API_BASE_URL
 * @description URL de base pour toutes les requêtes vers l'API backend.
 * Utilisée par tous les services pour construire les chemins complets des endpoints.
 * @example
 * import { API_BASE_URL } from "./config.js";
 * 
 * // Construire une URL pour un endpoint spécifique
 * const loginUrl = `${API_BASE_URL}authentification/login`;
 */
const isProductionHost = window.location.hostname === "arnaudramirez.emf-informatique.ch";

export const API_BASE_URL = isProductionHost
	? "https://arnaudramirez.emf-informatique.ch/api/"
	: "/api/";