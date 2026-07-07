/**import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Event Management API",
      version: "1.0.0",
      description: "API documentation for the Event Management System",
    },

    servers: [
      {
        url: "http://localhost:3000",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Invalid request.",
            },
          },
        },
      },
    },
  },

  apis: [
    "./src/routes/*.js",
    "./src/app.js",
  ],
};

export default swaggerJsdoc(options);**/