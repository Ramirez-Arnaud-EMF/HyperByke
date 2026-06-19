/**
 * @fileoverview Routes pour la gestion des motos
 * @author Arnaud Ramirez
 * @date 11.06.2025
 * @version 1.0.0
 */

const express = require("express");
const router = express.Router();

const validateAuthentification = require("../middlewares/validateAuthentification");
const motoController = require("../controllers/motoController");
const validateMoto = require("../middlewares/validateMoto");

/**
 * @swagger
 * tags:
 *   - name: Moto
 *     description: Opérations sur les motos
 */

/**
 * @swagger
 * /moto/allmotos:
 *   get:
 *     summary: Récupère toutes les motos
 *     tags: [Moto]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des motos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   pk_moto:
 *                     type: integer
 *                   nomModele:
 *                     type: string
 */
router.get("/allmotos", validateAuthentification(['garagiste']), motoController.getAllMotos);

/**
 * @swagger
 * /moto/moto/{id}:
 *   get:
 *     summary: Récupère une moto par son id
 *     tags: [Moto]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détail de la moto
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
 */
router.get("/moto/:id", validateAuthentification(['garagiste']), motoController.getMoto);

/**
 * @swagger
 * /moto/addmoto:
 *   post:
 *     summary: Ajoute une nouvelle moto
 *     tags: [Moto]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nomClient:
 *                 type: string
 *               pk_configurationMoto:
 *                 type: integer
 *               dateLivraison:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Moto ajoutée
 *       400:
 *         description: Champs manquants
 */
router.post("/addmoto", validateAuthentification(['garagiste']), validateMoto, motoController.addMoto);

/**
 * @swagger
 * /moto/moto/{id}:
 *   delete:
 *     summary: Supprime une moto
 *     tags: [Moto]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Moto supprimée
 *       404:
 *         description: Moto non trouvée
 */
router.delete("/moto/:id", validateAuthentification(['garagiste']), motoController.deleteMoto);

/**
 * @swagger
 * /moto/moto/{id}/piece/{pieceId}:
 *   delete:
 *     summary: Décrémente une pièce d'une moto et du stock
 *     tags: [Moto]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: pieceId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Quantité décrémentée
 *       400:
 *         description: Stock insuffisant ou pièce non trouvée
 */
router.delete("/moto/:id/piece/:pieceId", validateAuthentification(['garagiste']), motoController.montePiece);

module.exports = router;
