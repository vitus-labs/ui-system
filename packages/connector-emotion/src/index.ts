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

// Objects (e.g. Emotion `keyframes` / serialized styles) must NOT be
// stringified: String(keyframes`...`) yields `_EMO_name_@keyframes..._EMO_`,
// which Emotion only understands when it sees the object itself. So they are
// kept as-is in a parts array (strings + objects) that Emotion serializes.
const isStyleObject = (v: unknown): boolean =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

const pushParts = (value: any, props: Record<string, any>, out: any[]) => {
  if (value == null || value === false || value === true) return
  if (typeof value === 'function') return pushParts(value(props), props, out)
  if (Array.isArray(value)) {
    for (const item of value) pushParts(item, props, out)
    return
  }
  out.push(isStyleObject(value) ? value : String(value))
}

// Collapses parts into a plain string when only strings are present, else
// into an Emotion SerializedStyles (via Emotion's own `css`) so the style
// objects (keyframes) are serialized natively. A raw array would not work:
// Emotion appends `;` after every string element of an interpolated array.
const finalize = (parts: any[]): any => {
  if (!parts.some(isStyleObject)) return parts.join('')
  const literals: string[] = []
  const objs: any[] = []
  let text = ''
  for (const part of parts) {
    if (isStyleObject(part)) {
      literals.push(text)
      objs.push(part)
      text = ''
    } else text += part
  }
  literals.push(text)
  return emotionCss(
    Object.assign([...literals], { raw: literals }) as any,
    ...objs,
  )
}

const buildParts = (
  strings: TemplateStringsArray,
  values: any[],
  props: Record<string, any>,
): any[] => {
  const out: any[] = [strings[0] ?? '']
  for (let i = 0; i < values.length; i++) {
    pushParts(values[i], props, out)
    out.push(strings[i + 1] ?? '')
  }
  return out
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
    // Style objects (keyframes etc.) keep their identity → parts array
    if (values.some(isStyleObject))
      return finalize(buildParts(strings, values, {}))

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
    return finalize(buildParts(strings, values, props))
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
    // Inject the context theme (like styled does) so `({ theme }) => ...`
    // interpolations resolve; an explicit `theme` prop wins.
    const theme = useTheme()
    const resolveProps = props.theme !== undefined ? props : { ...props, theme }
    // Resolve all interpolations (including our css functions)
    return createElement(Global, {
      styles: finalize(buildParts(strings, values, resolveProps)),
    })
  }

  GlobalComponent.displayName = 'GlobalStyle'
  return GlobalComponent
}

// NOTE: this connector does NOT export `useCSS`. An earlier shim
// returned `emotionCss\`…\`.name` for shape-parity with styler's
// useCSS, but Emotion never inserts the serialized rule unless it
// passes through @emotion/styled or `<Global>` — so the className
// resolved to a stylesheet that didn't exist, rendering UNSTYLED with
// no warning. Emotion's idiomatic pattern is
// `<div className={css\`…\`} />` (css returns an injection-ready
// className synchronously). Consumers needing the useCSS hook shape
// should use `@vitus-labs/connector-styler` directly.

// ---------------------------------------------------------------------------
// Re-exports from Emotion
// ---------------------------------------------------------------------------

export { keyframes, useTheme }
