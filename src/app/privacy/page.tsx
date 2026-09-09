import type { Metadata } from "next";
import Link from "next/link";
import { COMPANY, POLICY_LAST_UPDATED } from "@/lib/company";

const TITLE = "Privacy — Outbid Me";
const DESCRIPTION =
  "What Outbid Me collects when you submit a listing or pay, and how to ask for it to be removed.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/privacy" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/privacy" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function PrivacyPage() {
  return (
    <article className="glass rise-in rounded-2xl px-5 py-8 sm:px-8">
      <h1 className="font-display text-4xl font-black leading-[0.95] sm:text-5xl">
        <span className="gradient-text">Privacy</span>
      </h1>
      <p className="mt-2 text-xs text-muted">
        Last updated {POLICY_LAST_UPDATED}.
      </p>

      <div className="mt-6 max-w-prose space-y-6 text-sm leading-relaxed">
        <p>
          We're {COMPANY.legalName}, a UK company, and we process personal
          data under UK GDPR — regardless of where you're visiting from.
        </p>

        <section>
          <h2 className="font-display text-2xl font-black">
            What we collect when you submit a listing
          </h2>
          <p className="mt-2">
            Name, URL, tagline, and the image you upload.{" "}
            <strong>
              This is published on the public leaderboard by design
            </strong>{" "}
            — it's not private data, it's the content of your listing. Don't
            submit anything in these fields you don't want publicly visible.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-black">
            What we collect when you pay
          </h2>
          <p className="mt-2">
            Payment is handled entirely by Stripe. Your card details go
            directly to Stripe's checkout page and never touch our servers or
            database — we only receive confirmation that a payment succeeded,
            and the amount.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-black">
            Cookies and analytics
          </h2>
          <p className="mt-2">
            We don't use cookies, and we don't run any analytics or tracking
            scripts on this site. The only site outside our own that's part
            of the flow is Stripe's checkout page, which is subject to{" "}
            <a
              href="https://stripe.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gain underline underline-offset-2 hover:text-ink"
            >
              Stripe's own privacy policy
            </a>{" "}
            while you're on it. Our hosting provider (Vercel) logs standard
            technical data like IP address for security and performance, as
            any web host does.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-black">
            How long we keep it, and how to remove it
          </h2>
          <p className="mt-2">
            Listing data stays live as long as the listing is on the board.
            If you want a listing removed or want to ask what data we hold on
            you, email{" "}
            <Link
              href="/contact"
              className="text-gain underline underline-offset-2 hover:text-ink"
            >
              /contact
            </Link>{" "}
            and we'll action it.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-black">Lawful basis</h2>
          <p className="mt-2">
            We process listing data to perform the contract you enter into
            when you submit a listing (Art. 6(1)(b) UK GDPR), and payment
            confirmation data on the basis of our legitimate interest in
            running the leaderboard and preventing fraud (Art. 6(1)(f)).
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-black">Questions</h2>
          <p className="mt-2">
            Email{" "}
            <Link
              href="/contact"
              className="text-gain underline underline-offset-2 hover:text-ink"
            >
              /contact
            </Link>
            .
          </p>
        </section>
      </div>
    </article>
  );
}
