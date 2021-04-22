import { CONTROL_OPTIONS, CONTROL_MAP, CONTROL_TYPES_GROUPS } from './constants'

import type { Control, StorybookControl } from '~/types'

// --------------------------------------------------------
// Make Controls
// --------------------------------------------------------
type MakeControls = (
  obj: Record<string, Control>
) => Record<string, StorybookControl>

const makeControls: MakeControls = (obj) =>
  Object.entries(obj).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: {
        control: { type: CONTROL_MAP[value.type] || value.type },
        defaultValue: value.value,
        description: value.description,
        options: value.options || CONTROL_OPTIONS[value.type],
        table: {
          disabled: value.disabled,
          category: value.group || CONTROL_TYPES_GROUPS[value.type],
          type: {
            summary: value.valueType,
          },
        },
      },
    }),
    {}
  )

export default makeControls
