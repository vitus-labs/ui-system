import React, { createRef } from 'react'
import Button, {
  ProviderButton,
  ButtonConsumer,
  ButtonWithRocketstyle,
} from './Button'

export default {
  component: Button,
  title: 'Button',
}

export const button = () => (
  <>
    <Button label="Button" />
    <Button tertiary state="primary" multiple={['centered']} label="Button" />
  </>
)

export const withRef = () => {
  const ref = createRef()

  return <Button ref={ref} />
}

export const childrenStyling = () => (
  <ProviderButton gap={16} beforeContent="icon" afterContent="icon">
    <ButtonConsumer gap={16} beforeContent="icon" afterContent="icon">
      inner text component
    </ButtonConsumer>
  </ProviderButton>
)

export const childrenStylingWithRef = () => {
  const ref = createRef()

  return (
    <ProviderButton ref={ref} gap={16} beforeContent="icon" afterContent="icon">
      <ButtonConsumer gap={16} beforeContent="icon" afterContent="icon">
        inner text component
      </ButtonConsumer>
    </ProviderButton>
  )
}

export const innerRocketstyleComponent = () => (
  <ButtonWithRocketstyle label="Button" />
)
