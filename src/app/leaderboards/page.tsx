"use client";

import { useEffect, useState } from "react";
import api from "@/src/api/client";

interface LeagueMember {
  userId: string;
  name: string;
  points: number;
  weeklyPoints: number;
  monthlyPoints: number;
  exactScores: number;
  correctScorers: number;
  correctAssists: number;
  achievements: string[];
  rank?: number;
  mostImproved?: boolean;
  doublePointUsed?: boolean;
}

interface League {
  id: string;
  name: string;
  members: LeagueMember[];
}

export default function LeaderboardsPage() {
  const [league, setLeague] = useState<League | null>(null);
  const [tab, setTab] = useState<"all" | "weekly" | "monthly">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/leagues");
        const globalLeague = res.data[0];
        setLeague(globalLeague);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading leaderboard...
      </div>
    );
  }

  if (!league) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        League not found
      </div>
    );
  }

  const sortedMembers = [...league.members].sort((a, b) => {
    if (tab === "all") return b.points - a.points;
    if (tab === "weekly") return b.weeklyPoints - a.weeklyPoints;
    return b.monthlyPoints - a.monthlyPoints;
  });

  const getPoints = (m: LeagueMember) =>
    tab === "all" ? m.points : tab === "weekly" ? m.weeklyPoints : m.monthlyPoints;

  const podium = sortedMembers.slice(0, 3);
  const others = sortedMembers.slice(3);

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-10">

      {/* TITLE */}
      <h1 className="text-3xl font-bold text-center">Leaderboard</h1>

      {/* TABS */}
      <div className="flex justify-center gap-3">
        {[
          { key: "all", label: "All‑Time" },
          { key: "weekly", label: "Weekly" },
          { key: "monthly", label: "Monthly" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as any)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              tab === t.key
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* PODIUM */}
      <div className="flex justify-center gap-6 mt-6">
        {podium.map((m, i) => (
          <div
            key={m.userId}
            className={`flex flex-col items-center p-4 rounded-xl shadow-md w-28 animate-fade-in`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div
              className={`text-3xl font-bold ${
                i === 0 ? "text-yellow-500" : i === 1 ? "text-gray-400" : "text-amber-700"
              }`}
            >
              {i + 1}
            </div>
            <div className="font-semibold text-center mt-1">{m.name}</div>
            <div className="text-lg font-bold mt-1">{getPoints(m)}</div>
          </div>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded-xl p-4">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="py-2">Rank</th>
              <th>Name</th>
              <th className="text-right">
                {tab === "all"
                  ? "Points"
                  : tab === "weekly"
                  ? "Weekly"
                  : "Monthly"}
              </th>
            </tr>
          </thead>

          <tbody>
            {others.map((m, i) => (
              <tr
                key={m.userId}
                className="border-b hover:bg-gray-50 transition animate-fade-in"
                style={{ animationDelay: `${(i + 3) * 40}ms` }}
              >
                <td className="py-2 font-semibold">{i + 4}</td>

                <td>
                  <div className="flex flex-col">
                    <span className="font-semibold">{m.name}</span>

                    {/* Achievements */}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {m.achievements.map((a, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-yellow-200 px-2 py-1 rounded"
                        >
                          {a}
                        </span>
                      ))}

                      {m.mostImproved && (
                        <span className="text-xs bg-green-200 px-2 py-1 rounded">
                          Most Improved
                        </span>
                      )}

                      {m.doublePointUsed && (
                        <span className="text-xs bg-purple-200 px-2 py-1 rounded">
                          Double Point Used
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                <td className="text-right font-bold">{getPoints(m)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
