/**
 * Emotion connector for @vitus-labs/core
 *
 * Uses @emotion/styled and @emotion/react as the rendering engine, but wraps
 * Emotion's `css` with an adapter that supports the styled-components
 * composition pattern (css-in-css nesting, arrays, function interpolations).
 *
 * @emotion/styled's template literal processor already handles:
 * - Functions: calls with props, recurses on result
 * - Arrays: recurses on each element
 * - Strings/numbers: inserts directly
 * - null/false/true: produces empty string
 *
 * So our `css` returns either a plain string (static fast path) or a
 * function(props) → string (dynamic path) — both are natively handled by
 * Emotion's styled template processing.
 */
import { createElement, type FC } from 'react'
import emotionStyled from '@emotion/styled'
import {
  Global,
  ThemeProvider,
  css as emotionCss,
  keyframes,
  useTheme,
} from '@emotion/react'

// ---------------------------------------------------------------------------
// resolveValue — recursively resolve css interpolation values to strings
// ---------------------------------------------------------------------------

const resolveValue = (value: any, props: Record<string, any>): string => {
  if (value == null || value === false || value === true) return ''
  if (typeof value === 'function') return resolveValue(value(props), props)
  if (Array.isArray(value)) {
    let result = ''
    for (const item of value) result += resolveValue(item, props)
    return result
  }
  return String(value)
}

// ---------------------------------------------------------------------------
// css — styled-components-compatible composition via function interpolations
// ---------------------------------------------------------------------------

/**
 * Tagged template that produces composable CSS fragments.
 *
 * - Static templates (no dynamic values) → returns a plain string
 * - Dynamic templates → returns `(props) => string` that resolves at render
 *
 * Both forms are natively handled by @emotion/styled's template processing.
 */
export const css = (
  strings: TemplateStringsArray,
  ...values: any[]
): any => {
  // Fast path: no interpolation values → return plain string
  if (values.length === 0) return strings[0] ?? ''

  // Fast path: all values are static (no functions or arrays that need props)
  const hasDynamic = values.some(
    (v) => typeof v === 'function' || Array.isArray(v),
  )

  if (!hasDynamic) {
    let result = strings[0] ?? ''
    for (let i = 0; i < values.length; i++) {
      const v = values[i]
      result +=
        (v == null || v === false || v === true ? '' : String(v)) +
        (strings[i + 1] ?? '')
    }
    return result
  }

  // Dynamic path: return a function that resolves with props at render time
  return (props: Record<string, any>) => {
    let result = strings[0] ?? ''
    for (let i = 0; i < values.length; i++) {
      result += resolveValue(values[i], props) + (strings[i + 1] ?? '')
    }
    return result
  }
}

// ---------------------------------------------------------------------------
// styled — re-export Emotion's styled (handles our css results natively)
// ---------------------------------------------------------------------------

export const styled = emotionStyled

// ---------------------------------------------------------------------------
// provider — Emotion's ThemeProvider
// ---------------------------------------------------------------------------

export const provider = ThemeProvider

// ---------------------------------------------------------------------------
// createGlobalStyle — wrapper matching styled-components API
// ---------------------------------------------------------------------------

/**
 * Returns a component (like styled-components' createGlobalStyle) that injects
 * global CSS using Emotion's `<Global>` under the hood.
 */
export const createGlobalStyle = (
  strings: TemplateStringsArray,
  ...values: any[]
) => {
  const GlobalComponent: FC<Record<string, any>> = (props) => {
    // Resolve all interpolations (including our css functions) to strings
    let cssStr = strings[0] ?? ''
    for (let i = 0; i < values.length; i++) {
      cssStr += resolveValue(values[i], props) + (strings[i + 1] ?? '')
    }
    return createElement(Global, { styles: emotionCss`${cssStr}` })
  }

  GlobalComponent.displayName = 'GlobalStyle'
  return GlobalComponent
}

// ---------------------------------------------------------------------------
// Re-exports from Emotion
// ---------------------------------------------------------------------------

export { keyframes, useTheme }
