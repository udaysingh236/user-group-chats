import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
const secretKey = process.env.JWT_SECRET || "your_secret_key";

export interface AuthPayload {
  userId: string;
  role: "user" | "admin";
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    const { userId, role } = decoded as AuthPayload;
    res.locals.auth = {
      userId,
      role,
    };
    next();
  });
};

export const checkUserRole = (req: Request, res: Response, next: NextFunction) => {
  const { role } = res.locals.auth;
  if (role !== "user") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

export const checkAdminRole = (req: Request, res: Response, next: NextFunction) => {
  const { role } = res.locals.auth;
  if (role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};
