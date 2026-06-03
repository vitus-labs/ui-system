---
'@vitus-labs/rocketstyle': patch
'@vitus-labs/attrs': patch
---

Performance pass on `@vitus-labs/rocketstyle` and `@vitus-labs/attrs`:

- `attrs` and `rocketstyle`: wrap the innermost `EnhancedComponent` in `memo()`. attrs' `attrsHoc` already stabilizes its output via `useStableValue` + `useMemo`; rocketstyle's `rocketstyleAttrsHoc` now follows the same pattern. With both, a content-equal parent re-render bails at the memo boundary instead of walking the HOC stack.
- `rocketstyleAttrsHoc`: brought to parity with `attrsHoc` (PR #170 pattern). Adds `useStableValue` + `useMemo` + a fast path for "no `.attrs()` configured" — the common case for rocketstyle components built with `.theme()`/dimensions only, which previously rebuilt every prop merge on every render.
- `usePseudoState`: handlers ref-captured. Consumers passing inline `onMouseEnter`/`onMouseLeave`/etc (the common React idiom) no longer churn the wrapped handler identities every render, so downstream memoization actually takes effect on interactive components.
- `useTheme`: drop the pointless `useMemo` wrapping `{ theme, mode, isDark, isLight }`. All call sites destructure the primitives; the memo bookkeeping cost more than the recomputation.
- `useRef` hooks (both packages): add empty `[]` deps to `useImperativeHandle` so the getter isn't re-registered every render.
- `chainOrOptions` + `chainReservedKeyOptions` (rocketstyle): replace `reduce-with-spread-accumulator` (O(K²)) with single-pass mutation (O(K)).
- `validateInit` (rocketstyle): replace nested `.some()` with module-level `Set` lookup (O(R + D) instead of O(R × D)).
- `calculateChainOptions` (both): drop the dead `const result = {}` allocation in the early-return path.

Dead code removed:

- `rocketstyle/constants/booleanTags.ts`: 33-line constant array imported by nothing in production. Only its own test referenced it.
- `rocketstyle/utils/theme.ts`: orphan `calculateChainOptions` (a 2-arg variant unused outside its own test; the live impl lives in `utils/attrs.ts`).
- `rocketstyle.tsx`: duplicate `IS_ROCKETSTYLE` + `displayName` assignment block.
