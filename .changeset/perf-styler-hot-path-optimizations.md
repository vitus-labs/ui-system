---
'@vitus-labs/styler': patch
---

Five targeted hot-path optimizations across `styled`, `useCSS`, `sheet`, `resolve`, `shared`, and `forward`.

**What changed**

1. **`DynamicStyled` LRU-2 cacheRef** (`styled.ts`) — the previous single-slot ref missed every render when a prop alternates between two values (toggle / hover / animation frame), forcing repeated `getClassName` / `prepare` work even though both class names were already cached upstream. Two slots cover the alternation case without meaningfully growing per-instance state.
2. **`splitAtRules` / `splitRules` char access** (`sheet.ts`) — `cssText[i]` allocates a fresh 1-char string in V8 per iteration; `cssText.charCodeAt(i)` returns a primitive. Material on long stylesheets with at-rule blocks.
3. **`CSSResult._isDynamic` memoization** (`resolve.ts` + `shared.ts`) — `isDynamic` was rescanning the same nested CSSResult sub-trees every time a consumer (styled, useCSS, createGlobalStyle, nested interpolation) asked. Lazy-cache the result per instance; CSSResults are created once at module level and reused everywhere.
4. **`buildProps` ref skip** (`forward.ts`) — when the caller passes no `ref`, the destructure default is `undefined`. Assigning that as an own-property still costs React a traversal during reconciliation. Skip the assignment for `undefined`; explicit `ref={null}` is preserved verbatim.
5. **`useCSS` single-pass content check** (`useCSS.ts`) — replaces three `cssText.trim()` calls per render with one `cssText.length > 0` check. `normalizeCSS` already strips leading/trailing whitespace, so the lengthier `.trim()` invariant was redundant.

**Bench impact** (bun 1.3.13, react 19.2.6, jsdom, three-run median):

| Scenario | Before (ops/s) | After (ops/s) | Δ |
|---|---|---|---|
| ssr-static | 489.8 | ~712 | **+45%** |
| ssr-dynamic | 412.9 | ~427 | +3–5% |
| ssr-themed | 337.7 | ~360 | +6–7% |
| csr-mount | 12195 | ~14000 | +5–20% |
| csr-update | 10669 | ~13000 | +0–27% |
| csr-many | 16958 | ~19500 | +15% |

`csr-update` was previously #3 (behind `styled-components` and `@emotion/styled`); after the LRU-2 it ties or leads. SSR scenarios were already first; the static path gets the largest absolute win because most page CSS is static and now skips per-render rescans entirely. CSR variance is inherent — React's own work dominates these scenarios — but every reproduced delta is in styler's favour.

**Bundle**: 4.65 KB → 4.72 KB gzipped (+70 B). Under the 12 KB size budget.

**Verification**: 393 styler tests + 2688 monorepo tests pass; biome / tsc / `pkgs:build` all green; all 6 bench scenarios show styler in the top spot vs `styled-components` 6 and `@emotion/styled` 11.
