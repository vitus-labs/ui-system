import React from 'react'
import { mount } from 'enzyme'
import Element from '..'

describe('<Element />', () => {
  describe('tags', () => {
    it('renders div as default', () => {
      expect.assertions(2)
      const wrapper = mount(<Element label="Some label" />)

      expect(wrapper.find('button').exists()).toBe(false)
      expect(wrapper.find('div').exists()).toBe(true)
    })

    it('renders as button', () => {
      expect.assertions(2)
      const wrapper = mount(<Element tag="button" label="Some label" />)

      expect(wrapper.find('div').exists()).toBe(false)
      expect(wrapper.find('button').exists()).toBe(true)
    })

    it('renders as image', () => {
      expect.assertions(2)
      const wrapper = mount(<Element tag="img" label="Some label" />)

      expect(wrapper.find('div').exists()).toBe(false)
      expect(wrapper.find('img').exists()).toBe(true)
    })
  })
})
