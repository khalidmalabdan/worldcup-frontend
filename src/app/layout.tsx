import type { ReactNode } from "react";

export const metadata = {
  title: "World Cup App",
  description: "Live matches, predictions, leaderboards",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
