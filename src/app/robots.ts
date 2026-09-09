import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/about", "/claim"],
      // /success doesn't exist yet (Stripe checkout — a later phase); listed
      // now so the rule is already in place once that route lands.
      disallow: ["/api/", "/success"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
