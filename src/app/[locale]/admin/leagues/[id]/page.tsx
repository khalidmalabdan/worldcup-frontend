"use client";
// Manual points editor for admins. Not pretty but gets the job done.
import { useEffect, useState } from "react";
import {
  getLeague,
  getLeagueMembers,
  setMemberPoints,
} from "@/lib/api/leagues";

export default function AdminLeaguePage({
  params,
}: {
  params: { id: string; locale: string };
}) {
  const leagueId = params.id;

  const [league, setLeague] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  // Load league + members
  useEffect(() => {
    async function load() {
      try {
        const [leagueData, memberData] = await Promise.all([
          getLeague(leagueId),
          getLeagueMembers(leagueId),
        ]);

        setLeague(leagueData);
        setMembers(memberData);
      } catch (err) {
        console.error("Failed to load admin league:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [leagueId]);

  async function updatePoints(userId: string, newPoints: number) {
    setSavingId(userId);

    try {
      await setMemberPoints(leagueId, userId, newPoints);

      // Update UI instantly
      setMembers((prev) =>
        prev.map((m) =>
          m.userId === userId ? { ...m, points: newPoints } : m
        )
      );
    } catch (err) {
      console.error("Failed to update points:", err);
      alert("Failed to update points");
    } finally {
      setSavingId(null);
    }
  }

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

      <h2 className="text-xl font-semibold">Manual Points Editor</h2>

      {members.length === 0 ? (
        <p className="text-gray-500">No members found.</p>
      ) : (
        <ul className="space-y-3">
          {members.map((m) => (
            <li
              key={m.userId}
              className="border p-4 rounded bg-white shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{m.name}</p>
                <p className="text-sm text-gray-600">
                  Current Points: {m.points}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="number"
                  defaultValue={m.points}
                  onChange={(e) =>
                    setMembers((prev) =>
                      prev.map((x) =>
                        x.userId === m.userId
                          ? { ...x, points: Number(e.target.value) }
                          : x
                      )
                    )
                  }
                  className="border px-2 py-1 w-20 rounded"
                />

                <button
                  onClick={() => updatePoints(m.userId, m.points)}
                  disabled={savingId === m.userId}
                  className={`px-4 py-2 rounded text-white ${
                    savingId === m.userId
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {savingId === m.userId ? "Saving..." : "Save"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <a
        href={`/${params.locale}/admin/leagues`}
        className="inline-block mt-4 text-blue-600 hover:underline"
      >
        ← Back to all leagues
      </a>
    </div>
  );
}
