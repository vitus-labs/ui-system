/**
 * Renders a list story for a rocketstyle component.
 * Accepts list configuration and wraps the component through RocketStoryHoc,
 * rendering it inside a Vitus Labs List element with auto-generated controls.
 */
import { List } from '@vitus-labs/elements'
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

export default (list) =>
  RocketStoryHoc((component) => (props) => (
    <List
      rootElement={false}
      itemProps={props}
      {...list}
      component={component}
    />
  ))
