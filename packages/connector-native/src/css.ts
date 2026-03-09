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

const resolveInterpolation = (value: Interpolation, props: any): string => {
  if (value == null || value === false || value === true) return ''
  if (typeof value === 'function') {
    const result = value(props)
    return resolveInterpolation(result, props)
  }
  if (isCSSResult(value)) {
    // Nested css`` — resolve it and convert back to CSS-like string
    const resolved = value.resolve(props)
    return Object.entries(resolved)
      .map(([k, v]) => `${k}: ${v}`)
      .join('; ')
  }
  if (typeof value === 'object') {
    return Object.entries(value)
      .map(([k, v]) => `${k}: ${v}`)
      .join('; ')
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
