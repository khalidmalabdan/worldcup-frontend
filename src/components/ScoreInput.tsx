"use client";

export default function ScoreInput({
  homeScore,
  awayScore,
  setHomeScore,
  setAwayScore
}: {
  homeScore: string | number;
  awayScore: string | number;
  setHomeScore: (v: string) => void;
  setAwayScore: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-4">
      {/* Home Score */}
      <input
        type="number"
        min="0"
        value={homeScore}
        onChange={(e) => setHomeScore(e.target.value)}
        className="w-14 text-center border rounded-lg py-2 text-lg font-semibold 
                   focus:ring-2 focus:ring-blue-500 outline-none"
      />

      <span className="text-xl font-bold text-gray-700">-</span>

      {/* Away Score */}
      <input
        type="number"
        min="0"
        value={awayScore}
        onChange={(e) => setAwayScore(e.target.value)}
        className="w-14 text-center border rounded-lg py-2 text-lg font-semibold 
                   focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  );
}
