import { memoize } from '@vitus-labs/core'
import stripUnit from './stripUnit'

export type NormalizeUnit = ({
  param,
  rootSize,
  outputUnit,
}: {
  param: any
  rootSize?: number
  outputUnit?: 'px' | 'rem' | '%' | string
}) => string | number

const normalizeUnit: NormalizeUnit = memoize(
  ({ param, rootSize = 16, outputUnit = __WEB__ ? 'rem' : 'px' }) => {
    if (!param && param !== 0) return null

    const [value, unit] = stripUnit(param, true)
    if (!value && value !== 0) return null
    if (value === 0 || typeof value === 'string') return param // zero should be unitless

    if (rootSize && !Number.isNaN(value)) {
      if (!unit && outputUnit === 'px') return `${value}${outputUnit}`
      if (!unit) return `${value / rootSize}rem`
      if (unit === 'px' && outputUnit === 'rem') return `${value / rootSize}rem`
    }

    if (unit) return param

    return `${value}${outputUnit}`
  },
  { isDeepEqual: true, maxSize: 1000 }
)

export default normalizeUnit
