// @ts-nocheck
import React, { createElement } from 'react'
import { createJSXCodeArray } from '~/utils/code'
import ROCKET_PROPS from '~/constants/defaultRocketProps'
import {
  transformToControls,
  filterControls,
  filterDefaultProps,
  disableDimensionControls,
  mergeOptions,
} from '~/utils/controls'
import { transformDimensionsToControls } from '~/utils/dimensions'
import theme from '~/utils/theme'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const makeDimensionStories = ({ name, component, dimension, attrs = {} }) => {
  const statics = component.getStaticDimensions(theme)
  const defaultProps = component.getDefaultProps(attrs, theme, 'light')
  const { dimensions, useBooleans, multiKeys } = statics
  const currentDimension = dimensions[dimension]
  const isMultiKey = !!multiKeys[dimension]
  const transformedProps = transformDimensionsToControls(statics)

  const Enhanced = (props) => {
    // TODO: add info that nothing to render is here
    if (!currentDimension) return null

    return (
      <>
        {Object.keys(currentDimension).map((item) =>
          createElement(component, {
            ...props,
            [dimension]: isMultiKey ? [item] : item,
          })
        )}
      </>
    )
  }

  const controlAttrs = transformToControls(
    mergeOptions({
      defaultProps,
      attrs: { ...transformedProps, ...ROCKET_PROPS, ...attrs },
    })
  )
  const arg = filterDefaultProps(controlAttrs)

  Enhanced.args = arg
  Enhanced.argTypes = {
    ...filterControls(controlAttrs),
    ...disableDimensionControls(dimension, dimensions),
  }

  Enhanced.parameters = {
    docs: {
      // description: {
      //   story: 'some story **markdown**',
      // },
      source: {
        code: createJSXCodeArray(
          name,
          arg,
          dimension,
          currentDimension,
          useBooleans
        ),
      },
    },
  }

  return Enhanced
}

export default makeDimensionStories
