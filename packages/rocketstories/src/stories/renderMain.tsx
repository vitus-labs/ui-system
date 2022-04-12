import React, { createElement } from 'react'
import StoryHoc from '~/internal/StoryHoc'

import type { StoryComponent, RocketStoryConfiguration } from '~/types'

export type RenderMain<P = {}> = (
  params: RocketStoryConfiguration
) => StoryComponent<P>

export default StoryHoc((component) => (props) => (
  <>{createElement(component, props)}</>
))
