/**
 * @fileoverview Contrôleur pour la gestion du stock de pièces
 * @author HyperBike Team
 * @version 1.0.0
 */

// filepath: c:\Users\RamirezA02\OneDrive - EDUETATFR\EMF\2e\295\Projet\HyperBikeServer\app\controllers\stockController.js
const stockServices = require('../services/stockServices');

/**
 * Récupère tout le stock de pièces disponibles
 * @async
 * @function getAllStocks
 * @param {Object} req - Objet de requête Express
 * @param {Object} res - Objet de réponse Express
 * @returns {Promise<void>} Réponse JSON avec la liste des stocks
 * @throws {Error} 500 - En cas d'erreur serveur interne
 * @example
 * GET /api/stock/allstock
 * 
 * Response:
 * [
 *   {
 *     "pk_piece": 1,
 *     "nomPiece": "Moteur V8",
 *     "quantiteStock": 15
 *   }
 * ]
 */
const getAllStocks = async (req, res) => {
    try {
        const rows = await stockServices.getAllStocks();
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * Ajoute du stock à une pièce existante
 * @async
 * @function addStock
 * @param {Object} req - Objet de requête Express
 * @param {Object} req.params - Paramètres de la requête
 * @param {string} req.params.id - ID de la pièce
 * @param {Object} req.body - Corps de la requête
 * @param {number} req.body.quantiteStock - Quantité à ajouter au stock
 * @param {Object} res - Objet de réponse Express
 * @returns {Promise<void>} Réponse JSON confirmant l'ajout
 * @throws {Error} 400 - Si quantiteStock n'est pas un nombre
 * @throws {Error} 404 - Si la pièce n'est pas trouvée
 * @throws {Error} 500 - En cas d'erreur serveur
 * @example
 * PUT /api/stock/addstock/1
 * {
 *   "quantiteStock": 10
 * }
 * 
 * Response:
 * {
 *   "message": "Stock ajouté avec succès"
 * }
 */
const addStock = async (req, res) => {
    const pk_piece = req.params.id;
    const { quantiteStock } = req.body;

    if (typeof quantiteStock !== 'number') {
        return res.status(400).json({ error: 'quantiteStock doit être un nombre' });
    }

    try {
        const updated = await stockServices.addStock(pk_piece, quantiteStock);
        if (updated) {
            res.status(200).json({ message: 'Stock ajouté avec succès' });
        } else {
            res.status(404).json({ error: 'Pièce non trouvée' });
        }
    } catch (error) {
        res.status(400).json({ error: 'Bad Request' });
    }
};

/**
 * Met à jour la quantité de stock d'une pièce (remplace la valeur existante)
 * @async
 * @function updateStock
 * @param {Object} req - Objet de requête Express
 * @param {Object} req.params - Paramètres de la requête
 * @param {string} req.params.id - ID de la pièce
 * @param {Object} req.body - Corps de la requête
 * @param {number} req.body.quantiteStock - Nouvelle quantité de stock
 * @param {Object} res - Objet de réponse Express
 * @returns {Promise<void>} Réponse JSON confirmant la mise à jour
 * @throws {Error} 400 - Si quantiteStock n'est pas un nombre
 * @throws {Error} 404 - Si la pièce n'est pas trouvée
 * @throws {Error} 500 - En cas d'erreur serveur
 * @example
 * PUT /api/stock/updatestock/1
 * {
 *   "quantiteStock": 25
 * }
 * 
 * Response:
 * {
 *   "message": "Stock mis à jour avec succès"
 * }
 */
const updateStock = async (req, res) => {
    const pk_piece = req.params.id;
    const { quantiteStock } = req.body;

    if (typeof quantiteStock !== 'number') {
        return res.status(400).json({ error: 'quantiteStock doit être un nombre' });
    }

    try {
        const updated = await stockServices.updateStock(pk_piece, quantiteStock);
        if (updated) {
            res.status(200).json({ message: 'Stock mis à jour avec succès' });
        } else {
            res.status(404).json({ error: 'Pièce non trouvée' });
        }
    } catch (error) {
        res.status(400).json({ error: 'Bad Request' });
    }
};

module.exports = {
    getAllStocks,
    addStock,
    updateStock,
};