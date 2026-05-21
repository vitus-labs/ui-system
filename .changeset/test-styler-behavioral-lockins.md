---
'@vitus-labs/styler': patch
---

Add behavioural lock-in tests for three perf-critical paths shipped earlier this session whose original tests were lost during PR #242's squash-merge.

**What's tested**

1. **`DynamicStyled` LRU-2 cacheRef alternation** (`styled.test.tsx`) — spy on `sheet.getClassName` and assert zero additional calls across 6 alternation renders after both slots prime. Locks in the LRU-2 cache-hit behaviour from PR #242. Without this, a future regression that quietly broke the two-slot ring buffer would only show up via downstream perf signals.
2. **`CSSResult._isDynamic` memoization** (`shared.test.ts`) — four tests covering populate-on-first-call (static + dynamic), cache-on-subsequent-call (via sentinel mutation of `values`), and nested-CSSResult propagation. Locks in the PR #242 memo behaviour.
3. **`CSSResult._staticResolved` cache** (`resolve.test.ts`) — four tests covering populate-on-first-resolveValue, cache-hit via sentinel mutation, no-cache for dynamic CSSResults, and fallthrough when `_isDynamic` is unclassified. Locks in the PR #253 static-resolve memoization.

**Why now**

The follow-up audit found these three perf-critical behaviours had no behavioural tests on `main`. The original tests I added in PR #242's correction commit `f4226464` weren't captured in the squash because auto-merge had already snapped its squash body to the prior commits. Without tests, a future regression silently breaks the cache hit/miss path — downstream perf signals are too slow.

No production code changes; tests only.

**Verification**

- 403 styler tests pass (+10 from this PR)
- 2699 monorepo tests pass
- Coverage: lines 99.34%, statements 98.71%, branches 94.46%, functions 98.45% — all above thresholds
- `bun run lint`, `bun run typecheck` clean
