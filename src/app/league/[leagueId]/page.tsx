"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/src/api/client";

interface Member {
  id: string;
  name: string;
  points: number;
}

interface League {
  id: string;
  name: string;
}

export default function LeaguePage() {
  const { id } = useParams();

  const [league, setLeague] = useState<League | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLeague() {
      try {
        const res = await api.get(`/leagues/${id}`);
        setLeague(res.data.league || res.data);

        const membersRes = await api.get(`/leagues/${id}/leaderboard`);
        setMembers(membersRes.data.members || membersRes.data);
      } catch (err) {
        setError("Failed to load league");
      } finally {
        setLoading(false);
      }
    }

    loadLeague();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Loading league...
      </div>
    );
  }

  if (!league) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        League not found
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">{league.name}</h1>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="space-y-3">
        {members.map((m, index) => (
          <div
            key={m.id}
            className="border rounded p-4 flex justify-between items-center"
          >
            <span className="font-semibold">
              {index + 1}. {m.name}
            </span>
            <span className="text-blue-600 font-bold">{m.points} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
}
