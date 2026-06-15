"use client";

import { useState } from "react";
import api from "@/lib/client";
import Button from "@/components/ui/Button";
import ErrorMessage from "@/components/ui/Error";
import { useTranslations } from "next-intl";

interface Props {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  initialHomeScore: number;
  initialAwayScore: number;
  onSaved?: () => void;
}

export default function PredictionForm({
  matchId,
  homeTeam,
  awayTeam,
  initialHomeScore,
  initialAwayScore,
  onSaved
}: Props) {
  const t = useTranslations("prediction");

  const [homeScore, setHomeScore] = useState(String(initialHomeScore ?? 0));
  const [awayScore, setAwayScore] = useState(String(initialAwayScore ?? 0));

  const [scorers, setScorers] = useState<string[]>([]);
  const [assisters, setAssisters] = useState<string[]>([]);

  const [scorerInput, setScorerInput] = useState("");
  const [assistInput, setAssistInput] = useState("");

  const [doublePoint, setDoublePoint] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function addScorer() {
    const v = scorerInput.trim();
    if (!v) return;
    setScorers((prev) => [...prev, v]);
    setScorerInput("");
  }

  function removeScorer(name: string) {
    setScorers((prev) => prev.filter((s) => s !== name));
  }

  function addAssist() {
    const v = assistInput.trim();
    if (!v) return;
    setAssisters((prev) => [...prev, v]);
    setAssistInput("");
  }

  function removeAssist(name: string) {
    setAssisters((prev) => prev.filter((s) => s !== name));
  }

  async function submit() {
    setSaving(true);
    setError("");

    try {
      await api.post(`/matches/${matchId}/predictions`, {
        homeScore: Number(homeScore),
        awayScore: Number(awayScore),
        scorers,
        assisters,
        goalMinutes: [],
        doublePoint
      });

      onSaved?.();
    } catch (err) {
      console.error("Failed to save prediction:", err);
      setError(t("errorSaving"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4 border p-4 rounded bg-white shadow-sm">
      <h2 className="font-semibold text-xl">{t("title")}</h2>

      {error && <ErrorMessage message={error} />}

      {/* Score */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-500">{homeTeam}</span>
          <input
            className="border p-2 w-16 text-center rounded"
            value={homeScore}
            onChange={(e) => setHomeScore(e.target.value)}
          />
        </div>

        <span className="text-2xl font-bold text-gray-500">-</span>

        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-500">{awayTeam}</span>
          <input
            className="border p-2 w-16 text-center rounded"
            value={awayScore}
            onChange={(e) => setAwayScore(e.target.value)}
          />
        </div>
      </div>

      {/* Scorers */}
      <div className="space-y-2">
        <div className="text-sm font-semibold">{t("scorers")}</div>

        <div className="flex gap-2">
          <input
            className="border p-2 flex-1 rounded"
            placeholder={t("playerPlaceholder")}
            value={scorerInput}
            onChange={(e) => setScorerInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addScorer()}
          />
          <Button type="button" onClick={addScorer} variant="primary">
            {t("add")}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {scorers.map((s) => (
            <span
              key={s}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center gap-1"
            >
              {s}
              <button
                type="button"
                onClick={() => removeScorer(s)}
                className="text-red-500 font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Assisters */}
      <div className="space-y-2">
        <div className="text-sm font-semibold">{t("assisters")}</div>

        <div className="flex gap-2">
          <input
            className="border p-2 flex-1 rounded"
            placeholder={t("playerPlaceholder")}
            value={assistInput}
            onChange={(e) => setAssistInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addAssist()}
          />
          <Button type="button" onClick={addAssist} variant="success">
            {t("add")}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {assisters.map((a) => (
            <span
              key={a}
              className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center gap-1"
            >
              {a}
              <button
                type="button"
                onClick={() => removeAssist(a)}
                className="text-red-500 font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Double Point */}
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={doublePoint}
          onChange={(e) => setDoublePoint(e.target.checked)}
        />
        {t("doublePoint")}
      </label>

      <Button
        onClick={submit}
        disabled={saving}
        variant="primary"
        className="w-full"
      >
        {saving ? t("saving") : t("savePrediction")}
      </Button>
    </div>
  );
}
