"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/src/api/client";
import { GROUPS, getGroupForMatch } from "@/src/utils/groups";
import {
  generateKnockoutBracket,
  KnockoutPair,
  TeamStanding as KnockoutTeamStanding,
} from "@/src/utils/knockout";

interface TeamStanding {
  team: string;
  mp: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
}

type StandingsResponse = {
  groups: Record<string, TeamStanding[]>;
};

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  status: "upcoming" | "live" | "finished";
  kickoffTime: number;
}

// crude flag map (you can replace with real URLs from backend)
const FLAG_MAP: Record<string, string> = {
  Mexico: "🇲🇽",
  "South Africa": "🇿🇦",
  "South Korea": "🇰🇷",
  Czechia: "🇨🇿",
  Canada: "🇨🇦",
  "Bosnia-Herzegovina": "🇧🇦",
  Qatar: "🇶🇦",
  Switzerland: "🇨🇭",
  Brazil: "🇧🇷",
  Morocco: "🇲🇦",
  Haiti: "🇭🇹",
  Scotland: "🏴",
  "United States": "🇺🇸",
  Paraguay: "🇵🇾",
  Australia: "🇦🇺",
  Turkey: "🇹🇷",
  Germany: "🇩🇪",
  "Curaçao": "🇨🇼",
  "Ivory Coast": "🇨🇮",
  Ecuador: "🇪🇨",
  Netherlands: "🇳🇱",
  Japan: "🇯🇵",
  Sweden: "🇸🇪",
  Tunisia: "🇹🇳",
  Belgium: "🇧🇪",
  Egypt: "🇪🇬",
  Iran: "🇮🇷",
  "New Zealand": "🇳🇿",
  Spain: "🇪🇸",
  "Cape Verde Islands": "🇨🇻",
  "Saudi Arabia": "🇸🇦",
  Uruguay: "🇺🇾",
  France: "🇫🇷",
  Senegal: "🇸🇳",
  Iraq: "🇮🇶",
  Norway: "🇳🇴",
  Argentina: "🇦🇷",
  Algeria: "🇩🇿",
  Austria: "🇦🇹",
  Jordan: "🇯🇴",
  Portugal: "🇵🇹",
  "Congo DR": "🇨🇩",
  Uzbekistan: "🇺🇿",
  Colombia: "🇨🇴",
  England: "🏴",
  Croatia: "🇭🇷",
  Ghana: "🇬🇭",
  Panama: "🇵🇦",
};

function getFlag(team: string) {
  return FLAG_MAP[team] ?? "🏳️";
}

function computeGroupMatchday(matches: Match[], groupKey: string): number {
  const groupMatches = matches.filter((m) => {
    const g = getGroupForMatch(m.homeTeam, m.awayTeam);
    return g === groupKey;
  });

  const finished = groupMatches.filter((m) => m.status === "finished").length;

  if (finished === 0) return 1;
  if (finished <= 2) return 1;
  if (finished <= 4) return 2;
  return 3;
}

function groupHasLiveMatch(matches: Match[], groupKey: string): boolean {
  return matches.some((m) => {
    const g = getGroupForMatch(m.homeTeam, m.awayTeam);
    return g === groupKey && m.status === "live";
  });
}

export default function GroupsPage() {
  const [data, setData] = useState<StandingsResponse | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMatchday, setActiveMatchday] = useState<number | "all">("all");

  useEffect(() => {
    let interval: NodeJS.Timeout;

    async function load() {
      try {
        const [standingsRes, matchesRes] = await Promise.all([
          api.get<StandingsResponse>("/standings"),
          api.get<Match[]>("/matches"),
        ]);
        setData(standingsRes.data);
        setMatches(matchesRes.data);
      } finally {
        setLoading(false);
      }
    }

    load();
    interval = setInterval(load, 10_000);

    return () => clearInterval(interval);
  }, []);

  const knockoutPairs: KnockoutPair[] = useMemo(() => {
    if (!data) return [];
    return generateKnockoutBracket(
      data.groups as Record<string, KnockoutTeamStanding[]>
    );
  }, [data]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading group standings...
      </div>
    );
  }

  const groupKeys = Object.keys(data.groups).sort();

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Group Standings</h1>

        <div className="inline-flex rounded-md border bg-white overflow-hidden">
          {["all", 1, 2, 3].map((md) => (
            <button
              key={md}
              onClick={() =>
                setActiveMatchday(md === "all" ? "all" : (md as number))
              }
              className={`px-3 py-1 text-sm border-l first:border-l-0 ${
                activeMatchday === md
                  ? "bg-emerald-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {md === "all" ? "All" : `Matchday ${md}`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {groupKeys.map((group) => {
          const standings = data.groups[group];
          const matchday = computeGroupMatchday(matches, group);
          const hasLive = groupHasLiveMatch(matches, group);

          if (activeMatchday !== "all" && matchday !== activeMatchday) {
            return null;
          }

          return (
            <div
              key={group}
              className="border rounded-lg overflow-hidden shadow bg-white"
            >
              <div className="px-4 py-2 bg-gray-100 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800 text-lg">
                    Group {group}
                  </span>

                  {hasLive && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-red-600">
                      <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      LIVE
                    </span>
                  )}
                </div>

                <span className="text-xs text-gray-500">
                  Matchday {matchday}
                </span>
              </div>

              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-600">
                    <th className="px-3 py-2 text-left">Team</th>
                    <th className="px-2 py-2 text-center">MP</th>
                    <th className="px-2 py-2 text-center">W</th>
                    <th className="px-2 py-2 text-center">D</th>
                    <th className="px-2 py-2 text-center">L</th>
                    <th className="px-2 py-2 text-center">GF</th>
                    <th className="px-2 py-2 text-center">GA</th>
                    <th className="px-2 py-2 text-center">GD</th>
                    <th className="px-2 py-2 text-center">Pts</th>
                  </tr>
                </thead>

                <tbody>
                  {standings.map((row, idx) => (
                    <tr
                      key={row.team}
                      className={
                        idx < 2
                          ? "bg-emerald-50"
                          : idx === standings.length - 1
                          ? "bg-red-50"
                          : ""
                      }
                    >
                      <td className="px-3 py-2 text-left font-medium text-gray-800 flex items-center gap-2">
                        <span className="text-lg">{getFlag(row.team)}</span>
                        <span>{row.team}</span>
                      </td>
                      <td className="px-2 py-2 text-center">{row.mp}</td>
                      <td className="px-2 py-2 text-center">{row.w}</td>
                      <td className="px-2 py-2 text-center">{row.d}</td>
                      <td className="px-2 py-2 text-center">{row.l}</td>
                      <td className="px-2 py-2 text-center">{row.gf}</td>
                      <td className="px-2 py-2 text-center">{row.ga}</td>
                      <td className="px-2 py-2 text-center">{row.gd}</td>
                      <td className="px-2 py-2 text-center font-semibold">
                        {row.pts}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>

      {knockoutPairs.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Knockout Bracket Preview (Top 16)
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {knockoutPairs.map((pair: KnockoutPair, idx: number) => (
              <div
                key={idx}
                className="border rounded-lg px-4 py-3 bg-white shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getFlag(pair.home.team)}</span>
                  <span className="font-medium text-gray-800">
                    {pair.home.team}
                  </span>
                </div>

                <span className="text-xs text-gray-400">vs</span>

                <div className="flex items-center gap-2">
                  <span className="text-lg">{getFlag(pair.away.team)}</span>
                  <span className="font-medium text-gray-800">
                    {pair.away.team}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
