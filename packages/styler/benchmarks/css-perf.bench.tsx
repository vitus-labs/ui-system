/**
 * CSS-in-JS perf microbench — `@vitus-labs/styler` vs styled-components vs Emotion.
 *
 * Run from the styler package: `bun run bench`.
 *
 * Six scenarios × three libraries, measured via tinybench. Each lib is
 * forced to do equivalent work (render + serialize CSS or render + inject
 * into DOM):
 *
 * SSR scenarios (renderToString):
 *   1. ssr-static   — template with no function interpolations.
 *   2. ssr-dynamic  — template reads a prop via function interpolation.
 *   3. ssr-themed   — template reads from ThemeProvider context.
 *
 * Client scenarios (jsdom + react-dom/client):
 *   4. csr-mount    — createRoot + render fresh tree (cold cache).
 *   5. csr-update   — render initial tree, then update props N times.
 *   6. csr-many     — mount many different components per tick (cache-bust).
 *
 * `styled-components` does NOT use React 19 `<style precedence>` — it
 * emits class names only and defers CSS collection. For a fair SSR
 * comparison, the sc paths wrap each render in `ServerStyleSheet` and
 * call `getStyleTags()` so the work matches styler/emotion's inline
 * style-tag emission.
 *
 * Numbers are per-tick (each tick runs N renders). Divide ms/op by N for
 * per-render cost.
 */

// ─── jsdom bootstrap (must be before react-dom/client) ───────────────
import { JSDOM } from 'jsdom'

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
})
;(globalThis as any).window = dom.window
;(globalThis as any).document = dom.window.document
;(globalThis as any).navigator = dom.window.navigator
;(globalThis as any).HTMLElement = dom.window.HTMLElement
;(globalThis as any).Element = dom.window.Element
;(globalThis as any).Node = dom.window.Node
;(globalThis as any).getComputedStyle = dom.window.getComputedStyle

// ─── Imports after jsdom is ready ────────────────────────────────────
import React from 'react'
import { renderToString } from 'react-dom/server'
import { type Root, createRoot } from 'react-dom/client'
import { Bench } from 'tinybench'

import {
  ThemeProvider as StylerProvider,
  styled as stylerStyled,
} from '../lib/index.js'

import scStyled, {
  ServerStyleSheet,
  ThemeProvider as ScProvider,
} from 'styled-components'

import { ThemeProvider as EmProvider } from '@emotion/react'
import emStyled from '@emotion/styled'

const SSR_N = 500 // renders per SSR tick
const CSR_N = 100 // mounts/updates per CSR tick
const MANY_N = 50 // distinct components per "many" tick

const theme = { color: '#1e88e5', bg: '#fff' }

// ─── Component factories (so we can vary template per scenario) ─────
const stylerStatic = stylerStyled.div`color: red; padding: 8px;`
const scStatic = scStyled.div`color: red; padding: 8px;`
const emStatic = emStyled.div`color: red; padding: 8px;`

const stylerDynamic = stylerStyled.div<{ color: string }>`
  color: ${(p) => p.color};
  padding: 8px;
`
const scDynamic = scStyled.div<{ color: string }>`
  color: ${(p) => p.color};
  padding: 8px;
`
const emDynamic = emStyled.div<{ color: string }>`
  color: ${(p) => p.color};
  padding: 8px;
`

const stylerThemed = stylerStyled.div`
  color: ${(p: any) => p.theme.color};
  background: ${(p: any) => p.theme.bg};
`
const scThemed = scStyled.div`
  color: ${(p) => p.theme.color};
  background: ${(p) => p.theme.bg};
`
const emThemed = emStyled.div`
  color: ${(p: any) => p.theme.color};
  background: ${(p: any) => p.theme.bg};
`

// ─── SSR helpers ─────────────────────────────────────────────────────
const ssrStatic = (Component: any) => {
  for (let i = 0; i < SSR_N; i++) renderToString(React.createElement(Component))
}
const ssrDynamic = (Component: any) => {
  for (let i = 0; i < SSR_N; i++) {
    renderToString(
      React.createElement(Component, { color: i % 2 ? '#f00' : '#0f0' }),
    )
  }
}
const ssrThemed = (Component: any, Provider: any) => {
  for (let i = 0; i < SSR_N; i++) {
    renderToString(
      React.createElement(Provider, { theme }, React.createElement(Component)),
    )
  }
}
const ssrScStatic = (Component: any) => {
  for (let i = 0; i < SSR_N; i++) {
    const sheet = new ServerStyleSheet()
    try {
      renderToString(sheet.collectStyles(React.createElement(Component)))
      sheet.getStyleTags()
    } finally {
      sheet.seal()
    }
  }
}
const ssrScDynamic = (Component: any) => {
  for (let i = 0; i < SSR_N; i++) {
    const sheet = new ServerStyleSheet()
    try {
      renderToString(
        sheet.collectStyles(
          React.createElement(Component, { color: i % 2 ? '#f00' : '#0f0' }),
        ),
      )
      sheet.getStyleTags()
    } finally {
      sheet.seal()
    }
  }
}
const ssrScThemed = (Component: any) => {
  for (let i = 0; i < SSR_N; i++) {
    const sheet = new ServerStyleSheet()
    try {
      renderToString(
        sheet.collectStyles(
          React.createElement(
            ScProvider,
            { theme },
            React.createElement(Component),
          ),
        ),
      )
      sheet.getStyleTags()
    } finally {
      sheet.seal()
    }
  }
}

