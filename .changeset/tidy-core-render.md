---
"@vitus-labs/core": patch
---

`render(0)` now renders `0` instead of nothing, and `init()` clears optional engine members (`keyframes`, `createGlobalStyle`, `useTheme`) that a newly supplied engine does not provide.
