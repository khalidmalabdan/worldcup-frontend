"use client";

import { useApi } from "@/lib/useApi";
import api from "@/api/client";

export default function Standings() {
  const { data, loading } = useApi(
    async () => {
      try {
        const res = await api.get("/standings");
        return res.data;
      } catch (err) {
        console.error("Failed to load standings:", err);
        return null;
      }
    },
    []
  );

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!data) {
    return (
      <div className="p-6 text-red-500">
        Failed to load standings.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">Group Standings</h1>

      {data.map((group: any) => (
        <div key={group.group} className="border p-4 rounded bg-white shadow">
          <h2 className="font-semibold text-xl mb-2">Group {group.group}</h2>

          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-2 text-left">Team</th>
                <th className="p-2 text-center">Pts</th>
                <th className="p-2 text-center">GF</th>
                <th className="p-2 text-center">GA</th>
              </tr>
            </thead>

            <tbody>
              {group.teams.map((t: any) => (
                <tr key={t.team} className="border-b">
                  <td className="p-2">{t.team}</td>
                  <td className="p-2 text-center">{t.points}</td>
                  <td className="p-2 text-center">{t.goalsFor}</td>
                  <td className="p-2 text-center">{t.goalsAgainst}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
