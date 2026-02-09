/**
 * Renders a list story for a rocketstyle component.
 * Accepts list configuration and wraps the component through RocketStoryHoc,
 * rendering it inside a Vitus Labs List element with auto-generated controls.
 */

import { List } from '@vitus-labs/elements'
import type { ComponentType } from 'react'
import RocketStoryHoc from '~/internal/RocketStoryHoc'
import type {
  ListStoryOptions,
  RocketStoryConfiguration,
  StoryComponent,
} from '~/types'

export type RenderList<P = {}> = (
  render: ListStoryOptions,
  params: RocketStoryConfiguration,
) => StoryComponent<P>

export default (list: ListStoryOptions) =>
  RocketStoryHoc(
    (component: ComponentType) => (props: Record<string, unknown>) => (
      <List
        rootElement={false}
        itemProps={props}
        {...list}
        component={component}
      />
    ),
  )
