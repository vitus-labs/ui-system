import { Dimensions } from 'react-native'

import type { CSSResult, css } from '~/css'

type CreateMediaQueries = <B extends Record<string, number>>(props: {
  breakpoints: B
  rootSize: number
  css: typeof css
}) => Record<keyof B, (...args: any[]) => any>

const EMPTY_STYLE = {} as const

/**
 * Wraps a breakpoint's CSSResult so the screen-width check happens at
 * `resolve()` time, not when the breakpoint function is called. This keeps
 * the width OUT of any upstream cache (e.g. unistyle's makeItResponsive
 * caches the array of these results by theme reference): the cached result
 * re-evaluates the current width on every resolve. Combined with the native
 * `styled` component subscribing to `useWindowDimensions`, responsive styles
 * stay correct across device rotation / window resize without a manual
 * re-render — matching how the browser re-evaluates `@media` on the web.
 */
const lazyBreakpoint = (inner: CSSResult, minWidth: number): CSSResult => ({
  __brand: 'vl.native.css',
  statics: {},
  dynamics: [],
  resolve: (props: any) =>
    Dimensions.get('window').width >= minWidth
      ? inner.resolve(props)
      : EMPTY_STYLE,
})

/**
 * React Native version of createMediaQueries.
 * Instead of wrapping styles in @media queries (web),
 * evaluates the current screen width against breakpoints
 * and conditionally applies styles (mobile-first), lazily at resolve time.
 */
const createMediaQueries: CreateMediaQueries = ({ breakpoints, css }) => {
  // Direct for-in + mutation. The prior `Object.keys.reduce` allocated the
  // keys array and paid reduce-callback overhead per breakpoint setup.
  // Mirrors the same change in `@vitus-labs/unistyle`'s `createMediaQueries`.
  const acc: Record<string, any> = {}
  for (const key in breakpoints) {
    const breakpointValue = (breakpoints as Record<string, number>)[key]

    if (breakpointValue === 0) {
      // Base breakpoint — always apply
      acc[key] = (strings: TemplateStringsArray, ...values: any[]) =>
        css(strings, ...values)
    } else if (breakpointValue != null) {
      // Conditional — apply when screen width >= breakpoint, checked lazily
      // at resolve time so rotation/resize is reflected without baking the
      // width into upstream caches.
      acc[key] = (strings: TemplateStringsArray, ...values: any[]) =>
        lazyBreakpoint(css(strings, ...values), breakpointValue)
    }
  }
  return acc as any
}

export default createMediaQueries
