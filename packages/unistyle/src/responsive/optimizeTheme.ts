export type OptimizeTheme = ({
  theme,
  breakpoints,
}: {
  theme: Record<string, Record<string, unknown>>
  breakpoints: string[]
}) => Record<string, Record<string, unknown>>

/**
 * Removes breakpoints whose styles are identical to the previous one.
 * This avoids generating duplicate `@media` blocks.
 * The smallest breakpoint is always kept.
 */
const optimizeTheme: OptimizeTheme = ({ theme, breakpoints }) =>
  breakpoints.reduce((acc, key, i) => {
    if (i === 0) return { ...acc, [key]: theme[key] }

    const previousBreakpoint = breakpoints[i - 1]!
    const previousValue = theme[previousBreakpoint]
    const currentValue = theme[key]

    if (JSON.stringify(previousValue) !== JSON.stringify(currentValue)) {
      return { ...acc, [key]: theme[key] }
    }

    return acc
  }, {})

export default optimizeTheme
