import type { ReactNode } from "react";
import { setRequestLocale } from "next-intl/server";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  try {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
      <html lang={locale}>
        <body>{children}</body>
      </html>
    );
  } catch (error) {
    console.error('LocaleLayout error:', error);
    const fallbackLocale = 'en';
    setRequestLocale(fallbackLocale);
    return (
      <html lang={fallbackLocale}>
        <body>
          <div className="p-6 text-center">
            <h1 className="text-red-600">Error in layout</h1>
            <p>{error instanceof Error ? error.message : String(error)}</p>
          </div>
        </body>
      </html>
    );
  }
}
