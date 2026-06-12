"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Trophy, List, User } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export default function BottomNav() {
  const path = usePathname();
  const locale = useLocale();
  const t = useTranslations("nav");

  const links = [
    { href: "/matches", label: t("matches"), icon: Home },
    { href: "/standings", label: t("standings"), icon: List },
    { href: "/leaderboards", label: t("leaderboards"), icon: Trophy },
    { href: "/profile", label: t("profile"), icon: User }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 flex justify-around py-2 z-50">
      {links.map(({ href, label, icon: Icon }) => {
        const fullHref = `/${locale}${href}`;
        const active = path.startsWith(fullHref);

        return (
          <Link
            key={href}
            href={fullHref}
            className={`flex flex-col items-center text-xs ${
              active ? "text-blue-400" : "text-gray-300"
            }`}
          >
            <Icon className="w-6 h-6 mb-1" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
