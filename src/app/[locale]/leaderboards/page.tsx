"use client";

import { useEffect, useState } from "react";
import api from "@/lib/client";
import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import Loading from "@/components/Loading";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";

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

// Normalize backend league shape
function normalizeLeague(l: any): League {
  return {
    id: l.id,
    name: l.name ?? "Global League",
    members: (l.members ?? []).map((m: any) => ({
      userId: m.userId,
      name: m.name ?? "Unknown",
      points: m.points ?? 0,
      weeklyPoints: m.weeklyPoints ?? 0,
      monthlyPoints: m.monthlyPoints ?? 0,
      exactScores: m.exactScores ?? 0,
      correctScorers: m.correctScorers ?? 0,
      correctAssists: m.correctAssists ?? 0,
      achievements: m.achievements ?? [],
      rank: m.rank ?? null,
      mostImproved: m.mostImproved ?? false,
      doublePointUsed: m.doublePointUsed ?? false,
    })),
  };
}

export default function LeaderboardsPage() {
  const [league, setLeague] = useState<League | null>(null);
  const [tab, setTab] = useState<"all" | "weekly" | "monthly">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/leagues");
        const globalLeague = normalizeLeague(res.data[0]);
        setLeague(globalLeague);
      } catch (err) {
        console.error("Failed to load leaderboard:", err);
        setLeague(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <Loading />;
  if (!league) return <EmptyState message="League not found." />;

  const sortedMembers = [...league.members].sort((a, b) => {
    if (tab === "all") return b.points - a.points;
    if (tab === "weekly") return b.weeklyPoints - a.weeklyPoints;
    return b.monthlyPoints - a.monthlyPoints;
  });

  const getPoints = (m: LeagueMember) =>
    tab === "all"
      ? m.points
      : tab === "weekly"
      ? m.weeklyPoints
      : m.monthlyPoints;

  const podium = sortedMembers.slice(0, 3);
  const others = sortedMembers.slice(3);

  return (
    <PageContainer size="md">
      <PageHeader title="Leaderboard" />

      {/* TABS */}
      <div className="flex justify-center gap-3 mb-6">
        {[
          { key: "all", label: "All‑Time" },
          { key: "weekly", label: "Weekly" },
          { key: "monthly", label: "Monthly" },
        ].map((t) => (
          <Button
            key={t.key}
            variant={tab === t.key ? "primary" : "secondary"}
            onClick={() => setTab(t.key as any)}
          >
            {t.label}
          </Button>
        ))}
      </div>

      {/* PODIUM */}
      <div className="flex justify-center gap-6 mt-6">
        {podium.map((m, i) => (
          <div
            key={m.userId}
            className="flex flex-col items-center p-4 rounded-xl shadow-md w-28 bg-white animate-fade-in"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div
              className={`text-3xl font-bold ${
                i === 0
                  ? "text-yellow-500"
                  : i === 1
                  ? "text-gray-400"
                  : "text-amber-700"
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
      <div className="bg-white shadow rounded-xl p-4 mt-10 overflow-x-auto">
        <table className="w-full text-left min-w-[500px]">
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
    </PageContainer>
  );
}
