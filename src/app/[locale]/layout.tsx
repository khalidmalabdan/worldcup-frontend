import type { ReactNode } from "react";
import { setRequestLocale } from "next-intl/server";

export default function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  setRequestLocale(params.locale);

  return (
    <html lang={params.locale}>
      <body>{children}</body>
    </html>
  );
}
