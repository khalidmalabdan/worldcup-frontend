export interface TeamStanding {
  team: string;
  pts: number;
  gd: number;
}

export interface KnockoutPair {
  home: TeamStanding;
  away: TeamStanding;
}

// Given group standings, generate a simple Round of 16 bracket:
// A1 vs B2, C1 vs D2, E1 vs F2, G1 vs H2
export function generateKnockoutBracket(
  groups: Record<string, TeamStanding[]>
): KnockoutPair[] {
  const orderedGroups = ["A", "B", "C", "D", "E", "F", "G", "H"];

  const topTwoByGroup: Record<string, TeamStanding[]> = {};

  for (const key of orderedGroups) {
    const standings = groups[key];
    if (!standings || standings.length === 0) continue;

    const sorted = [...standings].sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      return b.gd - a.gd;
    });

    topTwoByGroup[key] = sorted.slice(0, 2);
  }

  const pairs: KnockoutPair[] = [];

  const pairings: [string, string][] = [
    ["A", "B"],
    ["C", "D"],
    ["E", "F"],
    ["G", "H"],
  ];

  for (const [g1, g2] of pairings) {
    const g1Teams = topTwoByGroup[g1];
    const g2Teams = topTwoByGroup[g2];
    if (!g1Teams || !g2Teams || g1Teams.length < 2 || g2Teams.length < 2) {
      continue;
    }

    const [g1First] = g1Teams;
    const [, g2Second] = g2Teams;

    pairs.push({
      home: g1First,
      away: g2Second,
    });
  }

  return pairs;
}
