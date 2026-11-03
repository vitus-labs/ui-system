import { isEmpty } from '@vitus-labs/core'
import type { Css } from '~/types'
import type createMediaQueries from './createMediaQueries'
import normalizeTheme from './normalizeTheme'
import optimizeBreakpointDeltas from './optimizeBreakpointDeltas'
import optimizeTheme from './optimizeTheme'
import type sortBreakpoints from './sortBreakpoints'
import transformTheme from './transformTheme'

// NOTE: internal helpers use `//` comments on purpose — the build keeps
// JSDoc blocks in the shipped bundle, which counts against the size budget.

// Template result shape (styler `CSSResult`): `strings` + `values`.
const isTemplateResult = (v: object): v is { values: unknown[] } =>
  'strings' in v && Array.isArray((v as { values?: unknown }).values)

// Per nested template result: "contains a function interpolation?". Shared
// snippets (module-level `css\`…\``) are walked once.
const fnCache = new WeakMap<object, boolean>()

// True when resolving `value` could depend on render-time props: a function
// anywhere in the tree (template values, nested results, arrays). Other
// nested objects (keyframes, …) are resolved by the engine via `String()`,
// which is props-independent. Over-deep (possibly cyclic) → dynamic.
const hasFunctions = (value: unknown, depth: number): boolean => {
  if (typeof value === 'function') return true
  if (value === null || typeof value !== 'object') return false
  if (depth > 32) return true
  const isArr = Array.isArray(value)
  if (!isArr && !isTemplateResult(value)) return false
  // the top-level result is fresh per call — only memoize nested ones
  const memo = !isArr && depth > 0
  let found = memo ? fnCache.get(value) : undefined
  if (found !== undefined) return found
  found = (isArr ? value : (value as { values: unknown[] }).values).some(
    (v: unknown) => hasFunctions(v, depth + 1),
  )
  if (memo) fnCache.set(value, found)
  return found
}

// Coerce a styles-callback result to a CSS string for delta optimization,
// or null when it can't be stringified faithfully — the caller then falls
// back to the unoptimized path, where the engine resolves the raw results
// with real render-time props.
//
// Template results (styler) stringify only when no function interpolation
// exists anywhere inside: their `toString()` resolves with EMPTY props, so
// `${p => p.theme…}` from `extendCss` / `colCss` / Element `css` callbacks
// would silently resolve wrong. Functions (Emotion dynamic `css`), arrays
// (styled-components RuleSet — `String()` inserts commas) and any other
// object shape (SerializedStyles, connector-native results) → null.
export const stringifyResult = (result: unknown): string | null => {
  if (result == null || result === false || result === true) return ''
  if (typeof result === 'string') return result
  if (
    typeof result !== 'object' ||
    !isTemplateResult(result) ||
    hasFunctions(result, 0)
  )
    return null
  const text = String(result)
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

interface ThemeCacheEntry {
  breakpoints: unknown
  optimized: Record<string, Record<string, unknown>>
  // Final output keyed by the outer `theme` reference — hit when the same
  // internal AND outer theme render again (stable ThemeProvider value).
  rendered?: WeakMap<object, unknown[]>
}

// One bucket per (styles, normalize): the output depends on both, so
// instances that merely share an internal theme object must not share it.
interface CacheBucket {
  // internal theme object → optimized theme + rendered output
  themes: WeakMap<object, ThemeCacheEntry>
}

const buckets = new WeakMap<object, Record<string, CacheBucket>>()

const getBucket = (styles: object, normalize: boolean): CacheBucket => {
  let byFlag = buckets.get(styles)
  if (!byFlag) buckets.set(styles, (byFlag = {}))
  return (byFlag[`${normalize}`] ??= { themes: new WeakMap() })
}

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
// Output is cached per (styles, normalize) by internal + outer theme
// identity.
const makeItResponsive: MakeItResponsive = ({
  theme: customTheme,
  key = '',
  css,
  styles,
  normalize = true,
}) => {
  const bucket = getBucket(styles, normalize)
  const themeCache = bucket.themes

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: hot-path responsive engine — theme cache + render cache + breakpoint pipeline + optimizer dispatch all inlined per render
  return ({ theme = {}, ...props }) => {
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
    let entry = themeCache.get(internalTheme)
    const breakpointsMatch = entry?.breakpoints === sortedBreakpoints

    // Full-render cache: same internal theme + same outer theme → return
    // the previous render's output verbatim. CSS results are immutable so
    // reusing them is safe.
    if (entry && breakpointsMatch && entry.rendered) {
      const memoized = entry.rendered.get(theme as object)
      if (memoized) return memoized
    }

    if (entry && breakpointsMatch) {
      optimizedTheme = entry.optimized
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

      entry = {
        breakpoints: sortedBreakpoints,
        optimized: optimizedTheme,
        // Preserve any pre-existing rendered cache when re-entering with a
        // changed sortedBreakpoints reference — usually unreachable because
        // breakpoints come from a stable Provider value, but the explicit
        // handling avoids a memory cliff in tests / HMR.
        rendered: entry?.rendered,
      }
      themeCache.set(internalTheme, entry)
    }

    // Render each breakpoint once, then try to resolve the results to
    // strings so the delta optimizer can diff at the property level. If any
    // result can't be stringified faithfully (function interpolations,
    // foreign engine result), fall back to the unoptimized path that lets
    // the engine resolve the raw results with real render-time props.
    const rendered: unknown[] = sortedBreakpoints.map((item: string) => {
      const breakpointTheme = optimizedTheme[item]
      if (!breakpointTheme || !media) return null
      return renderStyles(breakpointTheme)
    })

    const renderedTexts: string[] = []
    for (const r of rendered) {
      const text = stringifyResult(r)
      if (text === null) break
      renderedTexts.push(text)
    }

    let result: unknown[]
    if (renderedTexts.length === rendered.length) {
      const deltas = optimizeBreakpointDeltas(renderedTexts)
      result = sortedBreakpoints.map((item: string, i: number) => {
        const css = deltas[i]
        if (!css || !media) return ''
        return (media as Record<string, any>)[item]`${css}`
      })
    } else {
      result = sortedBreakpoints.map((item: string, i: number) => {
        if (!optimizedTheme[item] || !media) return ''
        return (media as Record<string, any>)[item]`
          ${rendered[i]};
        `
      })
    }

    // Memoize the final rendered output by outer theme reference. Stable
    // theme + stable internal theme => future renders return immediately.
    if (!entry.rendered) entry.rendered = new WeakMap()
    entry.rendered.set(theme as object, result)

    return result
  }
}

export default makeItResponsive
