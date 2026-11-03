---
"@vitus-labs/unistyle": patch
"@vitus-labs/coolgrid": patch
---

**unistyle** — responsive pipeline fixes from the 2026-11 audit:

- `makeItResponsive` no longer resolves CSS results with empty props when breakpoints exist. Styles whose CSS contains a function interpolation (`extendCss` callbacks, `colCss` / `rowCss`, Element `css` callbacks reading `props.theme`) now take the unoptimized path and resolve with real render-time props instead of silently rendering the wrong value or dropping the line.
- A `css\`…\`` result (or any non-plain object) used as a theme value is no longer mistaken for a breakpoint map and dropped.
- The output cache is scoped per `styles` function and `normalize` flag: two components sharing one theme object no longer share output.
- **Behaviour change:** responsive arrays with holes now inherit the previous breakpoint, as the README documents: `[12, null, 15]` gives `sm: 12` (was `sm: 15`), and a leading hole (`[null, 4]`) leaves `xs` unset (was `4`).
- `createMediaQueries` defaults `rootSize` to 16 (a missing `rootSize` produced `NaNem`).
- The breakpoint delta optimizer re-emits declarations reset by related properties at an intermediate breakpoint (`border-top` / `border-color`, `border-width` / `border-top`, `grid-area` / `grid-row`, logical / physical sides such as `margin-inline-start` / `margin-left`), and ignores `/* … */` comments.
- Faster responsive cache misses: family-indexed delta invalidation, key-indexed `styles()` descriptor lookup, and a bounded content-keyed cache for fresh plain-data theme objects.

**coolgrid** — `Col` clamps `size` to `columns`, so `size > columns` no longer produces a width over 100%.
