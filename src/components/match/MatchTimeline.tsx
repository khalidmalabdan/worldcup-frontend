"use client";

interface TimelineEvent {
  id: string;
  minute: number;
  type: string; // "goal", "yellow", "red", "substitution", etc.
  player: string;
  teamSide: "home" | "away";
  detail?: string;
}

const ICONS: Record<string, string> = {
  goal: "⚽",
  yellow: "🟨",
  red: "🟥",
  substitution: "🔁",
  chance: "🔥",
};

export default function MatchTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow mt-6">
      <h2 className="text-xl font-semibold mb-4">Match Timeline</h2>

      <div className="relative">
        {/* Center line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-200 -translate-x-1/2" />

        <div className="space-y-6">
          {events.map((ev) => {
            const icon = ICONS[ev.type] || "⚽";

            return (
              <div
                key={ev.id}
                className={`flex items-center gap-4 ${
                  ev.teamSide === "home"
                    ? "justify-start"
                    : "justify-end text-right"
                }`}
              >
                {/* Event bubble */}
                <div
                  className={`max-w-[60%] p-3 rounded-lg shadow-sm border ${
                    ev.teamSide === "home"
                      ? "bg-blue-50 border-blue-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{icon}</span>
                    <span className="font-semibold">{ev.player}</span>
                  </div>

                  {ev.detail && (
                    <p className="text-gray-600 text-sm mt-1">{ev.detail}</p>
                  )}

                  <p className="text-gray-400 text-xs mt-1">{ev.minute}'</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
