// Basic group mapping used for helper functions.
// You can adjust these to match your real tournament data.

export const GROUPS: Record<string, string[]> = {
  A: ["Mexico", "South Africa", "South Korea", "Czechia"],
  B: ["Canada", "Bosnia-Herzegovina", "Qatar", "Switzerland"],
  C: ["Brazil", "Morocco", "Haiti", "Scotland"],
  D: ["United States", "Paraguay", "Australia", "Turkey"],
  E: ["Germany", "Curaçao", "Ivory Coast", "Ecuador"],
  F: ["Netherlands", "Japan", "Sweden", "Tunisia"],
  G: ["Belgium", "Egypt", "Iran", "New Zealand"],
  H: ["Spain", "Cape Verde Islands", "Saudi Arabia", "Uruguay"],
};

export function getGroupForMatch(homeTeam: string, awayTeam: string): string | null {
  for (const [groupKey, teams] of Object.entries(GROUPS)) {
    if (teams.includes(homeTeam) && teams.includes(awayTeam)) {
      return groupKey;
    }
  }
  return null;
}
