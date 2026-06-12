"use client";

import { useTranslations } from "next-intl";

export default function MatchStatusBadge({ status }: { status: string }) {
  const t = useTranslations("matches.status");

  let color = "";
  let text = t(status as any) ?? status;

  switch (status) {
    case "live":
      color = "bg-red-600 text-white";
      break;

    case "upcoming":
      color = "bg-gray-200 text-gray-700";
      break;

    case "finished":
      color = "bg-green-600 text-white";
      break;

    default:
      color = "bg-gray-300 text-gray-700";
  }

  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${color}`}>
      {text}
    </span>
  );
}
