/**
 * Render-perf benchmark for `@vitus-labs/elements`.
 *
 * Run from the package: `bun run bench`.
 *
 * Scenarios:
 *  1. mount-element ×100   — first mount of 100 <Element /> components
 *  2. reupdate-stable ×50  — parent re-renders with stable child props
 *                            (covers memo() on Element + Wrapper)
 *  3. reupdate-churn ×50   — same, with inline-fresh props (memo cannot bail)
 *  4. mount-three-slot ×100 — Element with beforeContent + content + afterContent
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
;(globalThis as any).__WEB__ = true
;(globalThis as any).__NATIVE__ = false

// ─── Imports after jsdom is ready ────────────────────────────────────
import * as connector from '@vitus-labs/connector-styler'
import { init } from '@vitus-labs/core'
import { Provider as UniProvider, breakpoints } from '@vitus-labs/unistyle'
import React from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { flushSync } from 'react-dom'
import { Bench } from 'tinybench'
import { Element } from '../lib/index.js'

init({ ...connector, component: 'div', textComponent: 'span' })

const MOUNT_N = 100
const UPDATE_N = 50

// ─── Render counter ────────────────────────────────────────────────
// To verify memo() bails, we wrap each <Element>'s child in a counter.
let leafRenderCount = 0
const CountingChild = ({ tick }: { tick: number }) => {
  leafRenderCount++
  return React.createElement('span', null, String(tick))
}

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

const STABLE_BLOCK = true

// Children with stable identity per re-render.
const makeStableChildren = (count: number): React.ReactElement[] => {
  const kids: React.ReactElement[] = []
  for (let i = 0; i < count; i++) {
    kids.push(
      React.createElement(
        Element,
        { key: i, block: STABLE_BLOCK, tag: 'div' },
        React.createElement(CountingChild, { tick: 0 }),
      ),
    )
  }
  return kids
}

// Children with churning props per re-render (memo can't bail).
const makeChurnChildren = (
  count: number,
  tick: number,
): React.ReactElement[] => {
  const kids: React.ReactElement[] = []
  for (let i = 0; i < count; i++) {
    kids.push(
      React.createElement(
        Element,
        { key: i, block: tick % 2 === 0, tag: 'div' },
        React.createElement(CountingChild, { tick }),
      ),
    )
  }
  return kids
}

const wrap = (children: React.ReactElement[]) =>
  React.createElement(
    UniProvider,
    { theme: breakpoints },
    React.createElement('div', null, children),
  )

// Three-slot Element with before/content/after.
const makeThreeSlotChildren = (count: number): React.ReactElement[] => {
  const kids: React.ReactElement[] = []
  for (let i = 0; i < count; i++) {
    kids.push(
      React.createElement(Element, {
        key: i,
        tag: 'div',
        beforeContent: React.createElement('span', null, '◀'),
        afterContent: React.createElement('span', null, '▶'),
        children: React.createElement(CountingChild, { tick: 0 }),
      }),
    )
  }
  return kids
}

// ─── Scenarios ───────────────────────────────────────────────────────
const mountElement = () => {
  setupRoot()
  flushSync(() => {
    currentRoot!.render(wrap(makeStableChildren(MOUNT_N)))
  })
}

const reupdateStable = () => {
  setupRoot()
  flushSync(() => {
    currentRoot!.render(wrap(makeStableChildren(MOUNT_N)))
  })
  for (let i = 1; i <= UPDATE_N; i++) {
    flushSync(() => {
      currentRoot!.render(wrap(makeStableChildren(MOUNT_N)))
    })
  }
}

const reupdateChurn = () => {
  setupRoot()
  flushSync(() => {
    currentRoot!.render(wrap(makeChurnChildren(MOUNT_N, 0)))
  })
  for (let i = 1; i <= UPDATE_N; i++) {
    flushSync(() => {
      currentRoot!.render(wrap(makeChurnChildren(MOUNT_N, i)))
    })
  }
}

const mountThreeSlot = () => {
  setupRoot()
  flushSync(() => {
    currentRoot!.render(wrap(makeThreeSlotChildren(MOUNT_N)))
  })
}

// ─── 1. Render-count diagnostics ────────────────────────────────────
console.log('\n=== Render-count diagnostics ===\n')

leafRenderCount = 0
setupRoot()
flushSync(() => {
  currentRoot!.render(wrap(makeStableChildren(MOUNT_N)))
})
const mountCount = leafRenderCount

leafRenderCount = 0
for (let i = 1; i <= UPDATE_N; i++) {
  flushSync(() => {
    currentRoot!.render(wrap(makeStableChildren(MOUNT_N)))
  })
}
const stableUpdateCount = leafRenderCount

setupRoot()
flushSync(() => {
  currentRoot!.render(wrap(makeChurnChildren(MOUNT_N, 0)))
})
leafRenderCount = 0
for (let i = 1; i <= UPDATE_N; i++) {
  flushSync(() => {
    currentRoot!.render(wrap(makeChurnChildren(MOUNT_N, i)))
  })
}
const churnUpdateCount = leafRenderCount

teardown()

console.table([
  {
    scenario: `mount ×${MOUNT_N} Elements`,
    'child renders': mountCount,
    expected: MOUNT_N,
  },
  {
    scenario: `re-update ×${UPDATE_N} (stable props)`,
    'child renders': stableUpdateCount,
    expected: `0 (memo should bail)`,
  },
  {
    scenario: `re-update ×${UPDATE_N} (churning props)`,
    'child renders': churnUpdateCount,
    expected: `${MOUNT_N * UPDATE_N} (memo cannot bail)`,
  },
])

// ─── 2. Timing benchmark ────────────────────────────────────────────
const bench = new Bench({ time: 1000 })

bench
  .add(`mount-element ×${MOUNT_N}`, mountElement)
  .add(`reupdate-stable ×${UPDATE_N}`, reupdateStable)
  .add(`reupdate-churn ×${UPDATE_N}`, reupdateChurn)
  .add(`mount-three-slot ×${MOUNT_N}`, mountThreeSlot)

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
