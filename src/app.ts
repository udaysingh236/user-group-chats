import express from "express";
import { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import userRoutes from "./routes/user.routes";
import adminRoutes from "./routes/admin.routes";
import { userSwaggerSpec, adminSwaggerSpec, userSwaggerOptions } from "./utils/swagger";
import { authMiddleware, checkAdminRole, checkUserRole } from "./services/auth";

const app = express();
app.use(express.json());
app.use(morgan("tiny"));

app.use("/api/user", authMiddleware, checkUserRole, userRoutes);
app.use("/api/admin", authMiddleware, checkAdminRole, adminRoutes);

// Read: https://github.com/scottie1984/swagger-ui-express?tab=readme-ov-file#two-swagger-documents
// User API Docs
app.use("/api/docs/user", swaggerUi.serveFiles(userSwaggerSpec), swaggerUi.setup(userSwaggerSpec));

// Admin API Docs
app.use(
  "/api/docs/admin",
  swaggerUi.serveFiles(adminSwaggerSpec),
  swaggerUi.setup(adminSwaggerSpec)
);

export default app;
