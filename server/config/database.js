/**
 * @fileoverview Configuration de la base de données MySQL pour HyperBike
 * @author Arnaud Ramirez
 * @date 11.06.2025
 * @version 1.0.0
 */

const mysql = require("mysql2/promise");
require("dotenv").config();

/**
 * Pool de connexions MySQL configuré avec les variables d'environnement
 * @type {mysql.Pool}
 * @description Configuration du pool de connexions pour optimiser les performances
 * avec gestion automatique des connexions multiples
 */
const connection = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
});

module.exports = connection;
