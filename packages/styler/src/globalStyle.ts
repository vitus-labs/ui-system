'use client'

/**
 * createGlobalStyle() — tagged template function that injects global CSS
 * rules (not scoped to a class name). Returns a React component that
 * injects styles when mounted and supports dynamic interpolations via
 * props/theme.
 *
 * Usage:
 *   const GlobalStyle = createGlobalStyle`
 *     body { margin: 0; font-family: ${({ theme }) => theme.font}; }
 *     *, *::before, *::after { box-sizing: border-box; }
 *   `
 *   // <GlobalStyle /> — renders nothing, injects global CSS
 *
 * Hybrid injection: useInsertionEffect on client (1 shared sheet; rules are
 * removed again when the last instance unmounts or the CSS changes),
 * React 19 `<style precedence>` on SSR (FOUC-free, zero config).
 */
import { createElement, type FC, useInsertionEffect } from 'react'

import { hash } from './hash'
import {
  type Interpolation,
  normalizeCSS,
  resolve,
  withSelectors,
} from './resolve'
import { isDynamic } from './shared'
import { sheet } from './sheet'
import { useTheme } from './ThemeProvider'

// SSR vs client detection — computed once at module load time.
const IS_SERVER = typeof document === 'undefined'

export const createGlobalStyle = (
  strings: TemplateStringsArray,
  ...values: Interpolation[]
) => {
  withSelectors(values)
  const hasDynamicValues = values.some(isDynamic)

  // STATIC FAST PATH: compute once at creation time
  if (!hasDynamicValues) {
    const cssText = normalizeCSS(resolve(strings, values, {}))
    // `normalizeCSS` already strips leading/trailing whitespace, so a length
    // check is equivalent to a `.trim()` but cheaper.
    const href = cssText.length > 0 ? `g-${hash(cssText)}` : ''

    // SSR: pre-compute <style precedence> for FOUC-free delivery (React 19
    // dedupes by href). Referenced @keyframes ride along.
    const cachedStyleEl =
      IS_SERVER && href
        ? createElement(
            'style',
            { href, precedence: 'low' },
            sheet.keyframesFor(cssText) + cssText,
          )
        : null

    // Client: rules live while at least one instance is mounted
    // (ref-counted in the sheet), like styled-components. Server: no hooks,
    // just the pre-built element.
    const StaticGlobal: FC = IS_SERVER
      ? () => cachedStyleEl
      : () => {
          useInsertionEffect(() => {
            if (!href) return
            sheet.acquireGlobal(cssText, href)
            return () => sheet.releaseGlobal(href)
          }, [])
          return null
        }
    StaticGlobal.displayName = 'GlobalStyle'
    return StaticGlobal
  }

  // DYNAMIC PATH: resolve on every render.
  // Client: useInsertionEffect acquires the current CSS and releases the
  // previous value / on unmount, so A → B → A never leaves B in effect.
  // SSR: <style precedence> for FOUC-free delivery.
  const DynamicGlobal = (props: Record<string, any>) => {
    const theme = useTheme()
    const allProps = { ...props, theme }
    const cssText = normalizeCSS(resolve(strings, values, allProps))

    useInsertionEffect(() => {
      if (cssText.length === 0) return
      const key = sheet.acquireGlobal(cssText)
      return () => sheet.releaseGlobal(key)
    }, [cssText])

    // Server only: the href hash is not needed on the client (the sheet
    // hashes once per distinct cssText in `acquireGlobal`).
    if (!IS_SERVER || cssText.length === 0) return null
    return createElement(
      'style',
      { href: `g-${hash(cssText)}`, precedence: 'low' },
      sheet.keyframesFor(cssText) + cssText,
    )
  }

  DynamicGlobal.displayName = 'GlobalStyle'
  return DynamicGlobal
}
