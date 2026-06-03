/**
 * Render-perf benchmark for `@vitus-labs/rocketstyle`.
 *
 * Run from the package: `bun run bench`.
 *
 * Each scenario uses `flushSync` so React commits within the tick — the
 * default `createRoot().render()` is async, which would otherwise measure
 * enqueue time instead of real render work.
 *
 * Two reports:
 *  1. Timing (tinybench) — ms/tick for cold mount, stable re-update, churn
 *     re-update, and the no-attrs fast path.
 *  2. Render counts (assertions) — how many times the leaf actually rendered.
 *     Demonstrates whether memo() + useStableValue is bailing in practice.
 */

// ─── jsdom bootstrap (must run before react-dom/client) ──────────────
import { JSDOM } from 'jsdom'

const dom = new JSDOM(
  '<!doctype html><html><body><div id="root"></div></body></html>',
  { url: 'http://localhost/', pretendToBeVisual: true },
)
;(globalThis as any).window = dom.window
;(globalThis as any).document = dom.window.document
;(globalThis as any).navigator = dom.window.navigator
;(globalThis as any).HTMLElement = dom.window.HTMLElement
;(globalThis as any).Element = dom.window.Element
;(globalThis as any).Node = dom.window.Node
;(globalThis as any).getComputedStyle = dom.window.getComputedStyle

// ─── Imports after jsdom is ready ────────────────────────────────────
import * as connector from '@vitus-labs/connector-styler'
import { init } from '@vitus-labs/core'
import React from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { flushSync } from 'react-dom'
import { Bench } from 'tinybench'
import rocketstyle, { Provider as RsProvider } from '../lib/index.js'

init({ ...connector, component: 'div', textComponent: 'span' })

const CHAIN_N = 50
const MOUNT_N = 100
const UPDATE_N = 50

const theme = { rootSize: 16 }

// ─── Test components ────────────────────────────────────────────────

// Counter that records how many times the leaf actually rendered.
let leafRenderCount = 0
const CountingLeaf = (props: any) => {
  leafRenderCount++
  return React.createElement('div', props)
}

// Full-featured rocketstyle component (theme + attrs + dimension).
const buildRichComponent = () =>
  rocketstyle({
    dimensions: { variants: 'variant' },
    useBooleans: true,
  })({ component: CountingLeaf, name: 'RichButton' })
    .theme({ padding: 8, color: 'black' })
    .variants({
      primary: { backgroundColor: 'blue' },
      danger: { backgroundColor: 'red' },
    })
    .attrs((p: any) => ({ 'data-test': p.label }))

// Lean component — no .attrs(), no priorityAttrs.
// Should hit the rocketstyleAttrsHoc fast path.
const buildLeanComponent = () =>
  rocketstyle({
    dimensions: { variants: 'variant' },
    useBooleans: true,
  })({ component: CountingLeaf, name: 'LeanButton' })
    .theme({ padding: 8 })
    .variants({
      primary: { backgroundColor: 'blue' },
      danger: { backgroundColor: 'red' },
    })

const RichButton = buildRichComponent()
const LeanButton = buildLeanComponent()

// ─── Render harness ──────────────────────────────────────────────────
let currentRoot: Root | null = null
let currentContainer: Element | null = null

const teardown = () => {
  if (currentRoot) {
    currentRoot.unmount()
    currentRoot = null
  }
  currentContainer = null
}

const setupRoot = () => {
  teardown()
  const host = document.getElementById('root') as Element
  host.innerHTML = '<div></div>'
  currentContainer = host.firstElementChild as Element
  currentRoot = createRoot(currentContainer)
}

// Stable props — same object identity across all children, and across renders.
const STABLE_PROPS = { variant: 'primary' as const, label: 'click' } as const

const makeChildren = (
  Child: any,
  count: number,
  tick: number,
  stable: boolean,
): React.ReactElement[] => {
  const kids: React.ReactElement[] = []
  for (let i = 0; i < count; i++) {
    kids.push(
      React.createElement(
        Child,
        stable
          ? { key: i, ...STABLE_PROPS }
          : { key: i, variant: 'primary', label: `click-${tick}` },
      ),
    )
  }
  return kids
}

