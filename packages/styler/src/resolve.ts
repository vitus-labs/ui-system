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

/**
 * Normalize resolved CSS text for strict `insertRule` compatibility.
 *
 * Single-pass scanner that handles all cleanup in one traversal:
 * - Strips block comments and line comments (preserves :// in URLs)
 * - Collapses whitespace to single spaces
 * - Removes redundant semicolons
 * - Trims leading/trailing whitespace
 */
export const normalizeCSS = (css: string): string => {
  const len = css.length
  let out = ''
  let space = false // pending space to emit before next non-whitespace char
  let last = 0 // charCode of last char written to output (0 = nothing yet)

  for (let i = 0; i < len; i++) {
    const c = css.charCodeAt(i)

    // /* block comment */
    if (c === 47 /* / */ && css.charCodeAt(i + 1) === 42 /* * */) {
      const end = css.indexOf('*/', i + 2)
      i = end === -1 ? len : end + 1
      space = true
      continue
    }

    // // line comment (but not :// in URLs)
    if (
      c === 47 /* / */ &&
      css.charCodeAt(i + 1) === 47 /* / */ &&
      last !== 58 /* : */
    ) {
      const nl = css.indexOf('\n', i + 2)
      i = nl === -1 ? len : nl
      space = true
      continue
    }

    // Whitespace → collapse
    if (c === 32 || c === 9 || c === 10 || c === 13 || c === 12) {
      space = true
      continue
    }

    // Semicolon → skip if redundant (after start, {, }, or another ;)
    if (c === 59 /* ; */) {
      if (
        last === 0 ||
        last === 123 /* { */ ||
        last === 125 /* } */ ||
        last === 59 /* ; */
      ) {
        continue
      }
      space = false
      out += ';'
      last = 59
      continue
    }

    // Regular char — emit pending space (but not at start of output)
    if (space && last !== 0) out += ' '
    space = false

    out += css[i]
    last = c
  }

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
