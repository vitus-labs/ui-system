type RootSize = number
type CssFn = (l: TemplateStringsArray, ...p: any[]) => string

// --------------------------------------------------------
// sort breakpoints
// --------------------------------------------------------
// type SortBreakpoints = <T>(breakpoints: T) => Array<keyof T>
const sortBreakpoints = (breakpoints) => {
  const result = Object.keys(breakpoints).sort(
    (a, b) => breakpoints[a] - breakpoints[b]
  )

  return result
}

// --------------------------------------------------------
// create media queries
// --------------------------------------------------------
type CreateMediaQueries = <B>({
  breakpoints,
  rootSize,
  css,
}: {
  breakpoints: B
  rootSize: RootSize
  css: CssFn
}) => Record<keyof B, typeof css>

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
    accumulator[label] = (
      literals: TemplateStringsArray,
      ...placeholders: any[]
    ) =>
      css`
        @media (min-width: ${emSize}em) {
          ${css(literals, ...placeholders)};
        }
      `
    return accumulator
  }, {} as Record<keyof typeof breakpoints, (l: TemplateStringsArray, ...p: any[]) => string>)

// --------------------------------------------------------
// transform theme
// --------------------------------------------------------
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

// --------------------------------------------------------
// make it responsive
// --------------------------------------------------------
type CustomTheme = Record<string, object | number | string | boolean>
type Theme = {
  rootSize: number
  breakpoints?: Record<string, number>
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
  const { rootSize, breakpoints } = theme

  const renderStyles = (theme: object) => styles({ theme, css, rootSize })

  if (!breakpoints || breakpoints.length === 0) {
    return css`
      ${renderStyles(internalTheme)}
    `
  }

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
