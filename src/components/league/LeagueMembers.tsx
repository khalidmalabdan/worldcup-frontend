export default function LeagueMembers({ members }: { members: any[] }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-3">Members</h2>

      <div className="space-y-3">
        {members.map((m) => (
          <div key={m.userId} className="flex items-center gap-3">
            <img
              src={m.user.avatar ?? "/default-avatar.png"}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="font-medium">{m.user.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
