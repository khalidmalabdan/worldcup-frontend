"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function PlayerMultiSelect({
  label,
  players,
  selected,
  setSelected
}: {
  label: string;
  players: { name: string; team: string }[];
  selected: string[];
  setSelected: (v: string[]) => void;
}) {
  const t = useTranslations("prediction");

  const [open, setOpen] = useState(false);

  function togglePlayer(playerName: string) {
    if (selected.includes(playerName)) {
      setSelected(selected.filter((p) => p !== playerName));
    } else {
      setSelected([...selected, playerName]);
    }
  }

  // Group players by team
  const grouped = players.reduce((acc: any, p) => {
    if (!acc[p.team]) acc[p.team] = [];
    acc[p.team].push(p);
    return acc;
  }, {});

  return (
    <div className="w-full">
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full border rounded-lg px-4 py-2 flex justify-between items-center bg-white"
      >
        <span className="font-medium">{label}</span>

        <span className="text-gray-500 text-sm">
          {selected.length > 0
            ? t("selectedCount", { count: selected.length })
            : t("none")}
        </span>
      </button>

      {/* Dropdown Content */}
      {open && (
        <div className="mt-2 border rounded-lg bg-white max-h-56 overflow-y-auto shadow-sm">
          {Object.keys(grouped).map((team) => (
            <div key={team}>
              {/* Team Header */}
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50">
                {team}
              </div>

              {/* Players */}
              {grouped[team].map((player: any) => (
                <label
                  key={player.name}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(player.name)}
                    onChange={() => togglePlayer(player.name)}
                    className="w-4 h-4"
                  />
                  <span>{player.name}</span>
                </label>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
