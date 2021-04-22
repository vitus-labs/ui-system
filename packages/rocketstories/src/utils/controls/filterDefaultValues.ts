import { get } from '@vitus-labs/core'
import type { Controls, Control } from '~/types'

// --------------------------------------------------------
// filterDefaultValues
// --------------------------------------------------------
type FilterDefaultValues = (props: Controls) => Record<string, Control['value']>

const filterDefaultValues: FilterDefaultValues = (props = {}) =>
  Object.entries(props).reduce((acc, [key, value]) => {
    const val = get(value, 'value')
    if (val) return { ...acc, [key]: val }

    return acc
  }, {})

export default filterDefaultValues
