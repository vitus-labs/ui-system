import { omit } from '@vitus-labs/core'
import { CONTROL_TYPES } from '~/constants/controls'

// --------------------------------------------------------
// Is valid control
// --------------------------------------------------------
type IsValidControl = (value: any) => boolean

const isValidControl: IsValidControl = (value: any) =>
  typeof value === 'object' &&
  value !== null &&
  CONTROL_TYPES.includes(value.type)

// --------------------------------------------------------
// Filter controls
// --------------------------------------------------------
type FilterControls = (obj: Record<string, any>) => Record<string, any>

const filterControls: FilterControls = (obj) =>
  Object.entries(obj).reduce((acc, [key, value]) => {
    if (isValidControl(value)) return { ...acc, [key]: value }

    return acc
  }, {})

// --------------------------------------------------------
// Filter values
// --------------------------------------------------------

type FilterValues = (obj: Record<string, any>) => Record<string, any>

const filterValues: FilterValues = (obj) => {
  const controls = filterControls(obj)
  const controlKeys = Object.keys(controls)

  return omit(obj, controlKeys)
}

export { filterControls, filterValues }
