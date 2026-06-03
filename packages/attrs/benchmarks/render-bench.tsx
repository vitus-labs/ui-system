/**
 * Render-perf benchmark for `@vitus-labs/attrs`.
 *
 * Run from the package: `bun run bench`.
 *
 * Scenarios:
 *  1. mount-rich ×100      — attrs component built WITH .attrs() configured
 *  2. mount-lean ×100      — attrs component with NO chain (fast path)
 *  3. reupdate-stable ×50  — parent re-renders with stable child props
 *                            (covers memo() on EnhancedComponent + useStableValue)
 *  4. reupdate-churn ×50   — same, with inline-fresh props (memo cannot bail)
 *
 * Plus render-count diagnostics to verify memo() actually bails.
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
import attrs from '../lib/index.js'

init({ ...connector, component: 'div', textComponent: 'span' })

const MOUNT_N = 100
const UPDATE_N = 50

// ─── Test components ────────────────────────────────────────────────
let leafRenderCount = 0
const CountingLeaf = (props: any) => {
  leafRenderCount++
  return React.createElement('div', props)
}

const buildRichAttrs = () =>
  attrs({ name: 'RichAttrs', component: CountingLeaf })
    .attrs({ role: 'button' })
    .attrs((p: any) => ({ 'data-label': p.label }))

const buildLeanAttrs = () =>
  attrs({ name: 'LeanAttrs', component: CountingLeaf })

const RichAttrs = buildRichAttrs()
const LeanAttrs = buildLeanAttrs()

// ─── Render harness ──────────────────────────────────────────────────
let currentRoot: Root | null = null

const teardown = () => {
  if (currentRoot) {
    currentRoot.unmount()
    currentRoot = null
  }
}

const setupRoot = () => {
  teardown()
  const host = document.getElementById('root') as Element
  host.innerHTML = '<div></div>'
  currentRoot = createRoot(host.firstElementChild as Element)
}

const STABLE_PROPS = { label: 'click' } as const

const makeStableChildren = (
  Child: any,
  count: number,
): React.ReactElement[] => {
  const kids: React.ReactElement[] = []
  for (let i = 0; i < count; i++) {
    kids.push(React.createElement(Child, { key: i, ...STABLE_PROPS }))
  }
  return kids
}

const makeChurnChildren = (
  Child: any,
  count: number,
  tick: number,
): React.ReactElement[] => {
  const kids: React.ReactElement[] = []
  for (let i = 0; i < count; i++) {
    kids.push(React.createElement(Child, { key: i, label: `click-${tick}` }))
  }
  return kids
}

const wrap = (children: React.ReactElement[]) =>
  React.createElement('div', null, children)

// ─── Scenarios ───────────────────────────────────────────────────────
const mountRich = () => {
  setupRoot()
  flushSync(() => {
    currentRoot!.render(wrap(makeStableChildren(RichAttrs, MOUNT_N)))
  })
}

const mountLean = () => {
  setupRoot()
  flushSync(() => {
    currentRoot!.render(wrap(makeStableChildren(LeanAttrs, MOUNT_N)))
  })
}

const reupdateStable = () => {
  setupRoot()
  flushSync(() => {
    currentRoot!.render(wrap(makeStableChildren(RichAttrs, MOUNT_N)))
  })
  for (let i = 1; i <= UPDATE_N; i++) {
    flushSync(() => {
      currentRoot!.render(wrap(makeStableChildren(RichAttrs, MOUNT_N)))
    })
  }
}

const reupdateChurn = () => {
  setupRoot()
  flushSync(() => {
    currentRoot!.render(wrap(makeChurnChildren(RichAttrs, MOUNT_N, 0)))
  })
  for (let i = 1; i <= UPDATE_N; i++) {
    flushSync(() => {
      currentRoot!.render(wrap(makeChurnChildren(RichAttrs, MOUNT_N, i)))
    })
  }
}

// ─── 1. Render-count diagnostics ────────────────────────────────────
console.log('\n=== Render-count diagnostics ===\n')

leafRenderCount = 0
setupRoot()
flushSync(() => {
  currentRoot!.render(wrap(makeStableChildren(RichAttrs, MOUNT_N)))
})
const mountCount = leafRenderCount

leafRenderCount = 0
for (let i = 1; i <= UPDATE_N; i++) {
  flushSync(() => {
    currentRoot!.render(wrap(makeStableChildren(RichAttrs, MOUNT_N)))
  })
}
const stableUpdateCount = leafRenderCount

setupRoot()
flushSync(() => {
  currentRoot!.render(wrap(makeChurnChildren(RichAttrs, MOUNT_N, 0)))
})
leafRenderCount = 0
for (let i = 1; i <= UPDATE_N; i++) {
  flushSync(() => {
    currentRoot!.render(wrap(makeChurnChildren(RichAttrs, MOUNT_N, i)))
  })
}
const churnUpdateCount = leafRenderCount

teardown()

console.table([
  {
    scenario: `mount ×${MOUNT_N}`,
    'leaf renders': mountCount,
    expected: MOUNT_N,
  },
  {
    scenario: `re-update ×${UPDATE_N} (stable props)`,
    'leaf renders': stableUpdateCount,
    expected: `0 (memo should bail)`,
  },
  {
    scenario: `re-update ×${UPDATE_N} (churning props)`,
    'leaf renders': churnUpdateCount,
    expected: `${MOUNT_N * UPDATE_N} (memo cannot bail)`,
  },
])

// ─── 2. Timing benchmark ────────────────────────────────────────────
const bench = new Bench({ time: 1000 })

bench
  .add(`mount-rich ×${MOUNT_N}`, mountRich)
  .add(`mount-lean ×${MOUNT_N} (fast path)`, mountLean)
  .add(`reupdate-stable ×${UPDATE_N}`, reupdateStable)
  .add(`reupdate-churn ×${UPDATE_N}`, reupdateChurn)

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
