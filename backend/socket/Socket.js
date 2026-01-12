import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// Allow frontend origin via environment variable (use FRONTEND_URL in production)
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Map to track users and their socket IDs
const userSocketMap = {}; // key: userId, value: socketId

// Helper function to get receiver's socket ID
export const getReciverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
    console.log(` User connected: ${userId}, socket ID: ${socket.id}`);
  }

  // Send updated list of online users
  io.emit("getonlineuser", Object.keys(userSocketMap));

  // Handle disconnection
  socket.on("disconnect", () => {
    if (userId && userSocketMap[userId]) {
      delete userSocketMap[userId];
      console.log(` User disconnected: ${userId}`);
      io.emit("getonlineuser", Object.keys(userSocketMap));
    }
  });
});

export { app, server, io };
