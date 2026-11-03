---
"@vitus-labs/styler": patch
---

`createGlobalStyle` rules are now mount-scoped and ref-counted: a dynamic global that changes value (A → B → A) replaces its previous rules instead of leaving the stale ones in effect, and rules are removed when the last instance unmounts (styled-components parity). Dynamic globals no longer hash the whole stylesheet on every client render.
