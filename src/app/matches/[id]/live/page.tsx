"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/src/api/client";
import useSocket from "@/src/hooks/useSocket";

interface MatchEvent {
  minute: number;
  type: string;
  scorer?: string;
  assist?: string;
  team?: string;
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
            events: payload.events,
          });
        }
      }
    );
  });

  if (loading || !match) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading live match...
      </div>
    );
  }

  const sortedEvents = [...(match.events || [])].sort(
    (a, b) => a.minute - b.minute
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

        {/* Live minute */}
        {match.status === "live" && (
          <div className="text-red-600 font-bold text-lg animate-pulse">
            {liveMinute !== null ? `${liveMinute}’ LIVE` : "LIVE"}
          </div>
        )}

        {match.status === "finished" && (
          <div className="text-green-600 font-bold text-lg">
            FULL TIME
          </div>
        )}

        {match.status === "upcoming" && (
          <div className="text-gray-600 font-semibold">
            Match has not started
          </div>
        )}
      </div>

      {/* TIMELINE */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Live Timeline</h2>

        {sortedEvents.length === 0 && (
          <p className="text-gray-500 text-sm">No events yet.</p>
        )}

        <div className="relative border-l-2 border-gray-300 ml-6 space-y-6">
          {sortedEvents.map((ev, idx) => (
            <div key={idx} className="relative pl-6 animate-fade-in">

              {/* Dot */}
              <div className="absolute -left-3 top-1 w-6 h-6 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center text-xs shadow-sm">
                {getIcon(ev.type)}
              </div>

              <div className="text-sm font-semibold">
                {ev.minute}’ — {ev.scorer || "Unknown"}
                {ev.team && (
                  <span className="text-gray-500"> ({ev.team})</span>
                )}
              </div>

              <div className="text-xs text-gray-500">
                {ev.type}
                {ev.assist && ` • Assist: ${ev.assist}`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
