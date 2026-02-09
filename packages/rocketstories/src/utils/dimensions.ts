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

// eslint-disable-next-line import/prefer-default-export
export const extractDefaultBooleanProps: ExtractDefaultBooleanProps = ({
  dimensions,
  multiKeys,
  useBooleans,
}) => {
  if (!useBooleans) return null

  return Object.entries(dimensions).reduce((acc, [key, value]) => {
    if (!multiKeys[key]) {
      const propName = Object.keys(value)[0] as string

      return { ...acc, [propName]: true }
    }

    return acc
  }, {})
}
