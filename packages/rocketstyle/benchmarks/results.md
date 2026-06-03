# `@vitus-labs/rocketstyle` — benchmark baselines

Captured on `main` after PR #279 merged (2026-06-03). Run via `bun run bench` from this package.

Machine: macOS arm64, Bun 1.3.14, jsdom 29.1.1, React 19.

## Render-count diagnostics (verifies memo bails)

| Scenario | Leaf renders | Expected |
|---|---|---|
| mount ×100 | **100** | 100 |
| re-update ×50 (stable props) | **0** | 0 (memo should bail) |
| re-update ×50 (churning props) | **5000** | 5000 (memo cannot bail) |

✅ `memo(EnhancedComponent)` + `useStableValue` works: zero downstream renders when parent re-renders with content-equal props.

## Timing (tinybench + flushSync)

| Scenario | avg ms/tick | min ms | p99 ms | ops/sec | samples |
|---|---|---|---|---|---|
| chain-build ×50 | 0.685 | 0.587 | 1.729 | 1491 | 1460 |
| mount-cold ×100 | 1.551 | 1.204 | 3.422 | 668 | 645 |
| reupdate-stable ×50 | **13.924** | 12.334 | 19.515 | 72 | 73 |
| reupdate-churn ×50 | **103.881** | 95.292 | 112.737 | 10 | 64 |
| fast-path-no-attrs-mount ×100 | 1.271 | 0.979 | 2.958 | 819 | 787 |

### Measurable wins from PR #279

- **Stable-prop re-update: 7.5× faster** (13.9 ms vs 103.9 ms when memo can't bail). This is the dominant practical win.
- **Fast-path lean mount: ~18% faster** (1.27 ms vs 1.55 ms) when component is built without `.attrs()` chain — the `rocketstyleAttrsHoc` fast path.
- **Chain build: ~14 µs per component.** At app-scale (~50 components defined at module init), ~0.7 ms total. The O(K²) → O(K) win on `chainOrOptions` lives here.

## Caveats

- `flushSync` is mandatory; the default `createRoot().render()` is async and measures enqueue time, not render time.
- `useStableValue` does deep equality each render. For most realistic prop shapes (10–30 keys, mostly primitives), the cost is dominated by the React element identity check; the bail savings dwarf the deep-equal cost.
- Numbers will shift on different machines / OS / Bun versions. The **ratio** between scenarios is more durable than absolute ms.
