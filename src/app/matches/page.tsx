"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import api from "@/api/client";
import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import Loading from "@/components/Loading";
import EmptyState from "@/components/ui/EmptyState";
import { useTranslations, useLocale } from "next-intl";

// Normalize match shape
function normalizeMatch(m: any) {
  return {
    id: m.id ?? m.matchId,
    homeTeam: m.homeTeam ?? m.home,
    awayTeam: m.awayTeam ?? m.away,
    homeScore: m.homeScore ?? m.home_score ?? null,
    awayScore: m.awayScore ?? m.away_score ?? null,
    homeFlag: m.homeFlag ?? m.homeLogo ?? null,
    awayFlag: m.awayFlag ?? m.awayLogo ?? null,
    status: m.status ?? "upcoming",
    kickoff: m.kickoff ?? m.kickoffTime ?? m.kickoff_time ?? 0,
    ...m,
  };
}

type StatusFilter = "all" | "live" | "upcoming" | "finished";
type DateFilter = "all" | "today" | "tomorrow" | "week";

export default function MatchesList() {
  const t = useTranslations("matches");
  const locale = useLocale();

  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");

  const [visibleCount, setVisibleCount] = useState<number>(20);

  useEffect(() => {
    async function loadMatches() {
      try {
        const res = await api.get("/matches");
        const raw = res.data.matches || res.data;

        const normalized = raw.map(normalizeMatch);

        const sorted = normalized.sort(
          (a: any, b: any) => a.kickoff - b.kickoff
        );

        setMatches(sorted);
      } catch (err) {
        console.error("Failed to load matches:", err);
        setMatches([]);
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

        const matchDate = new Date(m.kickoff);
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

  if (loading) return <Loading />;

  return (
    <PageContainer size="md">
      <PageHeader title={t("title")} />

      {/* Filters */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b pb-4 mb-4 space-y-4">

        {/* Search */}
        <input
          type="text"
          placeholder={t("search")}
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
                {t(`status.${s}`)}
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
              {t(`filters.${d}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Match List */}
      {visibleMatches.length === 0 ? (
        <EmptyState message={t("noMatches")} />
      ) : (
        <div className="space-y-4">
          {visibleMatches.map((match, index) => {
            const formattedDate = new Date(match.kickoff).toLocaleString(
              locale === "ar" ? "ar-SA" : "en-US",
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
                href={`/${locale}/matches/${match.id}`}
                className="block border rounded-xl p-4 hover:bg-gray-100 transition transform hover:-translate-y-0.5 hover:shadow-md opacity-0 animate-fade-in"
                style={{
                  animationDelay: `${index * 40}ms`,
                  animationFillMode: "forwards",
                }}
              >
                <div className="flex justify-between items-center">

                  {/* Left */}
                  <div className="flex items-center gap-3">

                    {match.homeFlag && (
                      <img
                        src={match.homeFlag}
                        alt={match.homeTeam}
                        className="w-7 h-7 rounded shadow-sm"
                      />
                    )}

                    <span className="font-semibold">{match.homeTeam}</span>

                    {(match.status === "live" ||
                      match.status === "finished") && (
                      <span className="font-bold text-lg">
                        {match.homeScore} - {match.awayScore}
                      </span>
                    )}

                    {match.status === "upcoming" && (
                      <span className="text-gray-500">{t("vs")}</span>
                    )}

                    <span className="font-semibold">{match.awayTeam}</span>

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
                      {t(`status.${match.status}`)}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Infinite Scroll */}
      {canLoadMore && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setVisibleCount((c) => c + 20)}
            className="px-4 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 shadow-sm"
          >
            {t("loadMore")}
          </button>
        </div>
      )}
    </PageContainer>
  );
}
