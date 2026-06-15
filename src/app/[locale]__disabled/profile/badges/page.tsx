"use client";

import { useEffect, useState } from "react";
import api from "@/lib/client";
import ProfileNav from "@/components/ProfileNav";
import type { Badge } from "@/types/badges";

export default function BadgesPage() {
  const [badges, setBadges] = useState<Badge[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/profile/badges");
        setBadges(res.data.badges || res.data);
      } catch (err) {
        console.error("Failed to load badges:", err);
        setBadges(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!badges) return <div className="p-6 text-red-500">Failed to load</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <ProfileNav />

      <h1 className="text-xl font-bold">Badges</h1>

      <div className="grid grid-cols-2 gap-4">
        {badges.map((b) => (
          <div
            key={b.id}
            className={`border p-4 rounded space-y-1 ${
              b.earned ? "bg-yellow-50" : "bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">
                {b.icon === "trophy"
                  ? "🏆"
                  : b.icon === "target"
                  ? "🎯"
                  : b.icon === "shoe"
                  ? "👟"
                  : b.icon === "sparkles"
                  ? "✨"
                  : "⭐"}
              </span>
              <div className="font-semibold">{b.title}</div>
            </div>

            <div className="text-xs text-gray-500">{b.description}</div>

            <div className="text-xs">
              {b.earned ? (
                <span className="text-green-600 font-semibold">Earned</span>
              ) : (
                <span className="text-gray-500">
                  Progress: {Math.round(b.progress)}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
