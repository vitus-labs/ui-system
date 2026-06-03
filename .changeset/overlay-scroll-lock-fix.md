---
'@vitus-labs/elements': patch
'@vitus-labs/kinetic': patch
'@vitus-labs/hooks': patch
'@vitus-labs/coolgrid': patch
---

- `elements/Overlay`: strip `body.overflow` management from `useScrollReposition`. `useScrollLock` is now the sole owner, gated on `isContentLoaded`. Fixes a silent permanent scroll-lock on async-mount modals.
- `elements/Overlay/useOverlay`: remove `prevFocusRef` (set, never read) and its dead effect.
- `kinetic`: `Transition.tsx` honors the `delay` prop (was advertised, ignored on web).
- `hooks`: drop `useFocus` and `useHover` from the native re-exports — they return DOM-only handler names that no RN component fires.
- `coolgrid`: delete `Container/utils.ts:getContainerWidth` — exported but only consumed by its own tests.
