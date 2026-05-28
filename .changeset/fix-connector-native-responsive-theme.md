---
'@vitus-labs/connector-native': patch
---

Fix two correctness bugs that broke responsive and themed styling on React Native:

1. **Array interpolations were stringified to garbage.** `unistyle`'s `makeItResponsive` emits an array of per-breakpoint results (`[CSSResult, '', CSSResult, …]`) and feeds it into the engine's `css` as an interpolation. The native `css` resolver had no array branch, so the array fell through to the object path and produced `"0: [object Object]; 1: ; …"` instead of merged styles — i.e. **every responsive (breakpoint-object) prop was broken on native**. Added array flattening (mirrors the web styler's `resolve.ts`), so entries resolve and cascade correctly with later breakpoints overriding earlier ones.

2. **The context theme was never injected.** The native `styled` component resolved templates with the raw props only — it never called `useTheme()`, so `${(p) => p.theme.x}` interpolations resolved to `undefined`, and `makeItResponsive` (which reads `props.theme`) saw an empty theme. Now `styled` injects the context theme into the resolve props (mirroring the web styler), without forwarding `theme` to the underlying RN component. A consumer-passed `theme` prop still takes precedence.

Both paths are now covered by tests, including an end-to-end responsive pipeline test (`createMediaQueries` → array → `css`) verifying the mobile-first breakpoint cascade.
