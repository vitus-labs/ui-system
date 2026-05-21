/**
 * Interpolation resolver: converts tagged template strings + values into a
 * final CSS string. Handles nested CSSResults, arrays, functions, and
 * primitive values.
 */

import type { CSSEngineResult } from '@vitus-labs/core'
import { evictMapByPercent } from './evict'
import type { DefaultTheme } from './ThemeProvider'

export type Interpolation =
  | string
  | number
  | boolean
  | null
  | undefined
  | CSSResult
  // Engine result from `@vitus-labs/core`. When connector-styler is in use,
  // it's augmented to extend CSSResult — but we list it explicitly so that
  // values flowing through from `config.css` (e.g. unistyle's `styles()`)
  // type-check at interpolation sites without casts.
  | CSSEngineResult
  | Interpolation[]
  | ((props: {
      theme?: DefaultTheme & Record<string, any>
      [key: string]: any
    }) => Interpolation)

/**
 * Lazy representation of a `css` tagged template. Stores the raw template
 * strings and interpolation values without resolving them. Resolution is
 * deferred until a styled component renders (or until explicitly resolved).
 */
export class CSSResult {
  /**
   * Memoized result of `isDynamic(this)`. Populated on first access from
   * `shared.ts#isDynamic` (or from `resolveValue` below on lazy populate).
   * CSSResult instances are typically created at module load and reused,
   * so even one rescan saved per nested result adds up across nested
   * composition trees.
   */
  _isDynamic: boolean | undefined = undefined

  /**
   * Memoized resolved CSS string for static CSSResults — populated by
   * `resolveValue` the first time a known-static nested CSSResult is
   * resolved. Safe because props don't affect the output when there are
   * no function interpolations. Skipped for dynamic CSSResults (the
   * resolved string depends on props each call).
   */
  _staticResolved: string | undefined = undefined

  constructor(
    readonly strings: TemplateStringsArray,
    readonly values: Interpolation[],
  ) {}

  /** Resolve with empty props — useful for static templates, testing, and debugging. */
  toString(): string {
    return resolve(this.strings, this.values, {})
  }
}

/** Resolve a tagged template's strings + values into a final CSS string. */
export const resolve = (
  strings: TemplateStringsArray,
  values: Interpolation[],
  props: Record<string, any>,
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: hot-path interpolation resolver — type branches inlined for V8 JIT
): string => {
  // Tagged templates guarantee strings.length === values.length + 1,
  // so strings[0] and strings[i+1] are always defined — no ?? needed.
  // biome-ignore lint/style/noNonNullAssertion: tagged template guarantee — strings.length >= 1
  let result = strings[0]!
  for (let i = 0; i < values.length; i++) {
    const v = values[i]
    // biome-ignore lint/style/noNonNullAssertion: tagged template guarantee — strings.length === values.length + 1, so strings[i+1] exists
    const s = strings[i + 1]!
    // Inline the most common value types to avoid function call overhead.
    // Using if/else (no continue) for better V8 JIT optimization.
    if (typeof v === 'function') {
      const r = v(props)
      result +=
        (typeof r === 'string'
          ? r
          : r == null || r === false || r === true
            ? ''
            : resolveValue(r as Interpolation, props)) + s
    } else if (v == null || v === false || v === true) {
      result += s
    } else if (typeof v === 'string') {
      result += v + s
    } else if (typeof v === 'number') {
      result += v + s
    } else {
      result += resolveValue(v, props) + s
    }
  }
  return result
}

/**
 * Normalize resolved CSS text for strict `insertRule` compatibility.
 *
 * Single-pass scanner that handles all cleanup in one traversal:
 * - Strips block comments and line comments (preserves :// in URLs)
 * - Collapses whitespace to single spaces
 * - Removes redundant semicolons
 * - Trims leading/trailing whitespace
 */
