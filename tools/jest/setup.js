import React from 'react'
import { JSDOM } from 'jsdom'
import { shallow, mount } from 'enzyme'
import { ThemeProvider } from 'styled-components'

const jsdom = new JSDOM('<!doctype html><html><body></body></html>')
const { window } = jsdom

function copyProps(src, target) {
  Object.defineProperties(target, {
    ...Object.getOwnPropertyDescriptors(src),
    ...Object.getOwnPropertyDescriptors(target)
  })
}

const defaultTheme = {
  rootSize: 16,
  breakpoints: {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200
  }
}

const ThemeProviderWrapper = ({ children }) => (
  <ThemeProvider theme={defaultTheme}>{children}</ThemeProvider>
)

export const shallowWithTheme = tree =>
  shallow(tree, {
    wrappingComponent: ThemeProviderWrapper
  })

export const mountWithTheme = tree =>
  mount(tree, {
    wrappingComponent: ThemeProviderWrapper
  })

global.mountWithTheme = mountWithTheme
global.shallowWithTheme = shallowWithTheme
global.React = React
global.window = window
global.document = window.document
global.navigator = {
  userAgent: 'node.js'
}
global.requestAnimationFrame = callback => {
  return setTimeout(callback, 0)
}
global.cancelAnimationFrame = id => {
  clearTimeout(id)
}
copyProps(window, global)
