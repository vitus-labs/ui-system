---
'@vitus-labs/core': patch
'@vitus-labs/rocketstyle': patch
'@vitus-labs/rocketstories': patch
---

Correctness fixes: `isEqual` compares non-plain objects (Date/Map/Set/class instances) by reference instead of reporting distinct instances equal; rocketstyle `.theme()` keeps arrays and non-plain values intact and `.config({ inversed: false })` can now override `true`; rocketstories no longer re-prepends the prefix when chaining and `.config({ name })` takes effect.
