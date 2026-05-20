---
'@vitus-labs/attrs': patch
---

`removeUndefinedProps`: switch from `Object.keys(props).reduce(...)` to a direct `for...in` loop.

**Why**

The function fires on every content-equal re-render via `attrsHoc`'s `useMemo` body. The prior `reduce` over `Object.keys(props)` allocated an intermediate keys array per call. The for-in loop iterates the same own enumerable keys (React props are always plain objects) without the array allocation.

**Verification**

- 83 attrs tests pass (existing suite exhaustively covers `removeUndefinedProps`: undefined-stripping, null/false/0/'' preservation, all-undefined, empty-object edge cases)
- 2688 monorepo tests pass
- `bun run lint`, `bun run typecheck` clean

**Honest framing**

Structural cleanup, **not a measurable headline perf win**. No microbench in-tree for attrs, so no claimed delta. The win is one fewer array allocation per `attrsHoc` render — it compounds across deep attrs-wrapped trees but is below single-component noise.
