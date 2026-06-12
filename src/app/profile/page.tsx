"use client";

import { useEffect, useState } from "react";
import api from "@/api/client";
import ProfileNav from "@/components/ProfileNav";
import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import Loading from "@/components/Loading";
import EmptyState from "@/components/ui/EmptyState";
import type { UserProfile } from "@/types/user";

// Normalize backend profile shape
function normalizeProfile(p: any): UserProfile {
  return {
    id: p.id,
    name: p.name ?? "Unknown User",
    avatar: p.avatar ?? null,
    leagues: p.leagues ?? [],
    stats: {
      totalPoints: p.stats?.totalPoints ?? 0,
      exactScores: p.stats?.exactScores ?? 0,
      correctScorers: p.stats?.correctScorers ?? 0,
      correctAssists: p.stats?.correctAssists ?? 0,
    },
  };
}

export default function ProfilePage() {
  const [data, setData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/profile");
        setData(normalizeProfile(res.data));
      } catch (err) {
        console.error("Failed to load profile:", err);
        setData(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <Loading />;
  if (!data) return <EmptyState message="Failed to load profile." />;

  return (
    <PageContainer size="md">
      <ProfileNav />
      <PageHeader title="Your Profile" />

      {/* USER HEADER */}
      <div className="flex items-center gap-4">
        {data.avatar ? (
          <img src={data.avatar} className="w-16 h-16 rounded-full shadow" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-gray-700 shadow">
            {data.name.charAt(0).toUpperCase()}
          </div>
        )}

        <div>
          <h1 className="text-2xl font-bold">{data.name}</h1>
          <p className="text-sm text-gray-500">User ID: {data.id}</p>
        </div>
      </div>

      {/* LEAGUES */}
      <div>
        <h2 className="font-semibold text-lg mb-2">Leagues</h2>

        {data.leagues.length === 0 ? (
          <p className="text-sm text-gray-500">Not in any leagues.</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {data.leagues.map((l) => (
              <li key={l.id} className="flex justify-between">
                <span>{l.name}</span>
                <span>
                  Rank: {l.rank ?? "-"} • Points: {l.points ?? 0}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* STATS */}
      <div>
        <h2 className="font-semibold text-lg mb-2">Stats</h2>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <StatCard label="Total Points" value={data.stats.totalPoints} />
          <StatCard label="Exact Scores" value={data.stats.exactScores} />
          <StatCard label="Correct Scorers" value={data.stats.correctScorers} />
          <StatCard label="Correct Assists" value={data.stats.correctAssists} />
        </div>
      </div>
    </PageContainer>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="border p-3 rounded bg-white shadow-sm">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}
