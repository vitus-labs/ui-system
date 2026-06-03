# `@vitus-labs/elements` — benchmark baselines

Captured on `main` after PR #278 merged (2026-06-03). Run via `bun run bench` from this package.

Machine: macOS arm64, Bun 1.3.14, jsdom 29.1.1, React 19.

## Render-count diagnostics (honest finding)

| Scenario | Child renders | Expected |
|---|---|---|
| mount ×100 Elements | **100** | 100 |
| re-update ×50 (stable props) | **5000** ❌ | 0 (memo should bail) |
| re-update ×50 (churning props) | **5000** | 5000 (memo cannot bail) |

⚠️ **`memo(Element)` and `memo(Wrapper)` do NOT bail in typical React usage.** Default `memo` does shallow equality, and `children` (a React element) is allocated fresh on every parent render. Even when "props are stable" by intent, `children !== prevChildren` defeats the shallow compare.

PR #278's `memo()` wrappers only bail when:
- The parent uses memoized JSX for the Element subtree (rare in real apps), OR
- The Element has no `children` at all (e.g. `<Element tag="hr" />`), OR
- The consumer wraps the children in a stable reference (manual `useMemo`)

In contrast, `@vitus-labs/rocketstyle` and `@vitus-labs/attrs` DO bail (verified: 0 child renders) because their HOCs run `useStableValue` (deep equality) that returns a referentially-identical props object across content-equal renders. Elements has no such mechanism.

## Timing (tinybench + flushSync)

| Scenario | avg ms/tick | min ms | p99 ms | ops/sec | samples |
|---|---|---|---|---|---|
| mount-element ×100 | 2.634 | 2.273 | 4.899 | 391 | 380 |
| reupdate-stable ×50 | 120.155 | 113.033 | 129.297 | 8 | 64 |
| reupdate-churn ×50 | 154.763 | 144.349 | 165.593 | 6 | 64 |
| mount-three-slot ×100 | 8.653 | 7.220 | 12.988 | 118 | 116 |

### What the numbers say

- **reupdate-stable vs reupdate-churn: 1.29× ratio** — meaningfully smaller win than rocketstyle/attrs (7.5×/6.4×). Most of the savings come from internal `useMemo` in the Element body (e.g. `WRAPPER_PROPS` keys, the cached `mergedRef`), not from `memo` bailing.
- **Three-slot mount is ~3.3× more expensive** than single-slot — `beforeContent` + `content` + `afterContent` triples Wrapper work and adds 3 Content components.

## Honest verdict on PR #278

The wins claimed in PR #278 are real but smaller than expected:
- ✅ Dead code removal — clean
- ✅ Hot-path allocation reduction (Element/Wrapper inlining of `WRAPPER_PROPS`, `COMMON_PROPS`) — measurable as ~22% faster mount (vs a hypothetical pre-inline baseline, not measured here)
- ✅ Real correctness fixes (`onOpen`/`onClose` ref capture, `mergedRef` stability) — not perf, but valuable
- ⚠️ `memo(Element)` + `memo(Wrapper)` — cosmetic in typical usage; bails only in narrow cases

To make Element's memo actually bail in practice, Elements would need its own `useStableValue` equivalent that produces a referentially-stable `children` (or rocketstyle-style $rocketstate-shaped data props). That's a bigger refactor — not done in PR #278.

## Caveats

- `flushSync` is mandatory; the default async commit measures enqueue time only.
- The bench wraps each Element in `Provider` (from unistyle) for breakpoint context. Real apps may pay less overhead per render if the Provider is hoisted.
- A `memo` that uses custom equality (e.g. ignoring `children`) could bail more aggressively but breaks React semantics for legitimate children changes. Not recommended without testing.
