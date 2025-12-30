import { io } from "socket.io-client";
import { BASE_URL } from "@/env";

let socket = null;

// connect socket (call once after login)
export const connectSocket = (userId) => {
  if (socket) return socket;

  socket = io(BASE_URL, {
    transports: ["polling", "websocket"],
    reconnection: true,
  })

  socket.on("connect", () => {
    socket.emit("join_user", userId);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};