"use client";

import { useEffect, useState } from "react";
import api from "@/api/client";
import { adminApi } from "@/api/admin";
import OverrideModal from "./OverrideModal";

// ✅ Runtime‑risk fix: normalize backend match shape
function normalizeMatch(m: any) {
  return {
    id: m.id ?? m.matchId,
    homeTeam: m.homeTeam ?? m.home,
    awayTeam: m.awayTeam ?? m.away,
    ...m,
  };
}

export default function AdminScoringPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [overrideData, setOverrideData] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/matches/finished");
        const data = res.data;

        // ✅ Apply normalization here
        const raw = data.matches || data;
        setMatches(raw.map(normalizeMatch));
      } catch (err) {
        console.error("Failed to load finished matches:", err);
        setMatches([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const call = async (path: string) => {
    try {
      await adminApi.post(path);
      alert("Action completed");
    } catch (err) {
      console.error("Admin scoring action failed:", err);
      alert("Error performing action");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading scoring dashboard...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">Admin Scoring Dashboard</h1>

      {/* GLOBAL ACTIONS */}
      <div className="flex gap-4">
        <button
          onClick={() => call("/scoring/score-all")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Score All Finished Matches
        </button>

        <button
          onClick={() => call("/scoring/rescore-all")}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Re‑Score All Matches
        </button>
      </div>

      {/* MATCH LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {matches.map((m) => (
          <div key={m.id} className="p-4 border rounded shadow bg-white">
            <h2 className="font-semibold text-lg">
              {m.homeTeam} vs {m.awayTeam}
            </h2>
            <p className="text-gray-500 text-sm">Match ID: {m.id}</p>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => call(`/scoring/score/${m.id}`)}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Score
              </button>

              <button
                onClick={() => call(`/scoring/rescore/${m.id}`)}
                className="px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700"
              >
                Re‑Score
              </button>

              <button
                onClick={() => setOverrideData({ matchId: m.id })}
                className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Override Points
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* OVERRIDE MODAL */}
      {overrideData && (
        <OverrideModal
          matchId={overrideData.matchId}
          onClose={() => setOverrideData(null)}
        />
      )}
    </div>
  );
}
