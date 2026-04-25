export type SortBreakpoints = <T extends Record<string, number>>(
  breakpoints: T,
) => (keyof T)[]

/** Sorts breakpoint keys by their pixel value (ascending, mobile-first). */
const sortBreakpoints: SortBreakpoints = (breakpoints) => {
  const result = Object.keys(breakpoints).sort(
    // biome-ignore lint/style/noNonNullAssertion: keys come from Object.keys(breakpoints), so breakpoints[a]/breakpoints[b] are guaranteed defined
    (a, b) => breakpoints[a]! - breakpoints[b]!,
  )

  return result
}

export default sortBreakpoints
