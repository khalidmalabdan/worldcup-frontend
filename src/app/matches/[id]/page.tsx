"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/client";
import { socket } from "@/lib/socket";
import PredictionForm from "./PredictionForm";
import Loading from "@/components/Loading";
import EmptyState from "@/components/ui/EmptyState";
import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import { useTranslations, useLocale } from "next-intl";

// Normalize backend match shape
function normalizeMatch(m: any) {
  return {
    id: m.id ?? m.matchId,
    kickoffTime: m.kickoffTime ?? m.kickoff_time ?? m.kickoff ?? 0,
    status: m.status ?? "upcoming",

    score: {
      home: m.score?.home ?? m.homeScore ?? m.home_score ?? 0,
      away: m.score?.away ?? m.awayScore ?? m.away_score ?? 0
    },

    homeTeam: {
      name: m.homeTeam?.name ?? m.homeTeam ?? m.home ?? "",
      logo: m.homeTeam?.logo ?? m.homeLogo ?? null,
      players: m.homeTeam?.players ?? []
    },

    awayTeam: {
      name: m.awayTeam?.name ?? m.awayTeam ?? m.away ?? "",
      logo: m.awayTeam?.logo ?? m.awayLogo ?? null,
      players: m.awayTeam?.players ?? []
    },

    events: m.events ?? [],
    userPrediction: m.userPrediction ?? null,
    ...m
  };
}

export default function MatchDetailsPage() {
  const t = useTranslations("matchDetails");
  const locale = useLocale();

  const { id } = useParams();
  const router = useRouter();

  const [match, setMatch] = useState<any>(null);
  const [userPrediction, setUserPrediction] = useState<any>(null);
  const [liveMinute, setLiveMinute] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---------------------------------------------------
     ⭐ Load match details + user prediction
  --------------------------------------------------- */
  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/matches/${id}`);
        const normalized = normalizeMatch(res.data);

        setMatch(normalized);

        if (normalized.userPrediction) {
          setUserPrediction({
            homeScore: normalized.userPrediction.homeScore,
            awayScore: normalized.userPrediction.awayScore
          });
        }
      } catch (err) {
        console.error("Failed to load match:", err);
        setMatch(null);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  /* ---------------------------------------------------
     ⭐ Live updates via Socket.IO
  --------------------------------------------------- */
  useEffect(() => {
    if (!id) return;

    socket.emit("match:subscribe", id);

    socket.on("match:update", (payload: any) => {
      if (payload.id === id) {
        setMatch((prev: any) => normalizeMatch({ ...prev, ...payload }));
      }
    });

    socket.on("match:minute", (minute: number) => {
      setLiveMinute(minute);
    });

    socket.on("match:final", (payload: any) => {
      if (payload.match.id === id) {
        setMatch(normalizeMatch({ ...payload.match, events: payload.events }));
      }
    });

    return () => {
      socket.off("match:update");
      socket.off("match:minute");
      socket.off("match:final");
    };
  }, [id]);

  /* ---------------------------------------------------
     ⭐ Loading / Error States
  --------------------------------------------------- */
  if (loading) return <Loading />;

  if (!match)
    return <EmptyState message={t("notFound")} />;

  /* ---------------------------------------------------
     ⭐ Format UI data
  --------------------------------------------------- */
  const formattedDate = new Date(match.kickoffTime).toLocaleString(
    locale === "ar" ? "ar-SA" : "en-US",
    {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }
  );

  const statusColor =
    match.status === "live"
      ? "bg-red-600 text-white"
      : match.status === "finished"
      ? "bg-green-600 text-white"
      : "bg-gray-300 text-gray-800";

  const sortedEvents = [...(match.events || [])].sort(
    (a: { minute: number }, b: { minute: number }) => a.minute - b.minute
  );

  const getIcon = (type: string) => {
    switch (type) {
      case "goal":
        return "⚽";
      case "assist":
        return "🎯";
      case "yellow":
        return "🟨";
      case "red":
        return "🟥";
      case "sub":
        return "🔄";
      default:
        return "•";
    }
  };

  return (
    <PageContainer size="md">
      <PageHeader title={t("title")} />

      {/* HEADER */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-10">
          {/* Home */}
          <div className="flex flex-col items-center">
            {match.homeTeam.logo && (
              <img
                src={match.homeTeam.logo}
                className="w-16 h-16 rounded-full shadow-md"
              />
            )}
            <span className="text-lg font-semibold">{match.homeTeam.name}</span>
          </div>

          {/* Score */}
          <div className="text-5xl font-bold">
            {match.score.home} <span className="text-gray-500">-</span>{" "}
            {match.score.away}
          </div>

          {/* Away */}
          <div className="flex flex-col items-center">
            {match.awayTeam.logo && (
              <img
                src={match.awayTeam.logo}
                className="w-16 h-16 rounded-full shadow-md"
              />
            )}
            <span className="text-lg font-semibold">{match.awayTeam.name}</span>
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
          <span>{formattedDate}</span>

          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${statusColor}`}
          >
            {t(`status.${match.status}`)}
          </span>

          {match.status === "live" && liveMinute !== null && (
            <span className="text-red-600 font-bold animate-pulse">
              {liveMinute}’ {t("live")}
            </span>
          )}
        </div>
      </div>

      {/* ⭐ TEAM PLAYERS SECTION */}
      <div className="grid grid-cols-2 gap-6 mt-4">
        {/* Home players */}
        <div>
          <h3 className="font-semibold text-lg mb-2">
            {match.homeTeam.name} — {t("players")}
          </h3>
          <ul className="space-y-1 text-sm text-gray-700">
            {match.homeTeam.players?.map((p: any, i: number) => (
              <li key={i}>• {p.name}</li>
            ))}
          </ul>
        </div>

        {/* Away players */}
        <div>
          <h3 className="font-semibold text-lg mb-2">
            {match.awayTeam.name} — {t("players")}
          </h3>
          <ul className="space-y-1 text-sm text-gray-700">
            {match.awayTeam.players?.map((p: any, i: number) => (
              <li key={i}>• {p.name}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* PREDICTION FORM */}
      <PredictionForm
        matchId={match.id}
        homeTeam={match.homeTeam.name}
        awayTeam={match.awayTeam.name}
        initialHomeScore={userPrediction?.homeScore ?? 0}
        initialAwayScore={userPrediction?.awayScore ?? 0}
        onSaved={() => router.refresh()}
      />

      {/* TIMELINE */}
      <div>
        <h2 className="text-xl font-semibold mb-3">{t("timeline")}</h2>

        {sortedEvents.length === 0 && (
          <p className="text-gray-500 text-sm">{t("noEvents")}</p>
        )}

        <div className="relative border-l-2 border-gray-300 ml-6 space-y-6">
          {sortedEvents.map((ev: any, idx: number) => (
            <div key={idx} className="relative pl-6">
              <div className="absolute -left-3 top-1 w-6 h-6 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center text-xs shadow-sm">
                {getIcon(ev.type)}
              </div>

              <div className="text-sm font-semibold">
                {ev.minute}’ — {ev.scorer || t("unknown")}
                {ev.team && (
                  <span className="text-gray-500"> ({ev.team})</span>
                )}
              </div>

              <div className="text-xs text-gray-500">
                {t(`event.${ev.type}`)}
                {ev.assist && ` • ${t("assist")}: ${ev.assist}`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
