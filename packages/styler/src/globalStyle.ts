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
 * Uses React 19's `<style precedence>` for FOUC-free SSR and static export.
 * Hash-based `href` ensures deduplication across renders and components.
 */
import { createElement } from 'react'

import { hash } from './hash'
import { type Interpolation, normalizeCSS, resolve } from './resolve'
import { isDynamic } from './shared'
import { sheet } from './sheet'
import { useTheme } from './ThemeProvider'

export const createGlobalStyle = (
  strings: TemplateStringsArray,
  ...values: Interpolation[]
) => {
  const hasDynamicValues = values.some(isDynamic)

  // STATIC FAST PATH: compute once at creation time
  if (!hasDynamicValues) {
    const cssText = normalizeCSS(resolve(strings, values, {}))
    const href = cssText.trim() ? `g-${hash(cssText)}` : ''

    // Populate sheet for legacy useServerInsertedHTML support
    if (cssText.trim()) sheet.insertGlobal(cssText)

    const StaticGlobal = () => {
      if (!href) return null
      return createElement('style', { href, precedence: 'low' }, cssText)
    }
    StaticGlobal.displayName = 'GlobalStyle'
    return StaticGlobal
  }

  // DYNAMIC PATH: resolve on every render. React 19's <style precedence>
  // handles injection, dedup, and cleanup automatically.
  const DynamicGlobal = (props: Record<string, any>) => {
    const theme = useTheme()
    const allProps = { ...props, theme }
    const cssText = normalizeCSS(resolve(strings, values, allProps))

    if (!cssText.trim()) return null

    const href = `g-${hash(cssText)}`
    return createElement('style', { href, precedence: 'low' }, cssText)
  }

  DynamicGlobal.displayName = 'GlobalStyle'
  return DynamicGlobal
}
