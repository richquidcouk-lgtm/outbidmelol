import type { Metadata } from "next";
import { Barlow_Condensed, IBM_Plex_Sans } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["700", "900"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Outbid Me — the board where money is the only ranking",
  description:
    "A public leaderboard ranked purely by how much has been paid. No votes, no algorithm. Pay more, rank higher.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://outbid-me.lol",
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${barlowCondensed.variable} ${plexSans.variable} antialiased`}
      >
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col">
          <header className="flex items-center justify-between gap-3 border-b border-rule px-4 py-3">
            <Link href="/" className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-black leading-none tracking-tight">
                OUTBID ME
              </span>
              <span className="hidden text-xs text-muted sm:inline">
                money is the ranking
              </span>
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/about" className="text-muted hover:text-ink">
                How it works
              </Link>
              <Link
                href="/claim"
                className="rounded-full bg-gain px-3 py-1.5 font-medium text-white"
              >
                Claim a spot
              </Link>
            </nav>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="border-t border-rule px-4 py-6 text-xs text-muted">
            <p>
              Ranking is cumulative amount paid, highest first. Nothing else
              affects position.
            </p>
            <p className="mt-2">
              <Link href="/about" className="underline hover:text-ink">
                How it works
              </Link>
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
