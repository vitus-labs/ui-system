---
"@vitus-labs/styler": patch
---

`styled(StyledComponent)` now folds into a single component at creation time (styled-components v6 semantics): the base template is followed by the extension in one rule, so the extension deterministically wins, `$`-transient props reach the base interpolations, and `${Base}` selectors still match extensions. `styled(NonStyledComponent)` and wrappers that hoist statics are unchanged. Dynamic styled components no longer forward the injected context `theme` to custom component targets (matches the static path).
