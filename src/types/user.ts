export interface UserLeague {
  id: string;
  name: string;
  rank: number | null;
  points: number;
}

export interface UserStats {
  totalPoints: number;
  exactScores: number;
  correctScorers: number;
  correctAssists: number;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar?: string | null;
  leagues: UserLeague[];
  stats: UserStats;
}
