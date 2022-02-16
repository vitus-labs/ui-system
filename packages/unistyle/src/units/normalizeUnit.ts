import stripUnit from './stripUnit'

const isNotValue = (value) => !value && value !== 0

export type NormalizeUnit = ({
  param,
  rootSize,
  outputUnit,
}: {
  param: any
  rootSize?: number
  outputUnit?: 'px' | 'rem' | '%' | string
}) => string | number

const normalizeUnit: NormalizeUnit = ({
  param,
  rootSize = 16,
  outputUnit = __WEB__ ? 'rem' : 'px',
}) => {
  if (isNotValue(param)) return null

  const [value, unit] = stripUnit(param, true)
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

export default normalizeUnit
