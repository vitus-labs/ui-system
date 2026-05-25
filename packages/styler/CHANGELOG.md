# @vitus-labs/styler

## 2.6.2

### Patch Changes

- [#242](https://github.com/vitus-labs/ui-system/pull/242) [`c483cab`](https://github.com/vitus-labs/ui-system/commit/c483cabc569b31aca111f1bbb5e59e30801bbffc) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Five targeted hot-path optimizations across `styled`, `useCSS`, `sheet`, `resolve`, `shared`, and `forward`.

  **What changed**

  1. **`DynamicStyled` LRU-2 cacheRef** (`styled.ts`) — the previous single-slot ref missed every render when a prop alternates between two values (toggle / hover / animation frame), forcing repeated `getClassName` / `prepare` work even though both class names were already cached upstream. Two slots cover the alternation case without meaningfully growing per-instance state.
  2. **`splitAtRules` / `splitRules` char access** (`sheet.ts`) — `cssText[i]` allocates a fresh 1-char string in V8 per iteration; `cssText.charCodeAt(i)` returns a primitive. Material on long stylesheets with at-rule blocks.
  3. **`CSSResult._isDynamic` memoization** (`resolve.ts` + `shared.ts`) — `isDynamic` was rescanning the same nested CSSResult sub-trees every time a consumer (styled, useCSS, createGlobalStyle, nested interpolation) asked. Lazy-cache the result per instance; CSSResults are created once at module level and reused everywhere.
  4. **`buildProps` ref skip** (`forward.ts`) — when the caller passes no `ref`, the destructure default is `undefined`. Assigning that as an own-property still costs React a traversal during reconciliation. Skip the assignment for `undefined`; explicit `ref={null}` is preserved verbatim.
  5. **`useCSS` single-pass content check** (`useCSS.ts`) — replaces three `cssText.trim()` calls per render with one `cssText.length > 0` check. `normalizeCSS` already strips leading/trailing whitespace, so the lengthier `.trim()` invariant was redundant.

  **Bench impact** (bun 1.3.13, react 19.2.6, jsdom, three-run median):

  | Scenario    | Before (ops/s) | After (ops/s) | Δ        |
  | ----------- | -------------- | ------------- | -------- |
  | ssr-static  | 489.8          | ~712          | **+45%** |
  | ssr-dynamic | 412.9          | ~427          | +3–5%    |
  | ssr-themed  | 337.7          | ~360          | +6–7%    |
  | csr-mount   | 12195          | ~14000        | +5–20%   |
  | csr-update  | 10669          | ~13000        | +0–27%   |
  | csr-many    | 16958          | ~19500        | +15%     |

  `csr-update` was previously [#3](https://github.com/vitus-labs/ui-system/issues/3) (behind `styled-components` and `@emotion/styled`); after the LRU-2 it ties or leads. SSR scenarios were already first; the static path gets the largest absolute win because most page CSS is static and now skips per-render rescans entirely. CSR variance is inherent — React's own work dominates these scenarios — but every reproduced delta is in styler's favour.

  **Bundle**: 4.65 KB → 4.72 KB gzipped (+70 B). Under the 12 KB size budget.

  **Verification**: 393 styler tests + 2688 monorepo tests pass; biome / tsc / `pkgs:build` all green; all 6 bench scenarios show styler in the top spot vs `styled-components` 6 and `@emotion/styled` 11.

- [#253](https://github.com/vitus-labs/ui-system/pull/253) [`51f61b2`](https://github.com/vitus-labs/ui-system/commit/51f61b23f8ae7a474b1a3c68e6f4410504fd92df) Thanks [@vitbokisch](https://github.com/vitbokisch)! - `CSSResult._staticResolved` cache: memoize the resolved CSS string on `CSSResult` instances that `shared.ts#isDynamic` has classified as static. Safe because props don't affect the output when there are no function interpolations — the resolved string is then a pure function of the template literal.

  **Why**

  `shared.ts#isDynamic` already populates `_isDynamic` on every `CSSResult` reached at styled-component / globalStyle creation time. The follow-up `resolveValue` path re-walked the template's `strings` + `values` on every render even when `_isDynamic === false` was already known. The common pattern is a shared static snippet (e.g. `const base = css\`padding: 12px;\``) interpolated into many dynamic components — that snippet's resolve work was paid once per dynamic render of every consumer. Memoizing on the instance turns that into one resolve per snippet, total.

  **Measured delta**

  Same-process microbench (median of 3 runs, bun 1.3.13 + tinybench, runnable at [`packages/styler/benchmarks/perf-audit-bench.tsx`](packages/styler/benchmarks/perf-audit-bench.tsx)):

  | Helper                                                              | Old ops/s | New ops/s | Δ                   |
  | ------------------------------------------------------------------- | --------- | --------- | ------------------- |
  | `nested-static resolve` (8 repeated resolves of one shared snippet) | 2.6M      | 6.5M      | **+149.4%** (~2.5×) |

  The 8-repeat fixture models the realistic case: one static `css\`…\`` snippet that gets interpolated into many dynamic styled components. First call computes + caches; subsequent calls return the cached string in O(1).

  **Other ideas explored and dropped**

  I also benched two other candidates in this round and dropped them after the numbers came in:

  1. **`normalizeCSS` slice-batching** (replace per-char `out += css[i]` with run-based `slice` appends): +19% on long CSS strings but **−15% on short CSS**. The flushRun closure overhead dominates for short inputs. Real-app CSS is mixed, so a net regression risk on the common medium-length case wasn't worth keeping.
  2. **`sheet.insertCache` / `prepareCache` split by `boost`** (avoid `${cssText}\0` allocation in boosted lookups): when measured fairly with pre-allocated maps (matching production class-field lifetimes), the delta was **+0.2%** — noise. The string allocation V8 paid was already amortized; doubling the map count for ~0 gain isn't worth the complexity.

  **Verification**

  - 393 styler tests pass (no new tests — existing `resolve` / nested-CSSResult coverage exercises the new memoized path)
  - 2689 monorepo tests pass
  - `bun run lint`, `bun run typecheck` clean

- [#254](https://github.com/vitus-labs/ui-system/pull/254) [`60fc25c`](https://github.com/vitus-labs/ui-system/commit/60fc25c1c31526aead35a7156618ab5e2f8ac4e8) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Add behavioural lock-in tests for three perf-critical paths shipped earlier this session whose original tests were lost during PR [#242](https://github.com/vitus-labs/ui-system/issues/242)'s squash-merge.

  **What's tested**

  1. **`DynamicStyled` LRU-2 cacheRef alternation** (`styled.test.tsx`) — spy on `sheet.getClassName` and assert zero additional calls across 6 alternation renders after both slots prime. Locks in the LRU-2 cache-hit behaviour from PR [#242](https://github.com/vitus-labs/ui-system/issues/242). Without this, a future regression that quietly broke the two-slot ring buffer would only show up via downstream perf signals.
  2. **`CSSResult._isDynamic` memoization** (`shared.test.ts`) — four tests covering populate-on-first-call (static + dynamic), cache-on-subsequent-call (via sentinel mutation of `values`), and nested-CSSResult propagation. Locks in the PR [#242](https://github.com/vitus-labs/ui-system/issues/242) memo behaviour.
  3. **`CSSResult._staticResolved` cache** (`resolve.test.ts`) — four tests covering populate-on-first-resolveValue, cache-hit via sentinel mutation, no-cache for dynamic CSSResults, and fallthrough when `_isDynamic` is unclassified. Locks in the PR [#253](https://github.com/vitus-labs/ui-system/issues/253) static-resolve memoization.

  **Why now**

  The follow-up audit found these three perf-critical behaviours had no behavioural tests on `main`. The original tests I added in PR [#242](https://github.com/vitus-labs/ui-system/issues/242)'s correction commit `f4226464` weren't captured in the squash because auto-merge had already snapped its squash body to the prior commits. Without tests, a future regression silently breaks the cache hit/miss path — downstream perf signals are too slow.

  No production code changes; tests only.

  **Verification**

  - 403 styler tests pass (+10 from this PR)
  - 2699 monorepo tests pass
  - Coverage: lines 99.34%, statements 98.71%, branches 94.46%, functions 98.45% — all above thresholds
  - `bun run lint`, `bun run typecheck` clean

## 2.6.1

### Patch Changes

- [#231](https://github.com/vitus-labs/ui-system/pull/231) [`75dc87f`](https://github.com/vitus-labs/ui-system/commit/75dc87f6fbc281676d5ed0791df9a08010e414cc) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Add a tracked CSS-in-JS perf benchmark at `packages/styler/benchmarks/`. Run with `bun run bench` from the styler package. Compares `@vitus-labs/styler` against `styled-components` 6 and `@emotion/styled` 11 on six scenarios: SSR (static / dynamic / themed) + CSR (mount / update / many distinct components).

  Documents the runtime perf landscape and serves as a regression check — a >10% drop on any styler row vs `results.md` should be investigated before merging.

  No runtime change; this only adds bench infra + devDependencies (`jsdom`, `tinybench`) to styler.

- [#233](https://github.com/vitus-labs/ui-system/pull/233) [`178cf8e`](https://github.com/vitus-labs/ui-system/commit/178cf8ede7fadb9749eacdace9886d9d77d13c16) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Cache the pre-built ReactElement for the no-extra-props case of static `styled` components.

  Most `<MyStyled />` call sites pass no props beyond `ref` — the destructure, `buildProps` iteration, and `createElement` calls produce the same element shape every render. Pre-build that element once at component creation and short-circuit in the render fn when `rawProps` is empty and `ref` is nullish.

  **Impact**: styler's overhead-over-bare-React for static SSR drops from ~0.065 μs/render to ~0.008 μs/render (~88% reduction). Net effect on full SSR throughput is +3–4% because React's `renderToString` itself dominates the remaining cost. Most-benefit consumers: pages that emit many static styled components with no extra props (typical layout/typography building blocks).

  ReactElement values are immutable so sharing the cached element across renders is safe; React still treats each render as a fresh tree by identity.

## 2.6.0

## 2.5.0

## 2.4.0

## 2.3.0

## 2.2.1

### Patch Changes

- [#217](https://github.com/vitus-labs/ui-system/pull/217) [`29aaed2`](https://github.com/vitus-labs/ui-system/commit/29aaed20c73c6cd466e0ac2ffb1512d4c519883a) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Fix publishing of internal `peerDependencies` — 2.2.0 shipped with the literal string `"workspace:^"` in published `peerDependencies`, which Bun (correctly) refuses to install. `npm publish` rewrites the workspace protocol in `dependencies` but **not** in `peerDependencies`, and `changeset publish` invokes `npm publish` under the hood. We now rewrite `workspace:^` (and `workspace:~`, `workspace:*`) to concrete caret ranges in a pre-publish step. The published artifact for `@vitus-labs/core` peer dep, for example, is now `"^2.2.1"` instead of `"workspace:^"`. Source declarations stay symbolic (`workspace:^`) so day-to-day workspace resolution is unchanged.

## 2.2.0

### Patch Changes

- [#208](https://github.com/vitus-labs/ui-system/pull/208) [`bb75613`](https://github.com/vitus-labs/ui-system/commit/bb75613ba75041ba405dbae1eb2f01ae66c7aa19) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Migrate internal `peerDependencies` to the `workspace:^` protocol. At publish time the protocol is rewritten to a real caret range (`^X.Y.Z`) — same end result for downstream consumers — but in-source declarations stay symbolic, so they don't need updating on every version bump. Deletes `scripts/sync-peer-deps.mjs` and the `version` lifecycle hooks that invoked it across 10 packages. Combined with the new `bumpVersionsWithWorkspaceProtocolOnly` and `onlyUpdatePeerDependentsWhenOutOfRange` Changesets options, minor bumps in any one package now correctly propagate as minor across the whole fixed group instead of cascading into a major bump.
