/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
import { init } from '@vitus-labs/core'
import * as d from '../decorators'

if (__VITUS_LABS_STORIES__.styles === 'styled-components') {
  const styled = require('styled-components')

  console.log('init config')
  init({
    styled: styled.default,
    css: styled.css,
    context: styled.ThemeContext,
  })
}

if (__VITUS_LABS_STORIES__.styles === 'emotion') {
  const styled = require('styled-components')

  init({
    styled: styled.default,
    css: styled.css,
    context: styled.ThemeContext,
  })
}

declare global {
  const __VITUS_LABS_STORIES__: Record<string, unknown>
}

declare global {
  interface Window {
    __VITUS_LABS_STORIES__: Record<string, unknown>
  }
}

// define configuration globally in window so it can be accessible from anywhere in the browser
window.__VITUS_LABS_STORIES__ = __VITUS_LABS_STORIES__

export const globalTypes = __VITUS_LABS_STORIES__.globals

export const decorators = Object.entries(
  __VITUS_LABS_STORIES__.decorators
).reduce((acc, [key, value]) => {
  if (value) {
    acc.push(d[key](value))
  }
  return acc
}, [])

export const parameters = Object.entries(__VITUS_LABS_STORIES__.addons).reduce(
  (acc, [key, value]) => {
    if (typeof value === 'object') {
      return { ...acc, [key]: value }
    }
    return acc
  },
  {}
)
