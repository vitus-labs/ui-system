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

// `<List {...list}>` spreads a dynamic ListStoryOptions; the strict public
// overloads can't pick a branch from a fully-spread shape. Cast to a loose
// callable for this internal HOC plumbing — runtime is correct.
const LooseList = List as (props: Record<string, unknown>) => React.ReactNode

export default (list: ListStoryOptions) =>
  RocketStoryHoc(
    (component: ComponentType) => (props: Record<string, unknown>) => (
      <LooseList
        rootElement={false}
        itemProps={props}
        {...list}
        component={component}
      />
    ),
  )
