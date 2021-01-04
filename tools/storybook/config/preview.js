import React, { Fragment } from 'react'
import { MINIMAL_VIEWPORTS, INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs'
import themeDecorator from '../decorators/themeDecorator'

export const decorators = [themeDecorator({})]

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
