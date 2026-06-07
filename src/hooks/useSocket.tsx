import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export default function useSocket(onConnect?: (s: Socket) => void) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL!, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to socket server");
      onConnect && onConnect(socket);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return socketRef.current;
}
