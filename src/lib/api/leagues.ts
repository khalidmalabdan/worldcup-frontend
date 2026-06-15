import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// ---------------------------------------------------
// Auth Token
// ---------------------------------------------------
export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

// ---------------------------------------------------
// League CRUD
// ---------------------------------------------------
export async function createLeague(name: string) {
  const res = await api.post("/leagues", { name });
  return res.data;
}

export async function joinLeague(code: string) {
  const res = await api.post("/leagues/join", { code });
  return res.data;
}

export async function renameLeague(leagueId: string, name: string) {
  const res = await api.post("/leagues/admin/rename", { leagueId, name });
  return res.data;
}

export async function deleteLeague(leagueId: string) {
  const res = await api.post("/leagues/admin/delete", { leagueId });
  return res.data;
}

// ---------------------------------------------------
// League Info (NEW — needed for League Page UI)
// ---------------------------------------------------
export async function getLeague(leagueId: string) {
  const res = await api.get(`/leagues/${leagueId}`);
  return res.data;
}

export async function getLeagueMembers(leagueId: string) {
  const res = await api.get(`/leagues/${leagueId}/members`);
  return res.data;
}

// ---------------------------------------------------
// Leaderboard
// ---------------------------------------------------
export async function getLeagueLeaderboard(leagueId: string) {
  const res = await api.get(`/leagues/${leagueId}/leaderboard`);
  return res.data;
}

// ---------------------------------------------------
// Settings
// ---------------------------------------------------
export async function regenerateLeagueCode(leagueId: string) {
  const res = await api.post("/leagues/settings/regenerate-code", { leagueId });
  return res.data;
}

export async function leaveLeague(leagueId: string) {
  const res = await api.post("/leagues/settings/leave", { leagueId });
  return res.data;
}

// ---------------------------------------------------
// Admin Actions
// ---------------------------------------------------
export async function kickMember(leagueId: string, memberId: string) {
  const res = await api.post("/leagues/admin/kick", { leagueId, memberId });
  return res.data;
}

// manual override over member points (for correcting errors or resolving disputes)
export async function setMemberPoints(
  leagueId: string,
  userId: string,
  points: number
) {
  const res = await api.post("/leagues/admin/set-points", {
    leagueId,
    userId,
    points,
  });

  return res.data;
}

export async function updateMemberRole(
  leagueId: string,
  memberId: string,
  role: string
) {
  const res = await api.post("/leagues/admin/role", {
    leagueId,
    memberId,
    role,
  });
  return res.data;
}

// ---------------------------------------------------
// Weekly Trophies (NEW — needed for League Page UI)
// ---------------------------------------------------
export async function getLeagueTrophies(leagueId: string) {
  const res = await api.get(`/trophies/league/${leagueId}`);
  return res.data;
}
