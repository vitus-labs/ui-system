import React from 'react'
import { shallow, mount } from 'enzyme'
import Element from '..'

describe('<Element />', () => {
  describe('statics', () => {
    it('has displayName', () => {
      expect.assertions(1)
      const wrapper = mount(<Element tag="button" label="Some label" />)

      expect(wrapper.name()).toBe('@vitus-labs/elements/Element')
    })
  })
})
