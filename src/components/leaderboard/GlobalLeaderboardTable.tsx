"use client";

import React from "react";

interface Entry {
  userId: string;
  name: string;
  avatar?: string | null;
  points: number;
  rank: number;
}

export default function GlobalLeaderboardTable({ data }: { data: Entry[] }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left text-sm font-semibold">
            <th className="p-3">Rank</th>
            <th className="p-3">User</th>
            <th className="p-3">Points</th>
          </tr>
        </thead>

        <tbody>
          {data.map((entry) => (
            <tr
              key={entry.userId}
              className="border-b hover:bg-gray-50 transition"
            >
              <td className="p-3 font-bold">{entry.rank}</td>

              <td className="p-3 flex items-center gap-3">
                <img
                  src={entry.avatar ?? "/default-avatar.png"}
                  alt={entry.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span>{entry.name}</span>
              </td>

              <td className="p-3 font-semibold">{entry.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
