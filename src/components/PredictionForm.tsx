"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function PredictionForm({ match }: any) {
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");

  async function submit() {
    await api.savePrediction(match.id, {
      homeScore: Number(homeScore),
      awayScore: Number(awayScore),
      scorers: [],
      assisters: [],
      goalMinutes: [],
      doublePoint: false,
    });

    alert("Prediction saved");
  }

  return (
    <div className="space-y-4 border p-4 rounded">
      <h2 className="font-semibold text-xl">Your Prediction</h2>

      <div className="flex gap-4">
        <input
          className="border p-2 w-16"
          placeholder="Home"
          value={homeScore}
          onChange={(e) => setHomeScore(e.target.value)}
        />
        <input
          className="border p-2 w-16"
          placeholder="Away"
          value={awayScore}
          onChange={(e) => setAwayScore(e.target.value)}
        />
      </div>

      <button
        onClick={submit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Prediction
      </button>
    </div>
  );
}
