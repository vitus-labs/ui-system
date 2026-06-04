---
'@vitus-labs/core': patch
---

Fix `Maximum call stack size exceeded` in `isEqual` when comparing objects that contain self-references or mutual references.

Reproduced in the wild as a consumer-app crash:

```
Uncaught RangeError: Maximum call stack size exceeded
    at isObjectEqual (index.js:156:23)
    at isEqual (index.js:170:9)
    at isObjectEqual …
```

The recursion path is `isEqual → isObjectEqual → isEqual → …` with no termination. Root cause: `isEqual`'s docstring acknowledged it did not handle circular references, but `useStableValue` calls it on whatever props consumers pass — including props that may include React internals (fiber owners, refs), context-shaped objects with back-references, or any other graph that happens to cycle. Stack overflow.

Fixed by threading a `WeakMap<object, object>` of "currently comparing" pairs through the recursion. When the same `(a, b)` pair is re-entered, the cycle returns `true` — the structural walk will still return `false` at any genuinely-differing leaf, so deep equality stays correct. Non-cyclic data is unaffected.

Regression test coverage added:
- Self-referential objects (`a.self = a`)
- Mutually-referential object pairs (`a.other = b; b.other = a`)
- Cyclic structures with a genuine difference (still returns false)
- Self-referential arrays
