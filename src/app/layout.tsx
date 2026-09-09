import type { Metadata } from "next";
import { Barlow_Condensed, IBM_Plex_Sans } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";
import "./globals.css";
import { HeaderStatsPill } from "@/components/HeaderStatsPill";
import { SITE_URL } from "@/lib/site";

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

// The header's live stats pill (see HeaderStatsPill) needs a DB call on
// every route via this shared layout. Forcing the whole tree dynamic means
// nothing — including /about, /terms, etc. — tries to statically prerender
// against the database at build time; they render per-request instead of
// being cached as static HTML. Fine at current traffic.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Outbid Me — the board where money is the only ranking",
  description:
    "A public leaderboard ranked purely by how much has been paid. No votes, no algorithm. Pay more, rank higher.",
  metadataBase: new URL(SITE_URL),
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "-sniCwJZhj0Y1A_SPJ5A5Zv7tUaHsFYGSty8KnE_eJc",
  },
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
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4">
          <header className="glass sticky top-0 z-30 -mx-4 flex items-center justify-between gap-3 px-4 py-3 sm:mx-0 sm:mt-4 sm:rounded-2xl sm:border sm:px-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-display flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gain via-accent to-gold text-lg font-black text-white shadow-[0_4px_16px_var(--glow-money)]">
                $
              </span>
              <span className="gradient-text font-display text-xl font-black leading-none tracking-tight">
                OUTBID ME
              </span>
              <Suspense fallback={<span className="hidden h-6 w-40 rounded-full bg-surface-2 md:block" />}>
                <HeaderStatsPill />
              </Suspense>
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
            <nav className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
              <Link href="/about" className="hover:text-ink hover:underline">
                How it works
              </Link>
              <Link href="/contact" className="hover:text-ink hover:underline">
                Contact
              </Link>
              <Link href="/terms" className="hover:text-ink hover:underline">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-ink hover:underline">
                Privacy
              </Link>
              <Link href="/refunds" className="hover:text-ink hover:underline">
                Refunds
              </Link>
            </nav>
          </footer>
        </div>
      </body>
    </html>
  );
}
