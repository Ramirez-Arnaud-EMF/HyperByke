/**
 * @fileoverview Configuration Swagger/OpenAPI pour la documentation de l'API HyperBike
 * @author Arnaud Ramirez
 * @date 11.06.2025
 * @version 1.0.0
 */

const swaggerJSDoc = require('swagger-jsdoc');

/**
 * Options de configuration pour la génération de la documentation Swagger
 * @type {Object}
 * @description Configuration OpenAPI 3.0 avec authentification JWT Bearer
 */
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HyperBike API',
      version: '1.0.0',
      description: 'Documentation de l\'API HyperBike',
    },
    servers: [
      {
        url: 'https://arnaudramirez.emf-informatique.ch/api',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'https',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./app/routes/*.js'],
};

/**
 * @fileoverview Configuration des spécifications Swagger générées
 * @type {Object}
 */
const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
