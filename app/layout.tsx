import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Packhouse — Fulfilment operations",
  description: "Fulfilment infrastructure for growing online businesses.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
