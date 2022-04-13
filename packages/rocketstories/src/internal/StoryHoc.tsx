import { createElement } from 'react'
import { createControls, makeStorybookControls } from '~/utils/controls'
import type { StoryConfiguration, StoryComponent } from '~/types'

export type Story<P = {}> = (
  WrappedComponent: any
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
