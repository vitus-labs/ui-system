import React from 'react'
import { shallow, mount, render } from 'enzyme'
import Element from '..'

describe('<Element />', () => {
  describe('tags', () => {
    it('renders as button', () => {
      expect.assertions(1)
      const wrapper = shallow(<Element tag="button" label="Some label" />)

      // expect(wrapper)
    })
  })
})
