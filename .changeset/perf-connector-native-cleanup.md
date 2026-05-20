---
'@vitus-labs/connector-native': patch
---

Three structural cleanups in the React Native CSS connector. No public API or behavioural changes.

**Changes**

1. **`styled.ts` prop filter loop** — `for (const key of Object.keys(props))` → `for (const key in props)`. Saves the keys array allocation on every native styled render.
2. **`createMediaQueries.ts`** — `Object.keys.reduce` → for-in + direct mutation. Mirrors the same change in `@vitus-labs/unistyle`'s `createMediaQueries`.
3. **`css.ts` `styleObjectToString`** — extracted the `Object.entries(o).map(([k,v]) => …).join('; ')` pattern (two arrays + a join) used in `resolveInterpolation` into a dedicated single-pass for-in concat helper. Saves the entries-tuple array + transformed array + the implicit array `.join()` consumes — three allocations skipped per nested-style stringification.

**Measured deltas**

Same-process microbench (median of 3 runs, bun 1.3.13 + tinybench, runnable at [`packages/styler/benchmarks/perf-audit-bench.tsx`](packages/styler/benchmarks/perf-audit-bench.tsx)):

| Helper | Old ops/s | New ops/s | Δ |
|---|---|---|---|
| `filterForwardedProps` (12-key props) | 5.1M | 5.4M | **+6.2%** |
| `createMediaQueries` (5 breakpoints) | 19.4M | 23.3M | **+19.9%** |
| `styleObjectToString` (5-key style object) | 3.3M | 21.5M | **+553.5%** |

`styleObjectToString` is the biggest single win — the prior `entries.map.join` chain allocated three intermediate arrays per call; the for-in concat skips all of them.

**Verification**

- All connector-native tests pass via the monorepo suite (135 files, 2688 tests pass)
- `bun run lint`, `bun run typecheck` clean
