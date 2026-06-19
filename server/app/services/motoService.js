/**
 * @fileoverview Service pour la gestion des motos et opérations associées
 * @author Arnaud Ramirez
 * @date 11.06.2025
 * @version 1.0.0
 */

// filepath: c:\Users\RamirezA02\OneDrive - EDUETATFR\EMF\2e\295\Projet\HyperBikeServer\app\services\motoService.js
const pool = require("../../config/database.js");

/**
 * Récupère toutes les motos avec leurs modèles depuis la base de données
 * @async
 * @function getAllMotos
 * @returns {Promise<Object[]>} Tableau contenant toutes les motos avec leurs modèles
 * @throws {Error} En cas d'erreur lors de la requête base de données
 * @example
 * const motos = await getAllMotos();
 * // Retourne: [{ pk_moto: 1, nomModele: "SportBike Pro" }]
 */
const getAllMotos = async () => {
    const connexion = await pool.getConnection();
    try {
        const [rows] = await connexion.query(`
            SELECT m.pk_moto, c.nomModele
            FROM Moto m
            JOIN ConfigurationMoto c ON m.fk_configurationMoto = c.pk_configurationMoto
        `);
        return rows;
    } catch (error) {
        console.error('Erreur lors de la récupération des motos :', error);
        throw error;
    } finally {
        if (connexion) connexion.release();
    }
};

/**
 * Récupère une moto spécifique par son ID avec ses détails et pièces associées
 * @async
 * @function getMotoById
 * @param {number} pk_moto - L'ID de la moto à récupérer
 * @returns {Promise<Object|null>} Objet contenant les détails de la moto et ses pièces (avec pk_piece), ou null si non trouvée
 * @throws {Error} En cas d'erreur lors de la requête base de données
 * @swagger
 * /motos/{id}:
 *   get:
 *     summary: Récupère une moto par son ID
 *     description: Retourne les détails d'une moto et la liste de ses pièces associées (avec pk_piece)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la moto
 *     responses:
 *       200:
 *         description: Détails de la moto et ses pièces
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pk_moto:
 *                   type: integer
 *                 nomModele:
 *                   type: string
 *                 dateLivraison:
 *                   type: string
 *                   format: date
 *                 nomClient:
 *                   type: string
 *                 pieces:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       pk_piece:
 *                         type: integer
 *                       nomPiece:
 *                         type: string
 *                       quantite:
 *                         type: integer
 *       404:
 *         description: Moto non trouvée
 *       500:
 *         description: Erreur serveur
 * @example
 * const moto = await getMotoById(1);
 * // Retourne: {
 * //   pk_moto: 1,
 * //   nomModele: "SportBike Pro",
 * //   dateLivraison: "2024-01-15",
 * //   nomClient: "Jean Dupont",
 * //   pieces: [{ pk_piece: 1, nomPiece: "Moteur", quantite: 1 }]
 * // }
 */
const getMotoById = async (pk_moto) => {
    const connexion = await pool.getConnection();
    try {
        const [rows] = await connexion.query(`
            SELECT m.pk_moto, c.nomModele, m.dateLivraison, m.nomClient
            FROM Moto m
            JOIN ConfigurationMoto c ON m.fk_configurationMoto = c.pk_configurationMoto
            WHERE m.pk_moto = ?
        `, [pk_moto]);
        if (rows.length === 0) return null;

        const [pieces] = await connexion.query(`
            SELECT p.pk_piece, p.nomPiece, tmp.quantite
            FROM tr_moto_piece tmp
            JOIN Piece p ON tmp.fk_piece = p.pk_piece
            WHERE tmp.fk_moto = ?
        `, [pk_moto]);

        return { ...rows[0], pieces };
    } catch (error) {
        console.error('Erreur lors de la récupération de la moto :', error);
        throw error;
    } finally {
        if (connexion) connexion.release();
    }
};

/**
 * Ajoute une nouvelle moto dans la base de données avec sa configuration
 * @async
 * @function addMoto
 * @param {Object} motoData - Données de la moto à ajouter
 * @param {string} motoData.nomClient - Nom du client propriétaire
 * @param {number} motoData.pk_configurationMoto - ID de la configuration de moto
 * @param {string} motoData.dateLivraison - Date de livraison au format YYYY-MM-DD
 * @returns {Promise<Object>} Objet contenant les données de la moto créée
 * @throws {Error} En cas d'erreur lors de l'insertion en base de données
 * @example
 * const nouvelleMoto = await addMoto({
 *   nomClient: "Marie Martin",
 *   pk_configurationMoto: 2,
 *   dateLivraison: "2024-02-20"
 * });
 * // Retourne: { pk_moto: 5, nomClient: "Marie Martin", pk_configurationMoto: 2, dateLivraison: "2024-02-20" }
 */
