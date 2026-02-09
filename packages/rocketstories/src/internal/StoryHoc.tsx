/**
 * Higher-order component factory for regular (non-rocketstyle) components.
 * Converts user-defined controls into Storybook argTypes and attaches
 * args and argTypes to the returned story component.
 */
import type { StoryComponent, StoryConfiguration } from '~/types'
import { createControls, makeStorybookControls } from '~/utils/controls'

export type Story<P = {}> = (
  WrappedComponent: any,
) => (params: StoryConfiguration) => StoryComponent<P>

const story: Story =
  (WrappedComponent) =>
  ({ component, attrs, controls }) => {
    // ------------------------------------------------------
    // CONTROLS GENERATION
    // ------------------------------------------------------
    const createdControls = createControls(controls)

    const finalControls = createdControls
    const storybookControls = makeStorybookControls(finalControls, attrs)

    const Enhanced = WrappedComponent(component)

    Enhanced.args = attrs
    Enhanced.argTypes = storybookControls

    return Enhanced
  }

export default story
