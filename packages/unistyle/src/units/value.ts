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
 * - Numbers without a unit are divided by `rootSize` and output as rem (web) or px (native).
 * - Values that already carry a unit are returned as-is, unless converting px→rem.
 * - Zero is always returned unitless.
 */
const value: Value = (
  param,
  rootSize = 16,
  outputUnit = __WEB__ ? 'rem' : 'px',
) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  if (isNotValue(param)) return null as any

  const [value, unit] = stripUnit(param as string, true)
  if (isNotValue(value)) return null
  if (value === 0 || typeof value === 'string') return param // zero should be unitless

  if (rootSize && !Number.isNaN(value)) {
    if (!unit && outputUnit === 'px') return `${value}${outputUnit}`
    if (!unit) return `${value / rootSize}rem`
    if (unit === 'px' && outputUnit === 'rem') return `${value / rootSize}rem`
  }

  if (unit) return param

  return `${value}${outputUnit}`
}

export default value
