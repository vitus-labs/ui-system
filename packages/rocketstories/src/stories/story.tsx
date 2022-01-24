import { createElement, VFC, ComponentType } from 'react'
import {
  filterControls,
  filterValues,
  valuesToControls,
  makeControls,
} from '~/utils/controls'
import filterDefaultValues from '~/utils/controls/filterDefaultValues'

type Story = ({
  component,
  attrs,
}: {
  component: ComponentType
  attrs: Record<string, unknown>
}) => VFC & { args: any; argTypes: any }

const story: Story = ({ component, attrs }) => {
  const definedControls = filterControls(attrs)
  const values = filterValues(attrs)

  const controls = valuesToControls({
    component: component as any,
    values,
    dimensionControls: {},
  })

  const storybookControls = makeControls({
    ...controls,
    ...definedControls,
  })

  const args = filterDefaultValues(controls)

  const Enhanced = (props) => createElement(component, props)

  Enhanced.args = args
  Enhanced.argTypes = storybookControls

  return Enhanced
}

export default story
