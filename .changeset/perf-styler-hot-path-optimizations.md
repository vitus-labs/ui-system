---
'@vitus-labs/styler': patch
---

Five small structural optimizations across `styled`, `useCSS`, `sheet`, `resolve`, `shared`, and `forward`. No public API changes; all internal.

**Changes**

1. **`DynamicStyled` LRU-2 cacheRef** (`styled.ts`) — the previous single-slot ref missed every render when a prop alternated between two values (toggle, hover, animation frame). Two slots cover that case; alternation now skips the `sheet.getClassName` Map lookup at steady state. A new test in `styled.test.tsx` spies on `sheet.getClassName` and asserts zero additional calls across six alternation renders after both slots are primed.
2. **`splitAtRules` / `splitRules` char access** (`sheet.ts`) — `cssText[i]` allocates a fresh 1-char string in V8 per iteration; `cssText.charCodeAt(i)` returns a primitive. Only material on long stylesheets containing `@media` / `@supports` / `@container`.
3. **`CSSResult._isDynamic` memoization** (`resolve.ts` + `shared.ts`) — caches the recursive scan result per `CSSResult` instance. Helps composition trees where the same shared snippet is interpolated into many consumers. Verified by four new tests in `shared.test.ts`.
4. **`buildProps` ref skip** (`forward.ts`) — skips `result.ref = undefined` (the common case where no `ref` was passed). Explicit `ref={null}` is preserved verbatim per existing test contract.
5. **`useCSS` single-pass content check** (`useCSS.ts`) — replaces three `cssText.trim()` calls per render with one `cssText.length > 0` check. `normalizeCSS` already strips edges, so the trims were redundant.

**Honest perf framing**

5×5 head-to-head bench runs (built from the same machine, same React 19.2.6 / bun 1.3.13) show all six scenarios **within run-to-run noise (±2%)** relative to `main`. The existing benchmark suite does not exercise the specific paths these changes target:

- The LRU-2 helps cssText alternation, but React's reconciliation work in `csr-update` dominates the saved Map lookup.
- The `charCodeAt` change only fires for CSS containing `@media` / `@supports` / `@container` — bench CSS has none.
- The `_isDynamic` memo only helps deeply nested or widely-shared `CSSResult` snippets — bench uses flat templates.
- The ref-skip and trim-collapse savings are below the bench noise floor on their own.

So this is a **correctness-and-cleanup** patch, not a measurable headline-perf bump. The structural improvements compound across real-app workloads (large component trees with shared CSS snippets, animation-driven prop alternation, responsive `@media`-heavy components) where the saved work isn't dominated by a single React render call.

**Bundle**: 4.65 KB → 4.72 KB gzipped (+70 B). Under the 12 KB size budget.

**Verification**: 399 styler tests (6 new) pass; 2688 monorepo tests pass; biome, tsc, and `pkgs:build` all green.
