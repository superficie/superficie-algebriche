// Emit data/pages.json: one entry per linkable URL state, so Hugo can render a real page for each
// (200 instead of the 404.html fallback). The set of points and surfaces lives in the browser
// scripts, so we evaluate surfaces.js here and replicate the point generation from table.js.
import fs from "node:fs";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// run surfaces.js (pure, no DOM) to obtain the `surfaces` array with computed invariants + slugs
const ctx = { console };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root, "static/js/surfaces.js"), "utf8"), ctx);
const surfaces = ctx.surfaces;

// replicate the point generation from static/js/table.js (domain c2 in [-20,80], c1^2 in [-30,60])
const points = [];
const P = (c2, c12, k) => points.push({ k, c2, c12 });
P(3, 9, -1);                       // projective plane
P(0, 0, 0); P(12, 0, 0); P(24, 0, 0);
for (let i2 = -20; i2 < 80; i2++) {
  for (let i12 = -30; i12 < 60; i12++) {
    if (i2 <= 4 && i12 <= 8 && i2 % 4 === 0 && i12 % 8 === 0 && i12 === i2 * 2) P(i2, i12, -1); // ruled
    if (i2 >= 0 && i12 <= 0 && i2 + i12 === 0) P(i2, i12, -1);                                   // Kodaira
    if ((i12 + i2) % 12 === 0 && i12 === 0 && i2 >= 0) P(i2, i12, 1);                             // Kodaira dim 1
    if ((i12 + i2) % 12 === 0 && i12 > 0 && i2 > 0 && i12 <= 3 * i2 && 5 * i12 - i2 + 36 >= 0) P(i2, i12, 2); // general type
  }
}

const inGraph = (s) => s.c2 >= -20 && s.c2 <= 80 && s.c12 >= -30 && s.c12 <= 60;

const paths = new Set();
for (const k of [-1, 0, 1, 2]) paths.add(`/${k}`);                                  // Kodaira only
for (const p of points) paths.add(`/${p.k}/${p.c2}-${p.c12}`);                       // a point
for (const s of surfaces) if (inGraph(s)) paths.add(`/${s.kodaira}/${s.c2}-${s.c12}/${s.slug}`); // a surface

const out = [...paths].sort();
fs.mkdirSync(path.join(root, "data"), { recursive: true });
fs.writeFileSync(path.join(root, "data/pages.json"), JSON.stringify(out, null, 1) + "\n");
console.error(`generated ${out.length} page paths (${points.length} points, ${surfaces.filter(inGraph).length} in-graph surfaces)`);
