import { isEmpty } from '@vitus-labs/core'
import type { Css } from '~/types'
import type createMediaQueries from './createMediaQueries'
import normalizeTheme from './normalizeTheme'
import optimizeTheme from './optimizeTheme'
import type sortBreakpoints from './sortBreakpoints'
import transformTheme from './transformTheme'

type CustomTheme = Record<
  string,
  Record<string, unknown> | number | string | boolean
>
type Theme = Partial<{
  rootSize: number
  breakpoints: Record<string, number>
  __VITUS_LABS__: Partial<{
    media: ReturnType<typeof createMediaQueries>
    sortedBreakpoints: ReturnType<typeof sortBreakpoints>
  }>
}> &
  CustomTheme

export type MakeItResponsiveStyles<
  T extends Partial<Record<string, any>> = any,
> = ({
  theme,
  css,
  rootSize,
  globalTheme,
}: {
  theme: T
  css: Css
  rootSize?: number
  globalTheme?: Record<string, any>
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

const makeItResponsive: MakeItResponsive =
  ({ theme: customTheme, key = '', css, styles, normalize = false }) =>
  ({ theme = {}, ...props }) => {
    const internalTheme = customTheme || props[key]

    // if no theme is defined, return empty objct
    if (isEmpty(internalTheme)) return ''

    const { rootSize, breakpoints, __VITUS_LABS__, ...restTheme } =
      theme as Theme

    const renderStyles = (
      theme: Record<string, unknown>,
    ): ReturnType<typeof styles> =>
      styles({ theme, css, rootSize, globalTheme: restTheme })

    // if there are no breakpoints, return just standard css
    if (isEmpty(breakpoints) || isEmpty(__VITUS_LABS__)) {
      return css`
        ${renderStyles(internalTheme)}
      `
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { media, sortedBreakpoints } = __VITUS_LABS__!

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

    const optimizedTheme = optimizeTheme({
      theme: transformedTheme,
      breakpoints: sortedBreakpoints,
    })

    return sortedBreakpoints.map((item) => {
      const breakpointTheme = optimizedTheme[item]

      if (!breakpointTheme || !media) return ''

      const result = renderStyles(breakpointTheme)

      return media[item]`
        ${result};
      `
    })
  }

export default makeItResponsive
