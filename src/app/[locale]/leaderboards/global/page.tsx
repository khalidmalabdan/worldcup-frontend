"use client";

import { useEffect, useState } from "react";
import api from "@/lib/client";
import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import Loading from "@/components/Loading";
import EmptyState from "@/components/ui/EmptyState";
import GlobalLeaderboardTable from "@/components/leaderboard/GlobalLeaderboardTable";

// Normalize backend shape
function normalizeEntry(e: any) {
  return {
    userId: e.userId ?? e.id,
    name: e.name ?? "Unknown",
    avatar: e.avatar ?? null,
    points: e.points ?? 0,
    rank: e.rank ?? null,
  };
}

export default function GlobalLeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/leaderboard/global");
        const raw = res.data.leaderboard || res.data;
        setLeaderboard(raw.map(normalizeEntry));
      } catch (err) {
        console.error("Failed to load global leaderboard:", err);
        setLeaderboard([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <Loading />;

  return (
    <PageContainer size="md">
      <PageHeader title="Global Leaderboard" />

      {leaderboard.length === 0 ? (
        <EmptyState message="No leaderboard data available." />
      ) : (
        <GlobalLeaderboardTable data={leaderboard} />
      )}
    </PageContainer>
  );
}
