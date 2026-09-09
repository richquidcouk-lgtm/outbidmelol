export type Category = {
  slug: string;
  label: string;
  icon: string;
};

// A comprehensive taxonomy, not a curated shortlist — any brand should find a
// close fit. Chips render as one neutral icon+label style rather than a hue
// per category: past ~8 series, distinct colors stop being reliably
// colorblind-safe (see the dataviz skill's categorical palette), and the
// reference site itself renders tags as plain gray icon+label, not hue-coded.
export const CATEGORIES: Category[] = [
  { slug: "agents", label: "AI Agents & Infrastructure", icon: "\u{1F916}" },
  { slug: "seo", label: "SEO & AI Visibility", icon: "\u{1F50D}" },
  { slug: "marketing", label: "Marketing & Advertising", icon: "\u{1F4E3}" },
  { slug: "crypto", label: "Crypto, Web3 & Investing", icon: "\u{1FA99}" },
  { slug: "dev-tools", label: "Developer Tools", icon: "\u{1F4BB}" },
  { slug: "business", label: "Business, Finance & Legal", icon: "\u{1F4BC}" },
  { slug: "security", label: "Security, Privacy & Compliance", icon: "\u{1F6E1}\u{FE0F}" },
  { slug: "health", label: "Health, Fitness & Wellness", icon: "\u{1FA7A}" },
  { slug: "social", label: "Social Media & Creator Tools", icon: "\u{1F4F1}" },
  { slug: "leaderboards", label: "Leaderboards & Attention Markets", icon: "\u{1F3C6}" },
  { slug: "hiring", label: "Hiring, Jobs & Careers", icon: "\u{1F9D1}\u{200D}\u{1F4BC}" },
  { slug: "education", label: "Education & Learning", icon: "\u{1F393}" },
  { slug: "agencies", label: "Agencies, Studios & Services", icon: "\u{1F3A8}" },
  { slug: "ecommerce", label: "Ecommerce & Retail", icon: "\u{1F6CD}\u{FE0F}" },
  { slug: "productivity", label: "Productivity & Collaboration", icon: "\u{2705}" },
  { slug: "design", label: "Design & Creative Tools", icon: "\u{1F58C}\u{FE0F}" },
  { slug: "gaming", label: "Gaming & Entertainment", icon: "\u{1F3AE}" },
  { slug: "travel", label: "Travel & Hospitality", icon: "\u{2708}\u{FE0F}" },
  { slug: "realestate", label: "Real Estate & Property", icon: "\u{1F3E0}" },
  { slug: "food", label: "Food & Beverage", icon: "\u{1F37D}\u{FE0F}" },
  { slug: "hardware", label: "Hardware & IoT", icon: "\u{1F527}" },
  { slug: "nonprofit", label: "Nonprofit & Community", icon: "\u{1F91D}" },
  { slug: "other", label: "Other", icon: "\u{2733}\u{FE0F}" },
];

// Fixed, curated subset shown inline before "More categories" — mirrors the
// reference site's own header nav, which shows a handful of high-traffic
// categories plus an Explore control rather than every category at once.
export const QUICK_CATEGORY_SLUGS = [
  "agents",
  "seo",
  "marketing",
  "dev-tools",
  "crypto",
  "ecommerce",
];

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

const BY_SLUG = new Map(CATEGORIES.map((c) => [c.slug, c]));

export function getCategory(slug: string): Category {
  return BY_SLUG.get(slug) ?? CATEGORIES[CATEGORIES.length - 1];
}

export function isCategorySlug(value: string): value is CategorySlug {
  return BY_SLUG.has(value);
}

/** "AI Agents & Infrastructure" -> "AI Agents" — for tight row/pill spaces. */
export function shortLabel(category: Category): string {
  return category.label.split(/[,&]/)[0].trim();
}
