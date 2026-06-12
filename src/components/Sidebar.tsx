"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useLocale, useTranslations } from "next-intl";

export default function Sidebar() {
  const path = usePathname();
  const locale = useLocale();
  const t = useTranslations("nav");

  const [open, setOpen] = useState(false);

  // Theme handling
  const theme = useTheme();
  const [isDark, setIsDark] = useState(true);

  // Sync with actual DOM theme on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDark(document.documentElement.classList.contains("dark"));
    }
  }, []);

  const toggleTheme = () => {
    theme.toggle();
    setIsDark((prev) => !prev);
  };

  const links = [
    { href: `/${locale}/matches`, label: t("matches") },
    { href: `/${locale}/standings`, label: t("standings") },
    { href: `/${locale}/leaderboards`, label: t("leaderboards") },
    { href: `/${locale}/profile`, label: t("profile") }
  ];

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
        <button onClick={() => setOpen(true)}>
          <Menu className="w-7 h-7 text-white" />
        </button>
        <h1 className="text-lg font-bold">⚽ {t("appName")}</h1>
      </div>

      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed lg:static top-0 left-0 h-full w-64 bg-gray-800 border-r border-gray-700 p-4 z-50
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Close button (mobile only) */}
        <div className="lg:hidden flex justify-end mb-4">
          <button onClick={() => setOpen(false)}>
            <X className="w-7 h-7 text-white" />
          </button>
        </div>

        <h1 className="text-xl font-bold mb-6 hidden lg:block">⚽ {t("appName")}</h1>

        {/* NAV LINKS */}
        <nav className="space-y-2">
          {links.map((l) => {
            const active = path.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2 rounded ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* THEME TOGGLE */}
        <div className="mt-8 border-t border-gray-700 pt-4">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 px-3 py-2 rounded text-gray-300 hover:bg-gray-700 w-full"
          >
            {isDark ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
            <span>{isDark ? t("lightMode") : t("darkMode")}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
