"use client";

import { useEffect, useState } from "react";
import api from "@/lib/client";

import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import Loading from "@/components/Loading";
import EmptyState from "@/components/ui/EmptyState";

import LeagueHeader from "@/components/league/LeagueHeader";
import LeagueMembers from "@/components/league/LeagueMembers";
import LeagueLeaderboard from "@/components/league/LeagueLeaderboard";
import LeagueTrophies from "@/components/league/LeagueTrophies";

// Normalize backend league shape
function normalizeLeague(l: any) {
  return {
    id: l.id,
    name: l.name ?? "League",
    description: l.description ?? "",
    ownerId: l.ownerId ?? null,
    createdAt: l.createdAt ?? null,
    ...l,
  };
}

function normalizeMembers(list: any[]) {
  return list.map((m) => ({
    userId: m.userId,
    name: m.name ?? "Unknown",
    avatar: m.avatar ?? null,
    rank: m.rank ?? "-",
    points: m.points ?? 0,
    ...m,
  }));
}

function normalizeLeaderboard(list: any[]) {
  return list.map((m) => ({
    userId: m.userId,
    name: m.name ?? "Unknown",
    points: m.points ?? 0,
    rank: m.rank ?? "-",
    ...m,
  }));
}

function normalizeTrophies(list: any[]) {
  return list ?? [];
}

export default function LeaguePage({
  params,
}: {
  params: { leagueId: string };
}) {
  const leagueId = params.leagueId;

  const [league, setLeague] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [trophies, setTrophies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [l, m, lb, t] = await Promise.all([
          api.get(`/leagues/${leagueId}`),
          api.get(`/leagues/${leagueId}/members`),
          api.get(`/leagues/${leagueId}/leaderboard`),
          api.get(`/leagues/${leagueId}/trophies`),
        ]);

        setLeague(normalizeLeague(l.data));
        setMembers(normalizeMembers(m.data.members ?? m.data));
        setLeaderboard(normalizeLeaderboard(lb.data.members ?? lb.data));
        setTrophies(normalizeTrophies(t.data.trophies ?? t.data));
      } catch (err) {
        console.error("Failed to load league:", err);
        setLeague(null);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [leagueId]);

  if (loading) return <Loading />;

  if (!league)
    return <EmptyState message="Failed to load league data." />;

  return (
    <PageContainer size="md">
      <PageHeader title={league.name} />

      {/* League Header */}
      <LeagueHeader league={league} />

      {/* Leaderboard */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Leaderboard</h2>
        <LeagueLeaderboard leaderboard={leaderboard} />
      </section>

      {/* Members */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-3">Members</h2>
        <LeagueMembers members={members} />
      </section>

      {/* Weekly Trophies */}
      <section className="mt-10">
        <LeagueTrophies trophies={trophies} />
      </section>
    </PageContainer>
  );
}
