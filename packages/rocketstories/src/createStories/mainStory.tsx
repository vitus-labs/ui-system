import React, { ComponentType, createElement, VFC } from 'react'
// import { RocketComponentType } from '@vitus-labs/rocketstyle'
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

type MainStory = ({
  name,
  component,
  attrs,
}: {
  name: string
  component: ComponentType
  attrs: Record<string, unknown>
}) => VFC & { args: any; argTypes: any; parameters: any }

const mainStory: MainStory = ({ name, component, attrs }) => {
  // @ts-ignore
  const statics = component.getStaticDimensions(theme)
  // @ts-ignore
  const defaultProps = component.getDefaultProps(attrs, theme, 'light')
  const { useBooleans, multiKeys, dimensions } = statics

  const dimensionControls = transformDimensionsToControls(statics)

  const Enhanced = (props) => (
    <>
      {createElement(component, props)}

      {useBooleans && createElement(component, props)}
    </>
  )

  const controlAttrs = transformToControls(
    mergeOptions({
      defaultProps,
      attrs: { ...dimensionControls, ...ROCKET_PROPS, ...attrs },
    })
  )

  const defaultPropsValues = filterDefaultProps(controlAttrs)
  const defaultBooleanProps = extractDefaultBooleanProps(dimensions, multiKeys)

  Enhanced.args = defaultPropsValues
  Enhanced.argTypes = {
    ...filterControls(controlAttrs),
    ...disableDimensionControls(dimensions),
  }
  Enhanced.parameters = {
    docs: {
      source: {
        code: createJSX(
          name,
          dimensionControls,
          defaultPropsValues,
          defaultBooleanProps
        ),
      },
    },
  }

  return Enhanced
}

export default mainStory
