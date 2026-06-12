"use client";

import { useEffect, useState } from "react";
import api from "@/api/client";
import ProfileNav from "@/components/ProfileNav";
import type { MatchHistoryEntry } from "@/types/history";

export default function HistoryPage() {
  const [history, setHistory] = useState<MatchHistoryEntry[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/profile/history");
        setHistory(res.data.history || res.data);
      } catch (err) {
        console.error("Failed to load history:", err);
        setHistory(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!history) return <div className="p-6 text-red-500">Failed to load</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <ProfileNav />

      <h1 className="text-xl font-bold">Match History</h1>

      {history.length === 0 ? (
        <p className="text-sm text-gray-500">No finished matches yet.</p>
      ) : (
        <div className="space-y-3">
          {history.map((h) => (
            <div
              key={h.matchId}
              className="border p-3 rounded text-sm flex justify-between"
            >
              {/* MATCH INFO */}
              <div>
                <div className="font-semibold">
                  {h.homeTeam} vs {h.awayTeam}
                </div>
                <div className="text-gray-500">
                  Final: {h.finalScore.home} - {h.finalScore.away}
                </div>
              </div>

              {/* USER PREDICTION */}
              <div className="text-right">
                {h.prediction ? (
                  <>
                    <div>
                      Your: {h.prediction.homeScore} - {h.prediction.awayScore}
                    </div>
                    <div className="text-xs text-gray-500">
                      Double: {h.prediction.doublePoint ? "Yes" : "No"}
                    </div>
                    <div className="font-semibold">
                      +{h.prediction.points} pts
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-gray-400">No prediction</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
