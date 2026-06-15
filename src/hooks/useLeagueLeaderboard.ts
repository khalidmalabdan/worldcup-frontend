"use client";

import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";
import { getLeagueLeaderboard } from "@/lib/api/leagues";

export function useLeagueLeaderboard(leagueId: string) {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const data = await getLeagueLeaderboard(leagueId);
    setMembers(data);
    setLoading(false);
  }

  useEffect(() => {
    if (!leagueId) return;

    load();

    const socket = getSocket();
    if (!socket) return;

    socket.emit("join:league", leagueId);

    const handler = (payload: { leagueId: string }) => {
      if (payload.leagueId === leagueId) {
        load();
      }
    };

    socket.on("league:leaderboardUpdated", handler);

    return () => {
      socket.off("league:leaderboardUpdated", handler);
    };
  }, [leagueId]);

  return { members, loading, reload: load };
}
