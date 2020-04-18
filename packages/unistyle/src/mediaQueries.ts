const sortBreakpoints = (breakpoints) =>
  Object.keys(breakpoints).sort((a, b) => breakpoints[a] - breakpoints[b])

const createMediaQueries = ({ breakpoints, rootSize, css }) =>
  Object.keys(breakpoints).reduce((accumulator, label) => {
    // use em in breakpoints to work properly cross-browser and support users
    // changing their browsers font-size: https://zellwk.com/blog/media-query-units/
    const emSize = breakpoints[label] / rootSize
    accumulator[label] = (...args) => css`
      @media (min-width: ${emSize}em) {
        ${css(...args)};
      }
    `
    return accumulator
  }, {})

const transformTheme = ({ theme, breakpoints }) => {
  const newTheme = {}

  breakpoints.forEach((item) => {
    newTheme[item] = {}
  })

  Object.keys(theme).forEach((item) => {
    if (Array.isArray(theme[item])) {
      theme[item].forEach((child, i) => {
        newTheme[breakpoints[i]][item] = child
      })
    } else if (typeof theme[item] === 'object') {
      const subObject = theme[item]
      Object.keys(subObject).forEach((child) => {
        newTheme[child][item] = subObject[child]
      })
    } else {
      newTheme[breakpoints[0]][item] = theme[item]
    }
  })

  return newTheme
}

const makeItResponsive = ({ theme: customTheme, key, css, styles }) => ({
  theme,
  ...props
}) => {
  const internalTheme = customTheme || props[key]
  const { rootSize, breakpoints } = theme
  const media = createMediaQueries({ breakpoints, rootSize, css })
  const sortedBreakpoints = sortBreakpoints(breakpoints)
  const transformedTheme = transformTheme({
    theme: internalTheme,
    breakpoints: sortedBreakpoints,
  })

  return sortedBreakpoints.map((item, i) => {
    const hasBreakpointProperties =
      Object.keys(transformedTheme[item]).length > 0

    if (hasBreakpointProperties) {
      const result = styles({ theme: transformedTheme[item], css, rootSize })

      // first breakpoint is rendered without media queries
      if (i === 0) {
        return css`
          ${result}
        `
      }
      return media[item]`
        ${result};
      `
    }

    return null
  })
}

export { sortBreakpoints, createMediaQueries, transformTheme }

export default makeItResponsive
