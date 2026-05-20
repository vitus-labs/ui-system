/**
 * Extracts default boolean shorthand props from rocketstyle dimensions.
 * For each single-key dimension, picks the first value key and maps it
 * to `true`, enabling the boolean prop alternative in code snippets.
 * Returns null when useBooleans is disabled.
 */
type ExtractDefaultBooleanProps = (params: {
  dimensions: Record<string, any>
  multiKeys: Record<string, true>
  useBooleans?: boolean
}) => Record<string, any> | null

export const extractDefaultBooleanProps: ExtractDefaultBooleanProps = ({
  dimensions,
  multiKeys,
  useBooleans,
}) => {
  if (!useBooleans) return null

  // Direct mutation — the previous `reduce` rebuilt the accumulator object
  // every iteration (O(n²)). for-in + key assignment is O(n).
  const result: Record<string, true> = {}
  for (const key in dimensions) {
    if (!multiKeys[key]) {
      const value = dimensions[key]
      const propName = Object.keys(value)[0] as string
      result[propName] = true
    }
  }
  return result
}
