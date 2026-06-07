"use client";

import { useEffect, useState } from "react";
import api from "@/api/client";

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  group?: string;
  status: "upcoming" | "live" | "finished";
}

interface TeamStanding {
  team: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
}

export default function GroupsPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/matches");
        setMatches(res.data.matches || res.data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading group standings...
      </div>
    );
  }

  // Group matches by group letter
  const groups: Record<string, Match[]> = {};
  matches.forEach((m) => {
    if (!m.group) return;
    if (!groups[m.group]) groups[m.group] = [];
    groups[m.group].push(m);
  });

  // Compute standings for a single group
  function computeStandings(groupMatches: Match[]): TeamStanding[] {
    const table: Record<string, TeamStanding> = {};

    function ensureTeam(team: string) {
      if (!table[team]) {
        table[team] = {
          team,
          played: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDiff: 0,
          points: 0,
        };
      }
    }

    groupMatches.forEach((m) => {
      if (m.status !== "finished") return;

      ensureTeam(m.homeTeam);
      ensureTeam(m.awayTeam);

      const home = table[m.homeTeam];
      const away = table[m.awayTeam];

      home.played++;
      away.played++;

      home.goalsFor += m.homeScore ?? 0;
      home.goalsAgainst += m.awayScore ?? 0;

      away.goalsFor += m.awayScore ?? 0;
      away.goalsAgainst += m.homeScore ?? 0;

      if (m.homeScore === m.awayScore) {
        home.draws++;
        away.draws++;
        home.points += 1;
        away.points += 1;
      } else if ((m.homeScore ?? 0) > (m.awayScore ?? 0)) {
        home.wins++;
        away.losses++;
        home.points += 3;
      } else {
        away.wins++;
        home.losses++;
        away.points += 3;
      }
    });

    // Compute goal difference
    Object.values(table).forEach((t) => {
      t.goalDiff = t.goalsFor - t.goalsAgainst;
    });

    // Sort standings
    return Object.values(table).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
      return b.goalsFor - a.goalsFor;
    });
  }

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-10">
      <h1 className="text-3xl font-bold text-center">Group Standings</h1>

      {Object.keys(groups)
        .sort()
        .map((group) => {
          const standings = computeStandings(groups[group]);

          return (
            <div key={group} className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Group {group}</h2>

              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="py-2">Team</th>
                    <th>P</th>
                    <th>W</th>
                    <th>D</th>
                    <th>L</th>
                    <th>GF</th>
                    <th>GA</th>
                    <th>GD</th>
                    <th>Pts</th>
                  </tr>
                </thead>

                <tbody>
                  {standings.map((t) => (
                    <tr key={t.team} className="border-b">
                      <td className="py-2 font-semibold">{t.team}</td>
                      <td>{t.played}</td>
                      <td>{t.wins}</td>
                      <td>{t.draws}</td>
                      <td>{t.losses}</td>
                      <td>{t.goalsFor}</td>
                      <td>{t.goalsAgainst}</td>
                      <td>{t.goalDiff}</td>
                      <td className="font-bold">{t.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
    </div>
  );
}