const addMoto = async ({ nomClient, pk_configurationMoto, dateLivraison }) => {
    const connexion = await pool.getConnection();
    try {
        const [result] = await connexion.query(
            `INSERT INTO Moto (fk_configurationMoto, nomClient, dateLivraison) VALUES (?, ?, ?)`,
            [pk_configurationMoto, nomClient, dateLivraison]
        );
        const pk_moto = result.insertId;

        const [pieces] = await connexion.query(
            `SELECT fk_piece, quantite FROM tr_configurationMoto_piece WHERE fk_configurationMoto = ?`,
            [pk_configurationMoto]
        );

        for (const piece of pieces) {
            await connexion.query(
                `INSERT INTO tr_moto_piece (fk_moto, fk_piece, quantite) VALUES (?, ?, ?)`,
                [pk_moto, piece.fk_piece, piece.quantite]
            );
        }

        return { pk_moto, nomClient, pk_configurationMoto, dateLivraison };
    } catch (error) {
        console.error("Erreur lors de l'ajout de la moto :", error);
        throw error;
    } finally {
        if (connexion) connexion.release();
    }
};

/**
 * Supprime une moto de la base de données
 * @async
 * @function deleteMoto
 * @param {number} pk_moto - L'ID de la moto à supprimer
 * @returns {Promise<boolean>} true si la moto a été supprimée, false sinon
 * @throws {Error} En cas d'erreur lors de la suppression
 * @example
 * const supprimee = await deleteMoto(1);
 * // Retourne: true si suppression réussie
 */
const deleteMoto = async (pk_moto) => {
    const connexion = await pool.getConnection();
    try {
        const [result] = await connexion.query(
            `DELETE FROM Moto WHERE pk_moto = ?`,
            [pk_moto]
        );
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Erreur lors de la suppression de la moto :', error);
        throw error;
    } finally {
        if (connexion) connexion.release();
    }
};

/**
 * Monte une pièce sur une moto en décrémentant les quantités disponibles
 * Cette fonction utilise une transaction pour assurer la cohérence des données
 * @async
 * @function montePiece
 * @param {number} pk_moto - L'ID de la moto
 * @param {number} pk_piece - L'ID de la pièce à monter
 * @returns {Promise<boolean>} true si le montage a réussi, false si stock insuffisant
 * @throws {Error} En cas d'erreur lors de la transaction
 * @example
 * const reussi = await montePiece(1, 3);
 * // Retourne: true si montage réussi, false si stock insuffisant
 */
const montePiece = async (pk_moto, pk_piece) => {
    const connexion = await pool.getConnection();
    try {
        await connexion.beginTransaction();
        // Vérifier la quantité actuelle dans tr_moto_piece
        const [[trRow]] = await connexion.query(
            'SELECT quantite FROM tr_moto_piece WHERE fk_moto = ? AND fk_piece = ?',
            [pk_moto, pk_piece]
        );
        if (!trRow || trRow.quantite <= 0) {
            await connexion.rollback();
            return false;
        }
        // Vérifier la quantité actuelle dans Piece
        const [[pieceRow]] = await connexion.query(
            'SELECT quantiteStock FROM Piece WHERE pk_piece = ?',
            [pk_piece]
        );
        if (!pieceRow || pieceRow.quantiteStock <= 0) {
            await connexion.rollback();
            return false;
        }
        // Décrémenter dans tr_moto_piece
        await connexion.query(
            'UPDATE tr_moto_piece SET quantite = quantite - 1 WHERE fk_moto = ? AND fk_piece = ?',
            [pk_moto, pk_piece]
        );
        // Décrémenter dans Piece
        await connexion.query(
            'UPDATE Piece SET quantiteStock = quantiteStock - 1 WHERE pk_piece = ?',
            [pk_piece]
        );
        await connexion.commit();
        return true;
    } catch (error) {
        if (connexion) await connexion.rollback();
        console.error('Erreur lors du montage de la pièce :', error);
        throw error;
    } finally {
        if (connexion) connexion.release();
    }
};

module.exports = {
    getAllMotos,
    getMotoById,
    addMoto,
    deleteMoto,
    montePiece,
};