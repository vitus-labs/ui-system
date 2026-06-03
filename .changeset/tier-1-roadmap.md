---
'@vitus-labs/elements': minor
'@vitus-labs/hooks': minor
'@vitus-labs/unistyle': minor
'@vitus-labs/styler': patch
'@vitus-labs/kinetic': patch
---

- `elements`: `Overlay` (modal) auto-traps focus and locks page scroll while open. Focus selector widened to include `contenteditable`, `video[controls]`, `audio[controls]`, `summary`. Hooks inlined — no `@vitus-labs/hooks` peer.
- `hooks`: add `useLocalStorage`, `useEventListener`, `useCopyToClipboard`, `useResizeObserver`.
- `unistyle`: add `between(breakpoints, minKey, maxKey)` for closed-range media queries; dev warning for unknown theme keys; CI-enforced `ITheme` ↔ `propertyMap` parity test.
- `styler`: hash-collision dev warning in `sheet`.
- `kinetic`: fix `Stagger.native` dropping per-child `delay`; `Transition.native` honors `useReducedMotion`.
- `connector-emotion` + `connector-styled-components`: per-connector smoke tests; broken `useCSS` shims removed (now styler-only).
