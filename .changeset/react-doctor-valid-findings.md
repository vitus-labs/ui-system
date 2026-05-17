---
'@vitus-labs/kinetic': patch
---

Perf + correctness micro-fixes from a `react-doctor` triage (valid findings only; tool false-positives documented, not actioned):

- `nativeParsers`: hoist `easingNames` to a module-level `Set` — was an O(n) `.includes()` re-allocating a 5-element array per parsed transition token. Dropped a provably-dead `type &&` guard (the regex group `(\w+)` guarantees a non-empty match).
- `nativeAnimations`: replace the O(n·m) `.find()`-in-loop with a pre-built type→value `Map`. `.find()`-first semantics are preserved exactly (the Map is built skip-if-present, so a repeated transform type keeps its FIRST value, not last).

Behaviour is unchanged. New `nativeAnimations.test.ts` (20 cases) pins the transform-merge parity, identity fallbacks, the non-transform style path, `getPrimaryTransition`, and `mergeStyles` — net coverage rises.
