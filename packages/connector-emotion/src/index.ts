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
 *
 * Type note: `css(...)` returns `string | ((props) => string)`. Because
 * core's `CSSEngineResult` is augmented via `interface` declaration merging
 * (which only supports object shapes), we don't augment from this connector
 * — `CSSEngineResult` stays empty for Emotion users, and consumer code
 * passes the result as a string-or-function interpolation, which is what
 * Emotion's styled template processor already expects.
 */

import {
  css as emotionCss,
  Global,
  keyframes,
  ThemeProvider,
  useTheme,
} from '@emotion/react'
import emotionStyled from '@emotion/styled'
import { createElement, type FC } from 'react'

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
export const css = (strings: TemplateStringsArray, ...values: any[]): any => {
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
// useCSS — parity with `@vitus-labs/styler`'s hook for engine-swap intent.
// ---------------------------------------------------------------------------

/**
 * Hook that resolves a `css()` result and returns the class name attached
 * to the corresponding Emotion `<style>` rule. Mirrors the styler `useCSS`
 * surface so consumer code can import `useCSS` from any connector.
 *
 * Honest limitation: Emotion's `css` returns either a plain string
 * (static fast path) or a `(props) => string` function (dynamic path).
 * Both are resolved here; the resulting string is fed through Emotion's
 * own `emotionCss\`…\`` to obtain a SerializedStyles with `.name`. For
 * the most common usage — static templates — this is indistinguishable
 * from styler's useCSS.
 */
export const useCSS = (
  template: unknown,
  props?: Record<string, unknown>,
): string => {
  const cssStr =
    typeof template === 'function'
      ? (template as (p: Record<string, unknown>) => string)(props ?? {})
      : typeof template === 'string'
        ? template
        : String(template ?? '')
  if (!cssStr) return ''
  const serialized = emotionCss`${cssStr}` as unknown as { name?: string }
  return serialized?.name ?? ''
}

// ---------------------------------------------------------------------------
// Re-exports from Emotion
// ---------------------------------------------------------------------------

export { keyframes, useTheme }
