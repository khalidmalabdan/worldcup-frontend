import { fetchLeaderboard } from "@/src/services/fetchLeaderboard";
import LeaderboardTable from "@/src/components/LeaderboardTable";
import { LeaderboardResponse } from "@/src/types/league";

interface WeeklyPageProps {
  params: {
    leagueId: string;
  };
}

export default async function WeeklyPage({ params }: WeeklyPageProps) {
  const data: LeaderboardResponse = await fetchLeaderboard(params.leagueId, "weekly");

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Weekly Leaderboard</h2>
      <LeaderboardTable data={data} />
    </>
  );
}
