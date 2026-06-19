/**
 * @fileoverview Service pour la gestion des motos (garage) - communication avec l'API motos
 * @author Arnaud Ramirez
 * @date 11.06.2025
 * @version 1.0.0
 */

import { API_BASE_URL } from "./config.js";

/**
 * Classe pour gérer les opérations liées aux motos dans le garage.
 * Fournit des méthodes pour récupérer, ajouter, modifier et supprimer des motos.
 * @class ServiceGarage
 * @classdesc Service gérant les opérations liées aux motos avec le serveur backend.
 * @example
 * const garageService = new ServiceGarage();
 * garageService.getMotos()
 *   .then(motos => console.log('Motos:', motos))
 *   .catch(err => console.error('Erreur:', err));
 */
export class ServiceGarage {
  /**
   * Crée une instance du service garage.
   * @constructor
   */
  constructor() {
    /**
     * URL de base de l'API utilisée pour toutes les requêtes liées aux motos.
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
   * Récupère la liste de toutes les motos.
   * @async
   * @returns {Promise<Object[]>} Liste des motos disponibles dans le garage.
   * @throws {Error} Si la requête échoue ou si l'API retourne une erreur.
   * @example
   * try {
   *   const motos = await garageService.getMotos();
   *   // Traiter la liste des motos
   * } catch (error) {
   *   console.error("Erreur:", error.message);
   * }
   */
  async getMotos() {
    try {
      const token = localStorage.getItem('hyperbyke_token');
      console.log("Token:", token ? "Présent" : "Absent");
      const response = await fetch(API_BASE_URL + 'moto/allmotos', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log("Réponse du serveur (getMotos):", response.status, response.statusText);
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
      console.log("Données reçues (getMotos):", data);
      return data;
    } catch (error) {
      console.error("Erreur dans getMotos:", error);
      throw error;
    }
  }
  /**
   * Ajoute une nouvelle moto.
   * @async
   * @param {string} nomClient - Nom du client propriétaire de la moto.
   * @param {number} pk_configurationMoto - ID du modèle de la moto.
   * @param {string} dateLivraison - Date de livraison prévue (format YYYY-MM-DD).
   * @returns {Promise<Object>} Données de la moto ajoutée.
   * @throws {Error} Si la requête échoue ou si l'API retourne une erreur.
   * @example
   * try {
   *   const nouvelleMoto = await garageService.ajouterMoto("Jean Dupont", 1, "2025-12-25");
   *   console.log("Moto ajoutée:", nouvelleMoto);
   * } catch (error) {
   *   console.error("Erreur:", error.message);
   * }
   */
  async ajouterMoto(nomClient, pk_configurationMoto, dateLivraison) {
    try {
      const token = localStorage.getItem('hyperbyke_token');
      console.log("Token:", token ? "Présent" : "Absent");
      const response = await fetch(API_BASE_URL + 'moto/addmoto', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nomClient, pk_configurationMoto, dateLivraison })
      });
      console.log("Réponse du serveur (ajouterMoto):", response.status, response.statusText);
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
      console.log("Données reçues (ajouterMoto):", data);
      return data;
    } catch (error) {
      console.error("Erreur dans ajouterMoto:", error);
      throw error;
    }
  }
  /**
   * Récupère le détail d'une moto.
   * @async
   * @param {number} id - ID unique de la moto à récupérer.
   * @returns {Promise<Object>} Détail complet de la moto avec ses pièces.
   * @throws {Error} Si la requête échoue ou si l'API retourne une erreur.
   * @example
   * try {
   *   const detailMoto = await garageService.getMotoDetail(123);
   *   console.log("Détail de la moto:", detailMoto);
   * } catch (error) {
   *   console.error("Erreur:", error.message);
   * }
   */
  async getMotoDetail(id) {
    try {
      const token = localStorage.getItem('hyperbyke_token');
      console.log("Token:", token ? "Présent" : "Absent");
      const response = await fetch(`${API_BASE_URL}moto/moto/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log("Réponse du serveur (getMotoDetail):", response.status, response.statusText);
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Non autorisé - Token invalide ou expiré');
        } else if (response.status === 403) {
          throw new Error('Accès refusé - Droits insuffisants');
        } else if (response.status === 404) {
          throw new Error('Moto non trouvée');
        }
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Données reçues (getMotoDetail):", data);
      return data;
    } catch (error) {
      console.error("Erreur dans getMotoDetail:", error);
      throw error;
    }
  }
  /**
   * Supprime une pièce d'une moto.
   * @async
   * @param {number} idMoto - ID unique de la moto.
   * @param {number} idPiece - ID unique de la pièce à supprimer.
   * @returns {Promise<boolean>} Retourne true si la suppression est réussie.
   * @throws {Error} Si la requête échoue ou si l'API retourne une erreur.
   * @example
   * try {
   *   const resultat = await garageService.supprimerPieceDeMoto(123, 456);
   *   if (resultat) {
   *     console.log("Pièce supprimée avec succès");
   *   }
   * } catch (error) {
   *   console.error("Erreur:", error.message);
   * }
   */
  async supprimerPieceDeMoto(idMoto, idPiece) {
    try {
      const token = localStorage.getItem('hyperbyke_token');
      console.log("Token:", token ? "Présent" : "Absent");
      const response = await fetch(`${API_BASE_URL}moto/moto/${idMoto}/piece/${idPiece}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log("Réponse du serveur (supprimerPieceDeMoto):", response.status, response.statusText);
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Non autorisé - Token invalide ou expiré');
        } else if (response.status === 403) {
          throw new Error('Accès refusé - Droits insuffisants');
        } else if (response.status === 404) {
          throw new Error('Moto ou pièce non trouvée');
        }
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      return true;
    } catch (error) {
      console.error("Erreur dans supprimerPieceDeMoto:", error);
      throw error;
    }
  }
  /**
   * Supprime une moto.
   * @async
   * @param {number} idMoto - ID unique de la moto à supprimer.
   * @returns {Promise<boolean>} Retourne true si la suppression est réussie.
   * @throws {Error} Si la requête échoue ou si l'API retourne une erreur.
   * @example
   * try {
   *   const resultat = await garageService.supprimerMoto(123);
   *   if (resultat) {
   *     console.log("Moto supprimée avec succès");
   *   }
   * } catch (error) {
   *   console.error("Erreur:", error.message);
   * }
   */
  async supprimerMoto(idMoto) {
    try {
      const token = localStorage.getItem('hyperbyke_token');
      console.log("Token:", token ? "Présent" : "Absent");
      const response = await fetch(`${API_BASE_URL}moto/moto/${idMoto}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log("Réponse du serveur (supprimerMoto):", response.status, response.statusText);
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Non autorisé - Token invalide ou expiré');
        } else if (response.status === 403) {
          throw new Error('Accès refusé - Droits insuffisants');
        } else if (response.status === 404) {
          throw new Error('Moto non trouvée');
        }
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      return true;
    } catch (error) {
      console.error("Erreur dans supprimerMoto:", error);
      throw error;
    }
  }
}
