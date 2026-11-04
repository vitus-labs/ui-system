---
"@vitus-labs/styler": minor
---

`styled(StyledComponent)` now folds into a single component at creation time (styled-components v6 semantics): the base template is followed by the extension in one rule, so the extension deterministically wins, `$`-transient props reach the base interpolations, and `${Base}` selectors still match extensions. `styled(NonStyledComponent)` and wrappers that hoist statics are unchanged. Dynamic styled components no longer forward the injected context `theme` to custom component targets (matches the static path).

Released as a minor because both changes can alter existing output: an extension that relied on the base winning a specificity tie now loses to the extension, and a custom component that read the injected `theme` prop should call `useTheme()` instead (an explicitly passed `theme` prop is still forwarded).
