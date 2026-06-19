/**
 * @fileoverview Middleware de validation pour les données de moto
 * @author Arnaud Ramirez
 * @date 11.06.2025
 * @version 1.0.0
 */

const Joi = require('joi');

/**
 * Middleware pour valider les données d'une moto
 * @function validateMoto
 * @param {Object} req - Objet de requête Express
 * @param {Object} req.body - Corps de la requête
 * @param {string} req.body.nomClient - Nom du client (string non vide)
 * @param {number} req.body.pk_configurationMoto - ID de configuration (number)
 * @param {string} req.body.dateLivraison - Date de livraison (format YYYY-MM-DD)
 * @param {Object} res - Objet de réponse Express
 * @param {Function} next - Fonction next d'Express
 * @returns {void|Response} Passe au middleware suivant ou retourne une erreur 400
 * @throws {Error} 400 - Si les champs requis sont manquants ou invalides
 * @example
 * router.post('/moto', validateMoto, controller.addMoto);
 */
const motoSchema = Joi.object({
    nomClient: Joi.string().trim().min(1).required(),
    pk_configurationMoto: Joi.number().required(),
    dateLivraison: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required()
});

module.exports = (req, res, next) => {
    const { error } = motoSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            error: error.details[0].message
        });
    }
    next();
};
