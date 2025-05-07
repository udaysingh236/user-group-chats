// socket/auth.ts
import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import logger from "../utils/logger";

interface JwtPayload {
  userId: string;
  role: string;
}

export const socketAuthMiddleware = (socket: Socket, next: (err?: Error) => void) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error("Authentication token missing"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    // Attach user data to socket
    socket.data.user = decoded;
    next();
  } catch (err) {
    logger.error("JWT auth failed:", err);
    return next(new Error("Invalid token"));
  }
};
