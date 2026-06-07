"use client";

import { useEffect, useState } from "react";
import api from "@/api/client";
import Link from "next/link";

interface League {
  id: string;
  name: string;
  membersCount: number;
}

export default function LeaguesPage() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [newLeague, setNewLeague] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLeagues() {
      try {
        const res = await api.get("/leagues");
        setLeagues(res.data.leagues || res.data);
      } catch (err) {
        setError("Failed to load leagues");
      } finally {
        setLoading(false);
      }
    }

    loadLeagues();
  }, []);

  async function createLeague() {
    if (!newLeague.trim()) return;

    try {
      const res = await api.post("/leagues", { name: newLeague });
      setLeagues([...leagues, res.data]);
      setNewLeague("");
    } catch (err) {
      alert("Failed to create league");
    }
  }

  async function joinLeague() {
    if (!joinCode.trim()) return;

    try {
      const res = await api.post("/leagues/join", { code: joinCode });
      setLeagues([...leagues, res.data]);
      setJoinCode("");
    } catch (err) {
      alert("Invalid join code");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Loading leagues...
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Your Leagues</h1>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* League List */}
      <div className="space-y-3">
        {leagues.map((league) => (
          <Link
            key={league.id}
            href={`/leagues/${league.id}`}
            className="block border rounded p-4 hover:bg-gray-100 transition"
          >
            <div className="flex justify-between">
              <span className="font-semibold">{league.name}</span>
              <span className="text-gray-600 text-sm">
                {league.membersCount} members
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Create League */}
      <div className="border rounded p-4 space-y-3">
        <h2 className="font-semibold">Create a League</h2>
        <input
          type="text"
          placeholder="League name"
          className="border rounded px-3 py-2 w-full"
          value={newLeague}
          onChange={(e) => setNewLeague(e.target.value)}
        />
        <button
          onClick={createLeague}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Create League
        </button>
      </div>

      {/* Join League */}
      <div className="border rounded p-4 space-y-3">
        <h2 className="font-semibold">Join a League</h2>
        <input
          type="text"
          placeholder="Enter join code"
          className="border rounded px-3 py-2 w-full"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
        />
        <button
          onClick={joinLeague}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Join League
        </button>
      </div>
    </div>
  );
}
