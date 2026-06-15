"use client";

import { useEffect, useState } from "react";
import api from "@/lib/client";
import Loading from "@/components/Loading";
import EmptyState from "@/components/ui/EmptyState";
import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import DevErrorBoundary from "@/components/DevErrorBoundary";

// Normalize backend match shape
function normalizeMatch(m: any) {
  return {
    id: m?.id ?? m?.matchId ?? null,
    homeTeam: m?.homeTeam ?? m?.home ?? null,
    awayTeam: m?.awayTeam ?? m?.away ?? null,
    homeScore: m?.homeScore ?? m?.home_score ?? null,
    awayScore: m?.awayScore ?? m?.away_score ?? null,
    status: m?.status ?? "upcoming",
    group: m?.group ?? null,
    ...m,
  };
}

export default function HomePage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // mark client so we avoid any browser-only render during SSR
    setIsClient(true);
  }, []);

  useEffect(() => {
    console.log("BASE URL:", process.env.NEXT_PUBLIC_API_URL);
    console.log("USEEFFECT START");

    async function load() {
      const base = process.env.NEXT_PUBLIC_API_URL ?? "";
      const endpoint = "/matches/day/today";
      const timestamp = Date.now();

      // --- DEBUG fetch to bypass axios baseURL issues and inspect raw response ---
      const debugUrl = `${base}${endpoint}?t=${timestamp}`;
      console.log("DEBUG fetch URL:", debugUrl);

      try {
        const r = await fetch(debugUrl, { cache: "no-store", headers: { Accept: "application/json" } });
        const text = await r.text();
        console.log("DEBUG status:", r.status);
        console.log("DEBUG body (first 2000 chars):", text.slice(0, 2000));
      } catch (e: any) {
        console.error("DEBUG fetch failed:", e?.message ?? e);
      }
      // --- end debug fetch ---

      // Robust axios + fallback fetch logic
      try {
        const res = await api.get(endpoint, {
          params: { t: timestamp },
          headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
          validateStatus: (s) => s >= 200 && s < 400, // allow 304 through so we can inspect it
        });

        console.log("AXIOS status:", res.status);
        console.log("AXIOS data type:", typeof res.data);
        try {
          const preview = JSON.stringify(res.data).slice(0, 1000);
          console.log("AXIOS data preview (first 1000 chars):", preview);
        } catch (e) {
          console.warn("Could not stringify res.data for preview", e);
        }

        // Defensive extraction of matches
        let raw: any[] = [];

        if (res.status === 304 || !res.data) {
          console.warn("Axios returned 304 or empty body; falling back to forced fetch.");
          // fallback to forced fetch
          try {
            const r = await fetch(debugUrl, { cache: "no-store", headers: { Accept: "application/json" } });
            console.log("FETCH fallback status:", r.status);
            const text = await r.text();
            console.log("FETCH fallback body preview:", text.slice(0, 1000));
            let json;
            try {
              json = JSON.parse(text);
            } catch (e) {
              console.error("FETCH fallback returned non-JSON body:", e);
              setError("API returned non-JSON response.");
              setMatches([]);
              setLoading(false);
              return;
            }
            raw = Array.isArray(json) ? json : Array.isArray(json.matches) ? json.matches : [];
          } catch (fetchErr) {
            console.error("Forced fetch failed:", fetchErr);
            setError("Failed to fetch fresh data from API.");
            setMatches([]);
            setLoading(false);
            return;
          }
        } else if (Array.isArray(res.data)) {
          raw = res.data;
        } else if (Array.isArray(res.data?.matches)) {
          raw = res.data.matches;
        } else if (res.data && typeof res.data === "object") {
          if (Array.isArray(res.data.data)) raw = res.data.data;
          else if (Array.isArray(res.data.result)) raw = res.data.result;
          else {
            console.warn("Unexpected API response shape:", Object.keys(res.data));
            raw = [];
          }
        } else {
          console.warn("Unexpected or empty res.data:", res.data);
          raw = [];
        }

        setMatches((raw ?? []).map(normalizeMatch));
        setError(null);
      } catch (err: any) {
        console.error("LOAD ERROR:", err?.message ?? err, err?.stack ?? "");
        // Try forced fetch as last resort
        try {
          const r = await fetch(debugUrl, { cache: "no-store", headers: { Accept: "application/json" } });
          console.log("FETCH fallback status:", r.status);
          const text = await r.text();
          console.log("FETCH fallback body preview:", text.slice(0, 1000));
          let json;
          try {
            json = JSON.parse(text);
          } catch (e) {
            console.error("FETCH fallback returned non-JSON body:", e);
            setError(err?.message || "Could not load matches.");
            setMatches([]);
            setLoading(false);
            return;
          }
          const raw = Array.isArray(json) ? json : Array.isArray(json.matches) ? json.matches : [];
          setMatches((raw ?? []).map(normalizeMatch));
          setError(null);
        } catch (fetchErr) {
          console.error("Both axios and fetch failed:", fetchErr);
          setError(err?.response?.data?.message || err?.message || "Could not load today’s matches.");
          setMatches([]);
        }
      } finally {
        setLoading(false);
      }
    }

    // run load only on client
    if (isClient) {
      load();
    } else {
      // if not client yet, schedule a short delay to let hydration finish
      const id = setTimeout(() => {
        load();
      }, 50);
      return () => clearTimeout(id);
    }
  }, [isClient]);

  if (loading)
    return (
      <DevErrorBoundary>
        <Loading />
      </DevErrorBoundary>
    );

  return (
    <DevErrorBoundary>
      <PageContainer size="md">
        <PageHeader title="Today's Matches" />

        {error ? (
          <EmptyState message={error} />
        ) : matches.length === 0 ? (
          // temporary: render raw JSON to avoid child component crashes while debugging
          <div className="prose">
            <EmptyState message="No matches scheduled for today." />
            <h3 className="mt-4">Raw matches (debug)</h3>
            <pre className="whitespace-pre-wrap break-words bg-gray-50 p-3 rounded">
              {JSON.stringify(matches, null, 2)}
            </pre>
          </div>
        ) : (
          <div className="space-y-6">
            {/* TEMPORARY: render JSON instead of MatchCard while debugging */}
            <pre className="whitespace-pre-wrap break-words">
              {JSON.stringify(matches, null, 2)}
            </pre>
          </div>
        )}
      </PageContainer>
    </DevErrorBoundary>
  );
}
