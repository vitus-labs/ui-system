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

const isNotValue = (value) => !value && value !== 0

export type Value = (
  param: string | number | null | undefined,
  rootSize?: number,
  outputUnit?: CssUnits,
) => string | number | null

const value: Value = (
  param,
  rootSize = 16,
  outputUnit = __WEB__ ? 'rem' : 'px',
) => {
  if (!param || isNotValue(param)) return null

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
