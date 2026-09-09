import type { Metadata } from "next";
import { COMPANY } from "@/lib/company";

const TITLE = "Contact — Outbid Me";
const DESCRIPTION =
  "How to reach Outbid Me, and the trader identification details for the company that runs it.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/contact" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/contact" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function ContactPage() {
  return (
    <article className="glass rise-in rounded-2xl px-5 py-8 sm:px-8">
      <h1 className="font-display text-4xl font-black leading-[0.95] sm:text-5xl">
        <span className="gradient-text">Contact</span>
      </h1>

      <div className="mt-6 max-w-prose space-y-6 text-sm leading-relaxed">
        <p>
          Outbid Me is run by <strong>{COMPANY.legalName}</strong>, a company
          registered in England and Wales.
        </p>

        <section>
          <h2 className="font-display text-2xl font-black">Get in touch</h2>
          <p className="mt-2">
            Email{" "}
            <a
              href={`mailto:${COMPANY.email}`}
              className="text-gain underline underline-offset-2 hover:text-ink"
            >
              {COMPANY.email}
            </a>
            . We're a small team — expect a reply within 2 business days,
            faster for anything payment-related.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-black">Who we are</h2>
          <ul className="mt-2 space-y-1">
            <li>Legal name: {COMPANY.legalName}</li>
            <li>Company number: {COMPANY.number}</li>
            <li>Registered office: {COMPANY.address}</li>
          </ul>
          <p className="mt-2 text-xs text-muted">
            This is the trader identification required under UK e-commerce
            regulations. It's not a support address — use the email above for
            that.
          </p>
        </section>
      </div>
    </article>
  );
}
