---
"@vitus-labs/styler": patch
"@vitus-labs/core": patch
---

- styler: without a `ThemeProvider`, interpolations still receive an empty `theme`, but `theme={}` is no longer forwarded to wrapped components.
- styler: `on*` props are forwarded to DOM elements only when they are functions.
- styler: a stray top-level `;` in global CSS is no longer inserted as a (throwing) rule.
- core: `init()` only resets optional engine members (`keyframes`, `createGlobalStyle`, `useTheme`) when a full engine (`css` + `styled`) is supplied, so partial `init()` calls keep them.
