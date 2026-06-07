import { fetchLeaderboard } from "@/src/services/fetchLeaderboard";
import LeaderboardTable from "@/src/components/LeaderboardTable";
import { LeaderboardResponse } from "@/src/types/league";

interface AllTimePageProps {
  params: {
    leagueId: string;
  };
}

export default async function AllTimePage({ params }: AllTimePageProps) {
  const data: LeaderboardResponse = await fetchLeaderboard(
    params.leagueId,
    "alltime"
  );

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">All‑time Leaderboard</h2>
      <LeaderboardTable data={data} />
    </>
  );
}
