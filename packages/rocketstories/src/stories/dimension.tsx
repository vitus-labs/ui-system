import React, { createElement } from 'react'
import { pick, isEmpty } from '@vitus-labs/core'
import NotFound from '~/components/NotFound'
import getTheme from '~/utils/theme'
import { createJSXCodeArray } from '~/utils/code'
import {
  filterDefaultValues,
  disableDimensionControls,
  dimensionsToControls,
  makeControls,
  filterControls,
  filterValues,
  valuesToControls,
} from '~/utils/controls'

import type { RocketComponent, StoryComponent } from '~/types'

type MakeDimensionStories = ({
  name,
  component,
  dimension,
  attrs,
}: {
  name: string
  component: RocketComponent
  dimension: string
  attrs: Record<string, unknown>
}) => StoryComponent

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const makeDimensionStories: MakeDimensionStories = ({
  name,
  component,
  dimension,
  attrs = {},
  // config = { pseudo: true },
}) => {
  // ------------------------------------------------------
  // ROCKETSTYLE COMPONENT INFO
  // ------------------------------------------------------
  const theme = getTheme()
  const statics = component.getStaticDimensions(theme)
  const defaultAttrs = component.getDefaultAttrs(attrs, theme, 'light')
  const { dimensions, useBooleans, multiKeys } = statics

  const allStoryAttrs = { ...defaultAttrs, ...attrs }

  // ------------------------------------------------------
  // CURRENT ROCKETSTYLE DIMENSION INFO
  // ------------------------------------------------------
  const currentDimension = dimensions[dimension]
  const isMultiKey = !!multiKeys[dimension]

  // ------------------------------------------------------
  //
  // RENDER EMPTY PAGE WHEN DIMENSION IS NOT AVAILABLE
  //
  // ------------------------------------------------------
  const DONT_RENDER = isEmpty(currentDimension)
  if (DONT_RENDER) return NotFound

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
  // STORY COMPONENT
  // ------------------------------------------------------
  const Enhanced = (props) => (
    <>
      {Object.keys(currentDimension).map((item) => (
        <div data-story={item}>
          {createElement(component, {
            ...props,
            [dimension]: isMultiKey ? [item] : item,
          })}
          {/* {config.pseudo && (
            <>
              {createElement(component, {
                ...props,
                [dimension]: isMultiKey ? [item] : item,
                hover: true,
              })}
              {createElement(component, {
                ...props,
                [dimension]: isMultiKey ? [item] : item,
                pressed: true,
              })}
              {createElement(component, {
                ...props,
                [dimension]: isMultiKey ? [item] : item,
                active: true,
              })}
            </>
          )} */}
        </div>
      ))}
    </>
  )

  Enhanced.args = args
  Enhanced.argTypes = {
    ...storybookControls,
    ...disableDimensionControls(dimensions, dimension),
  }

  Enhanced.parameters = {
    docs: {
      // description: {
      //   story: 'some story **markdown**',
      // },
      source: {
        code: createJSXCodeArray(
          name,
          pick(args, Object.keys(attrs)),
          dimension,
          currentDimension,
          useBooleans,
          isMultiKey
        ),
      },
    },
  }

  return Enhanced
}

export default makeDimensionStories
