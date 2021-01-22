import React from 'react'
import List, { ProviderButton, ButtonConsumer } from './List'

export default {
  component: List,
  title: 'List',
}

export const button = () => (
  <>
    <List />
    <List primary />
  </>
)

export const childrenStyling = () => (
  <>
    <ProviderButton>
      <ButtonConsumer>inner text component</ButtonConsumer>
    </ProviderButton>
  </>
)
