// Generates on-brand SVG placeholder images for every product in database/db.sql
// into backend/public/images/products/. Run with:
//   node scripts/generate-product-images.mjs
//
// Images live with the backend (see UPLOAD_DIR in backend/config/config.php) so
// they are served from one place; the storefront and admin proxy /images there.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sql = readFileSync(join(root, "database", "db.sql"), "utf8");

// Only look at the products INSERT block.
const start = sql.indexOf("INSERT INTO products");
const end = sql.indexOf("INSERT INTO reviews");
if (start === -1 || end === -1) throw new Error("Could not locate products INSERT block in db.sql");
const block = sql.slice(start, end);

const products = [...block.matchAll(/'([^']+)',\s*'([a-z0-9-]+)',\s*[\d.]+,\s*(?:NULL|[\d.]+),\s*'/g)].map(
  (m) => ({ title: m[1], slug: m[2] }),
);

if (products.length === 0) throw new Error("No products parsed from db.sql");

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Wrap a title into at most two lines of roughly `max` characters. */
function wrap(text, max = 20) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    if (line && (line + " " + word).length > max) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  if (lines.length <= 2) return lines;
  return [lines[0], lines.slice(1).join(" ")];
}

function svg({ title }) {
  const lines = wrap(title);
  const initial = esc(title.trim()[0]?.toUpperCase() ?? "H");
  const titleSize = lines.some((l) => l.length > 18) ? 40 : 46;
  const titleY = lines.length === 1 ? 648 : 620;
  const titleSpans = lines
    .map((l, i) => `<tspan x="450" dy="${i === 0 ? 0 : titleSize + 12}">${esc(l)}</tspan>`)
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 900" width="900" height="900" role="img" aria-label="${esc(title)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#15151a"/>
      <stop offset="1" stop-color="#08080a"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.36" r="0.72">
      <stop offset="0" stop-color="#d4af37" stop-opacity="0.24"/>
      <stop offset="1" stop-color="#d4af37" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f8ecc0"/>
      <stop offset="0.5" stop-color="#d4af37"/>
      <stop offset="1" stop-color="#9c7718"/>
    </linearGradient>
  </defs>
  <rect width="900" height="900" fill="url(#bg)"/>
  <rect width="900" height="900" fill="url(#glow)"/>
  <g opacity="0.6" stroke="url(#gold)" fill="none">
    <circle cx="450" cy="350" r="132" stroke-width="1.6"/>
    <circle cx="450" cy="350" r="176" stroke-width="0.8" opacity="0.45"/>
  </g>
  <text x="450" y="350" text-anchor="middle" dominant-baseline="central"
        font-family="Georgia, 'Times New Roman', serif" font-size="150" fill="url(#gold)">${initial}</text>
  <g font-family="Georgia, 'Times New Roman', serif" font-size="${titleSize}" fill="#f4f1e8" text-anchor="middle">
    <text x="450" y="${titleY}">${titleSpans}</text>
  </g>
  <text x="450" y="${titleY + (lines.length - 1) * (titleSize + 12) + 74}" text-anchor="middle"
        font-family="Helvetica, Arial, sans-serif" font-size="22" letter-spacing="8"
        fill="#d4af37" opacity="0.85">HAPPYSHOP</text>
</svg>
`;
}

const outDir = join(root, "backend", "public", "images", "products");
mkdirSync(outDir, { recursive: true });

for (const product of products) {
  writeFileSync(join(outDir, `${product.slug}.svg`), svg(product), "utf8");
}

console.log(`Generated ${products.length} product images in backend/public/images/products/`);
