/* eslint-disable @typescript-eslint/no-explicit-any */
import { set, isEmpty, memoize } from '@vitus-labs/core'
import { normalizeTheme } from './normalizeTheme'

// --------------------------------------------------------
// sort breakpoints
// --------------------------------------------------------
type SortBreakpoints = <T extends Record<string, any>>(
  breakpoints: T
) => Array<keyof T>
export const sortBreakpoints: SortBreakpoints = (breakpoints) => {
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

export const createMediaQueries: CreateMediaQueries = ({
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
// remove unexpected keys
// --------------------------------------------------------
const removeUnexpectedKeys = (obj, keys) => {
  const result = {}
  keys.forEach((bp) => {
    const value = obj[bp]

    if (value) {
      result[bp] = value
    }
  })

  return result
}

// --------------------------------------------------------
// transform theme
// --------------------------------------------------------
type TransformTheme = ({
  theme,
  breakpoints,
}: {
  theme: Record<string, unknown>
  breakpoints: Array<string>
}) => any
export const transformTheme: TransformTheme = memoize(
  ({ theme, breakpoints }) => {
    const result = {}

    if (isEmpty(theme) || !breakpoints) return result

    // can be one of following types
    // { fontSize: 12 }
    // { fontSize: { xs: 12, md: 15 }}
    // { fontSize: [12, 15] }
    Object.entries(theme).forEach(([key, value]) => {
      // array
      if (Array.isArray(value) && value.length > 0) {
        value.forEach((child, i) => {
          const indexBreakpoint = breakpoints[i]
          set(result, [indexBreakpoint, key], child)
        })
      }
      // object
      else if (typeof value === 'object') {
        Object.entries(value).forEach(([childKey, childValue]) => {
          set(result, [childKey, key], childValue)
        })
      }
      // normal value
      else if (value != null) {
        const firstBreakpoint = breakpoints[0]
        set(result, [firstBreakpoint, key], value)
      }
    })

    return removeUnexpectedKeys(result, breakpoints)
  },
  {
    isSerialized: true,
    maxArgs: 1,
    maxSize: 800,
  }
)

// --------------------------------------------------------
// make it responsive
// --------------------------------------------------------
type CustomTheme = Record<
  string,
  Record<string, unknown> | number | string | boolean
>
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
  normalize,
}: {
  theme?: CustomTheme
  key?: string
  css: any
  styles: any
  normalize?: boolean
}) => ({ theme }: { theme?: Theme }) => any

export const makeItResponsive: MakeItResponsive = ({
  theme: customTheme,
  key = '',
  css,
  styles,
  normalize = false,
}) => ({ theme, ...props }) => {
  const internalTheme = customTheme || props[key]

  // if no theme is defined, return empty objct
  if (isEmpty(internalTheme)) return ''

  const { rootSize, breakpoints, __VITUS_LABS__ } = theme

  const renderStyles = (
    theme: Record<string, unknown>
  ): ReturnType<typeof styles> => styles({ theme, css, rootSize })

  // if there are no breakpoints, return just standard css
  if (isEmpty(breakpoints) || isEmpty(__VITUS_LABS__)) {
    return css`
      ${renderStyles(internalTheme)}
    `
  }

  const { media, sortedBreakpoints } = __VITUS_LABS__

  let helperTheme = internalTheme

  if (normalize) {
    helperTheme = normalizeTheme({
      theme: internalTheme,
      breakpoints: sortedBreakpoints,
    })
  }

  const transformedTheme = transformTheme({
    theme: helperTheme,
    breakpoints: sortedBreakpoints,
  })

  // this breakpoint will not be rendered within media query
  const firstBreakpoint = sortedBreakpoints[0]

  return sortedBreakpoints.map((item) => {
    const breakpointTheme = transformedTheme[item]

    if (!breakpointTheme) return undefined

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
