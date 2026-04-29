import { isEmpty } from '@vitus-labs/core'
import type { Css } from '~/types'
import type createMediaQueries from './createMediaQueries'
import normalizeTheme from './normalizeTheme'
import optimizeBreakpointDeltas from './optimizeBreakpointDeltas'
import optimizeTheme from './optimizeTheme'
import type sortBreakpoints from './sortBreakpoints'
import transformTheme from './transformTheme'

/**
 * Coerce a styles-callback result to a CSS string for delta optimization.
 * Returns null when the engine's result type can't be stringified cleanly
 * (e.g. Emotion / styled-components objects whose default toString() yields
 * "[object Object]") — caller falls back to the unoptimized path.
 *
 * Styler's CSSResult provides toString() that resolves with empty props,
 * so any function interpolation that needs render-time props must come from
 * the styles-callback closure (theme is destructured at call time, not
 * resolved later). Verified across the project's styles callbacks.
 */
const stringifyResult = (result: unknown): string | null => {
  if (result == null) return ''
  if (typeof result === 'string') return result
  const text = String(result)
  // Default Object.prototype.toString → "[object Foo]" — bail out.
  return text.includes('[object ') ? null : text
}

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
}) => (props: { theme?: Theme; [key: string]: any }) => any

/**
 * Core responsive engine used by every styled component in the system.
 *
 * Returns a styled-components interpolation function that:
 * 1. Reads the component's theme prop (via `key` or direct `theme`)
 * 2. Without breakpoints → renders plain CSS
 * 3. With breakpoints → normalizes, transforms (property-per-breakpoint →
 *    breakpoint-per-property), optimizes (deduplicates identical breakpoints),
 *    and wraps each breakpoint's styles in the appropriate `@media` query.
 */
const themeCache = new WeakMap<
  object,
  { breakpoints: unknown; optimized: Record<string, Record<string, unknown>> }
>()

const makeItResponsive: MakeItResponsive =
  ({ theme: customTheme, key = '', css, styles, normalize = true }) =>
  ({ theme = {}, ...props }) => {
    const internalTheme = customTheme || props[key]

    // if no theme is defined, return empty object
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

    // biome-ignore lint/style/noNonNullAssertion: __VITUS_LABS__ global is set in unistyle Provider before any styled components render
    const { media, sortedBreakpoints } = __VITUS_LABS__!

    let optimizedTheme: Record<string, Record<string, unknown>>

    const cached = themeCache.get(internalTheme)
    if (cached && cached.breakpoints === sortedBreakpoints) {
      optimizedTheme = cached.optimized
    } else {
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

      optimizedTheme = optimizeTheme({
        theme: transformedTheme,
        breakpoints: sortedBreakpoints,
      })

      themeCache.set(internalTheme, {
        breakpoints: sortedBreakpoints,
        optimized: optimizedTheme,
      })
    }

    // Resolve each per-breakpoint render to a string so the delta optimizer
    // can diff at the property level. If any breakpoint's result can't be
    // cleanly stringified (foreign engine result), fall back to the original
    // unoptimized path that lets the engine resolve interpolations itself.
    const renderedTexts: (string | null)[] = sortedBreakpoints.map(
      (item: string) => {
        const breakpointTheme = optimizedTheme[item]
        if (!breakpointTheme || !media) return ''
        return stringifyResult(renderStyles(breakpointTheme))
      },
    )

    const canOptimize = renderedTexts.every((t) => t !== null)
    if (canOptimize) {
      const deltas = optimizeBreakpointDeltas(renderedTexts as string[])
      return sortedBreakpoints.map((item: string, i: number) => {
        const css = deltas[i]
        if (!css || !media) return ''
        return (media as Record<string, any>)[item]`${css}`
      })
    }

    return sortedBreakpoints.map((item: string) => {
      const breakpointTheme = optimizedTheme[item]

      if (!breakpointTheme || !media) return ''

      const result = renderStyles(breakpointTheme)

      return (media as Record<string, any>)[item]`
        ${result};
      `
    })
  }

export default makeItResponsive
