/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { Fragment } from 'react'
import { pick, isEmpty } from '@vitus-labs/core'
import { Element } from '@vitus-labs/elements'
import NotFound from '~/components/NotFound'
import { Heading } from '~/components/base'
import getTheme from '~/utils/theme'
import { createJSXCodeArray } from '~/utils/code'
import {
  createControls,
  convertDimensionsToControls,
  getDefaultVitusLabsControls,
  makeStorybookControls,
  disableDimensionControls,
} from '~/utils/controls'
import type {
  RocketDimensions,
  StoryComponent,
  RocketStoryConfiguration,
} from '~/types'
import Provider from './context'
import Item from './components/Item'
import PseudoList from './components/PseudoList'

export type RenderDimension<P = {}> = (
  dimension: RocketDimensions,
  params: RocketStoryConfiguration & {
    ignore: any
  }
) => StoryComponent<P>

const renderDimension: RenderDimension = (
  dimension,
  { name, component, attrs = {}, controls, storyOptions = {}, ignore = [] }
) => {
  // ------------------------------------------------------
  // ROCKETSTYLE COMPONENT INFO
  // ------------------------------------------------------
  const theme = getTheme()
  const statics = component.getStaticDimensions(theme)
  const defaultAttrs = component.getDefaultAttrs(attrs, theme, 'light')
  const { dimensions, useBooleans, multiKeys } = statics

  const finalAttrs = { ...defaultAttrs, ...attrs }

  // ------------------------------------------------------
  // CURRENT ROCKETSTYLE DIMENSION INFO
  // ------------------------------------------------------
  const currentDimension = dimensions[dimension]
  const isMultiKey = !!multiKeys[dimension]

  // ------------------------------------------------------
  // RENDER EMPTY PAGE WHEN DIMENSION IS NOT AVAILABLE
  // ------------------------------------------------------
  const DONT_RENDER = isEmpty(currentDimension)
  if (DONT_RENDER) return NotFound

  // ------------------------------------------------------
  // CONTROLS GENERATION
  // ------------------------------------------------------
  const createdControls = createControls(controls)
  const dimensionControls = convertDimensionsToControls(statics)
  const vitusLabsControls = getDefaultVitusLabsControls(component)

  const finalControls = {
    ...vitusLabsControls,
    ...createdControls,
    ...dimensionControls,
  }

  const storybookControls = makeStorybookControls(finalControls, defaultAttrs)

  // ------------------------------------------------------
  // CREATE DEFAULT STORY DESCRIPTION
  // ------------------------------------------------------
  const hasPseudo = storyOptions.pseudo === true

  let story = `This story renders all _options_ of the **${dimension}** dimension. `
  if (hasPseudo) {
    story += 'Including `pseudo` states.'
  }

  // ------------------------------------------------------
  // STORY COMPONENT
  // ------------------------------------------------------
  const revertedDirection =
    storyOptions.direction === 'rows' ? 'inline' : 'rows'
  const hasStoryOptions = !isEmpty(storyOptions)
  const WrapElement = hasStoryOptions ? Element : Fragment
  const wrapperProps = hasStoryOptions
    ? ({
        block: true,
        contentDirection: hasPseudo
          ? revertedDirection
          : storyOptions.direction,
        contentAlignX: storyOptions.alignX,
        contentAlignY: storyOptions.alignY,
        style: { gap: storyOptions.gap },
      } as const)
    : {}

  const Enhanced: StoryComponent = (props) => (
    <WrapElement {...wrapperProps}>
      {Object.keys(currentDimension).map((item) => {
        // const storyName = `${dimension}-${item}`
        const shouldBeIgnored = ignore.includes(item)
        const key = `${dimension}-${item}`

        const storyProps = {
          key,
          'data-story': key,
          contentDirection: revertedDirection,
          contentAlignX: storyOptions.alignX,
          contentAlignY: storyOptions.alignY,
          style: { gap: storyOptions.gap ? storyOptions.gap / 2 : 0 },
        } as const

        // do not render ignored dimension keys
        if (shouldBeIgnored) return null

        if (storyOptions.pseudo === true) {
          return (
            <WrapElement contentDirection="rows" contentAlignY="top">
              <Heading
                level1
                label={item.charAt(0).toUpperCase() + item.slice(1)}
              />
              <WrapElement
                {...storyProps}
                contentDirection={storyOptions.direction}
                contentAlignY="top"
              >
                <Provider component={component}>
                  <PseudoList
                    itemProps={{
                      ...props,
                      [dimension]: isMultiKey ? [item] : item,
                    }}
                  />
                </Provider>
              </WrapElement>
            </WrapElement>
          )
        }

        return (
          <WrapElement {...storyProps}>
            <Provider component={component}>
              <Item
                {...{
                  ...props,
                  [dimension]: isMultiKey ? [item] : item,
                }}
              />
            </Provider>
          </WrapElement>
        )
      })}
    </WrapElement>
  )

  Enhanced.args = finalAttrs
  Enhanced.argTypes = {
    ...storybookControls,
    ...disableDimensionControls(dimensions, dimension),
  }

  Enhanced.parameters = {
    docs: {
      description: {
        story,
      },
      source: {
        code: createJSXCodeArray(
          name,
          pick(finalAttrs, Object.keys(attrs)),
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

export default renderDimension
