import RocketStoryHoc from '~/internal/RocketStoryHoc'
import type { RocketStoryConfiguration, StoryComponent } from '~/types'

export type RenderRender<P = {}> = (
  render,
  params: RocketStoryConfiguration,
) => StoryComponent<P>

export default (render) => RocketStoryHoc(() => render)