const normCache = new Map<string, string>()
/** Clear the normalizeCSS cache (called during HMR cleanup). */
export const clearNormCache = () => normCache.clear()

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: single-pass CSS normalizer — comment/whitespace/semicolon handling inlined for perf
export const normalizeCSS = (css: string): string => {
  const cached = normCache.get(css)
  if (cached !== undefined) return cached

  const len = css.length
  let out = ''
  let space = false // pending space to emit before next non-whitespace char
  let last = 0 // charCode of last char written to output (0 = nothing yet)
  // Run batching: instead of `out += css[i]` per regular character (each
  // append allocates a 1-char string + cons), track the start of the current
  // "regular chars" span and flush it via a single `slice()` at the next
  // special-char boundary. The flush is inlined (not a closure) — the prior
  // closure-based version regressed short inputs by 15%; inline is net
  // positive on both short and long CSS strings.
  let runStart = 0

  for (let i = 0; i < len; i++) {
    const c = css.charCodeAt(i)

    // /* block comment */
    if (c === 47 /* / */ && css.charCodeAt(i + 1) === 42 /* * */) {
      // Inline flush of the regular-char run ending at i.
      if (i > runStart) {
        if (space && last !== 0) out += ' '
        space = false
        out += css.slice(runStart, i)
        last = css.charCodeAt(i - 1)
      }
      const end = css.indexOf('*/', i + 2)
      i = end === -1 ? len : end + 1
      space = true
      runStart = i + 1
      continue
    }

    // // line comment (but not :// in URLs)
    if (
      c === 47 /* / */ &&
      css.charCodeAt(i + 1) === 47 /* / */ &&
      last !== 58 /* : */
    ) {
      if (i > runStart) {
        if (space && last !== 0) out += ' '
        space = false
        out += css.slice(runStart, i)
        last = css.charCodeAt(i - 1)
      }
      const nl = css.indexOf('\n', i + 2)
      i = nl === -1 ? len : nl
      space = true
      runStart = i + 1
      continue
    }

    // Whitespace → collapse
    if (c === 32 || c === 9 || c === 10 || c === 13 || c === 12) {
      if (i > runStart) {
        if (space && last !== 0) out += ' '
        space = false
        out += css.slice(runStart, i)
        last = css.charCodeAt(i - 1)
      }
      space = true
      runStart = i + 1
      continue
    }

    // Semicolon → skip if redundant (after start, {, }, or another ;)
    if (c === 59 /* ; */) {
      if (i > runStart) {
        if (space && last !== 0) out += ' '
        space = false
        out += css.slice(runStart, i)
        last = css.charCodeAt(i - 1)
      }
      if (
        last === 0 ||
        last === 123 /* { */ ||
        last === 125 /* } */ ||
        last === 59 /* ; */
      ) {
        runStart = i + 1
        continue
      }
      space = false
      out += ';'
      last = 59
      runStart = i + 1
    }

    // Regular char — extend the run; nothing to do until the next boundary.
  }
  // Flush trailing run.
  if (len > runStart) {
    if (space && last !== 0) out += ' '
    out += css.slice(runStart, len)
  }

  // Evict oldest ~10% to prevent memory leaks without cliff-edge drop
  if (normCache.size > 2000) {
    evictMapByPercent(normCache, 0.1)
  }
  normCache.set(css, out)

  return out
}

export const resolveValue = (
  value: Interpolation,
  props: Record<string, any>,
): string => {
  // null, undefined, false, true → empty (enables conditional: ${cond && css`...`})
  if (value == null || value === false || value === true) return ''

  // function interpolation → call with props/theme context, resolve result
  if (typeof value === 'function')
    return resolveValue(value(props) as Interpolation, props)

  // nested CSSResult → recursively resolve, with static-result memoization.
  // When `_isDynamic === false` (populated by shared.ts#isDynamic at styled
  // component creation time), the resolved string is independent of props
  // and can be cached on the instance — saves re-walking strings/values for
  // every consumer of a shared static snippet.
  if (value instanceof CSSResult) {
    if (value._isDynamic === false) {
      if (value._staticResolved === undefined) {
        value._staticResolved = resolve(value.strings, value.values, {})
      }
      return value._staticResolved
    }
    return resolve(value.strings, value.values, props)
  }

  // array of results (e.g. from makeItResponsive's breakpoints.map())
  // Uses loop instead of .map().join() to avoid intermediate array allocation
  if (Array.isArray(value)) {
    let arrayResult = ''
    for (let i = 0; i < value.length; i++) {
      arrayResult += resolveValue(value[i], props)
    }
    return arrayResult
  }

  return String(value)
}
