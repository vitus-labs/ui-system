import { ComponentType } from 'react'
import { isEmpty } from '@vitus-labs/core'
import styleComponent from './rocketstyle'
import {
  getKeys,
  getMultipleDimensions,
  getDimensionsValues,
} from './initUtils'
import { Dimensions, StyleComponent } from './types'

const defaultDimensions = {
  states: 'state',
  sizes: 'size',
  variants: 'variant',
  multiple: ['multiple', { multi: true }],
}

type Rocketstyle = <
  T = unknown,
  S extends Record<string, unknown> = Record<string, unknown>,
  D extends Dimensions = typeof defaultDimensions
>({
  dimensions,
  styles,
  useBooleans,
}: {
  dimensions?: D
  styles?: S
  useBooleans: boolean
}) => <C = ComponentType>({
  name,
  component,
}: {
  name: string
  component: C
}) => ReturnType<StyleComponent<C, T, S, D>>

const rocketstyle: Rocketstyle = ({
  dimensions = defaultDimensions,
  useBooleans = true,
  styles,
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

    if (!styles) {
      errors.styles = 'Parameter `styles` is missing in params!'
    }

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
    styles,
    useBooleans,
    dimensions,
    dimensionKeys: getKeys(dimensions),
    dimensionValues: getDimensionsValues(dimensions),
    multiKeys: getMultipleDimensions(dimensions),
  })
}

export default rocketstyle
