---
'@vitus-labs/styler': patch
---

`CSSResult._staticResolved` cache: memoize the resolved CSS string on `CSSResult` instances that `shared.ts#isDynamic` has classified as static. Safe because props don't affect the output when there are no function interpolations — the resolved string is then a pure function of the template literal.

**Why**

`shared.ts#isDynamic` already populates `_isDynamic` on every `CSSResult` reached at styled-component / globalStyle creation time. The follow-up `resolveValue` path re-walked the template's `strings` + `values` on every render even when `_isDynamic === false` was already known. The common pattern is a shared static snippet (e.g. `const base = css\`padding: 12px;\``) interpolated into many dynamic components — that snippet's resolve work was paid once per dynamic render of every consumer. Memoizing on the instance turns that into one resolve per snippet, total.

**Measured delta**

Same-process microbench (median of 3 runs, bun 1.3.13 + tinybench, runnable at [`packages/styler/benchmarks/perf-audit-bench.tsx`](packages/styler/benchmarks/perf-audit-bench.tsx)):

| Helper | Old ops/s | New ops/s | Δ |
|---|---|---|---|
| `nested-static resolve` (8 repeated resolves of one shared snippet) | 2.6M | 6.5M | **+149.4%** (~2.5×) |

The 8-repeat fixture models the realistic case: one static `css\`…\`` snippet that gets interpolated into many dynamic styled components. First call computes + caches; subsequent calls return the cached string in O(1).

**Other ideas explored and dropped**

I also benched two other candidates in this round and dropped them after the numbers came in:

1. **`normalizeCSS` slice-batching** (replace per-char `out += css[i]` with run-based `slice` appends): +19% on long CSS strings but **−15% on short CSS**. The flushRun closure overhead dominates for short inputs. Real-app CSS is mixed, so a net regression risk on the common medium-length case wasn't worth keeping.
2. **`sheet.insertCache` / `prepareCache` split by `boost`** (avoid `${cssText}\0` allocation in boosted lookups): when measured fairly with pre-allocated maps (matching production class-field lifetimes), the delta was **+0.2%** — noise. The string allocation V8 paid was already amortized; doubling the map count for ~0 gain isn't worth the complexity.

**Verification**

- 393 styler tests pass (no new tests — existing `resolve` / nested-CSSResult coverage exercises the new memoized path)
- 2689 monorepo tests pass
- `bun run lint`, `bun run typecheck` clean
