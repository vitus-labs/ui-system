// --------------------------------------------------------
// chain options
// --------------------------------------------------------
export const chainOptions = (opts, defaultOpts = []) => {
  const result = [...defaultOpts]

  if (typeof opts === 'function') result.push(opts)
  else if (typeof opts === 'object') result.push(() => opts)

  return result
}

// --------------------------------------------------------
// combine values
// --------------------------------------------------------
type OptionFunc<A> = (...arg: Array<A>) => Record<string, unknown>
type CalculateChainOptions = <A>(
  options: Array<OptionFunc<A>>,
  ...args: Array<A>
) => ReturnType<OptionFunc<A>>

export const calculateChainOptions: CalculateChainOptions = (
  options,
  ...args
) => {
  let result = {}

  options.forEach((item) => {
    result = { ...result, ...item(...args) }
  })

  return result
}

// --------------------------------------------------------
// calculate styles
// --------------------------------------------------------
export const calculateStyles = (styles, css) => {
  if (!styles) return null

  return styles.map((item) => item(css))
}

export const isInDimensions = (key, dimensions) => {
  const hasKey = () => {
    Object.values(dimensions).some((value) => value[key])
  }

  if (dimensions[key] || hasKey()) return true
}

export const splitProps = (props, dimensions) => {
  const styleProps = {}
  const otherProps = {}

  Object.entries(props).forEach(([key, value]) => {
    if (isInDimensions(key, dimensions)) styleProps[key] = value
    else otherProps[key] = value
  })

  return { styleProps, otherProps }
}

// --------------------------------------------------------
// get style attributes
// --------------------------------------------------------
export const calculateStyledAttrs = ({
  props,
  dimensions,
  useBooleans,
  multiKeys,
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
    } else {
      // assign when it's only a string or number otherwise it's considered
      // as invalid param
      result[item] = valueTypes.includes(typeof pickedProp)
        ? pickedProp
        : undefined
    }
  })

  // (2) if booleans are being used let's find the rest
  if (useBooleans) {
    Object.entries(result).forEach(([key, value]) => {
      const isMultiKey = multiKeys[key]

      // when value in result is not assigned yet
      if (!value) {
        let newDimensionValue
        const keywords = Object.keys(dimensions[key])
        const propsKeys = Object.keys(props)

        if (isMultiKey) {
          newDimensionValue = propsKeys.filter((key) => keywords.includes(key))
        } else {
          // reverse props to guarantee the last one will have
          // a priority over previous ones
          newDimensionValue = propsKeys.reverse().find((key) => {
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

// --------------------------------------------------------
// generate theme
// --------------------------------------------------------
type CalculateTheme = <
  P extends Record<string, string>,
  T extends Record<string, string>,
  B extends Record<string, string | number | object>
>({
  props,
  themes,
  baseTheme,
}: {
  props: P
  themes: T
  baseTheme: B
}) => B & Record<string, string | number | object>

export const calculateTheme: CalculateTheme = ({
  props,
  themes,
  baseTheme,
}) => {
  // generate final theme which will be passed to styled component
  let finalTheme = { ...baseTheme }

  Object.entries(props).forEach(
    ([key, value]: [string, string | Array<string>]) => {
      const keyTheme = themes[key]

      if (Array.isArray(value)) {
        value.forEach((item) => {
          finalTheme = {
            ...finalTheme,
            ...keyTheme[item],
          }
        })
      } else {
        finalTheme = {
          ...finalTheme,
          ...keyTheme[value],
        }
      }
    }
  )

  return finalTheme
}
