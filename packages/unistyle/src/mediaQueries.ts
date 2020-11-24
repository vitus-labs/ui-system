// --------------------------------------------------------
// sort breakpoints
// --------------------------------------------------------
type SortBreakpoints = <T extends Record<string, any>>(
  breakpoints: T
) => Array<keyof T>
const sortBreakpoints: SortBreakpoints = (breakpoints) => {
  const result = Object.keys(breakpoints).sort(
    (a, b) => breakpoints[a] - breakpoints[b]
  )

  return result
}

// --------------------------------------------------------
// create media queries
// --------------------------------------------------------
type CreateMediaQueries = <
  B,
  R extends number,
  C extends (...args: any) => any
>({
  breakpoints,
  rootSize,
  css,
}: {
  breakpoints: B
  rootSize: R
  css: C
}) => Record<keyof B, ReturnType<C>>

const createMediaQueries: CreateMediaQueries = ({
  breakpoints,
  rootSize,
  css,
}) =>
  Object.keys(breakpoints).reduce((accumulator, label) => {
    // use em in breakpoints to work properly cross-browser and support users
    // changing their browsers font-size: https://zellwk.com/blog/media-query-units/
    const emSize = breakpoints[label] / rootSize
    /* eslint-disable-next-line no-param-reassign */
    accumulator[label] = (...args: any[]) =>
      css`
        @media (min-width: ${emSize}em) {
          ${css(...args)};
        }
      `
    return accumulator
  }, {} as Record<keyof typeof breakpoints, ReturnType<typeof css>>)

// --------------------------------------------------------
// transform theme
// --------------------------------------------------------
const transformTheme = ({ theme, breakpoints }) => {
  const newTheme = {}

  // init breakpoints object
  // { xs: {}, sm: {}, md: {},... }
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

  const cleanedTheme = {}
  Object.keys(newTheme).forEach((item) => {
    const theme = newTheme[item]
    if (Object.keys(theme).length > 0) {
      cleanedTheme[item] = theme
    }
  })

  return cleanedTheme
}

// --------------------------------------------------------
// make it responsive
// --------------------------------------------------------
type CustomTheme = Record<string, object | number | string | boolean>
type Theme = {
  rootSize: number
  breakpoints?: Record<string, number>
  __VITUS_LABS__?: {
    media?: ReturnType<typeof createMediaQueries>
    sortedBreakpoints?: ReturnType<typeof sortBreakpoints>
  }
} & CustomTheme

type MakeItResponsive = ({
  theme,
  key,
  css,
  styles,
}: {
  theme?: CustomTheme
  key?: string
  css: any
  styles: any
}) => ({ theme }: { theme?: Theme }) => any

const makeItResponsive: MakeItResponsive = ({
  theme: customTheme,
  key = '',
  css,
  styles,
}) => ({ theme, ...props }) => {
  const internalTheme = customTheme || props[key]
  const { rootSize, breakpoints, __VITUS_LABS__ } = theme
  const renderStyles = (theme: object): ReturnType<typeof styles> =>
    styles({ theme, css, rootSize })

  // if there are no breakpoints, return just standard css
  if (!breakpoints || breakpoints.length === 0 || !__VITUS_LABS__) {
    return css`
      ${renderStyles(internalTheme)}
    `
  }

  const { media, sortedBreakpoints } = __VITUS_LABS__

  const transformedTheme = transformTheme({
    theme: internalTheme,
    breakpoints: sortedBreakpoints,
  })

  // this breakpoint will not be rendered within media query
  const firstBreakpoint = sortBreakpoints[0]

  return sortedBreakpoints.map((item) => {
    const result = renderStyles(transformedTheme[item])

    // first breakpoint is rendered without media queries
    if (item === firstBreakpoint) {
      return css`
        ${result}
      `
    }

    return media[item]`
        ${result};
      `
  })
}

export { sortBreakpoints, createMediaQueries, transformTheme }

export default makeItResponsive
