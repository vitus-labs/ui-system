import React from 'react'
import Button, { ProviderButton, ButtonConsumer } from './Button'

export default {
  component: Button,
  title: 'Button',
}

export const button = () => (
  <>
    <Button label="Button" />
    <Button
      secondary
      state="secondary"
      multiple={['centered']}
      label="Button"
    />
  </>
)

export const childrenStyling = () => (
  <>
    <ProviderButton gap={16} beforeContent="icon" afterContent="icon">
      <ButtonConsumer gap={16} beforeContent="icon" afterContent="icon">
        inner text component
      </ButtonConsumer>
    </ProviderButton>
  </>
)
