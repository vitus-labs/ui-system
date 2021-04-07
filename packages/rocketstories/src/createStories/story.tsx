import { createElement, VFC, ComponentType } from 'react'

import {
  transformToControls,
  filterControls,
  filterDefaultProps,
} from '~/utils/controls'

type Story = ({
  component,
  attrs,
}: {
  component: ComponentType
  attrs: Record<string, unknown>
}) => VFC & { args: any; argTypes: any }

const story: Story = ({ component, attrs }) => {
  const Enhanced = (props) => createElement(component, props)

  const controlAttrs = transformToControls(attrs)
  const defaultPropsValues = filterDefaultProps(controlAttrs)

  Enhanced.args = defaultPropsValues
  Enhanced.argTypes = {
    ...filterControls(controlAttrs),
  }

  return Enhanced
}

export default story
