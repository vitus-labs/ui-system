import { createElement, VFC, ComponentType } from 'react'
import { createControls, makeStorybookControls } from '~/utils/controls'

type Story = ({
  component,
  attrs,
}: {
  component: ComponentType
  attrs: Record<string, unknown>
}) => VFC & { args: any; argTypes: any }

const story: Story = ({ component, attrs, controls }) => {
  // ------------------------------------------------------
  // CONTROLS GENERATION
  // ------------------------------------------------------
  const createdControls = createControls(controls)

  const finalControls = createdControls
  const storybookControls = makeStorybookControls(finalControls, attrs)

  const args = attrs

  const Enhanced = (props) => createElement(component, props)

  Enhanced.args = args
  Enhanced.argTypes = storybookControls

  return Enhanced
}

export default story
