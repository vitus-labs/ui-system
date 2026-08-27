---
'@vitus-labs/elements': patch
---

Drop a redundant `useMemo` in Element's axis resolution.

The memo returned `{ wrapperDirection, wrapperAlignX, wrapperAlignY }`, which
is destructured immediately into three primitives passed straight to Wrapper —
nothing downstream depends on the object's identity. Memoizing therefore cost a
7-element dependency array plus 7 comparisons per render to avoid three
branches. The logic moves to a pure `resolveWrapperAxes()` in `utils.ts`.

Behaviour is identical (`if (x) v = x` is `x || v` for these inputs). This is a
simplification, not a measured speed-up: see the PR for why the local harness
cannot resolve a change this size.
