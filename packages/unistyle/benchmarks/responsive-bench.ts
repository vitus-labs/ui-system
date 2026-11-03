/**
 * Micro-benchmarks for unistyle's responsive pipeline.
 *
 * Run from the package: `bun run bench` (resolves workspace packages to
 * source). Not wired into CI — numbers are machine-dependent; compare
 * before/after on the same machine.
 *
 * Scenarios (5 breakpoints, realistic 20-prop theme, styler engine):
 *  - makeItResponsive HIT          — same theme object + same outer theme
 *  - makeItResponsive content HIT  — fresh object, equal content (inline `$x={{…}}`)
 *  - makeItResponsive MISS         — fresh object, new content every call
 *  - styles() one breakpoint       — descriptor lookup + processing
 *  - optimizeBreakpointDeltas      — 5 breakpoint delta diff
 *
 * Also prints a checksum of the delta output so optimizer refactors can be
 * checked for byte-identical output across versions.
 */
;(globalThis as any).__WEB__ = true
;(globalThis as any).__NATIVE__ = false

const { Bench } = await import('tinybench')
const { init } = await import('@vitus-labs/core')
const styler = await import('../../styler/src/index')
init({
  css: styler.css,
  styled: styler.styled,
  provider: styler.ThemeProvider,
  keyframes: styler.keyframes,
} as any)

const u = await import('../src/index')
const { optimizeBreakpointDeltas } = await import(
  '../src/responsive/optimizeBreakpointDeltas'
)
const { default: optimizeTheme } = await import('../src/responsive/optimizeTheme')

const css = styler.css as any
const bps = { xs: 0, sm: 576, md: 768, lg: 992, xl: 1200 }
const sorted = u.sortBreakpoints(bps)
const media = u.createMediaQueries({ breakpoints: bps, rootSize: 16, css })
const outer = {
  rootSize: 16,
  breakpoints: bps,
  __VITUS_LABS__: { media, sortedBreakpoints: sorted },
}

let n = 0
const mk = (fontSize = 18) => ({
  paddingX: { xs: 8, md: 16, lg: 24 },
  paddingY: [4, 8],
  marginTop: { xs: 0, md: 16 },
  fontSize: { xs: 14, md: 16, xl: fontSize },
  lineHeight: 1.5,
  color: '#333',
  backgroundColor: { xs: '#fff', lg: '#fafafa' },
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: [8, 12, 16],
  borderRadius: 4,
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: { xs: '#ddd', md: '#ccc' },
  width: { xs: '100%', md: 720, lg: 960 },
  maxWidth: 1140,
  transition: 'all .2s',
  opacity: [1, 1, 0.9],
})

const S = u.styles as any
const R = u.makeItResponsive({ key: '$t', css, styles: S })
const stable = mk()
const norm = u.normalizeTheme({ theme: mk(), breakpoints: sorted })
const trans = u.transformTheme({ theme: norm, breakpoints: sorted })
const opt = optimizeTheme({ theme: trans, breakpoints: sorted })
const texts: string[] = sorted.map((b: string) =>
  opt[b] ? String(S({ theme: opt[b], css, rootSize: 16 })) : '',
)

// FNV-1a checksum of the delta output (byte-identity check)
const deltas = optimizeBreakpointDeltas(texts).join('\u0000')
let h = 0x811c9dc5
for (let i = 0; i < deltas.length; i++) {
  h ^= deltas.charCodeAt(i)
  h = Math.imul(h, 0x01000193) >>> 0
}
console.log(
  `delta output: ${deltas.length} chars, fnv1a ${h.toString(16)}`,
)

const b = new Bench({ time: 800 })
b.add('makeItResponsive HIT', () => R({ theme: outer, $t: stable }))
b.add('makeItResponsive content HIT (fresh equal obj)', () =>
  R({ theme: outer, $t: mk() }),
)
b.add('makeItResponsive MISS (new content)', () =>
  R({ theme: outer, $t: mk(++n) }),
)
b.add('styles() one breakpoint + String()', () =>
  String(S({ theme: opt.xs, css, rootSize: 16 })),
)
b.add('optimizeBreakpointDeltas (5 bps)', () => optimizeBreakpointDeltas(texts))

await b.run()
console.table(
  b.table().map((r: any) => ({
    name: r['Task name'],
    'avg ns': r['Latency avg (ns)'],
    'med ns': r['Latency med (ns)'],
  })),
)
