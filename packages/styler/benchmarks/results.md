# CSS-in-JS perf benchmark

Comparison of `@vitus-labs/styler` against `styled-components` 6 and `@emotion/styled` 11 on render performance across SSR and CSR paths.

**Reproduce**: `bun run bench` from `packages/styler/`.

## Setup

- bun 1.3.14, react 19.2.6
- styler 2.6.2, styled-components 6.4.2, @emotion/styled 11.14.1 / @emotion/react 11.14.0
- jsdom for CSR scenarios
- tinybench: 1500 ms timed window, 300 ms warmup
- Apple Silicon
- Medians of 3 full passes (within-pass variance < 5%)

## Scenarios

| Scenario | What it measures |
|---|---|
| `ssr-static` | `renderToString` 500× with a template that has no function interpolations |
| `ssr-dynamic` | `renderToString` 500× with a template that reads a prop via fn interpolation |
| `ssr-themed` | `renderToString` 500× with a template that reads from `ThemeProvider` context |
| `csr-mount` | `createRoot` → mount 100 components per tick (jsdom) |
| `csr-update` | mount once, then re-render 100× with different props |
| `csr-many` | mount 50 **distinct** styled components per tick (defeats per-component cache) |

**Fairness note**: `styled-components` 6 does NOT use React 19's `<style precedence>` mechanism — `renderToString` only emits class names, deferring CSS serialization. The SSR sc paths wrap each render in `ServerStyleSheet.collectStyles()` + `getStyleTags()` so all three libs do equivalent work (render + serialize CSS).

## Results (median ops/sec, higher is better)

| Scenario | styler | emotion | sc | styler vs emotion | styler vs sc |
|---|---|---|---|---|---|
| ssr-static | **674.5** | 315.6 | 196.6 | **2.14×** | **3.43×** |
| ssr-dynamic | **400.7** | 303.0 | 188.4 | **1.32×** | **2.13×** |
| ssr-themed | **346.1** | 251.7 | 171.0 | **1.37×** | **2.02×** |
| csr-mount | 13715 | 13048 | 13266 | 1.05× | 1.03× |
| csr-update | 12800 | 12664 | 12844 | 1.01× | 1.00× |
| csr-many | **18714** | 17938 | 5463 | 1.04× | **3.43×** |

## Per-render translation

SSR per-render cost (each tick = 500 renders):

| Scenario | styler | emotion | sc |
|---|---|---|---|
| ssr-static | **3.05 μs** | 6.44 μs | 10.26 μs |
| ssr-dynamic | **5.06 μs** | 6.68 μs | 10.75 μs |
| ssr-themed | **6.05 μs** | 8.15 μs | 11.82 μs |

CSR per-mount cost (each tick = 100 mounts; csr-many = 50 distinct components):

| Scenario | styler | emotion | sc |
|---|---|---|---|
| csr-mount | **0.78 μs** | 0.84 μs | 0.82 μs |
| csr-update | 0.84 μs | 0.85 μs | **0.82 μs** |
| csr-many (per component) | **1.18 μs** | 1.20 μs | 4.22 μs |

## Takeaways

1. **SSR**: styler leads on every scenario — **2.0–3.4× vs styled-components** and **1.3–2.1× vs emotion**. The lead is largest on `ssr-static` (no function interpolations → class computed once and cached) and narrows on `ssr-dynamic`/`ssr-themed` where all three must resolve per render. The React 19 `<style precedence>` integration + cached static templates + lazy resolve all contribute.
2. **CSR mount/update**: within ~5% across all three libs — i.e. a statistical tie. React's reconciler + jsdom DOM mutation dominate; CSS-in-JS overhead is in the noise here.
3. **CSR many** (distinct components per tick, cache-defeating): styler ≈ emotion, both **~3.4× faster than styled-components**. Each new `styled.div` template carries per-component setup cost that sc pays heavily at create-time.

## Caveats (honesty)

- **jsdom CSR doesn't paint** — a real browser includes layout/style recalc this bench doesn't reflect. The CSR mount/update tie should be read as "CSS engine isn't the bottleneck there," not "all engines paint equally fast."
- **`tinybench` numbers within ~5% are noise.** The SSR gaps and the `csr-many` sc gap are well outside the noise floor; the CSR mount/update results are within it (reported as ties).
- **Absolute throughput is machine/thermal-dependent** — only the cross-library ratios on the *same* run are meaningful. These were measured on one machine in one sitting, 3 passes.
- **`styled-components` 6 ships a streaming-SSR path** (`renderToPipeableStream`) optimized for large trees — this bench measures sync `renderToString` only.
- **styler's cache benefits from the same component rendering many times per tick.** Real apps see this for their most-rendered components; cold one-off renders look more like `csr-many`.

## Regression check

Future PRs that touch the styler hot path should re-run `bun run bench` and update this file. A >10% regression on any styler row vs these numbers warrants investigation before merging. (Compare ratios, not absolute ops/s — the latter drifts with machine/runtime version.)

## Post-audit results (`perf/styler-audit`)

Same setup, single pass after the styler perf pass landed on this branch:

| Scenario | Pre (ops/s) | Post (ops/s) | Δ |
|---|---|---|---|
| ssr-static | 674.5 | **730.4** | +8.3% |
| ssr-dynamic | 400.7 | **429.5** | +7.2% |
| ssr-themed | 346.1 | **371.2** | +7.3% |
| csr-mount | 13715 | 14164 | +3.3% (within noise) |
| csr-update | 12800 | 12995 | +1.5% (within noise) |
| csr-many | 18714 | 19276 | +3.0% (within noise) |

SSR scenarios are the load-bearing wins (~7-8% across all three). CSR rows are within the noise floor as expected — they were already cache-hit dominated by the per-tick repeated renders.

### Where the SSR gains came from (audit-pass changes)

| Change | Hot-path effect |
|---|---|
| `styled.ts`: drop `delete rawProps.theme` in favor of `Object.assign({theme}, rawProps)` | Avoids V8 hidden-class deopt on every dynamic render |
| `sheet.ts`: 2-slot LRU in front of `prepareCache` + `insertCache` | Reference compare hits before `Map.get` hash + bucket walk |
| `sheet.ts`: no-`@` fast path in `prepare()` and `insert()` | Skips `splitAtRules` + two intermediate arrays + map/spread on ~95% of CSS |
| `sheet.ts`: inline `@`-prefix dispatch in `splitAtRules` (`startsWith` + 1-char gate) | Removes the per-`@` `.slice(i, i+20)` + regex compile |
| `resolve.ts`: 2-slot LRU in front of `normCache` | Same reference-compare win on `normalizeCSS` |
| `styled.ts`: lazy `useRef` init for dynamic LRU | One less literal allocation per render |

None of these change behavior — every existing test (406 in styler, 2776 across the monorepo) still passes. Bundle size grew ~600 B gzipped (11.4 → 12.0 KB).
