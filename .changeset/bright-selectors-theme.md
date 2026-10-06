---
"@vitus-labs/styler": minor
---

Add component selectors for static styled components (`${Button} { ... }` resolves to its class; dynamic components throw a clear error) and function themes: `<ThemeProvider theme={outer => ({ ...outer, x })}>`.
