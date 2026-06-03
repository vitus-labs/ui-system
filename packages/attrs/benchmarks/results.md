# `@vitus-labs/attrs` — benchmark baselines

Captured on `main` after PR #279 merged (2026-06-03). Run via `bun run bench` from this package.

Machine: macOS arm64, Bun 1.3.14, jsdom 29.1.1, React 19.

## Render-count diagnostics (verifies memo bails)

| Scenario | Leaf renders | Expected |
|---|---|---|
| mount ×100 | **100** | 100 |
| re-update ×50 (stable props) | **0** | 0 (memo should bail) |
| re-update ×50 (churning props) | **5000** | 5000 (memo cannot bail) |

✅ `memo(EnhancedComponent)` + `useStableValue` (from `attrsHoc`) works: zero downstream renders when parent re-renders with content-equal props.

## Timing (tinybench + flushSync)

| Scenario | avg ms/tick | min ms | p99 ms | ops/sec | samples |
|---|---|---|---|---|---|
| mount-rich ×100 | 1.092 | 0.863 | 2.479 | 946 | 917 |
| mount-lean ×100 (fast path) | **0.916** | 0.734 | 2.290 | 1132 | 1092 |
| reupdate-stable ×50 | **11.039** | 10.169 | 13.378 | 91 | 91 |
| reupdate-churn ×50 | **71.107** | 66.606 | 75.998 | 14 | 64 |

### Measurable wins from PR #279

- **Stable-prop re-update: 6.4× faster** (11.0 ms vs 71.1 ms when memo can't bail).
- **Lean mount: ~16% faster** (0.92 ms vs 1.09 ms) when the component is built without `.attrs()` configured — the `attrsHoc` fast path.

## Caveats

- `flushSync` is mandatory; the default async commit measures enqueue time only.
- The fast-path is the common case: most `attrs()` usage attaches static props via `.attrs({...})` once, which the implementation can short-circuit at HOC-build time. Components with dynamic `.attrs((p) => ...)` callbacks fall on the rich path.
