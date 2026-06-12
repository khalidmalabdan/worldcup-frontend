"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface LanguageSwitcherProps {
  locale: string;
}

export default function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const t = useTranslations("lang");

  const other = locale === "en" ? "ar" : "en";

  // Remove current locale prefix
  const pathWithoutLocale = pathname.replace(/^\/(en|ar)/, "") || "";

  return (
    <Link
      href={`/${other}${pathWithoutLocale}`}
      className="text-sm text-blue-400 hover:underline font-medium"
    >
      {other === "ar" ? t("arabic") : t("english")}
    </Link>
  );
}
