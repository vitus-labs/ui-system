import React from 'react'
import { shallow } from 'enzyme'
import Element from '..'

describe('<Element />', () => {
  describe('children props', () => {
    it('render label prop', () => {
      expect.assertions(1)
      const wrapper = shallow(<Element label="Some label" />)

      expect(wrapper.text()).toBe('Some label')
    })

    it('render content prop', () => {
      expect.assertions(1)
      const wrapper = shallow(<Element content="Some content" />)

      expect(wrapper.text()).toBe('Some content')
    })

    it('render children prop', () => {
      expect.assertions(1)
      const wrapper = shallow(<Element>Some content</Element>)

      expect(wrapper.text()).toBe('Some content')
    })

    it('render content prop over label prop', () => {
      expect.assertions(2)
      const wrapper = shallow(
        <Element content="Some content" label="Some label" />
      )

      expect(wrapper.text()).toBe('Some content')
      expect(wrapper.text()).not.toBe('Some label')
    })

    it('render children prop over label prop', () => {
      expect.assertions(2)
      const wrapper = shallow(
        <Element label="Some label">Some content</Element>
      )

      expect(wrapper.text()).toBe('Some content')
      expect(wrapper.text()).not.toBe('Some label')
    })

    it('render children prop over content prop', () => {
      expect.assertions(2)
      const wrapper = shallow(
        <Element content="Some content">children</Element>
      )

      expect(wrapper.text()).toBe('children')
      expect(wrapper.text()).not.toBe('Some content')
    })

    it('render children prop over content & label prop', () => {
      expect.assertions(3)
      const wrapper = shallow(
        <Element label="Some label" content="Some content">
          Some children
        </Element>
      )

      expect(wrapper.text()).toBe('Some children')
      expect(wrapper.text()).not.toBe('Some content')
      expect(wrapper.text()).not.toBe('Some label')
    })
  })
})
