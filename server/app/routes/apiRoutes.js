/**
 * @fileoverview Routes principales de l'API - Point d'entrée pour tous les endpoints
 * @author Arnaud Ramirez
 * @date 11.06.2025
 * @version 1.0.0
 */

const express = require("express");
const router = express.Router();

const motoRoutes = require("./motoRoutes");
const stockRoutes = require("./stockRoutes");
const authentificationRoutes = require("./authentificationRoutes");

/**
 * Configuration des routes principales de l'API
 * @description Définit les préfixes pour chaque groupe de routes
 * - /api/moto/* : Gestion des motos
 * - /api/stock/* : Gestion du stock
 * - /api/authentification/* : Authentification
 */

router.use("/moto", motoRoutes);
router.use("/stock", stockRoutes);
router.use("/authentification", authentificationRoutes);

module.exports = router;