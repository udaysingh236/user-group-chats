import swaggerJSDoc from "swagger-jsdoc";

const userSwaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User API",
      version: "1.0.0",
      description: "API for User operations",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ["./src/routes/user.routes.ts"],
};

const adminSwaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Admin API",
      version: "1.0.0",
      description: "API for Admin operations",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/admin.routes.ts"],
};

const userSwaggerSpec = swaggerJSDoc(userSwaggerOptions);
const adminSwaggerSpec = swaggerJSDoc(adminSwaggerOptions);

export { userSwaggerSpec, adminSwaggerSpec };
