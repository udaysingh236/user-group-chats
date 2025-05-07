import { Server as SocketIOServer } from "socket.io";
import http from "http";
import { socketAuthMiddleware } from "./auth";
import logger from "../utils/logger";

export function setupSocket(server: http.Server) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*",
    },
  });

  io.use(socketAuthMiddleware);

  const onlineUsers = new Map<string, string>(); // userId -> socketId

  io.on("connection", (socket) => {
    const { userId, role } = socket.data.user; // ✅ use this instead of handshake.query.userId
    logger.info(`Authenticated user: ${userId}, role: ${role}`);
    if (userId) {
      onlineUsers.set(userId, socket.id);
    }

    // Cleanup
    socket.on("disconnect", () => {
      onlineUsers.forEach((sockId, uid) => {
        if (sockId === socket.id) {
          onlineUsers.delete(uid);
        }
      });
    });

    // Handle private message
    socket.on("private_message", ({ toUserId, message }) => {
      const toSocketId = onlineUsers.get(toUserId);
      if (toSocketId) {
        io.to(toSocketId).emit("private_message", {
          fromUserId: userId,
          message,
        });
      }
    });

    // Join group
    socket.on("join_group", ({ groupId }) => {
      socket.join(groupId);
    });

    // Leave group
    socket.on("leave_group", ({ groupId }) => {
      socket.leave(groupId);
    });

    // Group message
    socket.on("group_message", ({ groupId, message }) => {
      socket.to(groupId).emit("group_message", {
        fromUserId: userId,
        groupId,
        message,
      });
    });
  });
}
