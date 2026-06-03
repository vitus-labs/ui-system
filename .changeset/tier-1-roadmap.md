---
'@vitus-labs/elements': minor
'@vitus-labs/hooks': minor
'@vitus-labs/unistyle': minor
'@vitus-labs/coolgrid': minor
'@vitus-labs/styler': patch
'@vitus-labs/kinetic': patch
---

Tier-1 roadmap: six shipped enhancements across the stack, all
architected to keep packages independent and recommended-to-compose.
(T1.3 / `recipe()` dropped — rocketstyle's chain API already covers
multi-dimensional state, theme modes, composition, and per-prop attrs
in a way that maps to this library's runtime-resolved, cross-platform
model. A CVA-shaped sugar layer borrows another ecosystem's design
constraints without sharing them, and the chain is the API.)

**T1.1 — Overlay modal a11y (`elements`)**
`Overlay` (when `type="modal"` and active) now wires focus-trap +
scroll-lock into the modal content automatically. The focus selector
covers `contenteditable`, `video[controls]`, `audio[controls]`,
`summary`, etc., and on mount focuses the first tabbable, restoring
focus on unmount. The hooks are inlined directly into elements/Overlay
— no @vitus-labs/hooks coupling.

**T1.2 — Silent-styling failure class closed (`styler`, `unistyle`)**
`styler`'s sheet cache now stores `cssText` so hash collisions are
detected and logged in dev. `unistyle` ships a CI-enforced parity test
between `ITheme` and the runtime `propertyMap`, plus a dev-only warning
when an unknown theme key reaches the styles transformer.

**T1.4 — Per-connector smoke tests (`connector-emotion`,
`connector-styled-components`)**
Each connector now has its own vitest suite verifying the public
surface (css/styled/keyframes/createGlobalStyle/useTheme/Provider). The
earlier `useCSS` shims were dropped — emotion's silently rendered
unstyled because the serialized rule was never inserted, and SC's was
a throw-only stub. `useCSS` is now properly a styler-only hook;
consumers needing engine-swap parity use Emotion's
`<div className={css\`…\`} />` or `styled(...)` patterns directly.

**T1.5 — Four new hooks (`hooks`)**
`useLocalStorage` (SSR-safe, cross-tab sync), `useEventListener`
(ref-captured handler, target-or-window), `useCopyToClipboard` (async
clipboard + `execCommand` fallback + transient flag),
`useResizeObserver` (ref → `DOMRectReadOnly | null`).

**T1.6 — Layout polish (`coolgrid`, `unistyle`)**
`Col` gains `offset`, `order`, and `auto` props (Bootstrap
equivalents). `unistyle` ships `between(breakpoints, minKey, maxKey)`
for closed-range media queries; signature loosened to accept any flat
`Record<string, number | string>` breakpoint map.

**T1.7 — Native kinetic parity (`kinetic`)**
Fixes a long-standing bug where `Stagger.native` computed but never
propagated the per-child `delay` — every child started at t=0.
`Transition.native` now honors `useReducedMotion` (snaps to final +
fires callbacks synchronously when the user prefers reduced motion).
