import { Match } from "@/src/types/match";

export async function fetchMatches(): Promise<Match[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/matches`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch matches");
  }

  return res.json();
}
