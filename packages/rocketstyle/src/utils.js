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
// calculate styles
// --------------------------------------------------------
export const calculateStyles = ({ component, styles, config: { styled, css } }) => {
  let result = component

  styles.forEach(item => {
    const styles = item(css)

    // needs some investigation why styles[0] breaks everything if not filtered
    if (Array.isArray(styles) && typeof styles[0] !== 'function') {
      result = styled(result)`
        ${styles}
      `
    }
  })

  return result
}

// --------------------------------------------------------
// combine values
// --------------------------------------------------------
export const calculateValues = (opts = [], ...args) => {
  let result = {}

  opts.forEach(item => {
    result = Object.assign({}, result, item(...args))
  })

  return result
}

// --------------------------------------------------------
// get style attributes
// --------------------------------------------------------
export const calculateStyledAttrs = ({
  props, dimensions, states, useBooleans,
}) => {
  const result = {}

  Object.keys(props).forEach(key => {
    const value = props[key]

    if (useBooleans && typeof value === 'boolean' && value === true) {
      Object.keys(states).forEach(stateKey => {
        if (
          (Array.isArray(result[stateKey]) || !result[stateKey])
          && states[stateKey].includes(key)
        ) {
          const isMultiKey = Array.isArray(dimensions[stateKey])
          const keyName = isMultiKey ? dimensions[stateKey][0] : dimensions[stateKey]

          if (isMultiKey) result[keyName] = [...(result[keyName] || []), key]
          else result[keyName] = key
        }
      })
    }

    // prop with one of the following key names always has a priority
    // TODO: fix multiple support when array
    const propNames = Object.values(dimensions)
    if (propNames.includes(key)) {
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

  Object.keys(obj).forEach(key => {
    const value = obj[key]

    if (Array.isArray(keys) && keys.includes(key)) {
      const helper = Object.assign({}, result)
      result = { ...helper, ...(typeof value === 'object' ? value : {}) }
    }
  })

  return result
}

// --------------------------------------------------------
// generate theme
// --------------------------------------------------------
export const calculateTheme = ({
  styledAttributes,
  themes,
  config,
}) => {
  // generate final theme which will be passed to styled component
  let finalTheme = themes.base

  Object.keys(themes).forEach(dimensionKey => {
    const isMultiKey = config.isDimensionMultiKey(dimensionKey)
    const keyName = isMultiKey
      ? config.dimensions[dimensionKey][0]
      : config.dimensions[dimensionKey]

    if (keyName) {
      if (isMultiKey) {
        finalTheme = Object.assign(
          {},
          finalTheme,
          mergeThemes(themes[dimensionKey], styledAttributes[dimensionKey]),
        )
      } else {
        finalTheme = Object.assign(
          {},
          finalTheme,
          themes[dimensionKey][styledAttributes[keyName] || 'base'],
        )
      }
    }
  })

  return finalTheme
}
