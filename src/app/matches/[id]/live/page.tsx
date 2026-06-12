"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/api/client";
import useSocket from "@/hooks/useSocket";
import { useTranslations } from "next-intl";

interface MatchEvent {
  minute: number;
  type: string;
  scorer?: string;
  assist?: string;
  team?: string; // "home" | "away"
}

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeFlag?: string;
  awayFlag?: string;
  homeScore: number;
  awayScore: number;
  kickoffTime: number;
  status: "upcoming" | "live" | "finished";
  events?: MatchEvent[];
}

export default function LiveMatchTracker() {
  const { id } = useParams();
  const t = useTranslations("matchDetails");

  const [match, setMatch] = useState<Match | null>(null);
  const [liveMinute, setLiveMinute] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch initial match data
  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/matches/${id}`);
        const m = res.data.match || res.data;
        setMatch(m);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  // Live socket updates
  useSocket((socket) => {
    if (!id) return;

    socket.emit("match:subscribe", id);

    socket.on("match:update", (data: Match) => {
      if (data.id === id) {
        setMatch((prev) => (prev ? { ...prev, ...data } : data));
      }
    });

    socket.on("match:minute", (minute: number) => {
      setLiveMinute(minute);
    });

    socket.on(
      "match:final",
      (payload: { match: Match; events: MatchEvent[] }) => {
        if (payload.match.id === id) {
          setMatch({
            ...payload.match,
            events: payload.events
          });
        }
      }
    );
  });

  if (loading || !match) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        {t("liveLoading")}
      </div>
    );
  }

  const sortedEvents = [...(match.events || [])].sort(
    (a, b) => a.minute - b.minute
  );

  const ICONS: Record<string, string> = {
    goal: "⚽",
    assist: "🎯",
    yellow: "🟨",
    red: "🟥",
    sub: "🔁",
    chance: "🔥"
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-10">
      {/* HEADER */}
      <div className="text-center space-y-4">
        {/* Teams */}
        <div className="flex items-center justify-center gap-6">
          {/* Home */}
          <div className="flex flex-col items-center">
            {match.homeFlag && (
              <img
                src={match.homeFlag}
                className="w-16 h-16 rounded shadow-md"
              />
            )}
            <span className="text-xl font-semibold">{match.homeTeam}</span>
          </div>

          {/* Score */}
          <div className="text-5xl font-bold animate-pulse">
            {match.homeScore} <span className="text-gray-500">-</span>{" "}
            {match.awayScore}
          </div>

          {/* Away */}
          <div className="flex flex-col items-center">
            {match.awayFlag && (
              <img
                src={match.awayFlag}
                className="w-16 h-16 rounded shadow-md"
              />
            )}
            <span className="text-xl font-semibold">{match.awayTeam}</span>
          </div>
        </div>

        {/* Live minute / status */}
        {match.status === "live" && (
          <div className="text-red-600 font-bold text-lg animate-pulse">
            {liveMinute !== null ? `${liveMinute}’ ${t("live")}` : t("live")}
          </div>
        )}

        {match.status === "finished" && (
          <div className="text-green-600 font-bold text-lg">
            {t("fullTime")}
          </div>
        )}

        {match.status === "upcoming" && (
          <div className="text-gray-600 font-semibold">
            {t("notStarted")}
          </div>
        )}
      </div>

      {/* SPLIT TIMELINE */}
      <div>
        <h2 className="text-xl font-semibold mb-3">{t("liveTimeline")}</h2>

        {sortedEvents.length === 0 && (
          <p className="text-gray-500 text-sm">{t("noEvents")}</p>
        )}

        <div className="relative mt-6">
          {/* Center vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-300 -translate-x-1/2" />

          <div className="space-y-8">
            {sortedEvents.map((ev, idx) => {
              const icon = ICONS[ev.type] || "•";
              const isHome = ev.team === "home";

              return (
                <div
                  key={idx}
                  className={`flex items-center ${
                    isHome ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-[60%] p-3 rounded-lg shadow border ${
                      isHome
                        ? "bg-blue-50 border-blue-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{icon}</span>
                      <span className="font-semibold">
                        {ev.scorer || t("unknown")}
                      </span>
                    </div>

                    {ev.assist && (
                      <p className="text-gray-600 text-sm mt-1">
                        {t("assist")}: {ev.assist}
                      </p>
                    )}

                    <p className="text-gray-400 text-xs mt-1">
                      {ev.minute}’
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
