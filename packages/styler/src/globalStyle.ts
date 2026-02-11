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
 * Approach inspired by Goober's glob() + styled-components' API:
 * - Static templates: inject once at component creation (no React overhead)
 * - Dynamic templates: re-inject on prop/theme change via useInsertionEffect
 * - Hash-based dedup prevents duplicate injection
 */
import { useInsertionEffect, useRef } from 'react'

import { type Interpolation, normalizeCSS, resolve } from './resolve'
import { isDynamic } from './shared'
import { sheet } from './sheet'
import { useTheme } from './ThemeProvider'

const IS_SERVER = typeof document === 'undefined'

export const createGlobalStyle = (
  strings: TemplateStringsArray,
  ...values: Interpolation[]
) => {
  const hasDynamicValues = values.some(isDynamic)

  // STATIC FAST PATH: inject at creation time, re-inject during SSR render
  if (!hasDynamicValues) {
    const cssText = normalizeCSS(resolve(strings, values, {}))
    if (cssText.trim()) sheet.insertGlobal(cssText)

    const StaticGlobal = () => {
      // SSR: re-insert every render (cache cleared by reset() between requests;
      // deduplicates within the same request via cache)
      if (IS_SERVER && cssText.trim()) sheet.insertGlobal(cssText)
      return null
    }
    StaticGlobal.displayName = 'GlobalStyle'
    return StaticGlobal
  }

  // DYNAMIC PATH: resolve on every render, re-inject when CSS changes
  const DynamicGlobal = (props: Record<string, any>) => {
    const theme = useTheme()
    const allProps = { ...props, theme }
    const cssText = normalizeCSS(resolve(strings, values, allProps))
    const prevCssRef = useRef('')

    // SSR: insert during render (useInsertionEffect doesn't run on server)
    if (IS_SERVER && cssText.trim()) sheet.insertGlobal(cssText)

    // Client: use useInsertionEffect (React 18+) for CSS injection.
    // Only re-inject when the resolved CSS actually changes.
    useInsertionEffect(() => {
      if (cssText !== prevCssRef.current) {
        prevCssRef.current = cssText
        if (cssText.trim()) sheet.insertGlobal(cssText)
      }
    })

    return null
  }

  DynamicGlobal.displayName = 'GlobalStyle'
  return DynamicGlobal
}
