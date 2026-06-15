"use client";

import { useEffect, useState } from "react";
import api from "@/lib/client";

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

export default function AdminLeagueDetails({ params }: { params: { id: string } }) {
  const { id } = params;

  const [league, setLeague] = useState<League | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/leagues/${id}`);
        setLeague(res.data);
      } catch (err) {
        console.error("Failed to load league:", err);
        setLeague(null);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading league...
      </div>
    );
  }

  if (!league) {
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load league.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">{league.name}</h1>

      <h2 className="text-xl font-semibold">Members</h2>

      {league.members.length === 0 ? (
        <p className="text-gray-500">No members found.</p>
      ) : (
        <ul className="space-y-2">
          {league.members.map((m) => (
            <li
              key={m.userId}
              className="border p-3 rounded bg-white shadow-sm flex justify-between"
            >
              <span>{m.name}</span>
              <span className="text-sm text-gray-700">
                {m.points} pts • Rank {m.rank ?? "—"}
              </span>
            </li>
          ))}
        </ul>
      )}

      <a
        href="/admin/leagues"
        className="inline-block mt-4 text-blue-600 hover:underline"
      >
        ← Back to all leagues
      </a>
    </div>
  );
}
