import React from 'react'
import { List } from '@vitus-labs/elements'
import RocketStoryHoc from '~/internal/RocketStoryHoc'
import type {
  ListStoryOptions,
  StoryComponent,
  RocketStoryConfiguration,
} from '~/types'

export type RenderList<P = {}> = (
  render: ListStoryOptions,
  params: RocketStoryConfiguration
) => StoryComponent<P>

export default (list) =>
  RocketStoryHoc((component) => (props) => (
    <List rootElement={false} {...props} {...list} component={component} />
  ))
