---
'@vitus-labs/hooks': patch
---

Fix hook correctness issues: `useIntersection` no longer loops with inline threshold arrays (and uses the last batched entry); `useFocusTrap` tracks focusability attribute changes; `useResizeObserver`, `useEventListener` and `useFocusTrap` handle refs whose element mounts later; `useMergedRef` honours React 19 ref cleanups; `useCopyToClipboard` falls back to `execCommand` when `writeText` rejects; `useClickOutside` fires once per tap (pointerdown + composedPath); `useBreakpoint` re-syncs after subscribing; `useLocalStorage` keeps stable callbacks and re-reads on key change; `useElementSize` uses the border box consistently; `useMediaQuery` guards a missing `matchMedia`.
