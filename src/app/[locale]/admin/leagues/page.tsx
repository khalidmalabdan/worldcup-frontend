"use client";

import { useEffect, useState } from "react";
import api from "@/lib/client";
import { useLocale } from "next-intl/client";

export default function AdminLeagues() {
  const [leagues, setLeagues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const locale = useLocale();

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/leagues");
        const data = res.data;
        setLeagues(data.leagues || data);
      } catch (err) {
        console.error("Failed to load leagues:", err);
        setLeagues([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading leagues...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">All Leagues</h1>

      {leagues.length === 0 ? (
        <p className="text-gray-500">No leagues found.</p>
      ) : (
        <ul className="space-y-2">
          {leagues.map((l: any) => (
            <li key={l.id} className="border p-3 rounded bg-white shadow-sm">
              <a
                href={`/${locale}/admin/leagues/${l.id}`}
                className="text-blue-600 hover:underline font-semibold"
              >
                {l.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
