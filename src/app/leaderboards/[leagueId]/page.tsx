"use client";

import { useApi } from "@/lib/useApi";
import api from "@/lib/client";
import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import Loading from "@/components/Loading";
import EmptyState from "@/components/ui/EmptyState";

// Normalize backend shape
function normalizeLeaderboard(data: any) {
  if (!data) return null;

  return {
    leagueName: data.leagueName ?? "League Leaderboard",
    members: (data.members ?? []).map((m: any) => ({
      userId: m.userId,
      name: m.name ?? "Unknown",
      points: m.points ?? 0,
      rank: m.rank ?? "-",
    })),
  };
}

export default function LeagueLeaderboardPage({
  params,
}: {
  params: { leagueId: string };
}) {
  const leagueId = params.leagueId;

  const { data, loading } = useApi(
    async () => {
      try {
        const res = await api.get(`/leagues/${leagueId}/leaderboard`);
        return normalizeLeaderboard(res.data);
      } catch (err) {
        console.error("Failed to load leaderboard:", err);
        return null;
      }
    },
    [leagueId]
  );

  if (loading) return <Loading />;

  if (!data)
    return <EmptyState message="Failed to load league leaderboard." />;

  return (
    <PageContainer size="md">
      <PageHeader title={data.leagueName} />

      <div className="bg-white shadow rounded-xl p-4 overflow-x-auto">
        <table className="w-full text-left min-w-[500px]">
          <thead>
            <tr className="bg-gray-100 border-b text-gray-700">
              <th className="p-2 text-left">Rank</th>
              <th className="p-2 text-left">User</th>
              <th className="p-2 text-right">Points</th>
            </tr>
          </thead>

          <tbody>
            {data.members.map((m: any, idx: number) => (
              <tr
                key={m.userId}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-2 font-semibold">{m.rank ?? idx + 1}</td>
                <td className="p-2">{m.name}</td>
                <td className="p-2 text-right font-bold">{m.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageContainer>
  );
}
