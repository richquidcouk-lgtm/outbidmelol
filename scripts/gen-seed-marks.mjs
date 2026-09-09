// Temporary: generates placeholder brand marks for the Phase 1 seed board.
// Delete once listings carry real Vercel Blob image URLs.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "seed");
mkdirSync(outDir, { recursive: true });

const brands = [
  ["hyperloop-coffee", "HC", "#0B3D2E", "#F5E9C8"],
  ["voidmail", "VM", "#1B1F3B", "#7CF5D4"],
  ["scrapheap", "SH", "#B02A12", "#FFE8D6"],
  ["dutchbulb", "DB", "#F2B705", "#2B1A00"],
  ["nine-lives", "9L", "#2E1A47", "#F0A6CA"],
  ["tinbox", "TB", "#3E5C76", "#F0EBD8"],
  ["ferment", "FE", "#5C3A21", "#E8D8B0"],
  ["orbit-labs", "OL", "#0F4C81", "#CDE7FF"],
  ["saltmarsh", "SM", "#556B2F", "#F7F5E6"],
  ["pigeonpost", "PP", "#6B2737", "#F2E9E4"],
  ["lastcall", "LC", "#111418", "#FFD400"],
  ["mossware", "MW", "#264653", "#A8DADC"],
];

for (const [slug, mono, bg, fg] of brands) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">` +
    `<rect width="128" height="128" fill="${bg}"/>` +
    `<text x="64" y="64" fill="${fg}" font-family="Arial Black, Arial, sans-serif" ` +
    `font-size="52" font-weight="900" text-anchor="middle" dominant-baseline="central">${mono}</text>` +
    `</svg>`;
  writeFileSync(join(outDir, `${slug}.svg`), svg, "utf8");
}

console.log(`wrote ${brands.length} placeholder marks to ${outDir}`);
