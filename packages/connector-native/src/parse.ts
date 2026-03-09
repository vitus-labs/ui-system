type StyleObject = Record<string, string | number>

const CAMEL_RE = /-([a-z])/g
const NUMERIC_RE = /^-?\d+(\.\d+)?$/

/**
 * Converts a kebab-case CSS property to camelCase for React Native.
 *
 * @example toCamelCase('background-color') // 'backgroundColor'
 */
const toCamelCase = (prop: string): string =>
  prop.trim().replace(CAMEL_RE, (_, c: string) => c.toUpperCase())

const parseValue = (_prop: string, raw: string): string | number => {
  const trimmed = raw.trim()

  // px values → numeric
  if (trimmed.endsWith('px')) {
    const n = Number.parseFloat(trimmed)
    if (!Number.isNaN(n)) return n
  }

  // plain numeric — always convert to number
  if (NUMERIC_RE.test(trimmed)) {
    return Number.parseFloat(trimmed)
  }

  return trimmed
}

/**
 * Parses a CSS declaration string into a React Native style object.
 * Converts kebab-case properties to camelCase and numeric/px values to numbers.
 *
 * @param cssText - Semicolon-separated CSS declarations (e.g. `"width: 100px; color: red"`)
 * @returns A flat style object suitable for React Native's `style` prop
 *
 * @example
 * parseCSS('background-color: red; width: 100px')
 * // { backgroundColor: 'red', width: 100 }
 */
export const parseCSS = (cssText: string): StyleObject => {
  const style: StyleObject = {}
  const declarations = cssText.split(';')

  for (const decl of declarations) {
    const colonIdx = decl.indexOf(':')
    if (colonIdx === -1) continue

    const rawProp = decl.slice(0, colonIdx)
    const rawValue = decl.slice(colonIdx + 1)

    if (!rawProp.trim() || !rawValue.trim()) continue

    const prop = toCamelCase(rawProp)
    style[prop] = parseValue(prop, rawValue)
  }

  return style
}

/**
 * Deep-merges multiple style sources into a single flat style object.
 * Supports nested arrays (like React Native's `style` prop) and skips falsy values.
 *
 * @param sources - Style objects, arrays of style objects, or falsy values
 * @returns A merged flat style object (later sources override earlier)
 */
export const mergeStyles = (
  ...sources: (StyleObject | any[] | undefined | null | false)[]
): StyleObject => {
  const result: StyleObject = {}
  for (const src of sources) {
    if (!src || typeof src !== 'object') continue
    if (Array.isArray(src)) {
      Object.assign(result, mergeStyles(...src))
    } else {
      Object.assign(result, src)
    }
  }
  return result
}
