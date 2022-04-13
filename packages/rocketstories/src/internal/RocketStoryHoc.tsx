import { pick } from '@vitus-labs/core'
import getTheme from '~/utils/theme'
import { generateMainJSXCode } from '~/utils/code'
import { extractDefaultBooleanProps } from '~/utils/dimensions'
import type { StoryComponent, RocketStoryConfiguration } from '~/types'
import {
  createControls,
  convertDimensionsToControls,
  getDefaultVitusLabsControls,
  makeStorybookControls,
  disableDimensionControls,
} from '~/utils/controls'

export type RocketStory<P = {}> = (
  WrappedComponent: any
) => (params: RocketStoryConfiguration) => StoryComponent<P>

const rocketStory: RocketStory =
  (WrappedComponent) =>
  ({ name, component, attrs, controls }) => {
    // ------------------------------------------------------
    // ROCKETSTYLE COMPONENT INFO
    // ------------------------------------------------------
    const theme = getTheme()
    const statics = component.getStaticDimensions(theme)
    const defaultAttrs = component.getDefaultAttrs(attrs, theme, 'light')
    const { dimensions, useBooleans, multiKeys } = statics

    const finalAttrs = { ...defaultAttrs, ...attrs }

    // ------------------------------------------------------
    // CONTROLS GENERATION
    // ------------------------------------------------------
    const createdControls = createControls(controls)
    const dimensionControls = convertDimensionsToControls(statics)
    const vitusLabsControls = getDefaultVitusLabsControls(component)

    const finalControls = {
      ...dimensionControls,
      ...vitusLabsControls,
      ...createdControls,
    }

    const storybookControls = makeStorybookControls(finalControls, defaultAttrs)

    // ------------------------------------------------------
    // CREATE DEFAULT STORY DESCRIPTION
    // ------------------------------------------------------
    const story = `This story is a showcase of a _${name}_ component`

    // ------------------------------------------------------
    // PROPS TO BE PASSED TO CODE GENERATION
    // ------------------------------------------------------
    // TODO

    // ------------------------------------------------------
    // STORY COMPONENT
    // ------------------------------------------------------
    const Enhanced = WrappedComponent(component)

    Enhanced.args = finalAttrs
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
            dimensions: {},
            props: pick(finalAttrs, Object.keys(attrs)),
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

export default rocketStory
