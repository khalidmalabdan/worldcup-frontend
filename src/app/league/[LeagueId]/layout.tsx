import { ReactNode } from "react";
import Link from "next/link";

interface LeagueLayoutProps {
  children: ReactNode;
  params: {
    leagueId: string;
  };
}

export default function LeagueLayout({ children, params }: LeagueLayoutProps) {
  const { leagueId } = params;

  const tabs = [
    { name: "Weekly", href: `/league/${leagueId}/weekly` },
    { name: "Monthly", href: `/league/${leagueId}/monthly` },
    { name: "All‑time", href: `/league/${leagueId}/alltime` },
  ];

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <nav className="flex gap-4 mb-8 border-b pb-3">
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            href={tab.href}
            className="text-gray-600 hover:text-black font-medium"
          >
            {tab.name}
          </Link>
        ))}
      </nav>

      {children}
    </div>
  );
}
