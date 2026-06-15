"use client";

import { useState } from "react";
import { setMemberPoints } from "@/lib/api/leagues";

// Define the shape of a league member
interface LeagueMember {
  userId: string;
  name: string;
  points: number;
}

interface ManualPointsEditorProps {
  leagueId: string;
  member: LeagueMember;
}

export default function ManualPointsEditor({
  leagueId,
  member,
}: ManualPointsEditorProps) {
  const [points, setPoints] = useState<number>(member.points);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await setMemberPoints(leagueId, member.userId, Number(points));
    setSaving(false);
    alert("Points updated!");
  }

  return (
    <div className="flex items-center gap-3">
      <input
        type="number"
        value={points}
        onChange={(e) => setPoints(Number(e.target.value))}
        className="border px-2 py-1 w-20 rounded"
      />

      <button
        onClick={save}
        disabled={saving}
        className="bg-blue-600 text-white px-3 py-1 rounded"
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
