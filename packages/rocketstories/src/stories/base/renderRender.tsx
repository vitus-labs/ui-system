import type { FC } from 'react'
import StoryHoc from '~/internal/StoryHoc'
import type { RocketStoryConfiguration, StoryComponent } from '~/types'

export type RenderRender<P = {}> = (
  render: FC,
  params: RocketStoryConfiguration,
) => StoryComponent<P>

export default (render: FC) => StoryHoc(() => render)
