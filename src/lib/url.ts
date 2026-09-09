/**
 * De-dupe key for listings: lowercase host + path, no protocol, no "www.",
 * no trailing slash, no query, no hash. So example.com/a and example.com/b
 * are separate listings, but https://WWW.Example.com/a/ collapses onto the first.
 */
export function normalizeUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  let parsed: URL;
  try {
    parsed = new URL(withProtocol);
  } catch {
    return null;
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;

  const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
  if (!host.includes(".")) return null;

  const path = parsed.pathname.replace(/\/+$/, "");
  return `${host}${path}`;
}

/** A normalized key is always safe to visit over https. */
export function toHref(normalized: string): string {
  return `https://${normalized}`;
}
