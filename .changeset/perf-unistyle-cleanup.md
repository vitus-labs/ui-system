---
'@vitus-labs/unistyle': patch
---

Five structural cleanups across the responsive engine. No public API or behavioural changes.

**Changes**

1. **`createMediaQueries`** (`responsive/createMediaQueries.ts`) — `Object.keys.reduce` → for-in + direct mutation. Avoids the keys array allocation + reduce callback overhead per breakpoint setup.
2. **`shouldNormalize`** (`responsive/normalizeTheme.ts`) — `Object.values(props).some(...)` → for-in early-exit. Drops the values array allocation; the early `return true` is hit by any responsive token so most calls bail out quickly.
3. **`normalizeTheme`** (`responsive/normalizeTheme.ts`) — `Object.entries.forEach` → for-in. Avoids the entries-tuple array allocation per theme normalization.
4. **`transformTheme`** (`responsive/transformTheme.ts`) — same pattern, applied to outer (`theme`) and inner (object-shape value) loops. Two entries-array allocations skipped per pivot.
5. **`optimizeTheme/shallowEqual`** (`responsive/optimizeTheme.ts`) — two `Object.keys` allocations replaced with for-in counting (same pattern as rocketstyle's `isShallowEqualRocketstate`).
6. **`alignContent` isReverted check** (`styles/alignContent.ts`) — `['inline', 'reverseInline'].includes(direction)` → direct `===` comparison. Avoids the per-call 2-element array allocation on a path that fires for every styled component with a `direction` prop.

## Measured deltas

Same-process microbench (median of 3 runs, bun 1.3.13 + tinybench, runnable at [`packages/styler/benchmarks/perf-audit-bench.tsx`](packages/styler/benchmarks/perf-audit-bench.tsx)):

| Helper | Old ops/s | New ops/s | Δ |
|---|---|---|---|
| `createMediaQueries` (5 breakpoints) | 18.8M | 21.6M | **+15.9%** |
| `shouldNormalize` (5-prop theme) | 20.2M | 24.3M | **+20.3%** |
| `shallowEqual` (5-key style objects, equal) | 23.2M | 24.1M | +4.0% |
| `alignContent isReverted` check | 24.5M | 24.6M | +0.3% (noise) |

The `shallowEqual` improvement is smaller than the rocketstyle equivalent because the early-exit `a === b` reference check dominates; the `alignContent` change is below noise but still a real allocation reduction. The structural argument stands for both — they just sit below tinybench's resolution for tiny inputs.

## Verification

- 207 unistyle tests pass (existing suite covers all five helpers via the responsive pipeline)
- 2688 monorepo tests pass
- `bun run lint`, `bun run typecheck` clean
