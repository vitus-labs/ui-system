import React from 'react'
import { configure, storiesOf } from '@storybook/react'
import { configureViewport, INITIAL_VIEWPORTS } from '@storybook/addon-viewport'

const newViewports = {
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

const req = require.context('../../themes/bootstrap', true, /\/stories.tsx$/)

function loadStories() {
  req.keys().forEach(filename => req(filename))
}

configureViewport({
  defaultViewport: 'responsive',
  viewports: { ...newViewports, ...INITIAL_VIEWPORTS }
})

configure(loadStories, module)