// ─── CSR helpers ─────────────────────────────────────────────────────
// Fresh container + createRoot per tick. Mount N components in one batch.
const csrMount = (Component: any) => {
  const container = document.createElement('div')
  const root = createRoot(container)
  const children = []
  for (let i = 0; i < CSR_N; i++) {
    children.push(
      React.createElement(Component, {
        key: i,
        color: i % 2 ? '#f00' : '#0f0',
      }),
    )
  }
  root.render(React.createElement(React.Fragment, null, children))
  root.unmount()
}

// Mount once, then update N times (each update re-renders with new prop).
const csrUpdate = (Component: any) => {
  const container = document.createElement('div')
  const root: Root = createRoot(container)
  root.render(React.createElement(Component, { color: '#000' }))
  for (let i = 0; i < CSR_N; i++) {
    root.render(
      React.createElement(Component, { color: i % 2 ? '#f00' : '#0f0' }),
    )
  }
  root.unmount()
}

// Cache-bust scenario: mount N DIFFERENT styled components per tick. This
// exposes per-template setup cost (vs per-render cost which dominates the
// other scenarios). Each component is created inside the tick so module-
// level caches don't help.
const csrManyStyler = () => {
  const container = document.createElement('div')
  const root = createRoot(container)
  const children = []
  for (let i = 0; i < MANY_N; i++) {
    const C = stylerStyled.div<{ c: string }>`color: ${(p) => p.c};`
    children.push(React.createElement(C, { key: i, c: '#abc' }))
  }
  root.render(React.createElement(React.Fragment, null, children))
  root.unmount()
}
const csrManySc = () => {
  const container = document.createElement('div')
  const root = createRoot(container)
  const children = []
  for (let i = 0; i < MANY_N; i++) {
    const C = scStyled.div<{ c: string }>`color: ${(p) => p.c};`
    children.push(React.createElement(C, { key: i, c: '#abc' }))
  }
  root.render(React.createElement(React.Fragment, null, children))
  root.unmount()
}
const csrManyEm = () => {
  const container = document.createElement('div')
  const root = createRoot(container)
  const children = []
  for (let i = 0; i < MANY_N; i++) {
    const C = emStyled.div<{ c: string }>`color: ${(p) => p.c};`
    children.push(React.createElement(C, { key: i, c: '#abc' }))
  }
  root.render(React.createElement(React.Fragment, null, children))
  root.unmount()
}

// ─── Bench ───────────────────────────────────────────────────────────
const bench = new Bench({ time: 1500, warmupTime: 300 })

bench
  // SSR
  .add('styler  · ssr-static  · 500x', () => ssrStatic(stylerStatic))
  .add('sc      · ssr-static  · 500x', () => ssrScStatic(scStatic))
  .add('emotion · ssr-static  · 500x', () => ssrStatic(emStatic))
  .add('styler  · ssr-dynamic · 500x', () => ssrDynamic(stylerDynamic))
  .add('sc      · ssr-dynamic · 500x', () => ssrScDynamic(scDynamic))
  .add('emotion · ssr-dynamic · 500x', () => ssrDynamic(emDynamic))
  .add('styler  · ssr-themed  · 500x', () => ssrThemed(stylerThemed, StylerProvider))
  .add('sc      · ssr-themed  · 500x', () => ssrScThemed(scThemed))
  .add('emotion · ssr-themed  · 500x', () => ssrThemed(emThemed, EmProvider))
  // CSR
  .add('styler  · csr-mount   · 100x', () => csrMount(stylerDynamic))
  .add('sc      · csr-mount   · 100x', () => csrMount(scDynamic))
  .add('emotion · csr-mount   · 100x', () => csrMount(emDynamic))
  .add('styler  · csr-update  · 100x', () => csrUpdate(stylerDynamic))
  .add('sc      · csr-update  · 100x', () => csrUpdate(scDynamic))
  .add('emotion · csr-update  · 100x', () => csrUpdate(emDynamic))
  .add('styler  · csr-many    · 50x',  () => csrManyStyler())
  .add('sc      · csr-many    · 50x',  () => csrManySc())
  .add('emotion · csr-many    · 50x',  () => csrManyEm())

await bench.run()

const rows = bench.tasks.map((t) => {
  const r = t.result
  if (!r) return null
  const [lib, scenario] = t.name.split(' · ').map((s: string) => s.trim())
  return {
    scenario,
    lib,
    'ops/sec': r.throughput.mean,
    'ms/op': r.latency.mean,
  }
}).filter((r): r is NonNullable<typeof r> => r !== null)

const grouped: Record<string, typeof rows> = {}
for (const r of rows) {
  ;(grouped[r.scenario] ??= []).push(r)
}

console.log('\n=== CSS-in-JS perf — styler vs styled-components vs emotion ===\n')
console.log(`Runtime: bun ${process.versions.bun ?? 'n/a'}, react ${React.version}`)
console.log(`SSR per-tick: ${SSR_N} renderToString calls`)
console.log(`CSR per-tick: ${CSR_N} mounts / updates, ${MANY_N} distinct components for csr-many\n`)

for (const [scenario, group] of Object.entries(grouped)) {
  group.sort((a, b) => Number(b['ops/sec']) - Number(a['ops/sec']))
  const max = Number(group[0]['ops/sec'])
  console.log(`── ${scenario} ──`)
  for (const r of group) {
    const ops = Number(r['ops/sec']).toFixed(1)
    const ms = Number(r['ms/op']).toFixed(3)
    const ratio = (Number(r['ops/sec']) / max).toFixed(2)
    const bar = '█'.repeat(Math.round(Number(ratio) * 20))
    console.log(
      `  ${r.lib.padEnd(8)}  ${ops.padStart(7)} ops/s   ${ms.padStart(8)} ms/op   ${ratio}× ${bar}`,
    )
  }
  console.log()
}
