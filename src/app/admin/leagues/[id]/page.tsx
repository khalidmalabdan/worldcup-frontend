"use client";
import { useEffect, useState } from "react";

interface LeagueMember {
  userId: string;
  name: string;
  points: number;
  rank?: number;
}

interface League {
  id: string;
  name: string;
  members: LeagueMember[];
}

export default function LeagueMembers({ params }: any) {
  const { id } = params;

  const [league, setLeague] = useState<League | null>(null);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("adminToken")
      : null;

  useEffect(() => {
    fetch(`/api/leagues/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setLeague(data));
  }, [id]);

  if (!league) return <p>Loading...</p>;

  return (
    <div style={{ padding: 40 }}>
      <h1>{league.name}</h1>

      <h2>Members</h2>
      <ul>
        {league.members.map((m) => (
          <li key={m.userId}>
            {m.name} — {m.points} pts (Rank {m.rank ?? "—"})
          </li>
        ))}
      </ul>
    </div>
  );
}
