import StoryHoc from '~/internal/StoryHoc'
import type { RocketStoryConfiguration, StoryComponent } from '~/types'

export type RenderRender<P = {}> = (
  render,
  params: RocketStoryConfiguration,
) => StoryComponent<P>

export default (render) => StoryHoc(() => render)
