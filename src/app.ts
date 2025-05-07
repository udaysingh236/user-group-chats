import express from "express";
import { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import userRoutes from "./routes/user.routes";
import adminRoutes from "./routes/admin.routes";
import { userSwaggerSpec, adminSwaggerSpec } from "./utils/swagger";
import { authMiddleware, checkAdminRole, checkUserRole } from "./services/auth";

const app = express();
app.use(express.json());
app.use(morgan("tiny"));

app.use("/api/user", authMiddleware, checkUserRole, userRoutes);
app.use("/api/admin", authMiddleware, checkAdminRole, adminRoutes);

// User API Docs
app.use(
  "/api/docs/user",
  (req: Request, res: Response, next: NextFunction) => {
    console.log("User Swagger UI route hit");
    next();
  },
  swaggerUi.serve,
  swaggerUi.setup(userSwaggerSpec)
);

app.use(
  "/api/docs/admin",
  (req: Request, res: Response, next: NextFunction) => {
    console.log("Admin Swagger UI route hit");
    next();
  },
  swaggerUi.serve,
  swaggerUi.setup(adminSwaggerSpec)
);

// Admin API Docs

console.log("User Swagger Spec:", userSwaggerSpec);
console.log("Admin Swagger Spec:", adminSwaggerSpec);

export default app;
