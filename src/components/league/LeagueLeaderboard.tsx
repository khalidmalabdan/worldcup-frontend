export default function LeagueLeaderboard({ leaderboard }: { leaderboard: any[] }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-3">Leaderboard</h2>

      <div className="space-y-3">
        {leaderboard.map((entry) => (
          <div key={entry.userId} className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="font-bold">{entry.rank}</span>
              <span>{entry.name}</span>
            </div>

            <span className="font-semibold">{entry.points}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
