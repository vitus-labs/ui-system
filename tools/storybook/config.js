import React, { Fragment } from 'react'
import { configure, addParameters, addDecorator, storiesOf } from '@storybook/react'
import { boolean, text } from '@storybook/addon-knobs'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { withKnobs } from '@storybook/addon-knobs'
import { withA11y } from '@storybook/addon-a11y'
import themeDecorator from './decorators/themeDecorator'

const customViewports = {
  xs: {
    name: 'XS Screen',
    styles: {
      width: '320px',
      height: '600px'
    }
  },
  sm: {
    name: 'SM Screen',
    styles: {
      width: '576px',
      height: '800px'
    }
  },
  md: {
    name: 'MD Screen',
    styles: {
      width: '778px',
      height: '800px'
    }
  },
  lg: {
    name: 'LG Screen',
    styles: {
      width: '992px',
      height: '1338px'
    }
  },
  xl: {
    name: 'XL Screen',
    styles: {
      width: '1200px',
      height: '1338px'
    }
  },
  xxl: {
    name: 'XXL Screen',
    styles: {
      width: '2460px',
      height: '1338px'
    }
  },
  kindleFire2: {
    name: 'Kindle Fire 2',
    styles: {
      width: '600px',
      height: '963px'
    }
  },
  kindleFireHD: {
    name: 'Kindle Fire HD',
    styles: {
      width: '533px',
      height: '801px'
    }
  }
}

global.React = React
global.Fragment = Fragment
global.storiesOf = storiesOf
global.is = { text, boolean }

export default ({ source, theme }) => {
  addParameters({
    viewport: {
      viewports: {
        ...INITIAL_VIEWPORTS,
        ...customViewports
      }
    }
  })
  addDecorator(withA11y)
  addDecorator(withKnobs)
  addDecorator(themeDecorator(theme))
  configure(source, module)
}
