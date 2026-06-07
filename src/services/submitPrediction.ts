export interface PredictionPayload {
  matchId: string;
  homeScore: number;
  awayScore: number;
}

export async function submitPrediction(payload: PredictionPayload) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/predictions`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to submit prediction");
  }

  return res.json();
}
