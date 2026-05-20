/**
 * Utilities for creating, converting, and formatting Storybook controls.
 * Handles transformation from rocketstories control definitions to the
 * Storybook argTypes format, including dimension-based select controls
 * and component-specific default controls.
 */
import * as CONTROLS from '~/controls'
import type {
  ControlConfiguration,
  Controls,
  RocketType,
  StorybookControl,
} from '~/types'

/** Normalizes user-supplied control shorthand (string or object) into full ControlConfiguration objects. */
export const createControls = (props: Record<string, any>) => {
  // Mutate accumulator directly. The previous `Object.entries.reduce` with
  // `return { ...acc, [key]: value }` per iteration was O(n²) — every
  // assignment cloned the whole accumulated object. for-in + mutation is O(n).
  const result: Record<string, any> = {}
  for (const key in props) {
    const value = props[key]
    if (typeof value === 'string') {
      result[key] = { type: value }
    } else if (typeof value === 'object' && value !== null) {
      result[key] = value
    }
  }
  return result
}

type ConvertDimensionsToControls = ({
  dimensions,
  multiKeys,
}: {
  dimensions: Record<string, any>
  multiKeys: Record<string, true>
}) => Controls

/** Converts rocketstyle dimension metadata into select/multi-select Storybook controls. */
export const convertDimensionsToControls: ConvertDimensionsToControls = ({
  dimensions,
  multiKeys,
}) => {
  // O(n) via direct mutation — same reasoning as `createControls`. Saves the
  // per-iteration `{...acc, [key]: control}` clone for components with many
  // dimensions (typical design-system buttons run 4-8 dimensions).
  const result: Record<string, any> = {}
  for (const key in dimensions) {
    const value = dimensions[key]
    result[key] = {
      type: multiKeys[key] ? 'multi-select' : 'select',
      options: Object.keys(value),
      group: 'Dimensions [Rocketstyle (Vitus-Labs)]',
    }
  }
  return result
}

// --------------------------------------------------------
// values to controls
// --------------------------------------------------------
type GetDefaultVitusLabsControls = (component: RocketType) => Controls

/** Returns pre-defined controls based on the component's Vitus Labs type (Element, List, Text, Overlay). */
export const getDefaultVitusLabsControls: GetDefaultVitusLabsControls = (
  component,
) => {
  const { IS_ROCKETSTYLE, VITUS_LABS__COMPONENT } = component

  const IS_ELEMENT = VITUS_LABS__COMPONENT === '@vitus-labs/elements/Element'
  const IS_LIST = VITUS_LABS__COMPONENT === '@vitus-labs/elements/List'
  const IS_TEXT = VITUS_LABS__COMPONENT === '@vitus-labs/elements/Text'
  const IS_OVERLAY = VITUS_LABS__COMPONENT === '@vitus-labs/elements/Overlay'

  const result = {
    ...(IS_ELEMENT || IS_LIST ? CONTROLS.ELEMENT_CONTROLS : {}),

    ...(IS_LIST ? CONTROLS.LIST_CONTROLS : {}),

    ...(IS_TEXT ? CONTROLS.TEXT_CONTROLS : {}),

    ...(IS_OVERLAY ? CONTROLS.OVERLAY_CONTROLS : {}),

    ...(IS_ROCKETSTYLE ? CONTROLS.ROCKETSTYLE_CONTROLS : {}),
  }

  return result as Controls
}

/** Transforms internal control definitions into the Storybook argTypes format with table metadata. */
type MakeStorybookControls = (
  obj: Record<string, ControlConfiguration>,
  props: Record<string, any>,
) => Record<string, StorybookControl>

export const makeStorybookControls: MakeStorybookControls = (obj, props) =>
  Object.entries(obj).reduce<Record<string, StorybookControl>>(
    (acc, [key, control]) => {
      const defaultValue =
        typeof props[key] !== 'function' ? props[key] : undefined

      if (control.disable) {
        acc[key] = {
          table: {
            disable: control.disable,
          },
        }
      } else {
        acc[key] = {
          control: { type: control.type ?? 'text' },
          description: control.description,
          options: control.options /* || CONTROL_OPTIONS[control.type] */,
          table: {
            defaultValue: {
              summary: defaultValue || control.value,
            },
            disable: control.disable,
            category: control.group /* || CONTROL_TYPES_GROUPS[control.type] */,
            type: {
              summary: control.valueType,
            },
          },
        }
      }

      return acc
    },
    {},
  )

/** Produces argType overrides that hide individual dimension value keys from the controls panel. */
type DisableDimensionControls = (
  dimensions: Record<string, Record<string, unknown>>,
  name?: string,
) => Record<string, { table: { disable: true } }>

export const disableDimensionControls: DisableDimensionControls = (
  dimensions,
  dimensionName,
) => {
  // Two-level O(n) walk via mutation — replaces the nested
  // `acc = {...acc, ...disableControl(item)}` reduce, which was O(n²) over
  // the total number of dimension values.
  const result: Record<string, { table: { disable: true } }> = dimensionName
    ? { [dimensionName]: { table: { disable: true } } }
    : {}
  for (const key in dimensions) {
    const value = dimensions[key]
    for (const item in value) {
      result[item] = { table: { disable: true } }
    }
  }
  return result
}
