import React from 'react'
import { shallow } from 'enzyme'
import Component from '.'

describe(Component.displayName, () => {
  it('renders correctly', async () => {
    const tree = shallow(<Component />)
    expect(tree).toMatchSnapshot()
  })
})
