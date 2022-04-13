import React, { createElement } from 'react'
import RocketStoryHoc from '~/internal/RocketStoryHoc'

import type { StoryComponent, RocketStoryConfiguration } from '~/types'

export type RenderMain<P = {}> = (
  params: RocketStoryConfiguration
) => StoryComponent<P>

export default RocketStoryHoc((component) => (props) => (
  <>{createElement(component, props)}</>
))
