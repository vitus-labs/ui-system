import React, { createElement } from 'react'
import { pick } from '@vitus-labs/core'
import getTheme from '~/utils/theme'
import { generateMainJSXCode } from '~/utils/code'
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

export type RenderMain<P = {}> = (
  WrappedComponent: any
) => (params: RocketStoryConfiguration) => StoryComponent<P>

const renderMain: RenderMain =
  (WrappedComponent) =>
  ({ name, component, attrs }) => {
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
    // CREATE DEFAULT STORY DESCRIPTION
    // ------------------------------------------------------
    const story = `This story is a showcase of a _${name}_ component`

    // ------------------------------------------------------
    // PROPS TO BE PASSED TO CODE GENERATION
    // ------------------------------------------------------
    const codeDimensionProps = Object.entries(dimensionControls).reduce(
      (acc, [key, value]) => {
        if (value.value) return { ...acc, [key]: value.value }
        return acc
      },
      {}
    )

    // ------------------------------------------------------
    // STORY COMPONENT
    // ------------------------------------------------------
    const Enhanced = WrappedComponent(component)

    Enhanced.args = args
    Enhanced.argTypes = {
      ...storybookControls,
      ...disableDimensionControls(dimensions),
    }

    Enhanced.parameters = {
      docs: {
        description: {
          story,
        },
        source: {
          code: generateMainJSXCode({
            name,
            dimensions: codeDimensionProps,
            props: pick(attrs, Object.keys(attrs)),
            booleanDimensions: extractDefaultBooleanProps({
              dimensions,
              multiKeys,
              useBooleans,
            }),
          }),
        },
      },
    }

    return Enhanced
  }

export default renderMain
