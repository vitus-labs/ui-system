import stripUnit from './stripUnit'

type CssUnits =
  | 'px'
  | 'rem'
  | '%'
  | 'em'
  | 'ex'
  | 'cm'
  | 'mm'
  | 'in'
  | 'pt'
  | 'pc'
  | 'ch'
  | 'vh'
  | 'vw'
  | 'vmin'
  | 'vmax'

/** Returns true for null/undefined/NaN but not for 0. */
const isNotValue = (value: unknown) => !value && value !== 0

export type Value = (
  param: string | number | null | undefined,
  rootSize?: number,
  outputUnit?: CssUnits,
) => string | number | null

/**
 * Converts a raw numeric value to a CSS string with appropriate units.
 * - Numbers without a unit are divided by `rootSize` and output as rem/em (web default rem, native px).
 *   Other output units (px, %, vw, …) append the unit without conversion.
 * - Values that already carry a unit are returned as-is, unless converting px→rem.
 * - Zero is always returned unitless.
 */
const value: Value = (
  param,
  rootSize = 16,
  outputUnit = __WEB__ ? 'rem' : 'px',
) => {
  if (isNotValue(param)) return null as any

  const [val, unit] = stripUnit(param as string, true)
  if (isNotValue(val)) return null
  if (val === 0 || typeof val === 'string') return param // zero should be unitless

  const canConvert = rootSize && !Number.isNaN(val)
  // rem/em are root-relative: px-based numbers are divided by rootSize
  const relative = outputUnit === 'rem' || outputUnit === 'em'
  if (canConvert && relative && (!unit || unit === 'px'))
    return `${val / rootSize}${outputUnit}`
  if (unit) return param

  return `${val}${outputUnit}`
}

export default value
