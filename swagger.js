import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'OpenMYC API',
    version: '1.0.0',
    description: 'API for all comedy open mics in NYC',
  },
};

const options = {
  swaggerDefinition,
  apis: ['src/routes/routes.ts'], // Path to the API routes in your Node.js application
};

const swaggerSpec = swaggerJSDoc(options);

console.log(swaggerSpec);

export default swaggerSpec;
