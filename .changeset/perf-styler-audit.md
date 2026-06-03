---
'@vitus-labs/styler': patch
---

Perf pass on the styler hot path — six micro-wins compounding to ~7-8% on SSR scenarios. Same engine, same output; no API or behavior changes.

**`styled.ts` — dynamic render**
- Drop `delete rawProps.theme` and replace with `Object.assign({ theme }, rawProps)` when `theme` isn't already provided. The `delete` was poisoning V8's hidden-class shape for every dynamic render's props object; the spread keeps the shape stable.
- Lazy `useRef` init for the 2-slot LRU cache — one less object literal allocated per render before the first cache hit.

**`sheet.ts` — `prepare()` / `insert()`**
- 2-slot LRU in front of `prepareCache` and `insertCache`. Reference compare hits before `Map.get`'s hash + bucket walk, which matters on the typical SSR loop where the same component re-renders 500x with identical cssText.
- No-`@` fast path: when cssText contains no `@`-rules and no `@layer` is configured (~95% of styled CSS), `prepare()` / `insert()` build the rule string directly and skip `splitAtRules` entirely (regex, linear scan, two intermediate arrays, map, spread — all gone).
- `splitAtRules` inline `@`-prefix dispatch: replaced the `cssText.slice(i, i + 20)` + regex pattern with a 1-char `charCodeAt` gate that calls `startsWith` only on a match. No per-`@` allocation; `startsWith` is a V8 intrinsic.

**`resolve.ts` — `normalizeCSS`**
- 2-slot LRU in front of `normCache`. Same shape and rationale as the sheet caches — SSR loops alternate between very few cssText values.

**Bench numbers** (median, single pass on the same machine; full table in `packages/styler/benchmarks/results.md`):

| Scenario | Pre | Post | Δ |
|---|---|---|---|
| ssr-static | 674.5 | 730.4 | +8.3% |
| ssr-dynamic | 400.7 | 429.5 | +7.2% |
| ssr-themed | 346.1 | 371.2 | +7.3% |

CSR scenarios are within the noise floor (already cache-hit dominated by the per-tick repeated renders).

All 406 styler tests and 2776 monorepo tests pass. One test (`warns in dev when two different cssText strings produce the same hash`) was updated to clear the new hot slots when bypassing the public `clearCache()` to plant its synthetic collision.
