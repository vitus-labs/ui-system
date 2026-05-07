/**
 * Renders a list story for a regular non-rocketstyle component.
 * Accepts list configuration (data, itemKey, etc.) and wraps the component
 * through StoryHoc, rendering it inside a Vitus Labs List element.
 */

import { List } from '@vitus-labs/elements'
import type { ComponentType } from 'react'
import StoryHoc from '~/internal/StoryHoc'
import type {
  ListStoryOptions,
  RocketStoryConfiguration,
  StoryComponent,
} from '~/types'

export type RenderList<P = {}> = (
  render: ListStoryOptions,
  params: RocketStoryConfiguration,
) => StoryComponent<P>

// `<List {...list}>` spreads a dynamic ListStoryOptions; the strict public
// overloads can't pick a branch from a fully-spread shape. Cast to a loose
// callable for this internal HOC plumbing — runtime is correct.
const LooseList = List as (props: Record<string, unknown>) => React.ReactNode

export default (list: ListStoryOptions) =>
  StoryHoc((component: ComponentType) => (props: Record<string, unknown>) => (
    <LooseList
      rootElement={false}
      {...list}
      itemProps={props}
      component={component}
    />
  ))
