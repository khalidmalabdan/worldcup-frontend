import { LeaderboardResponse } from "@/types/league";

export async function fetchLeaderboard(
  leagueId: string,
  type: string
): Promise<LeaderboardResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/leagues/${type}/${leagueId}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch leaderboard");
  }

  return res.json();
}
