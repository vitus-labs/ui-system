import { parseCSS } from '~/parse'

type StyleObject = Record<string, string | number>
type Interpolation =
  | string
  | number
  | boolean
  | null
  | undefined
  | StyleObject
  | CSSResult
  | Interpolation[]
  | ((props: any) => any)

/**
 * Lazy CSS result object produced by `css`. Contains pre-parsed static styles
 * and a `resolve(props)` method for dynamic interpolations.
 */
export type CSSResult = {
  __brand: 'vl.native.css'
  /** Pre-parsed static styles (empty when template has dynamic interpolations). */
  statics: StyleObject
  /** Functions extracted from template interpolations. */
  dynamics: Array<(props: any) => any>
  /** Resolves the template with the given props into a flat style object. */
  resolve: (props: any) => StyleObject
}

const isCSSResult = (v: unknown): v is CSSResult =>
  typeof v === 'object' && v !== null && (v as any).__brand === 'vl.native.css'

const styleObjectToString = (obj: Record<string, unknown>): string => {
  // Single for-in concat avoids the `Object.entries → .map → .join`
  // chain's three intermediate arrays (entries tuple array + transformed
  // array + the implicit array `join` consumes).
  let result = ''
  let first = true
  for (const key in obj) {
    if (first) {
      result = `${key}: ${obj[key]}`
      first = false
    } else {
      result += `; ${key}: ${obj[key]}`
    }
  }
  return result
}

const resolveInterpolation = (value: Interpolation, props: any): string => {
  if (value == null || value === false || value === true) return ''
  if (typeof value === 'function') {
    const result = value(props)
    return resolveInterpolation(result, props)
  }
  if (isCSSResult(value)) {
    // Nested css`` — resolve it and convert back to CSS-like string
    return styleObjectToString(value.resolve(props))
  }
  if (Array.isArray(value)) {
    // Array of interpolations — e.g. the per-breakpoint output of
    // unistyle's makeItResponsive ([CSSResult, '', CSSResult, …]). Resolve
    // each entry and join as `;`-separated declarations so the outer parse
    // splits them correctly. Without this branch arrays fell through to the
    // object path below and stringified to "0: [object Object]; …".
    let out = ''
    for (let i = 0; i < value.length; i++) {
      const part = resolveInterpolation(value[i] as Interpolation, props)
      if (part) out += `${part};`
    }
    return out
  }
  if (typeof value === 'object') {
    return styleObjectToString(value as Record<string, unknown>)
  }
  return String(value)
}

/**
 * Tagged template for CSS on React Native. Parses CSS declarations into
 * a style object, with support for dynamic interpolations via functions.
 *
 * Static templates (no functions) are parsed once at creation time.
 * Dynamic templates are resolved on each render via `result.resolve(props)`.
 *
 * @example
 * ```ts
 * // Static
 * const base = css`width: 100px; color: red;`
 * base.resolve({}) // { width: 100, color: 'red' }
 *
 * // Dynamic
 * const dynamic = css`width: ${(p) => p.size}px;`
 * dynamic.resolve({ size: 200 }) // { width: 200 }
 * ```
 */
export const css = (
  strings: TemplateStringsArray,
  ...values: Interpolation[]
): CSSResult => {
  const hasDynamics = values.some((v) => typeof v === 'function')

  // Static fast path: no functions, parse once
  if (!hasDynamics) {
    let cssText = strings[0] ?? ''
    for (let i = 0; i < values.length; i++) {
      cssText += resolveInterpolation(values[i], {}) + (strings[i + 1] ?? '')
    }
    const statics = parseCSS(cssText)

    return {
      __brand: 'vl.native.css',
      statics,
      dynamics: [],
      resolve: () => statics,
    }
  }

  // Dynamic path: resolve at render time, cache by assembled CSS text
  const resolveCache = new Map<string, StyleObject>()
  const resolve = (props: any): StyleObject => {
    let cssText = strings[0] ?? ''
    for (let i = 0; i < values.length; i++) {
      cssText += resolveInterpolation(values[i], props) + (strings[i + 1] ?? '')
    }
    let cached = resolveCache.get(cssText)
    if (!cached) {
      if (resolveCache.size > 100) resolveCache.clear()
      cached = parseCSS(cssText)
      resolveCache.set(cssText, cached)
    }
    return cached
  }

  return {
    __brand: 'vl.native.css',
    statics: {},
    dynamics: values.filter((v) => typeof v === 'function') as Array<
      (props: any) => any
    >,
    resolve,
  }
}
