import "./globals.css";

export const metadata = {
  title: "World Cup App",
  description: "Predictions and standings",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
