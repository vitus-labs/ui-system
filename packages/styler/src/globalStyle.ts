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
 * Hybrid injection: useInsertionEffect on client (1 shared sheet),
 * React 19 `<style precedence>` on SSR (FOUC-free, zero config).
 */
import { createElement, useInsertionEffect } from 'react'

import { hash } from './hash'
import { type Interpolation, normalizeCSS, resolve } from './resolve'
import { isDynamic } from './shared'
import { sheet } from './sheet'
import { useTheme } from './ThemeProvider'

// SSR vs client detection — computed once at module load time.
const IS_SERVER = typeof document === 'undefined'

export const createGlobalStyle = (
  strings: TemplateStringsArray,
  ...values: Interpolation[]
) => {
  const hasDynamicValues = values.some(isDynamic)

  // STATIC FAST PATH: compute once at creation time
  if (!hasDynamicValues) {
    const cssText = normalizeCSS(resolve(strings, values, {}))
    const href = cssText.trim() ? `g-${hash(cssText)}` : ''

    // Inject into sheet. Client: insertRule() into shared sheet. SSR: ssrBuffer.
    if (cssText.trim()) sheet.insertGlobal(cssText)

    // SSR: pre-compute <style precedence> for FOUC-free delivery.
    // Client: CSS already injected via sheet.insertGlobal() above.
    const cachedStyleEl =
      IS_SERVER && href
        ? createElement('style', { href, precedence: 'low' }, cssText)
        : null

    const StaticGlobal = () => cachedStyleEl
    StaticGlobal.displayName = 'GlobalStyle'
    return StaticGlobal
  }

  // DYNAMIC PATH: resolve on every render.
  // Client: useInsertionEffect injects into shared sheet.
  // SSR: <style precedence> for FOUC-free delivery.
  const DynamicGlobal = (props: Record<string, any>) => {
    const theme = useTheme()
    const allProps = { ...props, theme }
    const cssText = normalizeCSS(resolve(strings, values, allProps))
    const href = cssText.trim() ? `g-${hash(cssText)}` : ''

    // Client: inject via useInsertionEffect (no-op on server)
    useInsertionEffect(() => {
      if (cssText.trim()) sheet.insertGlobal(cssText)
    }, [cssText])

    if (!href) return null

    // SSR: render <style precedence> for FOUC-free delivery
    if (IS_SERVER) {
      sheet.insertGlobal(cssText)
      return createElement('style', { href, precedence: 'low' }, cssText)
    }

    // Client: CSS injected via useInsertionEffect, render nothing
    return null
  }

  DynamicGlobal.displayName = 'GlobalStyle'
  return DynamicGlobal
}
