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
export const calculateChainOptions = (opts = [], ...args) => {
  let result = {}

  opts.forEach((item) => {
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

// --------------------------------------------------------
// get style attributes
// --------------------------------------------------------
export const calculateStyledAttrs = ({
  props,
  dimensions,
  states,
  useBooleans,
}) => {
  const result = {}

  Object.keys(props).forEach((key) => {
    const value = props[key]

    if (useBooleans && typeof value === 'boolean' && value === true) {
      Object.keys(states).forEach((stateKey) => {
        if (
          (Array.isArray(result[stateKey]) || !result[stateKey]) &&
          states[stateKey].includes(key)
        ) {
          const isMultiKey = Array.isArray(dimensions[stateKey])
          const keyName = isMultiKey
            ? dimensions[stateKey][0]
            : dimensions[stateKey]

          if (isMultiKey) result[keyName] = [...(result[keyName] || []), key]
          else result[keyName] = key
        }
      })
    }

    // prop with one of the following key names always has a priority
    const propNames = []

    Object.values(dimensions).forEach((item) => {
      if (Array.isArray(item)) propNames.push(item[0])
      if (typeof item === 'string') propNames.push(item)
    })

    if (propNames.includes(key) && !!value) {
      result[key] = value
    }
  })

  return result
}

// --------------------------------------------------------
// merge themes
// --------------------------------------------------------
export const mergeThemes = (obj, keys) => {
  let result = {}

  Object.keys(obj).forEach((key) => {
    const value = obj[key]

    if (
      Array.isArray(keys) &&
      keys.includes(key) &&
      typeof value === 'object'
    ) {
      result = { ...result, ...value }
    }
  })

  return result
}

// --------------------------------------------------------
// generate theme
// --------------------------------------------------------
const isDimensionMultiKey = (key) =>
  // check if key is an array and if it has `multi` set to true
  // as an argument on index 1
  Array.isArray(key) && key[1].multi === true

// --------------------------------------------------------
// generate theme
// --------------------------------------------------------
export const calculateTheme = ({
  styledAttributes,
  themes,
  config: { dimensions },
}) => {
  // generate final theme which will be passed to styled component
  let finalTheme = themes.base

  Object.keys(themes).forEach((dimensionKey) => {
    const value = dimensions[dimensionKey]
    const isMultiKey = isDimensionMultiKey(value)
    const keyName = isMultiKey ? value[0] : value

    if (keyName) {
      finalTheme = {
        ...finalTheme,
        ...(isMultiKey
          ? mergeThemes(themes[dimensionKey], styledAttributes[dimensionKey])
          : themes[dimensionKey][styledAttributes[keyName] || 'base']),
      }
    }
  })

  return finalTheme
}
