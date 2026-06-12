export interface MatchHistoryEntry {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  finalScore: {
    home: number;
    away: number;
  };
  prediction: {
    homeScore: number;
    awayScore: number;
    doublePoint: boolean;
    points: number;
  } | null;
}
