---
'@vitus-labs/connector-native': patch
---

Fix several `css` / `parseCSS` correctness bugs in the native connector.

- A nested `css` result with its own dynamic interpolations is now treated as dynamic (previously resolved once with empty props, yielding e.g. `{ width: "px color:red" }`). Breakpoint results from `createMediaQueries` also register as dynamic.
- `parseCSS` strips `/* */` comments and `//` line comments (at declaration start), and splits declarations on `;` only outside parentheses and quotes (`url(data:…;base64,…)`, `content: ";"`).
- `font-weight` stays a string (`'700'`), as React Native requires.
- `rem`/`em` values and unitless `line-height` are intentionally not converted (documented); use `px`.
