import StoryHoc from '~/internal/StoryHoc'
import type { StoryComponent, RocketStoryConfiguration } from '~/types'

export type RenderRender = (
  render,
  params: RocketStoryConfiguration
) => StoryComponent

export default (render) => StoryHoc(() => render)
