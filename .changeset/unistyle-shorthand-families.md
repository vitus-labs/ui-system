---
"@vitus-labs/unistyle": patch
---

Responsive breakpoint optimizer: shorthands whose longhands don't share their name prefix (`border-radius` ↔ `border-top-left-radius`, `inset` ↔ `top`, `margin-inline` ↔ `margin-left`, `place-items` ↔ `align-items`, `gap` ↔ `row-gap`, `grid-area` ↔ `grid-row-start`, `font` ↔ `line-height`, …) now invalidate each other, so a declaration repeated after its shorthand reset it is no longer dropped.
