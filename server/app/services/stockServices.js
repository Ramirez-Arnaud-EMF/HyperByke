/**
 * @fileoverview Service pour la gestion du stock de pièces
 * @author Arnaud Ramirez
 * @date 11.06.2025
 * @version 1.0.0
 */

// filepath: c:\Users\RamirezA02\OneDrive - EDUETATFR\EMF\2e\295\Projet\HyperBikeServer\app\services\stockServices.js
const pool = require('../../config/database.js');

/**
 * Récupère tous les stocks de pièces depuis la base de données
 * @async
 * @function getAllStocks
 * @returns {Promise<Object[]>} Tableau contenant toutes les pièces avec leurs quantités en stock
 * @throws {Error} En cas d'erreur lors de la requête base de données
 * @example
 * const stocks = await getAllStocks();
 * // Retourne: [{ pk_piece: 1, nomPiece: "Moteur V8", quantiteStock: 15 }]
 */
const getAllStocks = async () => {
    const connexion = await pool.getConnection();
    try {
        const [rows] = await connexion.query(
            'SELECT pk_piece, nomPiece, quantiteStock FROM Piece'
        );
        return rows;
    } catch (error) {
        console.error('Erreur lors de la récupération des stocks :', error);
        throw error;
    } finally {
        if (connexion) connexion.release();
    }
};

/**
 * Met à jour la quantité de stock d'une pièce spécifique (remplace la valeur existante)
 * @async
 * @function updateStock
 * @param {number} pk_piece - L'ID de la pièce à mettre à jour
 * @param {number} quantiteStock - La nouvelle quantité de stock
 * @returns {Promise<boolean>} true si la mise à jour a réussi, false si la pièce n'existe pas
 * @throws {Error} En cas d'erreur lors de la mise à jour
 * @example
 * const misAJour = await updateStock(1, 25);
 * // Retourne: true si mise à jour réussie
 */
const updateStock = async (pk_piece, quantiteStock) => {
    const connexion = await pool.getConnection();
    try {
        const [result] = await connexion.query(
            'UPDATE Piece SET quantiteStock = ? WHERE pk_piece = ?',
            [quantiteStock, pk_piece]
        );
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Erreur lors de la mise à jour du stock :', error);
        throw error;
    } finally {
        if (connexion) connexion.release();
    }
};

/**
 * Ajoute une quantité spécifiée au stock existant d'une pièce
 * @async
 * @function addStock
 * @param {number} pk_piece - L'ID de la pièce
 * @param {number} quantiteToAdd - La quantité à ajouter au stock existant
 * @returns {Promise<boolean>} true si l'ajout a réussi, false si la pièce n'existe pas
 * @throws {Error} En cas d'erreur lors de l'ajout
 * @example
 * const ajoute = await addStock(1, 10);
 * // Retourne: true si ajout réussi (ancien stock + 10)
 */
const addStock = async (pk_piece, quantiteToAdd) => {
    const connexion = await pool.getConnection();
    try {
        const [result] = await connexion.query(
            'UPDATE Piece SET quantiteStock = quantiteStock + ? WHERE pk_piece = ?',
            [quantiteToAdd, pk_piece]
        );
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Erreur lors de l\'ajout de stock :', error);
        throw error;
    } finally {
        if (connexion) connexion.release();
    }
};

module.exports = {
    getAllStocks,
    updateStock,
    addStock,
};