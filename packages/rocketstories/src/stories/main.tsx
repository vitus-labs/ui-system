import React, { createElement } from 'react'
import { pick } from '@vitus-labs/core'
import getTheme from '~/utils/theme'
import { createMainJSX } from '~/utils/code'
import { extractDefaultBooleanProps } from '~/utils/dimensions'
import {
  filterDefaultValues,
  makeControls,
  filterControls,
  filterValues,
  valuesToControls,
  dimensionsToControls,
  disableDimensionControls,
} from '~/utils/controls'
import type { StoryComponent, RocketStoryConfiguration } from '~/types'

type MainStory = (params: RocketStoryConfiguration) => StoryComponent

const mainStory: MainStory = ({ name, component, attrs }) => {
  // ------------------------------------------------------
  // ROCKETSTYLE COMPONENT INFO
  // ------------------------------------------------------
  const theme = getTheme()
  const statics = component.getStaticDimensions(theme)
  const defaultAttrs = component.getDefaultAttrs(attrs, theme, 'light')
  const { dimensions, useBooleans, multiKeys } = statics

  const allStoryAttrs = { ...defaultAttrs, ...attrs }

  // ------------------------------------------------------
  // CONTROLS GENERATION
  // ------------------------------------------------------
  const definedControls = filterControls(allStoryAttrs)
  const values = filterValues(allStoryAttrs)

  const dimensionControls = dimensionsToControls(statics)

  const controls = valuesToControls({
    component,
    values,
    dimensionControls,
  })

  const storybookControls = makeControls({
    ...controls,
    ...definedControls,
  })

  // ------------------------------------------------------
  // CONTROLS DEFAULT VALUES
  // ------------------------------------------------------
  const args = filterDefaultValues(controls)

  // ------------------------------------------------------
  // PROPS TO BE PASSED TO ODE GENERATION
  // ------------------------------------------------------
  const codeDimensionProps = Object.entries(dimensionControls).reduce(
    (acc, [key, value]) => ({ ...acc, [key]: value.value }),
    {}
  )

  const codeProps = pick(args, Object.keys(attrs))

  // ------------------------------------------------------
  // STORY COMPONENT
  // ------------------------------------------------------
  const Enhanced = (props) => <>{createElement(component, props)}</>

  Enhanced.args = args
  Enhanced.argTypes = {
    ...storybookControls,
    ...disableDimensionControls(dimensions),
  }

  Enhanced.parameters = {
    docs: {
      source: {
        code: createMainJSX({
          name,
          dimensions: codeDimensionProps,
          params: codeProps,
          booleanDimensions: useBooleans
            ? extractDefaultBooleanProps({
                dimensions,
                multiKeys,
              })
            : null,
        }),
      },
    },
  }

  return Enhanced
}

export default mainStory
