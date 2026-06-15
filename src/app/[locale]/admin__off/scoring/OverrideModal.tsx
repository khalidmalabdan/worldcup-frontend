"use client";

import { useState, useEffect } from "react";
import { adminApi } from "@/api/admin";

interface OverrideModalProps {
  matchId: string;
  onClose: () => void;
}

export default function OverrideModal({ matchId, onClose }: OverrideModalProps) {
  const [userId, setUserId] = useState("");
  const [points, setPoints] = useState("");

  const submit = async () => {
    if (!userId.trim() || points === "") {
      alert("Please enter both User ID and Points");
      return;
    }

    try {
      const res = await adminApi.post(
        `/scoring/override/${matchId}/${userId}`,
        { points: Number(points) }
      );

      if (res.status >= 400) {
        alert("Failed to override points");
        return;
      }

      alert("Points overridden successfully");
      onClose();
    } catch (err) {
      console.error("Override failed:", err);
      alert("Error overriding points");
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded shadow w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Override Points</h2>

        <label className="block mb-2 font-medium">User ID</label>
        <input
          className="w-full border p-2 rounded mb-4"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter user ID"
        />

        <label className="block mb-2 font-medium">New Points</label>
        <input
          className="w-full border p-2 rounded mb-4"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          placeholder="Enter points"
          type="number"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
