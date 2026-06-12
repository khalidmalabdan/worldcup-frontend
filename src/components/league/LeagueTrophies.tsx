"use client";

interface Trophy {
  id: string;
  trophy: string; // e.g. "top_scorer"
  icon?: string;
  title?: string;
  description?: string;
  weekStart?: string;
  weekEnd?: string;
}

const TROPHY_ICONS: Record<string, string> = {
  top_scorer: "🏆",
  most_improved: "📈",
  consistent_predictor: "🎯",
};

export default function LeagueTrophies({ trophies }: { trophies: Trophy[] }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-3">Weekly Trophies</h2>

      {trophies.length === 0 ? (
        <p className="text-gray-500">No trophies yet.</p>
      ) : (
        <div className="space-y-4">
          {trophies.map((trophy) => {
            const icon =
              trophy.icon ||
              TROPHY_ICONS[trophy.trophy] ||
              "🏅";

            return (
              <div
                key={trophy.id}
                className="flex items-start gap-3 border-b pb-3 last:border-none"
              >
                <span className="text-3xl">{icon}</span>

                <div>
                  <p className="font-medium">
                    {trophy.title ?? trophy.trophy.replace(/_/g, " ")}
                  </p>

                  {trophy.description && (
                    <p className="text-gray-500 text-sm">
                      {trophy.description}
                    </p>
                  )}

                  {(trophy.weekStart || trophy.weekEnd) && (
                    <p className="text-gray-400 text-xs mt-1">
                      {trophy.weekStart?.slice(0, 10)} →{" "}
                      {trophy.weekEnd?.slice(0, 10)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
