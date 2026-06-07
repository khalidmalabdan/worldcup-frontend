import { Server } from "socket.io";
import { Server as HTTPServer } from "http";

export function setupSocket(server: HTTPServer) {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_ORIGIN || "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("match:subscribe", (matchId: string) => {
      socket.join(`match:${matchId}`);
    });

    socket.on("prediction:subscribe", (matchId: string) => {
      socket.join(`prediction:${matchId}`);
    });

    socket.on("league:subscribe", (leagueId: string) => {
      socket.join(`league:${leagueId}`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
}
