/* eslint-disable @typescript-eslint/no-explicit-any */
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

// eslint-disable-next-line import/prefer-default-export
export const extractDefaultBooleanProps: ExtractDefaultBooleanProps = ({
  dimensions,
  multiKeys,
}) =>
  Object.entries(dimensions).reduce((acc, [key, value]) => {
    if (!multiKeys[key]) {
      const propName = Object.keys(value)[0]

      return { ...acc, [propName]: true }
    }

    return acc
  }, {})
