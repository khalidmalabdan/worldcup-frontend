export interface LeagueMember {
  userId: string;
  name: string;
  points: number;
  weeklyPoints: number;
  monthlyPoints: number;
  exactScores: number;
  correctScorers: number;
  correctAssists: number;
  achievements: string[];
  rank?: number;
}

export interface LeaderboardResponse {
  leagueId: string;
  name: string;
  leaderboardType: string;
  members: LeagueMember[];
}
