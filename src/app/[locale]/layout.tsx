// import React from "react";


// export default function LocaleLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body>{children}</body>
//     </html>
//   );
// }


// import type { ReactNode } from "react";
// import { setRequestLocale } from "next-intl/server";

// export default function LocaleLayout({
//   children,
//   params,
// }: {
//   children: ReactNode;
//   params: { locale: string };
// }) {
//   const { locale } = params;

//   // Register locale for next-intl
//   setRequestLocale(locale);

//   return (
//     <html lang={locale}>
//       <body>{children}</body>
//     </html>
//   );
// }

import "./globals.css";

export const metadata = {
  title: "World Cup App",
  description: "Predictions and standings",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
