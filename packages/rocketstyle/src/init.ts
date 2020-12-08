import { isEmpty } from '@vitus-labs/core'
import styleComponent from './rocketstyle'
import {
  getKeys,
  getMultipleDimensions,
  getDimensionsValues,
} from './initUtils'
import { Dimensions, StyleComponent, ElementType } from './types'

const defaultDimensions = {
  states: 'state',
  sizes: 'size',
  variants: 'variant',
  multiple: {
    propName: 'multiple',
    multi: true,
  },
}

type Rocketstyle = <T = unknown, CT = unknown>() => <
  // S extends Style = Style,
  D extends Dimensions = typeof defaultDimensions
  UB extends boolean = true
>({
  dimensions,
  useBooleans,
}: // styles,
{
  dimensions?: D
  useBooleans: UB
  // styles?: S
}) => <C extends ElementType>({
  name,
  component,
}: {
  name: string
  component: C
}) => ReturnType<StyleComponent<C, T, CT, D, UB>>

const rocketstyle: Rocketstyle = () => ({
  dimensions = defaultDimensions,
  useBooleans = true,
}) => ({ name, component }) => {
  // --------------------------------------------------------
  // handle ERRORS in development mode
  // --------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    type Errors = Partial<{
      component: string
      styles: string
      name: string
      dimensions: string
    }>

    const errors: Errors = {}
    if (!component) {
      errors.component = 'Parameter `component` is missing in params!'
    }

    // if (!styles) {
    //   errors.styles = 'Parameter `styles` is missing in params!'
    // }

    if (!name) {
      errors.name = 'Parameter `name` is missing in params!'
    }

    if (!dimensions) {
      errors.dimensions = 'Parameter `dimensions` is missing in params!'
    }

    if (!isEmpty(errors)) {
      throw Error(JSON.stringify(errors))
    }
  }

  return styleComponent({
    name,
    component,
    // styles,
    useBooleans,
    dimensions,
    dimensionKeys: getKeys(dimensions),
    dimensionValues: getDimensionsValues(dimensions),
    multiKeys: getMultipleDimensions(dimensions),
  })
}

export default rocketstyle