const renderTree = (Child: any, count: number, tick: number, stable: boolean) =>
  React.createElement(
    RsProvider,
    { theme },
    React.createElement(
      'div',
      { 'data-tick': tick },
      makeChildren(Child, count, tick, stable),
    ),
  )

// ─── Scenarios (sync via flushSync) ──────────────────────────────────
const chainBuild = () => {
  for (let i = 0; i < CHAIN_N; i++) buildRichComponent()
}

const mountCold = () => {
  setupRoot()
  flushSync(() => {
    currentRoot!.render(renderTree(RichButton, MOUNT_N, 0, true))
  })
}

const reupdateStable = () => {
  setupRoot()
  flushSync(() => {
    currentRoot!.render(renderTree(RichButton, MOUNT_N, 0, true))
  })
  for (let i = 1; i <= UPDATE_N; i++) {
    flushSync(() => {
      currentRoot!.render(renderTree(RichButton, MOUNT_N, i, true))
    })
  }
}

const reupdateChurn = () => {
  setupRoot()
  flushSync(() => {
    currentRoot!.render(renderTree(RichButton, MOUNT_N, 0, false))
  })
  for (let i = 1; i <= UPDATE_N; i++) {
    flushSync(() => {
      currentRoot!.render(renderTree(RichButton, MOUNT_N, i, false))
    })
  }
}

const fastPathLeanMount = () => {
  setupRoot()
  flushSync(() => {
    currentRoot!.render(renderTree(LeanButton, MOUNT_N, 0, true))
  })
}

// ─── 1. Render-count diagnostics (memo verification) ────────────────
console.log('\n=== Render-count diagnostics ===\n')

leafRenderCount = 0
setupRoot()
flushSync(() => {
  currentRoot!.render(renderTree(RichButton, MOUNT_N, 0, true))
})
const mountCount = leafRenderCount

leafRenderCount = 0
for (let i = 1; i <= UPDATE_N; i++) {
  flushSync(() => {
    currentRoot!.render(renderTree(RichButton, MOUNT_N, i, true))
  })
}
const stableUpdateCount = leafRenderCount

leafRenderCount = 0
setupRoot()
flushSync(() => {
  currentRoot!.render(renderTree(RichButton, MOUNT_N, 0, false))
})
leafRenderCount = 0
for (let i = 1; i <= UPDATE_N; i++) {
  flushSync(() => {
    currentRoot!.render(renderTree(RichButton, MOUNT_N, i, false))
  })
}
const churnUpdateCount = leafRenderCount

teardown()

console.table([
  {
    scenario: `mount ×${MOUNT_N} children`,
    'leaf renders': mountCount,
    expected: MOUNT_N,
  },
  {
    scenario: `re-update ×${UPDATE_N} (stable props)`,
    'leaf renders': stableUpdateCount,
    expected: `0 (memo should bail)`,
  },
  {
    scenario: `re-update ×${UPDATE_N} (inline props churn)`,
    'leaf renders': churnUpdateCount,
    expected: `${MOUNT_N * UPDATE_N} (memo cannot bail)`,
  },
])

// ─── 2. Timing benchmark ────────────────────────────────────────────
const bench = new Bench({ time: 1000 })

bench
  .add(`chain-build ×${CHAIN_N}`, chainBuild)
  .add(`mount-cold ×${MOUNT_N}`, mountCold)
  .add(`reupdate-stable ×${UPDATE_N}`, reupdateStable)
  .add(`reupdate-churn ×${UPDATE_N}`, reupdateChurn)
  .add(`fast-path-no-attrs-mount ×${MOUNT_N}`, fastPathLeanMount)

await bench.run()

console.log('\n=== Timing (tinybench, flushSync) ===\n')
console.table(
  bench.tasks.map((t) => ({
    scenario: t.name,
    'avg ms/tick': t.result?.latency.mean.toFixed(3),
    'min ms': t.result?.latency.min.toFixed(3),
    'p99 ms': t.result?.latency.p99?.toFixed(3),
    'ops/sec': Math.round(t.result?.throughput.mean ?? 0),
    samples: t.result?.latency.samplesCount,
  })),
)

teardown()
