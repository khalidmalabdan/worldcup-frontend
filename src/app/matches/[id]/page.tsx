"use client"; // match details page

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/src/api/client";
import useSocket from "@/src/hooks/useSocket";
import PredictionForm from "./PredictionForm";

type MatchStatus = "upcoming" | "live" | "finished";

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
  kickoffTime: number;
  matchDate: string;
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
  homeFlag?: string;
  awayFlag?: string;
  events?: MatchEvent[];
  group?: string;
}

interface Prediction {
  homeScore: number;
  awayScore: number;
}

export default function MatchDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [match, setMatch] = useState<Match | null>(null);
  const [prediction, setPrediction] = useState<Prediction>({
    homeScore: 0,
    awayScore: 0,
  });

  const [liveMinute, setLiveMinute] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch match + prediction
  useEffect(() => {
    async function loadData() {
      try {
        const matchRes = await api.get(`/matches/${id}`);
        const m = matchRes.data.match || matchRes.data;
        setMatch(m);

        const predRes = await api.get(`/matches/${id}/predictions/me`);
        if (predRes.data) {
          setPrediction({
            homeScore: predRes.data.homeScore,
            awayScore: predRes.data.awayScore,
          });
        }
      } catch {
        setError("Failed to load match data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  // Live updates
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
          setMatch((prev) =>
            prev
              ? { ...prev, ...payload.match, events: payload.events }
              : { ...payload.match, events: payload.events }
          );
        }
      }
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Loading match...
      </div>
    );
  }

  if (!match) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Match not found
      </div>
    );
  }

  const formattedDate = new Date(match.kickoffTime).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const statusColor =
    match.status === "live"
      ? "bg-red-600 text-white"
      : match.status === "finished"
      ? "bg-green-600 text-white"
      : "bg-gray-300 text-gray-800";

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
                className="w-14 h-14 rounded shadow-md"
              />
            )}
            <span className="text-lg font-semibold">{match.homeTeam}</span>
          </div>

          {/* Score */}
          <div className="text-4xl font-bold">
            {match.homeScore} <span className="text-gray-500">-</span>{" "}
            {match.awayScore}
          </div>

          {/* Away */}
          <div className="flex flex-col items-center">
            {match.awayFlag && (
              <img
                src={match.awayFlag}
                className="w-14 h-14 rounded shadow-md"
              />
            )}
            <span className="text-lg font-semibold">{match.awayTeam}</span>
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
          <span>{formattedDate}</span>
          {match.group && <span>• Group {match.group}</span>}
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${statusColor}`}
          >
            {match.status.toUpperCase()}
          </span>

          {match.status === "live" && liveMinute !== null && (
            <span className="text-red-600 font-bold animate-pulse">
              {liveMinute}’ LIVE
            </span>
          )}
        </div>
      </div>

      {/* PREDICTION FORM (REUSABLE COMPONENT) */}
      <PredictionForm
        matchId={match.id}
        homeTeam={match.homeTeam}
        awayTeam={match.awayTeam}
        initialHomeScore={prediction.homeScore}
        initialAwayScore={prediction.awayScore}
        onSaved={() => router.push("/matches")}
      />

      {/* TIMELINE */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Match Timeline</h2>

        {sortedEvents.length === 0 && (
          <p className="text-gray-500 text-sm">No events yet.</p>
        )}

        <div className="relative border-l-2 border-gray-300 ml-6 space-y-6">
          {sortedEvents.map((ev, idx) => (
            <div key={idx} className="relative pl-6">

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
