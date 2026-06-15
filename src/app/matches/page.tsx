"use client";

import { useEffect, useState } from "react";
import api from "@/lib/client";
import MatchCard from "@/components/MatchCard";
import Loading from "@/components/Loading";
import EmptyState from "@/components/ui/EmptyState";
import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";

// Normalize backend match shape
function normalizeMatch(m: any) {
  return {
    id: m.id ?? m.matchId,
    homeTeam: m.homeTeam ?? m.home,
    awayTeam: m.awayTeam ?? m.away,
    homeScore: m.homeScore ?? m.home_score ?? null,
    awayScore: m.awayScore ?? m.away_score ?? null,
    status: m.status ?? "upcoming",
    group: m.group ?? null,
    ...m,
  };
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/matches");
        const raw = res.data.matches || res.data;
        setMatches(raw.map(normalizeMatch));
      } catch (err: any) {
        console.error("Failed to load matches:", err);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Could not load matches."
        );
        setMatches([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <Loading />;

  return (
    <PageContainer size="md">
      <PageHeader title="All Matches" />

      {error ? (
        <EmptyState message={error} />
      ) : matches.length === 0 ? (
        <EmptyState message="No matches available." />
      ) : (
        <div className="space-y-6">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
