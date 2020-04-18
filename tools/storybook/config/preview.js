import React, { Fragment } from 'react'
import { storiesOf, addParameters, addDecorator } from '@storybook/react'
import { MINIMAL_VIEWPORTS, INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs'
import themeDecorator from '../decorators/themeDecorator'

addDecorator(
  themeDecorator({
    rootSize: 16,
    breakpoints: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
    },
    grid: {
      columns: 12,
      container: {
        xs: '100%',
        sm: 540,
        md: 720,
        lg: 960,
        xl: 1140,
      },
    },
  })
)

global.React = React
global.Fragment = Fragment
global.storiesOf = storiesOf
global.STORY = {
  text,
  boolean,
  number,
  withKnobs,
}

addParameters({
  viewport: {
    viewports: { ...MINIMAL_VIEWPORTS, ...INITIAL_VIEWPORTS },
  },
  backgrounds: [
    { name: 'light', value: '#fff', default: true },
    { name: 'dark', value: '#000' },
  ],
})
