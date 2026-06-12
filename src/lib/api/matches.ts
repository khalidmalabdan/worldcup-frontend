import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export async function getMatchTimeline(matchId: string) {
  const res = await api.get(`/matches/${matchId}/timeline`);
  return res.data;
}
