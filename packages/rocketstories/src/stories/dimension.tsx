/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { createElement, Fragment } from 'react'
import { pick, isEmpty } from '@vitus-labs/core'
import { Element, Text } from '@vitus-labs/elements'
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

import type {
  RocketType,
  StoryComponent,
  Configuration,
  ExtractDimensions,
} from '~/types'

type MakeDimensionStories = <T extends RocketType>({
  name,
  component,
  dimension,
  attrs,
}: {
  name: string
  component: T
  dimension: ExtractDimensions<T>
  attrs: Configuration['attrs']
  storyOptions: Configuration['storyOptions']
  ignore: any
}) => StoryComponent

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const makeDimensionStories: MakeDimensionStories = ({
  name,
  component,
  dimension,
  attrs = {},
  storyOptions = {},
  ignore,
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
  const WrapElement = isEmpty(storyOptions) ? Fragment : Element

  const Enhanced = (props) => (
    <WrapElement
      block
      contentDirection={storyOptions.direction}
      contentAlignX={storyOptions.alignX}
      contentAlignY={storyOptions.alignY}
      // @ts-ignore
      style={{ gap: storyOptions.gap }}
    >
      {Object.keys(currentDimension).map((item) => {
        const shouldBeIgnored = ignore.includes(item)
        const key = `${dimension}-${item}`

        // do not render ignored dimension keys
        if (shouldBeIgnored) return null

        if (storyOptions.pseudo === true) {
          return (
            <WrapElement
              key={key}
              data-story={key}
              contentDirection={
                storyOptions.direction === 'rows' ? 'inline' : 'rows'
              }
              contentAlignX={storyOptions.alignX}
              contentAlignY={storyOptions.alignY}
              // @ts-ignore
              style={{ gap: storyOptions.gap / 2 }}
            >
              <div>
                <Text paragraph>Base</Text>
                {createElement(component, {
                  ...props,
                  [dimension]: isMultiKey ? [item] : item,
                })}
              </div>

              <div>
                <Text paragraph>Hover</Text>
                {createElement(component, {
                  ...props,
                  [dimension]: isMultiKey ? [item] : item,
                  hover: true,
                })}
              </div>

              <div>
                <Text paragraph>Pressed</Text>
                {createElement(component, {
                  ...props,
                  [dimension]: isMultiKey ? [item] : item,
                  pressed: true,
                })}
              </div>

              <div>
                <Text paragraph>Active</Text>
                {createElement(component, {
                  ...props,
                  [dimension]: isMultiKey ? [item] : item,
                  active: true,
                })}
              </div>
            </WrapElement>
          )
        }

        return (
          <WrapElement
            key={key}
            data-story={`${dimension}-${item}`}
            {...storyOptions}
            contentDirection="rows"
          >
            {createElement(component, {
              ...props,
              [dimension]: isMultiKey ? [item] : item,
            })}
          </WrapElement>
        )
      })}
    </WrapElement>
  )

  Enhanced.args = args
  Enhanced.argTypes = {
    ...storybookControls,
    ...disableDimensionControls(dimensions, dimension as any),
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
          dimension as any,
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
