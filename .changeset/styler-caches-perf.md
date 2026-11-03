---
"@vitus-labs/styler": patch
---

Sheet eviction now only trims the cssText lookup caches and never the set of rules already in the DOM (it re-inserted live rules — duplicates and cascade reorder); production stores a marker instead of the cssText. `getClassName` → `insert` share the miss-path hash, and static `css` snippets reached through a function interpolation are memoized from their second use.
