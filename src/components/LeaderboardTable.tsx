import { LeaderboardResponse, LeagueMember } from "@/types/league";

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
            <th className="py-3 px-4">User</th>
            <th className="py-3 px-4 text-right">Points</th>
            <th className="py-3 px-4 text-right">Weekly</th>
            <th className="py-3 px-4 text-right">Monthly</th>
            <th className="py-3 px-4 text-right">Exact Scores</th>
          </tr>
        </thead>

        <tbody>
          {data.members.map((member: LeagueMember, index: number) => (
            <tr key={member.userId} className="border-b hover:bg-gray-50 transition">
              <td className="py-3 px-4 font-semibold">{member.rank ?? index + 1}</td>
              <td className="py-3 px-4">{member.name}</td>
              <td className="py-3 px-4 text-right">{member.points}</td>
              <td className="py-3 px-4 text-right">{member.weeklyPoints}</td>
              <td className="py-3 px-4 text-right">{member.monthlyPoints}</td>
              <td className="py-3 px-4 text-right">{member.exactScores}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
