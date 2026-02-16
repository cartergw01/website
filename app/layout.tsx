import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "inFlow",
  description: "AI curated personalized news feed"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="mx-auto min-h-screen w-full max-w-5xl p-6">{children}</main>
      </body>
    </html>
  );
}
