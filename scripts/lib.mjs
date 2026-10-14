// Shared helpers for the profile SVGs.
// GitHub serves README images under a strict CSP, so web fonts inside an SVG never load.
// Every piece of text is therefore converted to outlines here with opentype.js.
import opentype from 'opentype.js';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(here, '..');

const load = (f) => opentype.parse(readFileSync(join(here, 'fonts', f)).buffer.slice(0));
export const FONTS = {
  display: load('Anton-Regular.ttf'),          // headlines
  cond: load('BarlowCondensed-SemiBold.ttf'),  // UI labels
  condB: load('BarlowCondensed-Bold.ttf'),
  condM: load('BarlowCondensed-Medium.ttf'),
  body: load('Barlow-Medium.ttf'),
  bodyB: load('Barlow-SemiBold.ttf'),
};

// The client palette, taken from the portfolio's own CSS tokens.
export const C = {
  red: '#ff4655', redD: '#c73a47',
  navy: '#0f1923', navy2: '#13202c', navy3: '#1c2a38', ink: '#0a1118',
  bone: '#ece8e1', muted: '#8a96a3', dim: '#5b6875',
  gold: '#d6b36a', gold2: '#f3d58f', teal: '#2ee6b6', green: '#35d6a0', blue: '#4cc3ff',
  line: 'rgba(236,232,225,.14)',
};

const missing = new Set();

/** Measure text width in px. */
export function measure(str, { font = 'cond', size = 16, ls = 0 } = {}) {
  const f = FONTS[font];
  let w = 0;
  const glyphs = f.stringToGlyphs(str);
  glyphs.forEach((g, i) => {
    w += (g.advanceWidth || 0) * (size / f.unitsPerEm);
    if (i < glyphs.length - 1) w += ls;
  });
  return w;
}

const r = (n) => Math.round(n);
function pathData(p) {
  return p.commands.map((c) => c.type === 'Z' ? 'Z'
    : c.type === 'Q' ? `Q${r(c.x1)} ${r(c.y1)} ${r(c.x)} ${r(c.y)}`
    : c.type === 'C' ? `C${r(c.x1)} ${r(c.y1)} ${r(c.x2)} ${r(c.y2)} ${r(c.x)} ${r(c.y)}`
    : `${c.type}${r(c.x)} ${r(c.y)}`).join('');
}

// Glyph outlines are defined once per file in <defs> and placed with <use>, which keeps files small.
const glyphDefs = new Map();
const fontKey = Object.fromEntries(Object.entries(FONTS).map(([k, f], i) => [k, 'f' + i]));

/**
 * Text as outlines.
 * anchor: start | middle | end. ls: letter-spacing in px. sw: stroke width in px for outlined text.
 */
export function T(str, { x = 0, y = 0, font = 'cond', size = 16, fill = C.bone, anchor = 'start', ls = 0, attrs = '', sw = 0 } = {}) {
  str = String(str);
  const f = FONTS[font];
  for (const ch of str) if (f.charToGlyphIndex(ch) === 0 && ch !== ' ') missing.add(`${ch} (${font})`);
  const w = measure(str, { font, size, ls });
  const x0 = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
  const s = size / f.unitsPerEm;
  let ux = 0, uses = '';
  for (const g of f.stringToGlyphs(str)) {
    const id = `${fontKey[font]}g${g.index}`;
    const d = pathData(g.getPath(0, 0, f.unitsPerEm));
    if (d) {
      if (!glyphDefs.has(id)) glyphDefs.set(id, `<path id="${id}" d="${d}"/>`);
      uses += `<use href="#${id}" x="${Math.round(ux)}"/>`;
    }
    ux += (g.advanceWidth || 0) + ls / s;
  }
  const stroke = sw ? ` stroke-width="${(sw / s).toFixed(1)}"` : '';
  return `<g fill="${fill}"${stroke} ${attrs} transform="translate(${+x0.toFixed(2)} ${+y.toFixed(2)}) scale(${+s.toFixed(5)})">${uses}</g>`;
}

/** Wrap a string into lines that fit maxWidth. */
export function wrap(str, maxWidth, opts) {
  const words = String(str).split(/\s+/);
  const lines = [];
  let cur = '';
  for (const w of words) {
    const t = cur ? cur + ' ' + w : w;
    if (measure(t, opts) > maxWidth && cur) { lines.push(cur); cur = w; } else cur = t;
  }
  if (cur) lines.push(cur);
  return lines;
}

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

export function svg(w, h, body, { title = '', style = '' } = {}) {
  const out = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}">
<title>${esc(title)}</title>
<defs>${[...glyphDefs.values()].join('')}</defs>
<style>
${style}
@media (prefers-reduced-motion: reduce){*{animation:none!important}}
</style>
${body}
</svg>`;
  glyphDefs.clear();
  return out;
}

export function save(rel, content) {
  const p = join(ROOT, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content);
  console.log(`  ${rel.padEnd(34)} ${(content.length / 1024).toFixed(1)} KB`);
}

export function reportMissing() {
  if (missing.size) console.warn('Missing glyphs:', [...missing].join(', '));
}

/** Small angled tag, the client's signature shape (one clipped corner). */
export function tag(x, y, w, h, fill, cut = 8, attrs = '') {
  return `<path d="M${x} ${y}H${x + w}V${y + h - cut}L${x + w - cut} ${y + h}H${x}Z" fill="${fill}" ${attrs}/>`;
}

/** The section header used across every panel: index, kicker, big title. */
export function header({ x = 48, y = 70, idx, kicker, title, w = 1000, right = '' }) {
  return `
  ${tag(x, y - 26, 6, 34, C.red, 0)}
  ${T(idx, { x: x + 20, y: y - 8, font: 'condB', size: 15, fill: C.red, ls: 2 })}
  ${T(kicker, { x: x + 20 + measure(idx, { font: 'condB', size: 15, ls: 2 }) + 14, y: y - 8, font: 'cond', size: 15, fill: C.muted, ls: 2 })}
  ${T(title, { x: x + 18, y: y + 46, font: 'display', size: 52, fill: C.bone, ls: 1 })}
  ${right ? T(right, { x: w - 48, y: y - 8, font: 'cond', size: 14, fill: C.dim, ls: 2, anchor: 'end' }) : ''}
  <rect x="${x}" y="${y + 64}" width="${w - x * 2}" height="1" fill="${C.line}"/>`;
}

/** Panel frame: dark client window with a hairline border and corner ticks. */
export function frame(w, h, inner = '') {
  return `
  <defs>
    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M24 0H0V24" fill="none" stroke="rgba(236,232,225,.035)" stroke-width="1"/>
    </pattern>
    <linearGradient id="vig" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${C.navy}"/><stop offset="1" stop-color="${C.ink}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" rx="14" fill="url(#vig)"/>
  <rect width="${w}" height="${h}" rx="14" fill="url(#grid)"/>
  <rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="13.5" fill="none" stroke="${C.line}"/>
  ${inner}
  <path d="M14 26V14H26M${w - 26} 14H${w - 14}V26M14 ${h - 26}V${h - 14}H26M${w - 26} ${h - 14}H${w - 14}V${h - 26}" fill="none" stroke="${C.red}" stroke-width="2" opacity=".8"/>`;
}
