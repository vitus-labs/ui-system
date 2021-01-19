import React, { Fragment } from 'react'
import { MINIMAL_VIEWPORTS, INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs'
import themeDecorator from '../decorators/themeDecorator'

// TODO: make decorator configurable
export const decorators = [
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
  }),
]

export const parameters = {
  viewport: {
    viewports: { ...MINIMAL_VIEWPORTS, ...INITIAL_VIEWPORTS },
  },
  backgrounds: {
    default: 'light',
    values: [
      { name: 'light', value: '#fff' },
      { name: 'dark', value: '#000' },
    ],
    grid: {
      disable: false,
      cellSize: 8,
      opacity: 0.5,
      cellAmount: 4,
      offsetX: 16,
      offsetY: 16,
    },
  },
}

global.React = React
global.Fragment = Fragment
global.STORY = {
  text,
  boolean,
  number,
  withKnobs,
}
