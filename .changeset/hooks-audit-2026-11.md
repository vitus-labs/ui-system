---
'@vitus-labs/hooks': patch
---

Fix SSR hydration mismatches and several smaller hook bugs.

- **SSR hydration:** `useMediaQuery`, `useBreakpoint` and `useLocalStorage` (and so `useColorScheme` / `useReducedMotion`) no longer read browser state in a `useState` initializer, which made React throw "Hydration failed" whenever the client's value differed from the server's. They now use `useSyncExternalStore` with a server snapshot (`false` / the smallest breakpoint / `initialValue`). While hydrating they render the server value, then re-render with the real value straight after. Client-only renders still get the real value on the first render.
- `useBreakpoint` now shares one rAF-throttled `resize` listener across all hook instances, instead of adding one listener per instance.
- `useLocalStorage` keeps all instances that use the same key in sync within the same tab, including values that could not be persisted because of private mode or a full storage quota.
- `useFocusTrap`: focus can no longer escape. With no focusable children, Tab is always blocked. When focus is on the container itself (or anywhere outside the list), Tab moves to the first element and Shift+Tab to the last.
- `useBreakpoint` (React Native) re-computes the active breakpoint when the theme's breakpoints change.
- `useEventListener` no longer removes and re-adds its listener on every render when `options` is passed as an inline object.
