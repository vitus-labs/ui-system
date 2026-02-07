/**
 * Renders a list story for a regular non-rocketstyle component.
 * Accepts list configuration (data, itemKey, etc.) and wraps the component
 * through StoryHoc, rendering it inside a Vitus Labs List element.
 */
import { List } from '@vitus-labs/elements'
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

export default (list) =>
  StoryHoc((component) => (props) => (
    <List
      rootElement={false}
      {...list}
      itemProps={props}
      component={component}
    />
  ))
