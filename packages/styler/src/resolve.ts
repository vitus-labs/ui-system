/**
 * Interpolation resolver: converts tagged template strings + values into a
 * final CSS string. Handles nested CSSResults, arrays, functions, and
 * primitive values.
 */

export type Interpolation =
  | string
  | number
  | boolean
  | null
  | undefined
  | CSSResult
  | Interpolation[]
  | ((props: any) => Interpolation)

/**
 * Lazy representation of a `css` tagged template. Stores the raw template
 * strings and interpolation values without resolving them. Resolution is
 * deferred until a styled component renders (or until explicitly resolved).
 */
export class CSSResult {
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
): string => {
  let result = strings[0] ?? ''
  for (let i = 0; i < values.length; i++) {
    result += resolveValue(values[i], props) + (strings[i + 1] ?? '')
  }
  return result
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

  // nested CSSResult → recursively resolve
  if (value instanceof CSSResult)
    return resolve(value.strings, value.values, props)

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
