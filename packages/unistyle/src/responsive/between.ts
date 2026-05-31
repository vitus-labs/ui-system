import type { Breakpoints } from './breakpoints'

/**
 * Build a closed-range `@media` query string from two breakpoint values.
 *
 * The default `createMediaQueries` only emits `(min-width: N)` rules
 * (mobile-first). For the "this style applies ONLY between sm and md"
 * pattern that grid layouts and visibility utilities commonly need,
 * `between()` returns the matching query string. Use it inside a `css`
 * template literal or with the engine's `extendCss` helper.
 *
 * Compatible with both numeric breakpoints (`576` → `576px`) and string
 * (`'36em'` → as-is). The upper bound is decremented by `0.02px` so
 * adjacent ranges don't overlap on Safari's sub-pixel matching.
 *
 * @example
 * ```ts
 * const onlyMobile = between(breakpoints, 'xs', 'sm')
 * // → '@media (min-width: 0px) and (max-width: 575.98px)'
 *
 * css`
 *   ${onlyMobile} { display: none; }
 * `
 * ```
 */
export const between = <B extends Breakpoints>(
  breakpoints: B,
  minKey: keyof B,
  maxKey: keyof B,
): string => {
  const min = breakpoints[minKey]
  const max = breakpoints[maxKey]
  const minStr = typeof min === 'number' ? `${min}px` : String(min)
  // Decrement the max by 0.02 to avoid overlap with the next breakpoint's
  // min on sub-pixel-rendering browsers (Safari rounds at .5 boundaries).
  const maxStr =
    typeof max === 'number' ? `${Math.max(0, max - 0.02)}px` : String(max)
  return `@media (min-width: ${minStr}) and (max-width: ${maxStr})`
}

export default between
