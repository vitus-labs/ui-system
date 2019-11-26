/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { shallow } from 'enzyme'
import Component from '.'

// ensure you're resetting modules before each test
beforeEach(() => {
  jest.resetModules()
})

const context = {
  breakpoints: {
    xs: {
      container: 400,
      viewport: 500,
    },
  },
  columns: 12,
}

describe(Component.displayName, () => {
  it('renders correctly', async () => {
    const tree = shallow(<Component {...context} />, { context })
    expect(tree).toMatchSnapshot()
  })
})
