/**
 * @fileoverview Middleware de validation pour les données de stock
 * @author Arnaud Ramirez
 * @date 11.06.2025
 * @version 1.0.0
 */

const Joi = require('joi');

/**
 * Middleware pour valider les données de stock
 * @function validateStock
 * @param {Object} req - Objet de requête Express
 * @param {Object} req.body - Corps de la requête
 * @param {number} req.body.quantiteStock - Quantité de stock (doit être un entier positif)
 * @param {Object} res - Objet de réponse Express
 * @param {Function} next - Fonction next d'Express
 * @returns {void|Response} Passe au middleware suivant ou retourne une erreur 400
 * @throws {Error} 400 - Si quantiteStock n'est pas un nombre entier positif
 * @example
 * router.put('/stock/:id', validateStock, controller.updateStock);
 */
const stockSchema = Joi.object({
    quantiteStock: Joi.number().integer().min(0).required()
});

module.exports = (req, res, next) => {
    const { error } = stockSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            error: error.details[0].message
        });
    }
    next();
};
