import { useEffect, useState } from "react";
import { io as clientIo } from "socket.io-client";
import { getLeagueLeaderboard } from "@/lib/api/leagues";

const socket = clientIo(process.env.NEXT_PUBLIC_API_URL as string, {
  transports: ["websocket"],
});

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
