"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Navbar() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("nav");

  const links = [
    { name: t("home"), href: `/${locale}` },
    { name: t("matches"), href: `/${locale}/matches` },
    { name: t("predictions"), href: `/${locale}/predictions` },
    { name: t("leagues"), href: `/${locale}/leagues` }
  ];

  return (
    <nav className="w-full bg-gray-900 text-white px-6 py-4 shadow-md">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        
        {/* LEFT SIDE LINKS */}
        <div className="flex items-center gap-6">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-lg font-medium transition ${
                  active
                    ? "text-yellow-400"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* RIGHT SIDE LANGUAGE SWITCHER */}
        <LanguageSwitcher locale={locale} />
      </div>
    </nav>
  );
}
