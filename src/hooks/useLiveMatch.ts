"use client";

import { useEffect, useState } from "react";
import { socket } from "@/src/lib/socket";

export function useLiveMatch(matchId: string | null) {
  const [minute, setMinute] = useState<number | null>(null);
  const [livePayload, setLivePayload] = useState<any | null>(null);
  const [finalPayload, setFinalPayload] = useState<any | null>(null);

  useEffect(() => {
    if (!matchId) return;

    socket.emit("match:subscribe", matchId);

    const handleUpdate = (payload: any) => {
      if (payload.id === matchId) setLivePayload(payload);
    };

    const handleMinute = (m: number) => setMinute(m);

    const handleFinal = (payload: any) => {
      if (payload.match.id === matchId) setFinalPayload(payload);
    };

    socket.on("match:update", handleUpdate);
    socket.on("match:minute", handleMinute);
    socket.on("match:final", handleFinal);

    return () => {
      socket.off("match:update", handleUpdate);
      socket.off("match:minute", handleMinute);
      socket.off("match:final", handleFinal);
    };
  }, [matchId]);

  return { minute, livePayload, finalPayload };
}
