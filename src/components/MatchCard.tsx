"use client";

import { useState } from "react";
import ScoreInput from "@/components/ScoreInput";
import PlayerMultiSelect from "./PlayerMultiSelect";
import MatchStatusBadge from "./MatchStatusBadge";
import { useTranslations } from "next-intl";

export default function MatchCard({ match }: { match: any }) {
  const t = useTranslations("prediction");
  const tMatches = useTranslations("matches");

  const [homeScore, setHomeScore] = useState(
    match.userPrediction?.homeScore ?? ""
  );
  const [awayScore, setAwayScore] = useState(
    match.userPrediction?.awayScore ?? ""
  );

  const [scorers, setScorers] = useState<string[]>(
    match.userPrediction?.scorers ?? []
  );
  const [assisters, setAssisters] = useState<string[]>(
    match.userPrediction?.assisters ?? []
  );

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const isLocked = match.status !== "upcoming";

  // Combine players from both teams
  const allPlayers = [
    ...match.homeTeam.players.map((p: any) => ({
      name: p.name,
      team: match.homeTeam.name
    })),
    ...match.awayTeam.players.map((p: any) => ({
      name: p.name,
      team: match.awayTeam.name
    }))
  ];

  async function submitPrediction() {
    if (isLocked) return;

    setLoading(true);
    setSuccess(false);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/predictions`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId: match.id,
          homeScore: Number(homeScore),
          awayScore: Number(awayScore),
          scorers,
          assisters
        })
      }
    );

    setLoading(false);

    if (res.ok) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }
  }

  return (
    <div className="border rounded-xl p-5 shadow-sm bg-white space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <img src={match.homeTeam.logo} className="w-8 h-8" alt="" />
          <span className="font-semibold">{match.homeTeam.name}</span>

          <span className="text-lg font-bold text-gray-500">
            {tMatches("vs")}
          </span>

          <span className="font-semibold">{match.awayTeam.name}</span>
          <img src={match.awayTeam.logo} className="w-8 h-8" alt="" />
        </div>

        <MatchStatusBadge status={match.status} />
      </div>

      {/* SCORE INPUTS */}
      <ScoreInput
        homeScore={homeScore}
        awayScore={awayScore}
        setHomeScore={setHomeScore}
        setAwayScore={setAwayScore}
      />

      {/* SCORERS */}
      <PlayerMultiSelect
        label={t("scorers")}
        players={allPlayers}
        selected={scorers}
        setSelected={setScorers}
      />

      {/* ASSISTERS */}
      <PlayerMultiSelect
        label={t("assisters")}
        players={allPlayers}
        selected={assisters}
        setSelected={setAssisters}
      />

      {/* SAVE BUTTON */}
      <button
        onClick={submitPrediction}
        disabled={loading || isLocked}
        className={`w-full py-2 rounded text-sm font-semibold ${
          loading || isLocked
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {loading ? t("saving") : t("savePrediction")}
      </button>

      {/* LOCKED MESSAGE */}
      {isLocked && (
        <p className="text-xs text-gray-500 text-center">
          {tMatches("locked")}
        </p>
      )}

      {/* SUCCESS MESSAGE */}
      {success && (
        <p className="text-xs text-green-600 text-center">
          {t("saved")}
        </p>
      )}
    </div>
  );
}
