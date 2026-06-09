#!/usr/bin/env node
/**
 * Generate per-package and umbrella SVG marks from the Vitus Labs design system,
 * and inject README headers across every package.
 *
 * Source of truth for glyph geometry: handed off by Claude Design in
 * `Vitus Labs Package Marks` — ported verbatim from `package-marks.js`.
 * Re-run is idempotent (overwrites SVGs and replaces the header block between
 * the BEGIN/END markers).
 *
 *   bun scripts/generate-package-logos.mjs
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO_ROOT = dirname(dirname(fileURLToPath(import.meta.url)))

// ─── PALETTE (from design bundle) ────────────────────────────────────────
const FG_DARK = '#ECEAE2' // foreground for dark backgrounds
const FG_LIGHT = '#0A0B0D' // foreground for light backgrounds
const COBALT = '#2F4DFF' // layer 0/1 — engines + connectors
const SIGNAL = '#FF5630' // layer 3 — animation
const ACID_DARK = '#C8FF3A' // layer U/4 on dark
const ACID_LIGHT = '#8FB81E' // layer U/4 on light (darker for readability)

const fgFor = (mode) => (mode === 'light' ? FG_LIGHT : FG_DARK)
const accentFor = (token, mode) => {
  switch (token) {
    case 'acid':
      return mode === 'light' ? ACID_LIGHT : ACID_DARK
    case 'cobalt':
      return COBALT
    case 'signal':
      return SIGNAL
    default:
      return fgFor(mode)
  }
}

// ─── SVG PRIMITIVES (verbatim from design) ───────────────────────────────
const R = (x, y, w, h, f, r) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r ?? 3}" fill="${f}"/>`
const P = (d, f) => `<path d="${d}" fill="${f}"/>`
const S = (d, s, w) =>
  `<path d="${d}" fill="none" stroke="${s}" stroke-width="${w}" stroke-linecap="square" stroke-linejoin="miter"/>`
const C = (cx, cy, r, f) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${f}"/>`
const RING = (cx, cy, r, s, w) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${s}" stroke-width="${w}"/>`
const frame = (fg) =>
  `<rect x="22" y="22" width="56" height="56" rx="12" fill="none" stroke="${fg}" stroke-width="6"/>`

// ─── GLYPH LIBRARY (verbatim from design) ─────────────────────────────────
const glyphs = {
  // Umbrella ─ stacked triangle funneling down (compose/converge)
  'ui-system': (fg, ac) =>
    P('M8 18 L92 18 L74 44 L26 44 Z', fg) +
    P('M26 50 L74 50 L60 72 L40 72 Z', fg) +
    P('M40 78 L60 78 L50 94 Z', ac),

  // Layer 0 · Engines (cobalt accent)
  styler: (fg, ac) =>
    P('M22 40 L51 40 L43 64 L22 64 Z', fg) +
    P('M59 40 L80 40 L80 64 L51 64 Z', fg) +
    P('M54 36 L59 36 L49 68 L44 68 Z', ac),
  core: (fg, ac) =>
    R(22, 38, 56, 15, fg) +
    P('M30 59 L70 59 L62 74 L38 74 Z', fg) +
    R(42, 80, 16, 7, ac, 3),

  // Layer 1 · Connectors (shared frame, cobalt inner glyph)
  'connector-styler': (fg, ac) => frame(fg) + P('M43 42 L57 42 L50 58 Z', ac),
  'connector-emotion': (fg, ac) => frame(fg) + C(50, 50, 10, ac),
  'connector-styled-components': (fg, ac) =>
    frame(fg) + P('M50 38 L62 50 L50 62 L38 50 Z', ac),
  'connector-native': (fg, ac) =>
    frame(fg) + R(38, 43, 24, 6, ac, 3) + R(38, 53, 24, 6, ac, 3),

  // Layer 2 · Building blocks (neutral — no per-package accent)
  attrs: (fg) => R(25, 35, 37, 15, fg, 5) + R(48, 51, 37, 15, fg, 5),
  elements: (fg) =>
    R(26, 26, 20, 20, fg, 3) +
    P('M56 26 L76 26 L66 46 Z', fg) +
    C(36, 64, 10, fg) +
    R(56, 56, 20, 16, fg, 3),
  unistyle: (fg) =>
    RING(50, 50, 28, fg, 6) + R(38, 44, 24, 5, fg, 2) + R(38, 52, 24, 5, fg, 2),
  coolgrid: (fg) =>
    R(22, 28, 3, 44, fg, 1) +
    R(31, 28, 46, 14, fg, 3) +
    R(31, 46, 34, 14, fg, 3) +
    R(31, 64, 22, 14, fg, 3),
  hooks: (fg) =>
    R(27, 42, 12, 16, fg, 3) + R(44, 42, 12, 16, fg, 3) + R(61, 42, 12, 16, fg, 3),

  // Layer 3 · Animation (signal accent — motion trails)
  kinetic: (fg, ac) =>
    P('M38 44 L74 44 L66 60 L30 60 Z', fg) +
    P('M27 44 L33 44 L25 60 L19 60 Z', ac) +
    P('M16 44 L20 44 L12 60 L8 60 Z', ac),
  'kinetic-presets': (fg, ac) =>
    P('M44 34 L80 34 L72 50 L36 50 Z', fg) +
    P('M36 52 L72 52 L64 68 L28 68 Z', fg) +
    P('M26 52 L31 52 L23 68 L18 68 Z', ac),

  // Layer 4 · Peak (acid accent — rocketstyle ascends)
  rocketstyle: (fg, ac) =>
    P('M50 16 L63 38 L37 38 Z', ac) +
    P('M40 44 L60 44 L67 64 L33 64 Z', fg) +
    P('M27 70 L73 70 L82 90 L18 90 Z', fg),
  rocketstories: (fg, ac) =>
    P('M50 30 L60 46 L40 46 Z', ac) +
    P('M42 50 L58 50 L63 66 L37 66 Z', fg) +
    S('M20 33 L20 20 L33 20', fg, 5) +
    S('M80 33 L80 20 L67 20', fg, 5) +
    S('M20 67 L20 80 L33 80', fg, 5) +
    S('M80 67 L80 80 L67 80', fg, 5),
}

const META = {
  'ui-system': { accent: 'acid' },
  styler: { accent: 'cobalt' },
  core: { accent: 'cobalt' },
  'connector-styler': { accent: 'cobalt' },
  'connector-emotion': { accent: 'cobalt' },
  'connector-styled-components': { accent: 'cobalt' },
  'connector-native': { accent: 'cobalt' },
  attrs: { accent: 'none' },
  elements: { accent: 'none' },
  unistyle: { accent: 'none' },
  coolgrid: { accent: 'none' },
  hooks: { accent: 'none' },
  kinetic: { accent: 'signal' },
  'kinetic-presets': { accent: 'signal' },
  rocketstyle: { accent: 'acid' },
  rocketstories: { accent: 'acid' },
}

// ─── BUILDERS ────────────────────────────────────────────────────────────
const buildMark = (name, mode) => {
  const fg = fgFor(mode)
  const ac = accentFor(META[name].accent, mode)
  const body = glyphs[name](fg, ac)
  const label = name === 'ui-system' ? 'vitus·labs' : `@vitus-labs/${name}`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="200" height="200" role="img" aria-label="${label}">${body}</svg>\n`
}

// Lockup: umbrella mark + "vitus·labs" wordmark (Geist Mono).
const buildLockup = (mode) => {
  const fg = fgFor(mode)
  const ac = accentFor('acid', mode)
  const body = glyphs['ui-system'](fg, ac)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 110" width="460" height="110" role="img" aria-label="vitus·labs">
  <g transform="translate(0,5)">${body}</g>
  <text x="120" y="72" font-family="Geist Mono, ui-monospace, SF Mono, Menlo, monospace" font-size="44" font-weight="500" fill="${fg}" letter-spacing="-0.02em">vitus<tspan fill="${ac}">·</tspan>labs</text>
</svg>\n`
}

// ─── README HEADER BLOCK ─────────────────────────────────────────────────
const HEADER_BEGIN = '<!-- LOGO:BEGIN -->'
const HEADER_END = '<!-- LOGO:END -->'

// Absolute GitHub raw URLs work on both github.com (rendered repo view) AND
// npmjs.com (which doesn't serve images from the package tarball — relative
// `./assets/...` paths break there). Branch-pinned to `main` so the published
// README always points at the latest committed art.
const RAW = 'https://raw.githubusercontent.com/vitus-labs/ui-system/main'

// Two `<picture>` elements at the SAME height baseline-align naturally —
// no table wrapper, so GitHub's default `<td>` border CSS can't kick in.
// `<div align="center">` centers horizontally on both github.com and
// npmjs.com. `<picture>` + `prefers-color-scheme` swaps the SVG variant
// based on the viewer's theme — readable in both modes.
const pkgHeader = (pkg) => `${HEADER_BEGIN}
<div align="center">
  <a href="https://github.com/vitus-labs/ui-system">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="${RAW}/.github/assets/vitus-labs-mark-dark.svg">
      <img alt="vitus·labs" src="${RAW}/.github/assets/vitus-labs-mark-light.svg" height="64">
    </picture>
  </a>
  &nbsp;&nbsp;&nbsp;&nbsp;
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="${RAW}/packages/${pkg}/assets/logo-dark.svg">
    <img alt="@vitus-labs/${pkg}" src="${RAW}/packages/${pkg}/assets/logo-light.svg" height="64">
  </picture>
</div>
${HEADER_END}
`

const rootHeader = () => `${HEADER_BEGIN}
<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./.github/assets/vitus-labs-lockup-dark.svg">
    <img alt="vitus·labs" src="./.github/assets/vitus-labs-lockup-light.svg" height="80">
  </picture>
</div>
${HEADER_END}
`

// ─── README INJECTION ────────────────────────────────────────────────────
// Replace existing BEGIN/END block, or prepend at top if absent.
const ensureHeader = (path, headerBlock) => {
  const original = readFileSync(path, 'utf8')
  let next
  if (original.includes(HEADER_BEGIN) && original.includes(HEADER_END)) {
    const re = new RegExp(
      `${HEADER_BEGIN}[\\s\\S]*?${HEADER_END}\\n?`,
      'm',
    )
    next = original.replace(re, headerBlock)
  } else {
    next = `${headerBlock}\n${original}`
  }
  if (next !== original) writeFileSync(path, next)
}

const writeFile = (p, content) => {
  mkdirSync(dirname(p), { recursive: true })
  writeFileSync(p, content)
}

// ─── EXECUTE ─────────────────────────────────────────────────────────────
const ASSETS_DIR = join(REPO_ROOT, '.github', 'assets')

// 1. Umbrella mark (shared across all packages + root) + wordmark lockup
writeFile(join(ASSETS_DIR, 'vitus-labs-mark-light.svg'), buildMark('ui-system', 'light'))
writeFile(join(ASSETS_DIR, 'vitus-labs-mark-dark.svg'), buildMark('ui-system', 'dark'))
writeFile(join(ASSETS_DIR, 'vitus-labs-lockup-light.svg'), buildLockup('light'))
writeFile(join(ASSETS_DIR, 'vitus-labs-lockup-dark.svg'), buildLockup('dark'))

// 2. Per-package marks
const PACKAGES = Object.keys(META).filter((k) => k !== 'ui-system')
for (const pkg of PACKAGES) {
  const dir = join(REPO_ROOT, 'packages', pkg, 'assets')
  writeFile(join(dir, 'logo-light.svg'), buildMark(pkg, 'light'))
  writeFile(join(dir, 'logo-dark.svg'), buildMark(pkg, 'dark'))
}

// 3. Inject README headers
const rootReadme = join(REPO_ROOT, 'README.md')
if (existsSync(rootReadme)) ensureHeader(rootReadme, rootHeader())
for (const pkg of PACKAGES) {
  const readme = join(REPO_ROOT, 'packages', pkg, 'README.md')
  if (existsSync(readme)) ensureHeader(readme, pkgHeader(pkg))
}

// biome-ignore lint/suspicious/noConsole: script output
console.log(
  `✓ Generated ${PACKAGES.length * 2} package SVGs + 4 umbrella SVGs, updated ${PACKAGES.length + 1} READMEs`,
)
