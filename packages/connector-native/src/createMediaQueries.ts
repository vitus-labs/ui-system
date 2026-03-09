import { Dimensions } from 'react-native'

import type { css } from '~/css'

type CreateMediaQueries = <B extends Record<string, number>>(props: {
  breakpoints: B
  rootSize: number
  css: typeof css
}) => Record<keyof B, (...args: any[]) => any>

/**
 * React Native version of createMediaQueries.
 * Instead of wrapping styles in @media queries (web),
 * evaluates the current screen width against breakpoints
 * and conditionally applies styles (mobile-first).
 */
const createMediaQueries: CreateMediaQueries = ({ breakpoints, css }) =>
  Object.keys(breakpoints).reduce<Record<string, any>>((acc, key) => {
    const breakpointValue = (breakpoints as Record<string, number>)[key]

    if (breakpointValue === 0) {
      // Base breakpoint — always apply
      acc[key] = (strings: TemplateStringsArray, ...values: any[]) =>
        css(strings, ...values)
    } else if (breakpointValue != null) {
      // Conditional — only apply when screen width >= breakpoint px value
      acc[key] = (strings: TemplateStringsArray, ...values: any[]) => {
        const { width } = Dimensions.get('window')
        if (width >= breakpointValue) return css(strings, ...values)
        return ''
      }
    }

    return acc
  }, {}) as any

export default createMediaQueries
