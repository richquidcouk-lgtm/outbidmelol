import type { Metadata } from "next";
import { Barlow_Condensed, IBM_Plex_Sans } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { formatMoney } from "@/lib/money";
import { getSeedListings, getSeedStats } from "@/lib/seed-data";

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
  // Phase 1 fixture — swapped for a shared cached Prisma query in Phase 2.
  const stats = getSeedStats(getSeedListings());

  return (
    <html lang="en">
      <body
        className={`${barlowCondensed.variable} ${plexSans.variable} antialiased`}
      >
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4">
          <header className="glass sticky top-0 z-30 -mx-4 flex items-center justify-between gap-3 px-4 py-3 sm:mx-0 sm:mt-4 sm:rounded-2xl sm:border sm:px-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-display flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gain via-accent to-gold text-lg font-black text-white shadow-[0_4px_16px_var(--glow-money)]">
                $
              </span>
              <span className="gradient-text font-display text-xl font-black leading-none tracking-tight">
                OUTBID ME
              </span>
              <span className="hidden items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 text-xs text-muted md:flex">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-gain shadow-[0_0_6px_var(--glow-money)]"
                  aria-hidden
                />
                <span className="tnum font-semibold text-ink">
                  {formatMoney(stats.totalRaisedCents)}
                </span>
                raised · {stats.listingCount} listings
              </span>
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link
                href="/about"
                className="hidden text-muted transition-colors hover:text-ink sm:inline"
              >
                How it works
              </Link>
              <Link
                href="/claim"
                className="rounded-full bg-gradient-to-r from-gain to-accent-2 px-4 py-2 font-semibold text-white shadow-[0_4px_20px_var(--glow-money)] transition-transform hover:scale-[1.03] active:scale-[0.98]"
              >
                Claim a spot
              </Link>
            </nav>
          </header>

          <main className="flex-1 py-6">{children}</main>

          <footer className="border-t border-rule px-1 py-8 text-xs text-muted">
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
