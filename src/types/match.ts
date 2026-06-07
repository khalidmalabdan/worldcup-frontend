export interface Match {
  id: string;

  homeTeam: string;
  awayTeam: string;

  // Kickoff timestamp (ms)
  kickoff: number;

  // Optional backend fields
  homeLogo?: string;
  awayLogo?: string;

  // Normalized frontend fields
  homeFlag?: string;
  awayFlag?: string;

  // Scores
  homeScore?: number;
  awayScore?: number;

  // Match status
  status?: "upcoming" | "live" | "finished";
}
