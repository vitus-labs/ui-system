---
'@vitus-labs/styler': patch
---

Fix CSR regression introduced by PR #281 + further perf cleanup on hot caches.

PR #281's CI bench job showed **csr-many −10.0%**, csr-mount −6.2%, csr-update −6.6% vs main. The wins on SSR were real but came with these CSR regressions, which the PR shipped anyway because local bench variance hid them.

**Root cause: `Object.assign({theme}, rawProps)` in `DynamicStyled`.** PR #281 replaced the `delete rawProps.theme` pattern with `Object.assign` to dodge a hypothesized V8 hidden-class deopt. But the deopt concern was misplaced — `rawProps` is freshly destructured per render and discarded; nothing reads it after the function returns. The `Object.assign` allocated a new object on every dynamic render, costing more than the deopt it was trying to avoid.

**Fix.** Mutate `rawProps` directly. Skip the write entirely when there's no provider (csr-mount / csr-many runs without `ThemeProvider`) AND the caller didn't pass an explicit `theme` prop. This also saves `buildProps`'s for-in iteration one extra key.

```ts
// Before (PR #281):
const resolveProps =
  rawProps.theme === undefined ? Object.assign({theme}, rawProps) : rawProps

// After:
if (theme !== undefined && rawProps.theme === undefined) rawProps.theme = theme
```

**Hot-cache cold-miss cleanup.** The 2-slot LRU hot caches in `sheet.insert()`, `sheet.prepare()`, and `normalizeCSS()` ran 4 reads + 4 compares before falling through to `Map.get` on cold-miss — paid by every csr-many call (50 distinct cssText per tick → 100% miss rate). Nested so the cold-start path is a single `null` check:

```ts
// Before:
if (hotA !== null && hotA.key === key) return hotA.value
if (hotB !== null && hotB.key === key) { /* promote */ }
// → 4 ops on cold start

// After:
if (hotA !== null) {
  if (hotA.key === key) return hotA.value
  const hotB = this.hotB
  if (hotB !== null && hotB.key === key) { /* promote */ }
}
// → 1 op on cold start (hotA === null), same cost as before on hit
```

All 412 styler tests + 2782 monorepo tests pass; lint and typecheck clean.
