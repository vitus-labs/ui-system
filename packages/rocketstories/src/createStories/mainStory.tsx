import React, { createElement } from 'react'
import ROCKET_PROPS from '~/constants/defaultRocketProps'
import { createJSXCode } from '~/utils/code'
import {
  transformToControls,
  filterControls,
  filterDefaultProps,
  disableDimensionControls,
  mergeOptions,
} from '~/utils/controls'
import {
  transformDimensionsToControls,
  extractDefaultBooleanProps,
} from '~/utils/dimensions'
import theme from '~/utils/theme'

const createJSX = (name, dimensions, params, booleanDimensions) => {
  let result = ''

  result += createJSXCode(name, { ...dimensions, ...params })

  if (booleanDimensions) {
    result += `\n\n`
    result += `// Or alternatively use boolean props (e.g. ${Object.keys(
      booleanDimensions
    )})`
    result += `\n`
    result += createJSXCode(name, { ...booleanDimensions, ...params })
  }

  return result
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const mainStory = ({ name, component, attrs }) => {
  const statics = component.getStaticDimensions(theme)
  const defaultProps = component.getDefaultProps(attrs, theme, 'light')
  const { useBooleans, multiKeys, dimensions } = statics
  const transformedProps = transformDimensionsToControls(statics)

  const defaultBooleanProps = extractDefaultBooleanProps(dimensions, multiKeys)

  const Enhanced = (props = {}) => (
    <>
      {createElement(component, { ...props })}

      {useBooleans &&
        createElement(component, {
          ...props,
        })}
    </>
  )

  const controlAttrs = transformToControls(
    mergeOptions({
      defaultProps,
      attrs: { ...transformedProps, ...ROCKET_PROPS, ...attrs },
    })
  )

  const arg = filterDefaultProps(controlAttrs)

  console.log(arg)

  Enhanced.args = arg
  Enhanced.argTypes = filterControls(attrs)
  Enhanced.parameters = {
    docs: {
      source: {
        code: createJSX(name, transformedProps, arg, defaultBooleanProps),
      },
    },
  }

  return Enhanced
}

export default mainStory
