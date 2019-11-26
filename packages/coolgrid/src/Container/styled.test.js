/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { shallow } from 'enzyme'
import Component from '.'
import Styled from './styled'

const requiredProps = {
  breakpoints: {
    xs: {
      viewport: 0,
      container: 0,
      size: 12,
    },
    sm: {
      viewport: 576,
      container: 540,
      size: 6,
    },
    md: {
      viewport: 778,
      container: 720,
      size: 3,
    },
  },
}

describe(Component.displayName, () => {
  it('renders correctly', async () => {
    const tree = shallow(<Styled {...requiredProps} />)
    expect(tree).toMatchSnapshot()

    expect(tree).toHaveStyleRule('max-width', '540px', {
      media: 'only screen and (min-width:576px)',
    })

    expect(tree).toHaveStyleRule('max-width', '720px', {
      media: 'only screen and (min-width:778px)',
    })
  })

  it('renders correctly width extendCss', async () => {
    const extendCss = 'font-size: 20px; background-color: black;'
    const tree = shallow(<Styled {...requiredProps} extendCss={extendCss} />)
    expect(tree).toMatchSnapshot()

    expect(tree).toHaveStyleRule('font-size', '20px')
    expect(tree).toHaveStyleRule('background-color', 'black')
  })
})
