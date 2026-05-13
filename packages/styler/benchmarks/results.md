# CSS-in-JS perf benchmark

Comparison of `@vitus-labs/styler` against `styled-components` 6 and `@emotion/styled` 11 on render performance across SSR and CSR paths.

**Reproduce**: `bun run bench` from `packages/styler/`.

## Setup

- bun 1.3.13, react 19.2.5
- `NODE_ENV=production`
- jsdom for CSR scenarios
- tinybench: 1500 ms timed window, 300 ms warmup
- Apple Silicon

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

## Latest results

```
── ssr-static ──
  styler     1528 ops/s   0.685 ms/op   1.00× ████████████████████
  emotion    1008 ops/s   1.040 ms/op   0.66× █████████████
  sc          259 ops/s   3.905 ms/op   0.17× ███

── ssr-dynamic ──
  styler     1174 ops/s   0.887 ms/op   1.00× ████████████████████
  emotion     904 ops/s   1.152 ms/op   0.77× ███████████████
  sc          242 ops/s   4.179 ms/op   0.21× ████

── ssr-themed ──
  styler     1148 ops/s   0.910 ms/op   1.00× ████████████████████
  emotion     903 ops/s   1.148 ms/op   0.79× ████████████████
  sc          250 ops/s   4.054 ms/op   0.22× ████

── csr-mount ──
  emotion   48630 ops/s   0.022 ms/op   1.00× ████████████████████
  styler    46611 ops/s   0.024 ms/op   0.96× ███████████████████
  sc        45659 ops/s   0.024 ms/op   0.94× ███████████████████

── csr-update ──
  styler    36386 ops/s   0.029 ms/op   1.00× ████████████████████
  emotion   35896 ops/s   0.030 ms/op   0.99× ████████████████████
  sc        35844 ops/s   0.029 ms/op   0.99× ████████████████████

── csr-many ──
  styler    42842 ops/s   0.027 ms/op   1.00× ████████████████████
  emotion   38800 ops/s   0.027 ms/op   0.91× ██████████████████
  sc        13936 ops/s   0.090 ms/op   0.33× ███████
```

## Per-render translation

SSR per-render cost (each tick = 500 renders):

| Scenario | styler | emotion | sc |
|---|---|---|---|
| ssr-static | **1.37 μs** | 2.08 μs | 7.81 μs |
| ssr-dynamic | **1.77 μs** | 2.30 μs | 8.36 μs |
| ssr-themed | **1.82 μs** | 2.30 μs | 8.11 μs |

CSR per-mount cost (each tick = 100 mounts):

| Scenario | styler | emotion | sc |
|---|---|---|---|
| csr-mount | 0.24 μs | **0.22 μs** | 0.24 μs |
| csr-update | **0.29 μs** | 0.30 μs | 0.29 μs |
| csr-many | **0.54 μs/tick / 50** | 0.55 μs | 1.79 μs |

## Takeaways

1. **SSR**: styler leads by **1.3–1.4× vs emotion** and **4–5× vs sc**. The React 19 `<style precedence>` integration + cached static templates + lazy resolve all contribute.
2. **CSR mount/update**: within ~5% across all three libs. React's reconciler dominates; CSS-in-JS work is in the noise.
3. **CSR many** (distinct components per tick, cache-defeating): styler/emotion are similar (~10% gap), **sc is 3× slower**. Each new `styled.div` template carries setup cost that sc pays at create-time.
4. **Bundle size (orthogonal)**: styler gzip ≈ 3.06 KB, emotion ≈ 7 KB, sc6 ≈ 16 KB.

## Caveats

- jsdom CSR doesn't paint — real browser perf includes layout/style recalc that this bench doesn't reflect. Component count, layout complexity, and CSS rule count will shift the picture.
- `tinybench` numbers within ~5% are noise. The dramatic SSR sc gap and `csr-many` sc gap are well outside the noise floor; the close-fought CSR mount/update results are within it.
- `styled-components` 6 ships a streaming-SSR path (`renderToPipeableStream`) optimized for large trees — this bench measures sync `renderToString` only.
- styler's cache benefits from the same component being rendered many times per tick. Real apps see this for the most-rendered components.

## Regression check

Future PRs that touch the styler hot path should re-run `bun run bench` and update this file. If you see a >10% regression on any styler row vs the numbers here, investigate before merging.
