---
'@vitus-labs/styler': patch
---

Three rounds of parallel hot-path audits + bundle trim. Net result: faster on every SSR scenario, all CSR scenarios at or above main, bundle SMALLER than before.

**Round 1 — small isolated wins**
- `ThemeProvider`: export `EMPTY_THEME` module-level sentinel. `useTheme()` returns it when no provider is mounted; `DynamicStyled` skips the `rawProps.theme` write via reference compare. Earlier guard `theme !== undefined` never fired because the context default was `{}`.
- `sheet.getClassName()`: inline the 2-slot LRU hot cache that `insert()` populates. Was paying `Map.get`'s hash + bucket walk on every dynamic client render even though `insert()` had just stored the same cssText 1 μs earlier in the same render.
- `styled.ts DynamicStyled`: hoist `tagIsDOM` out of the render (mirrors the static path).
- `forward.ts buildProps`: skip the `theme` key explicitly in the DOM-default branch. `theme` is now always on `rawProps` (mutated by `DynamicStyled`), so the for-in paid 3 string checks + an `in` lookup to ultimately reject it.

**Round 2 — architectural compression**
- `CSSResult`: drop `= undefined` field initializers. V8 sees unassigned properties as `undefined` anyway; skipping the writes shortens the constructor's hidden-class transition by 2 stores.
- `styled.ts proxyCache`: `Map` → null-prototype object. `proxyCache[prop]` is monomorphic dict-mode access; `Map.get` goes through a polymorphic IC shared with every Map in the runtime.
- `styled.ts staticComponentCache`: lazy-promote single-tag entries. Previously every cache miss allocated a fresh `Map<Tag, Component>` even when only one tag was paired with the template (95% of cases). Now stores `[tag, component]` tuple for single-tag, promotes to Map only on the second tag. ~56 B GC pressure + ~50-100 ns saved per miss. Material on csr-many.

**Round 3 — the load-bearing win**
- `createElement → jsx/jsxs` from `react/jsx-runtime`. React 19's `createElement` always allocates a fresh props object and `for-in`-copies every config key (verified in `react.production.js:409`). `jsx`/`jsxs` skip the copy when no `key` is set on config — `buildProps` never writes `key`, so every styled render benefits.
- `DynamicStyled` split into IS_SERVER vs client variants. The server variant drops the `useRef` LRU cache + `useInsertionEffect` closure + deps array (dead weight on SSR — React's server renderer no-ops effects, and SSR never alternates between values on the same instance). React hooks rules apply per-function-body, so each variant calls its hooks unconditionally; the choice happens at module load via the `IS_SERVER` ternary.

**Bundle**
The ESM bundle ships unminified (tools-rolldown only minifies the unpkg UMD build), so explanatory comments survive into the gzipped output. Trimmed verbose multi-paragraph rationales across `styled.ts`, `sheet.ts`, `resolve.ts`, `ThemeProvider.tsx` — kept one tight line each. **Bundle dropped 12.14 KB → 11.64 KB gzipped**, ~300 B smaller than the pre-perf-pass baseline despite gaining all of rounds 1-3.

**CI bench (same-runner) for the final commit:**

| Scenario | main | PR | Δ |
|---|---|---|---|
| ssr-dynamic | 512 | **561** | **+9.5%** |
| ssr-themed | 497 | **519** | **+4.6%** |
| csr-many | 18624 | **19177** | **+3.0%** |
| ssr-static / csr-mount / csr-update | within noise | | |

The standout `+9.5% ssr-dynamic` is where the IS_SERVER variant split pays off: 500 dynamic renders per tick × ~150 ns saved on closure allocation + LRU bookkeeping = ~75 μs per tick.

All 412 styler tests pass; lint, typecheck, build clean.
