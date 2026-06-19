/**
 * @fileoverview Routes pour l'authentification des utilisateurs
 * @author Arnaud Ramirez
 * @date 11.06.2025
 * @version 1.0.0
 */

const express = require("express");
const router = express.Router();

const authentificationController = require("../controllers/authentificationController");

/**
 * @swagger
 * /authentification/login:
 *   post:
 *     summary: Authentifie un utilisateur et retourne un token JWT
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Authentification réussie, retourne le token
 *       400:
 *         description: Champs manquants
 *       401:
 *         description: Identifiants incorrects
 */
router.post("/login", authentificationController.login);

module.exports = router;
