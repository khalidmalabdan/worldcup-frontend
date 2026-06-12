export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

async function request(path: string, options: RequestInit = {}) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const headers: any = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || "API error");
  }

  return res.json();
}

export const api = {
  // Matches
  getMatches: () => request("/matches"),
  getMatchDetails: (id: string) => request(`/matches/${id}/details`),
  getTodayMatches: () => request("/matches/day/today"),

  // Predictions
  getPrediction: (matchId: string) => request(`/predictions/${matchId}`),
  savePrediction: (matchId: string, data: any) =>
    request(`/predictions/${matchId}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Standings
  getStandings: () => request("/standings"),

  // Leaderboard
  getLeaderboard: (leagueId: string) =>
    request(`/league/${leagueId}`),

  // Profile
  getProfile: () => request("/users/me"),
  getHistory: () => request("/users/me/history"),
  getBadges: () => request("/users/me/badges"),
};
