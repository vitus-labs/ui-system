---
"@vitus-labs/styler": patch
---

Fix stylesheet insertion: global CSS is split at top-level `;` so `@import`/`@charset` no longer break `insertRule` (and are inserted first), and boosted vs. unboosted identical CSS now get distinct class names so the boosted rule is actually inserted. Dynamic styled components without a `ThemeProvider` now receive an empty `theme` object instead of `undefined`.
