import type { FC } from 'react'
import RocketStoryHoc from '~/internal/RocketStoryHoc'
import type { RocketStoryConfiguration, StoryComponent } from '~/types'

export type RenderRender<P = {}> = (
  render: FC,
  params: RocketStoryConfiguration,
) => StoryComponent<P>

export default (render: FC) => RocketStoryHoc(() => render)
