---
'@vitus-labs/connector-native': patch
---

Fundamentally fix the two remaining React Native styling gaps:

1. **Multi-value box shorthands now expand correctly.** `padding: 8px 16px`, `margin: 0 auto`, `border-radius: 4px 8px 12px 16px`, etc. previously parsed to just their first token (`padding: 8`), because React Native has no multi-value shorthand. They now expand into RN longhands following the CSS box-model value rules: edge shorthands (`margin`/`padding`/`inset`/`border-width`) → `*Top/*Right/*Bottom/*Left`, `border-radius` → per-corner radii, and `gap: row col` → `rowGap`/`columnGap`. Single values are unchanged (RN supports them); `calc()` and elliptical (`/`) radii are left untouched.

2. **Responsive breakpoints are now reactive to rotation / resize.** `createMediaQueries` deferred its `Dimensions.get('window').width` check from breakpoint-call time to `resolve()` time, so the current width is read on every resolve instead of being baked into upstream caches (e.g. `makeItResponsive`'s per-theme cache). The native `styled` component subscribes to `useWindowDimensions()` so a rotation/resize re-renders and re-resolves — matching how the browser re-evaluates `@media`. Previously a responsive component kept its first-render breakpoint until something else forced a re-render.
