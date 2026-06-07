export interface LeaderboardTeam {
  id: string;
  name: string;
  points: number;
  wins: number;
  losses: number;
  draws: number;
}

export interface LeaderboardResponse {
  leagueId: string;
  type: string;
  teams: LeaderboardTeam[];
}
