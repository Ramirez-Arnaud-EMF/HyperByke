/**
 * @fileoverview Service pour la gestion du stock de pièces (logistique) - communication avec l'API stock
 * @author Arnaud Ramirez
 * @date 11.06.2025
 * @version 1.0.0
 */

import { API_BASE_URL } from "./config.js";

/**
 * Classe pour gérer les opérations liées à la logistique et au stock de pièces.
 * Fournit des méthodes pour récupérer, commander et modifier les pièces en stock.
 * @class ServiceLogistique
 * @classdesc Service gérant les opérations liées au stock de pièces avec le serveur backend.
 * @example
 * const logistiqueService = new ServiceLogistique();
 * logistiqueService.getPieces()
 *   .then(pieces => console.log('Pièces en stock:', pieces))
 *   .catch(err => console.error('Erreur:', err));
 */
export class ServiceLogistique {
  /**
   * Crée une instance du service logistique.
   * @constructor
   */
  constructor() {
    /**
     * URL de base de l'API utilisée pour toutes les requêtes liées au stock.
     * @private
     * @type {string}
     */
    this.apiUrl = API_BASE_URL;

    /**
     * Clé utilisée pour stocker le token d'authentification dans le localStorage.
     * @private
     * @type {string}
     */
    this.tokenKey = 'hyperbyke_token';
  }

  /**
   * Récupère la liste de toutes les pièces en stock.
   * @async
   * @returns {Promise<Object[]>} Liste des pièces disponibles en stock.
   * @throws {Error} Si la requête échoue ou si l'API retourne une erreur.
   * @example
   * try {
   *   const pieces = await logistiqueService.getPieces();
   *   // Traiter la liste des pièces
   * } catch (error) {
   *   console.error("Erreur:", error.message);
   * }
   */
  async getPieces() {
    try {
      const token = localStorage.getItem('hyperbyke_token');
      console.log("Token:", token ? "Présent" : "Absent");
      const response = await fetch(API_BASE_URL + 'stock/allstock', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log("Réponse du serveur:", response.status, response.statusText);
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Non autorisé - Token invalide ou expiré');
        } else if (response.status === 403) {
          throw new Error('Accès refusé - Droits insuffisants');
        } else if (response.status === 404) {
          throw new Error('Endpoint non trouvé - Vérifiez que le serveur est démarré');
        }
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Données reçues:", data);
      return data;
    } catch (error) {
      console.error("Erreur dans getPieces:", error);
      throw error;
    }
  }
  /**
   * Commande une quantité de pièce à ajouter au stock existant.
   * @async
   * @param {number} id - ID unique de la pièce à commander.
   * @param {number} quantiteStock - Quantité à ajouter au stock existant.
   * @returns {Promise<Object>} Détails de la pièce après la mise à jour du stock.
   * @throws {Error} Si la requête échoue ou si l'API retourne une erreur.
   * @example
   * try {
   *   const resultat = await logistiqueService.commander(123, 10);
   *   console.log("Commande effectuée:", resultat);
   * } catch (error) {
   *   console.error("Erreur:", error.message);
   * }
   */
  async commander(id, quantiteStock) {
    try {
      const token = localStorage.getItem('hyperbyke_token');
      console.log("Token:", token ? "Présent" : "Absent");
      const response = await fetch(`${API_BASE_URL}stock/addstock/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantiteStock })
      });
      console.log("Réponse du serveur (commander):", response.status, response.statusText);
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Non autorisé - Token invalide ou expiré');
        } else if (response.status === 403) {
          throw new Error('Accès refusé - Droits insuffisants');
        } else if (response.status === 404) {
          throw new Error('Endpoint non trouvé - Vérifiez que le serveur est démarré');
        }
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Données reçues (commander):", data);
      return data;
    } catch (error) {
      console.error("Erreur dans commander:", error);
      throw error;
    }
  }
  /**
   * Modifie la quantité absolue d'une pièce en stock.
   * Contrairement à la méthode commander qui ajoute une quantité, cette méthode définit une quantité précise.
   * @async
   * @param {number} id - ID unique de la pièce à modifier.
   * @param {number} quantiteStock - Nouvelle quantité absolue à définir.
   * @returns {Promise<Object>} Détails de la pièce après la mise à jour du stock.
   * @throws {Error} Si la requête échoue ou si l'API retourne une erreur.
   * @example
   * try {
   *   const resultat = await logistiqueService.modifier(123, 50);
   *   console.log("Stock modifié:", resultat);
   * } catch (error) {
   *   console.error("Erreur:", error.message);
   * }
   */
  async modifier(id, quantiteStock) {
    try {
      const token = localStorage.getItem('hyperbyke_token');
      console.log("Token:", token ? "Présent" : "Absent");
      const response = await fetch(`${API_BASE_URL}stock/updatestock/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantiteStock })
      });
      console.log("Réponse du serveur (modifier):", response.status, response.statusText);
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Non autorisé - Token invalide ou expiré');
        } else if (response.status === 403) {
          throw new Error('Accès refusé - Droits insuffisants');
        } else if (response.status === 404) {
          throw new Error('Endpoint non trouvé - Vérifiez que le serveur est démarré');
        }
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Données reçues (modifier):", data);
      return data;
    } catch (error) {
      console.error("Erreur dans modifier:", error);
      throw error;
    }
  }
}