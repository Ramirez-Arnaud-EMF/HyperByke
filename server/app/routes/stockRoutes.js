/**
 * @fileoverview Routes pour la gestion du stock de pièces
 * @author Arnaud Ramirez
 * @date 11.06.2025
 * @version 1.0.0
 */

const express = require("express");
const router = express.Router();

const validateAuthentification = require("../middlewares/validateAuthentification");
const stockController = require("../controllers/stockController");
const validateStock = require("../middlewares/validateStock");

/**
 * @swagger
 * /stock/allstock:
 *   get:
 *     summary: Récupère tout le stock de pièces
 *     tags: [Stock]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des pièces
 *
 * /stock/addstock/{id}:
 *   put:
 *     summary: Ajoute du stock à une pièce
 *     tags: [Stock]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantiteStock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Stock ajouté
 *
 * /stock/updatestock/{id}:
 *   put:
 *     summary: Met à jour la quantité de stock d'une pièce
 *     tags: [Stock]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantiteStock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Stock mis à jour
 */

router.get("/allstock",  validateAuthentification(['garagiste', 'logisticien']), stockController.getAllStocks);
router.put("/addstock/:id",  validateAuthentification(['logisticien']), validateStock, stockController.addStock);
router.put("/updatestock/:id",  validateAuthentification(['logisticien']), validateStock, stockController.updateStock);

module.exports = router;
