// --------------------------------------------------------
// extractDefaultBooleanProps
// --------------------------------------------------------
type ExtractDefaultBooleanProps = ({
  dimensions,
  multiKeys,
}: {
  dimensions: Record<string, any>
  multiKeys: Record<string, true>
}) => Record<string, any>

export const extractDefaultBooleanProps: ExtractDefaultBooleanProps = ({
  dimensions,
  multiKeys,
}) =>
  Object.entries(dimensions).reduce((acc, [key, value], i) => {
    if (!multiKeys[key]) {
      const propName = Object.keys(value)[0]

      return { ...acc, [propName]: true }
    }

    return acc
  }, {})
