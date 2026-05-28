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

// ── Multi-value box shorthands ──────────────────────────────────────────
// React Native has no `padding: 8px 16px` shorthand — each side is its own
// property. CSS authors expect the shorthand to work, so we expand it into
// RN longhands per the CSS box-model value rules. Without this, multi-value
// shorthands silently parsed to their first token (`padding: 8px 16px` → 8).

// Edge shorthands expand to [top, right, bottom, left] longhands.
const EDGE_SHORTHANDS: Record<
  string,
  readonly [string, string, string, string]
> = {
  margin: ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'],
  padding: ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'],
  inset: ['top', 'right', 'bottom', 'left'],
  borderWidth: [
    'borderTopWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'borderLeftWidth',
  ],
}

// border-radius shorthand is corner-based: [TL, TR, BR, BL].
const RADIUS_LONGHANDS = [
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomRightRadius',
  'borderBottomLeftRadius',
] as const

/**
 * Expand 1–4 CSS edge values into the four [top, right, bottom, left] slots,
 * following CSS shorthand rules:
 *   1 → all sides · 2 → [V, H] · 3 → [top, H, bottom] · 4 → as-is
 */
const expandEdge = <T>(v: T[]): [T, T, T, T] => {
  // biome-ignore lint/style/noNonNullAssertion: callers only pass 1–4 element arrays; index access guarded by length switch
  const a = v[0]!
  switch (v.length) {
    case 1:
      return [a, a, a, a]
    case 2:
      // biome-ignore lint/style/noNonNullAssertion: length === 2 guarantees v[1]
      return [a, v[1]!, a, v[1]!]
    case 3:
      // biome-ignore lint/style/noNonNullAssertion: length === 3 guarantees v[1],v[2]
      return [a, v[1]!, v[2]!, v[1]!]
    default:
      // biome-ignore lint/style/noNonNullAssertion: length >= 4
      return [a, v[1]!, v[2]!, v[3]!]
  }
}

/**
 * Expand 1–4 CSS corner values into [TL, TR, BR, BL] for border-radius:
 *   1 → all corners · 2 → [TL&BR, TR&BL] · 3 → [TL, TR&BL, BR] · 4 → as-is
 */
const expandCorners = <T>(v: T[]): [T, T, T, T] => {
  // biome-ignore lint/style/noNonNullAssertion: callers only pass 1–4 element arrays
  const a = v[0]!
  switch (v.length) {
    case 1:
      return [a, a, a, a]
    case 2:
      // biome-ignore lint/style/noNonNullAssertion: length === 2 guarantees v[1]
      return [a, v[1]!, a, v[1]!]
    case 3:
      // biome-ignore lint/style/noNonNullAssertion: length === 3 guarantees v[1],v[2]
      return [a, v[1]!, v[2]!, v[1]!]
    default:
      // biome-ignore lint/style/noNonNullAssertion: length >= 4
      return [a, v[1]!, v[2]!, v[3]!]
  }
}

/**
 * Splits a CSS value into space-separated tokens, but bails (returns null)
 * for values containing `(` (functions like calc()) or `/` (elliptical
 * radii) where naive whitespace splitting would corrupt the value.
 */
const splitTokens = (value: string): string[] | null => {
  if (value.includes('(') || value.includes('/')) return null
  const tokens = value.trim().split(/\s+/)
  return tokens.length > 1 ? tokens : null
}

/**
 * If `prop` is a known multi-value box shorthand and `rawValue` has multiple
 * tokens, expand into RN longhand entries on `style`. Returns true when it
 * handled the declaration, false to fall through to single-value parsing.
 */
const expandShorthand = (
  style: StyleObject,
  prop: string,
  rawValue: string,
): boolean => {
  const isEdge = prop in EDGE_SHORTHANDS
  const isRadius = prop === 'borderRadius'
  const isGap = prop === 'gap'
  if (!isEdge && !isRadius && !isGap) return false

  const tokens = splitTokens(rawValue)
  if (!tokens) return false // single value or unsplittable → caller handles

  const values = tokens.map((t) => parseValue(prop, t))

  if (isGap) {
    // CSS `gap: row column` (1 value → both axes)
    // biome-ignore lint/style/noNonNullAssertion: tokens.length > 1 here
    style.rowGap = values[0]!
    // biome-ignore lint/style/noNonNullAssertion: tokens.length > 1 here
    style.columnGap = values[1]!
    return true
  }

  // biome-ignore lint/style/noNonNullAssertion: isEdge (prop in EDGE_SHORTHANDS) guaranteed here when not radius/gap
  const slots = isRadius ? RADIUS_LONGHANDS : EDGE_SHORTHANDS[prop]!
  const expanded = isRadius ? expandCorners(values) : expandEdge(values)
  for (let i = 0; i < 4; i++) {
    // biome-ignore lint/style/noNonNullAssertion: slots and expanded are fixed length 4
    style[slots[i]!] = expanded[i]!
  }
  return true
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
    // Multi-value box shorthands (`padding: 8px 16px`) expand into RN
    // longhands; everything else is a single value.
    if (!expandShorthand(style, prop, rawValue)) {
      style[prop] = parseValue(prop, rawValue)
    }
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
