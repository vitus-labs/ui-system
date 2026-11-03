---
"@vitus-labs/core": patch
---

Components and `css` created through `config` before `init()` (the default with ESM import hoisting) now expose `_sel`/`_styler` so they work as `${Comp}` selectors and can be extended, render without an extra component layer once resolved, and memoize the `css` thunk so a pre-init static template stays static.
