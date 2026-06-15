import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket() {
  if (typeof window === "undefined") {
    return null;
  }

  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_API_URL!, {
      transports: ["websocket"],
    });
  }

  return socket;
}
