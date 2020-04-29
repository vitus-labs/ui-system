import { set, get, pick } from '@vitus-labs/core'

// ------------------------------------------
// pickTheme props
// ------------------------------------------
const pickThemeProps = (props, keywords) => {
  const result = {}

  keywords.forEach((item) => {
    const value = props[item]
    if (value || typeof value === 'number') result[item] = value
  })

  return result
}

// ------------------------------------------
// calculate theme
// ------------------------------------------
const calculateTheme = ({ breakpoints, keywords, props }) => {
  const theme = {}

  keywords.forEach((item) => {
    const propItem = props[item]

    if (propItem === undefined || propItem === null) return

    // if it is a prop key as a breakpoint (like xs, sm,...)
    if (breakpoints.includes(item)) {
      if (typeof item === 'object') {
        Object.keys(item).forEach((child) => {
          set(theme, [child, propItem], item[child])
        })
      } else {
        set(theme, ['size', item], propItem)
      }
    } else if (Array.isArray(propItem)) {
      propItem.forEach((value, i) => {
        set(theme, [item, breakpoints[i]], value)
      })
    } else if (typeof propItem === 'object') {
      Object.keys(propItem).forEach((child) => {
        set(theme, [item, child], propItem[child])
      })
    } else {
      breakpoints.forEach((breakpoint) => {
        set(theme, [item, breakpoint], propItem)
      })
    }
  })

  return theme
}

const assignValue = ({ name, index, breakpoints, source, result }) => {
  // eslint-disable-next-line no-plusplus
  for (let i = index; i >= 0; i--) {
    const currentValue = get(source, [name, breakpoints[i]])
    const valueType = ['number', 'string', 'boolean', 'function']

    if (valueType.includes(typeof currentValue)) {
      set(result, [name, breakpoints[index]], currentValue)
      break
    }
  }
}

const shouldReassign = ({ theme, breakpoints, position }) =>
  Object.keys(theme).some((name) => {
    const currentValue = get(theme, [name, breakpoints[position]])
    const previousValue = get(theme, [name, breakpoints[position - 1]])

    return currentValue !== previousValue
  })

const optimizeTheme = ({ theme, breakpoints }) => {
  const result = {}

  breakpoints.forEach((bp, i) => {
    if (shouldReassign({ theme, breakpoints, position: i })) {
      Object.keys(theme).forEach((name) => {
        assignValue({
          name,
          index: i,
          breakpoints,
          source: theme,
          result,
        })
      })
    }
  })

  return result
}

const normalizeTheme = ({ props, keywords, breakpoints }) => {
  const theme = calculateTheme({ props, keywords, breakpoints })
  const result = {}

  // normalize size, paddings, ... for each breakpoint
  breakpoints.forEach((bp, i) => {
    Object.keys(theme).forEach((name) => {
      assignValue({
        name,
        index: i,
        breakpoints,
        source: theme,
        result,
      })
    })
  })

  return result
}

const groupByBreakpoint = (props) => {
  const result = {}

  Object.keys(props).forEach((attr) => {
    Object.keys(props[attr]).forEach((bp) =>
      set(result, [bp, attr], props[attr][bp])
    )
  })

  return result
}

export { pickThemeProps, normalizeTheme, groupByBreakpoint }

export default ({ props, keywords, breakpoints }) => {
  // FIXME:  || !breakpoints?.length > 0
  if (!breakpoints) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`
        You are not passing an array of sorted breakpoint keys to
        this function so it will return back picked props and not optimized theme.
      `)
    }

    return pick(props, keywords)
  }
  const helper = normalizeTheme({
    props,
    keywords,
    breakpoints,
  })

  return optimizeTheme({
    theme: helper,
    breakpoints,
  })
}