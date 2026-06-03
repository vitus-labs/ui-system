/**
 * Build a closed-range `@media` query string from two breakpoint values.
 *
 * Accepts any flat breakpoint map (`Record<string, number | string>`).
 * Numeric values render as `${n}px`, string values pass through as-is
 * so consumers can use rem/em units (`'36em'` → as-is). The upper
 * bound is decremented by `0.02px` so adjacent ranges don't overlap on
 * Safari's sub-pixel matching.
 *
 * @example
 * ```ts
 * const onlyMobile = between({ xs: 0, sm: 576 }, 'xs', 'sm')
 * // → '@media (min-width: 0px) and (max-width: 575.98px)'
 * ```
 */
export const between = <B extends Record<string, number | string>>(
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
