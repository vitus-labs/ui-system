import { isEmpty } from '@vitus-labs/core'

// --------------------------------------------------------
// pick styled props
// --------------------------------------------------------
type PickStyledProps = (
  props: Record<string, unknown>,
  keywords: Record<string, true>
) => Partial<typeof props>
export const pickStyledProps: PickStyledProps = (props, keywords) => {
  const result = {}

  Object.entries(props).forEach(([key, value]) => {
    if (keywords[key]) result[key] = value
  })

  return result
}

// --------------------------------------------------------
// combine values
// --------------------------------------------------------
type OptionFunc<A> = (...arg: Array<A>) => Record<string, unknown>
type CalculateChainOptions = <A>(
  options: Array<OptionFunc<A>> | undefined | null
) => (args: Array<A>) => ReturnType<OptionFunc<A>>

export const calculateChainOptions: CalculateChainOptions = (options) => (
  args
) => {
  const result = {}
  if (isEmpty(options)) return result

  return options.reduce(
    (acc, item) => Object.assign(acc, item(...args)),
    result
  )
}

// --------------------------------------------------------
// get style attributes
// --------------------------------------------------------
export const calculateStylingAttrs = ({ useBooleans, multiKeys }) => ({
  props,
  dimensions,
}) => {
  const result = {}

  // (1) find dimension keys values & initialize
  // object with possible options
  Object.keys(dimensions).forEach((item) => {
    const pickedProp = props[item]
    const valueTypes = ['number', 'string']

    // if the property is mutli key, allow assign array as well
    if (multiKeys[item] && Array.isArray(pickedProp)) {
      result[item] = pickedProp
    }
    // assign when it's only a string or number otherwise it's considered
    // as invalid param
    else if (valueTypes.includes(typeof pickedProp)) {
      result[item] = pickedProp
    } else {
      result[item] = undefined
    }
  })

  // (2) if booleans are being used let's find the rest
  if (useBooleans) {
    const propsKeys = Object.keys(props).reverse()

    Object.entries(result).forEach(([key, value]) => {
      const isMultiKey = multiKeys[key]

      // when value in result is not assigned yet
      if (!value) {
        let newDimensionValue
        const keywords = Object.keys(dimensions[key])

        if (isMultiKey) {
          newDimensionValue = propsKeys.filter((key) => keywords.includes(key))
        } else {
          // reverse props to guarantee the last one will have
          // a priority over previous ones
          newDimensionValue = propsKeys.find((key) => {
            if (keywords.includes(key) && props[key]) return key
            return false
          })
        }

        result[key] = newDimensionValue
      }
    })
  }

  return result
}
