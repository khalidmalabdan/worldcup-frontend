"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import api from "@/src/api/client";

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  kickoffTime: number;
  matchDate: string;
  homeLogo?: string;
  awayLogo?: string;
  homeFlag?: string;
  awayFlag?: string;
  homeScore?: number;
  awayScore?: number;
  status?: "upcoming" | "live" | "finished";
}

type StatusFilter = "all" | "live" | "upcoming" | "finished";
type DateFilter = "all" | "today" | "tomorrow" | "week";

export default function MatchesList() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");

  const [visibleCount, setVisibleCount] = useState<number>(20);

  useEffect(() => {
    async function loadMatches() {
      try {
        const res = await api.get("/matches");

        const raw = res.data;
        const data: Match[] = Array.isArray(raw)
          ? raw
          : (raw.matches as Match[]) || [];

        const normalized: Match[] = data.map((m: Match) => ({
          ...m,
          homeFlag: m.homeFlag || m.homeLogo,
          awayFlag: m.awayFlag || m.awayLogo,
          status: m.status || "upcoming",
        }));

        const sorted: Match[] = normalized.sort(
          (a: Match, b: Match) => a.kickoffTime - b.kickoffTime
        );

        setMatches(sorted);
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, []);

  const filteredMatches = useMemo(() => {
    return matches
      .filter((m) =>
        search.trim().length === 0
          ? true
          : `${m.homeTeam} ${m.awayTeam}`
              .toLowerCase()
              .includes(search.toLowerCase())
      )
      .filter((m) =>
        statusFilter === "all" ? true : m.status === statusFilter
      )
      .filter((m) => {
        if (dateFilter === "all") return true;

        const matchDate = new Date(m.kickoffTime);
        const today = new Date();

        const matchDay = new Date(
          matchDate.getFullYear(),
          matchDate.getMonth(),
          matchDate.getDate()
        ).getTime();

        const todayDay = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        ).getTime();

        if (dateFilter === "today") return matchDay === todayDay;
        if (dateFilter === "tomorrow")
          return matchDay === todayDay + 24 * 60 * 60 * 1000;
        if (dateFilter === "week")
          return (
            matchDay >= todayDay &&
            matchDay <= todayDay + 7 * 24 * 60 * 60 * 1000
          );

        return true;
      });
  }, [matches, search, statusFilter, dateFilter]);

  const visibleMatches = useMemo(
    () => filteredMatches.slice(0, visibleCount),
    [filteredMatches, visibleCount]
  );

  const canLoadMore = visibleCount < filteredMatches.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading matches...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Matches</h1>

      {/* Filters */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b pb-4 mb-4 space-y-4">

        {/* Search */}
        <input
          type="text"
          placeholder="Search teams..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500"
        />

        {/* Status Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(["all", "live", "upcoming", "finished"] as StatusFilter[]).map(
            (s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded text-sm whitespace-nowrap ${
                  statusFilter === s
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {s.toUpperCase()}
              </button>
            )
          )}
        </div>

        {/* Date Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(["all", "today", "tomorrow", "week"] as DateFilter[]).map((d) => (
            <button
              key={d}
              onClick={() => setDateFilter(d)}
              className={`px-3 py-1 rounded text-sm whitespace-nowrap ${
                dateFilter === d
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {d === "all"
                ? "All Dates"
                : d === "today"
                ? "Today"
                : d === "tomorrow"
                ? "Tomorrow"
                : "This Week"}
            </button>
          ))}
        </div>
      </div>

      {/* Match List */}
      <div className="space-y-4">
        {visibleMatches.map((match: Match, index) => {
          const formattedDate = new Date(match.kickoffTime).toLocaleString(
            "en-US",
            {
              weekday: "short",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }
          );

          const statusColor =
            match.status === "live"
              ? "bg-red-600 text-white"
              : match.status === "finished"
              ? "bg-green-600 text-white"
              : "bg-gray-300 text-gray-800";

          return (
            <Link
              key={match.id}
              href={`/matches/${match.id}`}
              className="block border rounded-xl p-4 hover:bg-gray-100 transition transform hover:-translate-y-0.5 hover:shadow-md opacity-0 animate-fade-in"
              style={{
                animationDelay: `${index * 40}ms`,
                animationFillMode: "forwards",
              }}
            >
              <div className="flex justify-between items-center">

                {/* Left */}
                <div className="flex items-center gap-3">

                  {/* Home Flag */}
                  {match.homeFlag && (
                    <img
                      src={match.homeFlag}
                      alt={match.homeTeam}
                      className="w-7 h-7 rounded shadow-sm"
                    />
                  )}

                  <span className="font-semibold">{match.homeTeam}</span>

                  {/* Score or VS */}
                  {(match.status === "live" ||
                    match.status === "finished") && (
                    <span className="font-bold text-lg">
                      {match.homeScore} - {match.awayScore}
                    </span>
                  )}

                  {match.status === "upcoming" && (
                    <span className="text-gray-500">vs</span>
                  )}

                  <span className="font-semibold">{match.awayTeam}</span>

                  {/* Away Flag */}
                  {match.awayFlag && (
                    <img
                      src={match.awayFlag}
                      alt={match.awayTeam}
                      className="w-7 h-7 rounded shadow-sm"
                    />
                  )}
                </div>

                {/* Right */}
                <div className="flex flex-col items-end">
                  <span className="text-gray-600 text-sm">{formattedDate}</span>

                  <span
                    className={`mt-1 px-2 py-1 text-xs rounded ${statusColor}`}
                  >
                    {match.status?.toUpperCase() || "UPCOMING"}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Infinite Scroll */}
      {canLoadMore && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setVisibleCount((c) => c + 20)}
            className="px-4 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 shadow-sm"
          >
            Load more matches
          </button>
        </div>
      )}

      {!canLoadMore && filteredMatches.length === 0 && (
        <div className="text-center text-gray-500 mt-4">
          No matches found for these filters.
        </div>
      )}
    </div>
  );
}
