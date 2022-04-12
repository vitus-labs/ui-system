// --------------------------------------------------------
// extractDefaultBooleanProps
// --------------------------------------------------------
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
      const propName = Object.keys(value)[0]

      return { ...acc, [propName]: true }
    }

    return acc
  }, {})
}
