import React from 'react'
import 'jest-styled-components'
import { mount } from 'enzyme'
import Element from '..'

describe('<Element />', () => {
  describe('styles', () => {
    it('renders default styles correctly', () => {
      expect.assertions(16)
      const wrapper = mount(<Element label="Some label" />)

      expect(wrapper).toHaveStyleRule('display', 'inline-flex')
      expect(wrapper).not.toHaveStyleRule('display', 'flex')

      expect(wrapper).toHaveStyleRule('flex-direction', 'column')
      expect(wrapper).not.toHaveStyleRule('flex-direction', 'row')

      expect(wrapper).toHaveStyleRule('align-items', 'flex-start')
      expect(wrapper).not.toHaveStyleRule('align-items', 'center')
      expect(wrapper).not.toHaveStyleRule('align-items', 'flex-end')
      expect(wrapper).not.toHaveStyleRule('align-items', 'stretch')
    })

    it('`block` element styles', () => {
      expect.assertions(16)
      const wrapper = mount(<Element block label="Some label" />)

      expect(wrapper).toHaveStyleRule('display', 'flex')
      expect(wrapper).not.toHaveStyleRule('display', 'inline-flex')

      expect(wrapper).toHaveStyleRule('flex-direction', 'column')
      expect(wrapper).not.toHaveStyleRule('flex-direction', 'row')

      expect(wrapper).toHaveStyleRule('align-items', 'flex-start')
      expect(wrapper).not.toHaveStyleRule('align-items', 'center')
      expect(wrapper).not.toHaveStyleRule('align-items', 'flex-end')
      expect(wrapper).not.toHaveStyleRule('align-items', 'stretch')
    })

    it('`block & inline` element styles', () => {
      expect.assertions(16)
      const wrapper = mount(
        <Element block contentDirection="inline" label="Some label" />
      )

      expect(wrapper).toHaveStyleRule('display', 'flex')
      expect(wrapper).not.toHaveStyleRule('display', 'inline-flex')

      expect(wrapper).toHaveStyleRule('flex-direction', 'row')
      expect(wrapper).not.toHaveStyleRule('flex-direction', 'column')

      expect(wrapper).toHaveStyleRule('align-items', 'center')
      expect(wrapper).not.toHaveStyleRule('align-items', 'flex-start')
      expect(wrapper).not.toHaveStyleRule('align-items', 'flex-end')
      expect(wrapper).not.toHaveStyleRule('align-items', 'stretch')
    })
  })
})
