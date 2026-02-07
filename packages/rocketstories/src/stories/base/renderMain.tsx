/**
 * Renders the main (default) story for a regular non-rocketstyle component.
 * Wraps the component through StoryHoc to attach Storybook controls, then
 * renders it with createElement using the current args.
 */
import { type ComponentType, createElement } from 'react'
import StoryHoc from '~/internal/StoryHoc'

import type { RocketStoryConfiguration, StoryComponent } from '~/types'

export type RenderMain<P = {}> = (
  params: RocketStoryConfiguration,
) => StoryComponent<P>

export default StoryHoc(
  (component: ComponentType) => (props: Record<string, unknown>) => (
    <>{createElement(component, props)}</>
  ),
)
