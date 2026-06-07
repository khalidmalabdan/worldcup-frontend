"use client";

import { useState } from "react";
import api from "@/src/api/client";

interface PredictionFormProps {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  initialHomeScore?: number;
  initialAwayScore?: number;
  onSaved?: () => void;
}

export default function PredictionForm({
  matchId,
  homeTeam,
  awayTeam,
  initialHomeScore = 0,
  initialAwayScore = 0,
  onSaved,
}: PredictionFormProps) {
  const [homeScore, setHomeScore] = useState(initialHomeScore);
  const [awayScore, setAwayScore] = useState(initialAwayScore);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await api.post(`/matches/${matchId}/predictions`, {
        homeScore,
        awayScore,
      });

      setSuccess("Prediction saved!");

      if (onSaved) onSaved();
    } catch {
      setError("Failed to save prediction");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Your Prediction
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-600 text-center">{success}</p>}

        {/* Home Team */}
        <div className="flex justify-between items-center">
          <label className="font-semibold">{homeTeam}</label>
          <input
            type="number"
            min="0"
            className="border rounded px-3 py-2 w-20 text-center"
            value={homeScore}
            onChange={(e) => setHomeScore(Number(e.target.value))}
          />
        </div>

        {/* Away Team */}
        <div className="flex justify-between items-center">
          <label className="font-semibold">{awayTeam}</label>
          <input
            type="number"
            min="0"
            className="border rounded px-3 py-2 w-20 text-center"
            value={awayScore}
            onChange={(e) => setAwayScore(Number(e.target.value))}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {saving ? "Saving..." : "Save Prediction"}
        </button>
      </form>
    </div>
  );
}
