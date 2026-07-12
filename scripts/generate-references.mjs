// Emit static/js/references.js from bibliography.bib: a `references` map keyed by MR/arXiv id,
// consumed by static/js/form.js (formatCitation). bibgetter writes one field per line, so we
// parse line-by-line rather than pulling in a BibTeX library.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// --- TeX -> display helpers -------------------------------------------------

// the few LaTeX accents that actually occur (French titles); extend if a new one shows up
const ACCENTS = { "'": { e: "é", a: "á", o: "ó", i: "í", u: "ú", c: "ć", n: "ń", s: "ś", z: "ź",
                         E: "É", A: "Á", O: "Ó", I: "Í", U: "Ú", C: "Ć", N: "Ń", S: "Ś" },
                  "`": { e: "è", a: "à", E: "È", A: "À" },
                  '"': { o: "ö", u: "ü", a: "ä", O: "Ö", U: "Ü", A: "Ä" } };
// letter-command accents (caron \v, cedilla \c, breve \u, double-acute \H); braces required so \vec etc. are untouched
const LETTER_ACCENTS = { v: { z: "ž", s: "š", c: "č", r: "ř", e: "ě", n: "ň", Z: "Ž", S: "Š", C: "Č" },
                         c: { c: "ç", s: "ş", C: "Ç" }, u: { g: "ğ", a: "ă" }, H: { o: "ő", u: "ű" } };
function accents(s) {
  s = s.replace(/\\(['`"])\{?(\w)\}?/g, (m, acc, ch) => (ACCENTS[acc] && ACCENTS[acc][ch]) || m);
  s = s.replace(/\\([vcuH])\{(\w)\}/g, (m, acc, ch) => (LETTER_ACCENTS[acc] && LETTER_ACCENTS[acc][ch]) || m);
  return s;
}

function stripBraces(s) { return s.replace(/[{}]/g, "").trim(); }

// Make a bibgetter title display-ready for KaTeX: strip protective braces around text but keep
// `$...$` math, and convert old-style \sp/\sb super/subscripts to ^/_.
function cleanTitle(s) {
  s = accents(s);
  // \sp{2} -> ^{2}, \sb{1} -> _{1}, and bare \sp2 / \sb g
  s = s.replace(/\\sp\s*\{([^}]*)\}/g, "^{$1}")
       .replace(/\\sb\s*\{([^}]*)\}/g, "_{$1}")
       .replace(/\\sp\s*(\w)/g, "^$1")
       .replace(/\\sb\s*(\w)/g, "_$1");
  // single-char super/subscript needs no braces: ^{2} -> ^2
  s = s.replace(/\^\{(\w)\}/g, "^$1").replace(/_\{(\w)\}/g, "_$1");
  s = s.replace(/\\ /g, " ");   // TeX inter-word "\ " -> space (KaTeX ignores it inside math anyway)
  s = s.replace(/[{}]/g, "");   // safe now: after the conversions above no math braces remain
  // sentence period that ended up inside a closing math span belongs outside it: .$ -> $.
  s = s.replace(/\.\$/g, "$.");
  // Horikawa-style series numbering: "... $c^2_1$. II" reads as "... $c^2_1$, II"
  s = s.replace(/\$\.\s+(I{1,3}|IV)\b/g, "$, $1");
  return s.replace(/\s+/g, " ").trim();
}

function cleanAuthor(s) {
  // defensive: appendix credit belongs in the title, not the author list
  return stripBraces(accents(s.replace(/\s+and with an appendix by[^}]*/i, "")));
}

// --- parse bibliography.bib -------------------------------------------------

const bib = fs.readFileSync(path.join(root, "bibliography.bib"), "utf8");
const entries = {};
let key = null;
for (const line of bib.split("\n")) {
  const start = line.match(/^@\w+\{([^,]+),/);
  if (start) { key = start[1].trim(); entries[key] = {}; continue; }
  if (!key) continue;
  const f = line.match(/^\s*(\w+)\s*=\s*\{(.*)\},?\s*$/);
  if (f) entries[key][f[1]] = f[2];
}

// --- build the references map ----------------------------------------------

const order = [];
const out = {};
for (const [k, e] of Object.entries(entries)) {
  const ref = { author: cleanAuthor(e.author), title: cleanTitle(e.title) };
  if (e.year) ref.year = parseInt(e.year, 10);
  const journal = e.journaltitle || e.journal;
  if (journal) ref.journal = stripBraces(journal);
  if (e.volume) ref.volume = stripBraces(e.volume);
  if (e.number) ref.number = stripBraces(e.number);
  const p = (e.pages || "").match(/(\d+)\s*--\s*(\d+)/);
  if (p) ref.pages = [parseInt(p[1], 10), parseInt(p[2], 10)];
  out[k] = ref;
  order.push(k);
}

// --- emit static/js/references.js (unquoted keys, matching form.js's shape) -
const field = (r) => {
  const parts = [`author: ${JSON.stringify(r.author)}`, `title: ${JSON.stringify(r.title)}`];
  if ("year" in r) parts.push(`year: ${r.year}`);
  if (r.journal) parts.push(`journal: ${JSON.stringify(r.journal)}`);
  if (r.volume) parts.push(`volume: ${JSON.stringify(r.volume)}`);
  if (r.number) parts.push(`number: ${JSON.stringify(r.number)}`);
  if (r.pages) parts.push(`pages: [${r.pages[0]}, ${r.pages[1]}]`);
  return `{ ${parts.join(", ")} }`;
};

const lines = order.sort().map((k) => `  ${JSON.stringify(k)}: ${field(out[k])}`);
const js = "var references = {\n" + lines.join(",\n") + "\n};\n";
fs.mkdirSync(path.join(root, "static/js"), { recursive: true });
fs.writeFileSync(path.join(root, "static/js/references.js"), js);
console.error(`generated ${order.length} references`);
