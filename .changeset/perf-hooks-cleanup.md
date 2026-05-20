---
'@vitus-labs/hooks': patch
---

`useBreakpoint`: build the sorted `[name, min]` tuples via a for-in scan + push instead of `Object.entries(breakpoints).sort(...)`. Applied to both the web (`useBreakpoint.ts`) and React Native (`useBreakpoint.native.ts`) variants.

**Why**

The `Object.entries(...)` call allocated an intermediate tuple-array that the subsequent `.sort(...)` mutates in place anyway. for-in + push builds the array we actually want directly, while also picking up a `typeof value === 'number'` type-guard along the way (kept the runtime contract; satisfies `noUncheckedIndexedAccess` cleanly).

Wrapped in `useMemo([breakpoints])` so this runs only when the breakpoints reference changes (typically once per Provider mount).

**Measured delta**

Same-process microbench (median of 3 runs, bun 1.3.13 + tinybench, runnable at [`packages/styler/benchmarks/perf-audit-bench.tsx`](packages/styler/benchmarks/perf-audit-bench.tsx)):

| Helper | Old ops/s | New ops/s | Δ |
|---|---|---|---|
| `buildSortedBpTuples` (5 breakpoints) | 4.9M | 8.8M | **+80.3%** |

The for-in + type-guard variant is materially faster than `Object.entries(...).sort(...)`. Useful even though useMemo caches the result — the cache miss happens at least once per Provider mount.

**Verification**

- 2688 monorepo tests pass
- `bun run lint`, `bun run typecheck` clean
