import { isEmpty } from '@vitus-labs/core'
import createMediaQueries from './createMediaQueries'
import sortBreakpoints from './sortBreakpoints'
import normalizeTheme from './normalizeTheme'
import transformTheme from './transformTheme'
import type { Css } from '~/types'

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

export type MakeItResponsiveStyles<
  T extends Partial<Record<string, any>> = any
> = ({
  theme,
  css,
  rootSize,
  globalTheme,
}: {
  theme: T
  css: Css
  rootSize: number
  globalTheme?: Partial<Record<string, any>>
}) => ReturnType<typeof css> | string | any

export type MakeItResponsive = ({
  theme,
  key,
  css,
  styles,
  normalize,
}: {
  theme?: CustomTheme
  key?: string
  css: any
  styles: MakeItResponsiveStyles
  normalize?: boolean
}) => ({ theme }: { theme?: Theme }) => any

const makeItResponsive: MakeItResponsive = ({
  theme: customTheme,
  key = '',
  css,
  styles,
  normalize = false,
}) => ({ theme = {}, ...props }) => {
  const internalTheme = customTheme || props[key]

  // if no theme is defined, return empty objct
  if (isEmpty(internalTheme)) return ''

  const { rootSize, breakpoints, __VITUS_LABS__, ...restTheme } = theme

  const renderStyles = (
    theme: Record<string, unknown>
  ): ReturnType<typeof styles> =>
    styles({ theme, css, rootSize, globalTheme: restTheme })

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

    if (!breakpointTheme) return ''

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

export default makeItResponsive
