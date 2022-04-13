import RocketStoryHoc from '~/internal/RocketStoryHoc'
import type { StoryComponent, RocketStoryConfiguration } from '~/types'

export type RenderRender<P = {}> = (
  render,
  params: RocketStoryConfiguration
) => StoryComponent<P>

export default (render) => RocketStoryHoc(() => render)
