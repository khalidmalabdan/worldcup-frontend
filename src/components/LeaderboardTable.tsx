import { LeaderboardResponse, LeaderboardTeam } from "@/src/types/league";

interface LeaderboardTableProps {
  data: LeaderboardResponse;
}

export default function LeaderboardTable({ data }: LeaderboardTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="py-3 px-4">Rank</th>
            <th className="py-3 px-4">Team</th>
            <th className="py-3 px-4 text-right">Points</th>
            <th className="py-3 px-4 text-right">Wins</th>
            <th className="py-3 px-4 text-right">Losses</th>
            <th className="py-3 px-4 text-right">Draws</th>
          </tr>
        </thead>

        <tbody>
          {data.teams.map((team: LeaderboardTeam, index: number) => (
            <tr key={team.id} className="border-b hover:bg-gray-50 transition">
              <td className="py-3 px-4 font-semibold">{index + 1}</td>
              <td className="py-3 px-4">{team.name}</td>
              <td className="py-3 px-4 text-right">{team.points}</td>
              <td className="py-3 px-4 text-right">{team.wins}</td>
              <td className="py-3 px-4 text-right">{team.losses}</td>
              <td className="py-3 px-4 text-right">{team.draws}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
