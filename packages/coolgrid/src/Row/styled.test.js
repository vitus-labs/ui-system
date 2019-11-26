import React from 'react'
import { shallow } from 'enzyme'
import Component from './styled'

describe('Row - styled component', () => {
  it('renders correctly', async () => {
    const tree = shallow(<Component />)
    expect(tree).toMatchSnapshot()
    expect(tree).toHaveStyleRule('box-sizing', 'border-box')
  })

  it('renders correctly with extendCss', async () => {
    const extendCss = 'font-size: 20px; background-color: black'
    const tree = shallow(<Component extendCss={extendCss} />)
    expect(tree).toMatchSnapshot()
    expect(tree).toHaveStyleRule('font-size', '20px')
    expect(tree).toHaveStyleRule('background-color', 'black')
  })

  it('renders correctly with gap', async () => {
    const tree = shallow(<Component gap={20} />)
    expect(tree).toMatchSnapshot()
    expect(tree).toHaveStyleRule('margin', '10px -10px')
  })

  it('renders correctly with gap and gutter', async () => {
    const tree = shallow(<Component gap={20} gutter={0} />)
    expect(tree).toMatchSnapshot()
    expect(tree).toHaveStyleRule('margin', '-10px -10px')
  })
})
