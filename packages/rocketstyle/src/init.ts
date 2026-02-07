// @ts-nocheck
import { isEmpty } from '@vitus-labs/core'
import { ALL_RESERVED_KEYS } from '~/constants'
import defaultDimensions from '~/constants/defaultDimensions'
import rocketComponent from '~/rocketstyle'
import type { DefaultDimensions, Dimensions } from '~/types/dimensions'
import type { RocketComponent } from '~/types/rocketComponent'
import type { ElementType } from '~/types/utils'
import {
  getDimensionsValues,
  getKeys,
  getMultipleDimensions,
} from '~/utils/dimensions'

export type Rocketstyle = <
  D extends Dimensions = DefaultDimensions,
  UB extends boolean = true,
>({
  dimensions,
  useBooleans,
}?: {
  dimensions?: D
  useBooleans?: UB
}) => <C extends ElementType>({
  name,
  component,
}: {
  name: string
  component: C
}) => ReturnType<RocketComponent<C, {}, {}, D, UB>>

/**
 * Factory initializer for rocketstyle components. Validates dimension
 * configurations against reserved keys, then delegates to the core
 * `rocketComponent` builder with pre-computed dimension metadata.
 */
const rocketstyle: Rocketstyle =
  ({ dimensions = defaultDimensions, useBooleans = true } = {}) =>
  ({ name, component }) => {
    // --------------------------------------------------------
    // handle ERRORS in development mode
    // --------------------------------------------------------
    if (process.env.NODE_ENV !== 'production') {
      type Errors = Partial<{
        component: string
        name: string
        dimensions: string
        invalidDimensions: string
      }>

      const errors: Errors = {}
      if (!component) {
        errors.component = 'Parameter `component` is missing in params!'
      }

      if (!name) {
        errors.name = 'Parameter `name` is missing in params!'
      }

      if (isEmpty(dimensions)) {
        errors.dimensions = 'Parameter `dimensions` is missing in params!'
      } else {
        const definedDimensions = getKeys(dimensions)
        const invalidDimension = ALL_RESERVED_KEYS.some((item) =>
          definedDimensions.includes(item as any),
        )

        if (invalidDimension) {
          errors.invalidDimensions = `Some of your \`dimensions\` is invalid and uses reserved static keys which are
          ${defaultDimensions.toString()}`
        }
      }

      if (!isEmpty(errors)) {
        throw Error(JSON.stringify(errors))
      }
    }

    return rocketComponent({
      name,
      component,
      useBooleans,
      dimensions,
      dimensionKeys: getKeys(dimensions),
      dimensionValues: getDimensionsValues(dimensions),
      multiKeys: getMultipleDimensions(dimensions),
      styled: true,
    })
  }

export default rocketstyle
