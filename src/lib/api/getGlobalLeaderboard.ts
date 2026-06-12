export async function getGlobalLeaderboard() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leaderboard/global`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch global leaderboard");
  }

  return res.json();
}
