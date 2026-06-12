"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProfileNav() {
  const path = usePathname();

  const links = [
    { href: "/profile", label: "Overview" },
    { href: "/profile/history", label: "History" },
    { href: "/profile/badges", label: "Badges" },
  ];

  return (
    <div className="flex gap-4 border-b pb-2 mb-4 text-sm">
      {links.map((l) => {
        const active = path === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`px-2 py-1 rounded ${
              active
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:text-black"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </div>
  );
}
