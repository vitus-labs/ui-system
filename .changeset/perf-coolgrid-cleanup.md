---
'@vitus-labs/coolgrid': patch
---

Two small structural cleanups in `useContext.tsx`. No public API or behavioural changes.

**Changes**

1. **Drop the `pickThemeProps` wrapper.** It was a one-line indirection around `pick(props, keywords)` used at a single call site. Inlined the `pick` call and removed the unused `PickThemeProps` exported type (no external consumers — `useContext.tsx` is not re-exported from `index.ts`).
2. **`getGridContext`: direct property access on `props` for top-level keys.** Callers always pass a plain object (a `pick()` result or a user-supplied literal), so `(props as Obj).columns` is equivalent to `get(props, 'columns')` but skips `get`'s path-parsing + safety-guard loop. The nested theme lookups (`'grid.columns'` / `'coolgrid.columns'`) still go through `get` because they have real nested paths.

**Verification**

- 77 coolgrid tests pass (no new tests — the existing suite covers `getGridContext`, `useGridContext`, and the Container/Row/Col consumer paths)
- 2688 monorepo tests pass
- `bun run lint`, `bun run typecheck` clean

**Honest framing**

Structural cleanup, not a measurable headline perf win. Two `get` calls saved per `getGridContext` invocation (which fires once per Container/Row/Col render), plus one less function call per `useGridContext`. No microbench in-tree, so no claimed delta — the wins are theoretical and compound across deep grid trees but are not visible at single-component granularity.
