// worldcup-web/utils/knockout.ts

export interface TeamStanding {
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

export interface KnockoutPair {
  home: TeamStanding;
  away: TeamStanding;
}

export function generateKnockoutBracket(
  groups: Record<string, TeamStanding[]>
): KnockoutPair[] {
  const allTeams: TeamStanding[] = [];

  for (const group of Object.keys(groups)) {
    allTeams.push(...groups[group]);
  }

  const sorted = allTeams.sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.gd !== a.gd) return b.gd - a.gd;
    if (b.gf !== a.gf) return b.gf - a.gf;
    return a.team.localeCompare(b.team);
  });

  const qualified = sorted.slice(0, 16);
  const pairs: KnockoutPair[] = [];

  for (let i = 0; i < qualified.length; i += 2) {
    if (i + 1 < qualified.length) {
      pairs.push({
        home: qualified[i],
        away: qualified[i + 1],
      });
    }
  }

  return pairs;
}
