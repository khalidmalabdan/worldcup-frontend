export default function LeagueHeader({ league }: { league: any }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
      <img
        src={league.logo ?? "/default-league.png"}
        className="w-16 h-16 rounded-lg object-cover"
      />

      <div>
        <h1 className="text-2xl font-bold">{league.name}</h1>
        <p className="text-gray-500">
          {league.isPrivate ? "Private League" : "Public League"}
        </p>
      </div>
    </div>
  );
}
