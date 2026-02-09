/**
 * Renders the main (default) story for a rocketstyle component.
 * Wraps the component through RocketStoryHoc to auto-generate dimension
 * controls and Vitus Labs-specific argTypes, then renders it with createElement.
 */
import { type ComponentType, createElement } from 'react'
import RocketStoryHoc from '~/internal/RocketStoryHoc'

import type { RocketStoryConfiguration, StoryComponent } from '~/types'

export type RenderMain<P = {}> = (
  params: RocketStoryConfiguration,
) => StoryComponent<P>

export default RocketStoryHoc(
  (component: ComponentType) => (props: Record<string, unknown>) => (
    <>{createElement(component, props)}</>
  ),
)
