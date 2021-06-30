import React from 'react'
import { shallow } from 'enzyme'
import Component from '.'
import Styled from './styled'

const requiredProps = {
  columns: 12,
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
    expect(tree).toHaveStyleRule('box-sizing', 'border-box')
  })

  it('renders custom styles - extendCss', async () => {
    const extendCss = 'font-size: 20px; background-color: black;'
    const tree = shallow(<Styled {...requiredProps} extendCss={extendCss} />)
    expect(tree).toMatchSnapshot()
    expect(tree).toHaveStyleRule('font-size', '20px')
    expect(tree).toHaveStyleRule('background-color', 'black')
  })

  it('renders correctly size with media queries', async () => {
    const tree = shallow(<Styled {...requiredProps} />)
    expect(tree).toMatchSnapshot()

    // XS / default query css
    expect(tree).toHaveStyleRule('box-sizing', 'border-box')
    expect(tree).toHaveStyleRule('position', 'relative')
    expect(tree).toHaveStyleRule('max-width', '100%')
    expect(tree).toHaveStyleRule('flex-basis', '100%')

    // SM query css
    expect(tree).toHaveStyleRule('max-width', '50%', {
      media: 'only screen and (min-width:576px)',
    })
    expect(tree).toHaveStyleRule('flex-basis', '50%', {
      media: 'only screen and (min-width:576px)',
    })

    // MD query css
    expect(tree).toHaveStyleRule('max-width', '25%', {
      media: 'only screen and (min-width:778px)',
    })
    expect(tree).toHaveStyleRule('flex-basis', '25%', {
      media: 'only screen and (min-width:778px)',
    })
  })

  it('renders correctly size + gap and padding with media queries', async () => {
    const requiredProps = {
      columns: 12,
      breakpoints: {
        xs: {
          viewport: 0,
          container: 0,
          size: 12,
          gap: 10,
          padding: 10,
        },
        sm: {
          viewport: 576,
          container: 540,
          size: 6,
          gap: 20,
          padding: 20,
        },
        md: {
          viewport: 778,
          container: 720,
          size: 3,
          gap: 30,
          padding: 35,
        },
      },
    }
    const tree = shallow(<Styled {...requiredProps} />)
    expect(tree).toMatchSnapshot()

    // XS / default query css
    expect(tree).toHaveStyleRule('box-sizing', 'border-box')
    expect(tree).toHaveStyleRule('position', 'relative')
    expect(tree).toHaveStyleRule('max-width', 'calc(100% - 10px)')
    expect(tree).toHaveStyleRule('flex-basis', 'calc(100% - 10px)')
    expect(tree).toHaveStyleRule('margin', '5px')
    expect(tree).toHaveStyleRule('padding', '10px')

    // SM query css
    expect(tree).toHaveStyleRule('max-width', 'calc(50% - 20px)', {
      media: 'only screen and (min-width:576px)',
    })
    expect(tree).toHaveStyleRule('flex-basis', 'calc(50% - 20px)', {
      media: 'only screen and (min-width:576px)',
    })
    expect(tree).toHaveStyleRule('margin', '10px', {
      media: 'only screen and (min-width:576px)',
    })
    expect(tree).toHaveStyleRule('padding', '20px', {
      media: 'only screen and (min-width:576px)',
    })

    // MD query css
    expect(tree).toHaveStyleRule('max-width', 'calc(25% - 30px)', {
      media: 'only screen and (min-width:778px)',
    })
    expect(tree).toHaveStyleRule('flex-basis', 'calc(25% - 30px)', {
      media: 'only screen and (min-width:778px)',
    })
    expect(tree).toHaveStyleRule('margin', '15px', {
      media: 'only screen and (min-width:778px)',
    })
    expect(tree).toHaveStyleRule('padding', '35px', {
      media: 'only screen and (min-width:778px)',
    })
  })
})
