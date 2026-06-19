/**
 * @fileoverview Contrôleur pour la gestion des motos
 * @author HyperBike Team
 * @version 1.0.0
 */

// filepath: c:\Users\RamirezA02\OneDrive - EDUETATFR\EMF\2e\295\Projet\HyperBikeServer\app\controllers\motoController.js
const motoService = require('../services/motoService');

/**
 * Récupère toutes les motos avec leurs modèles
 * @async
 * @function getAllMotos
 * @param {Object} req - Objet de requête Express
 * @param {Object} res - Objet de réponse Express
 * @returns {Promise<void>} Réponse JSON avec la liste des motos
 * @throws {Error} 500 - En cas d'erreur serveur
 * @example
 * GET /api/moto/allmotos
 * 
 * Response:
 * [
 *   {
 *     "pk_moto": 1,
 *     "nomModele": "SportBike Pro"
 *   }
 * ]
 */
const getAllMotos = async (req, res) => {
    try {
        const motos = await motoService.getAllMotos();
        res.json(motos);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

/**
 * Récupère une moto spécifique par son ID avec ses détails et pièces
 * @async
 * @function getMoto
 * @param {Object} req - Objet de requête Express
 * @param {Object} req.params - Paramètres de la requête
 * @param {string} req.params.id - ID de la moto
 * @param {Object} res - Objet de réponse Express
 * @returns {Promise<void>} Réponse JSON avec les détails de la moto
 * @throws {Error} 404 - Si la moto n'est pas trouvée
 * @throws {Error} 500 - En cas d'erreur serveur
 * @example
 * GET /api/moto/moto/1
 * 
 * Response:
 * {
 *   "pk_moto": 1,
 *   "nomModele": "SportBike Pro",
 *   "dateLivraison": "2024-01-15",
 *   "nomClient": "Jean Dupont",
 *   "pieces": [
 *     {
 *       "nomPiece": "Moteur",
 *       "quantite": 1
 *     }
 *   ]
 * }
 */
const getMoto = async (req, res) => {
    try {
        const moto = await motoService.getMotoById(req.params.id);
        if (!moto) return res.status(404).json({ error: 'Moto non trouvée' });
        res.json(moto);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

/**
 * Ajoute une nouvelle moto avec sa configuration
 * @async
 * @function addMoto
 * @param {Object} req - Objet de requête Express
 * @param {Object} req.body - Corps de la requête
 * @param {string} req.body.nomClient - Nom du client
 * @param {number} req.body.pk_configurationMoto - ID de la configuration de moto
 * @param {string} req.body.dateLivraison - Date de livraison (format YYYY-MM-DD)
 * @param {Object} res - Objet de réponse Express
 * @returns {Promise<void>} Réponse JSON avec la moto créée
 * @throws {Error} 400 - Si des champs requis sont manquants
 * @throws {Error} 500 - En cas d'erreur serveur
 * @example
 * POST /api/moto/addmoto
 * {
 *   "nomClient": "Marie Martin",
 *   "pk_configurationMoto": 2,
 *   "dateLivraison": "2024-02-20"
 * }
 * 
 * Response:
 * {
 *   "pk_moto": 5,
 *   "nomClient": "Marie Martin",
 *   "pk_configurationMoto": 2,
 *   "dateLivraison": "2024-02-20"
 * }
 */
const addMoto = async (req, res) => {
    const { nomClient, pk_configurationMoto, dateLivraison } = req.body;
    if (!nomClient || !pk_configurationMoto || !dateLivraison) {
        return res.status(400).json({ error: 'Champs manquants' });
    }
    try {
        const moto = await motoService.addMoto({ nomClient, pk_configurationMoto, dateLivraison });
        res.status(201).json(moto);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

/**
 * Supprime une moto par son ID
 * @async
 * @function deleteMoto
 * @param {Object} req - Objet de requête Express
 * @param {Object} req.params - Paramètres de la requête
 * @param {string} req.params.id - ID de la moto à supprimer
 * @param {Object} res - Objet de réponse Express
 * @returns {Promise<void>} Réponse JSON confirmant la suppression
 * @throws {Error} 404 - Si la moto n'est pas trouvée
 * @throws {Error} 500 - En cas d'erreur serveur
 * @example
 * DELETE /api/moto/deletemoto/1
 * 
 * Response:
 * {
 *   "message": "Moto supprimée"
 * }
 */
const deleteMoto = async (req, res) => {
    try {
        const deleted = await motoService.deleteMoto(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Moto non trouvée' });
        res.json({ message: 'Moto supprimée' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

/**
 * Monte une pièce sur une moto (décrémente les quantités)
 * @async
 * @function montePiece
 * @param {Object} req - Objet de requête Express
 * @param {Object} req.params - Paramètres de la requête
 * @param {string} req.params.id - ID de la moto
 * @param {string} req.params.pieceId - ID de la pièce à monter
 * @param {Object} res - Objet de réponse Express
 * @returns {Promise<void>} Réponse JSON confirmant le montage
 * @throws {Error} 400 - Si le stock est insuffisant ou la pièce non trouvée
 * @throws {Error} 500 - En cas d'erreur serveur
 * @example
 * PUT /api/moto/montepiece/1/3
 * 
 * Response:
 * {
 *   "message": "Quantité décrémentée avec succès"
 * }
 */
const montePiece = async (req, res) => {
    const pk_moto = req.params.id;
    const pk_piece = req.params.pieceId;
    try {
        const decremented = await motoService.montePiece(pk_moto, pk_piece);
        if (decremented) {
            res.status(200).json({ message: 'Quantité décrémentée avec succès' });
        } else {
            res.status(400).json({ error: 'Impossible de décrémenter la quantité (stock insuffisant ou pièce non trouvée)' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur lors du décrément' });
    }
};

module.exports = {
    getAllMotos,
    getMoto,
    addMoto,
    deleteMoto,
    montePiece,
};