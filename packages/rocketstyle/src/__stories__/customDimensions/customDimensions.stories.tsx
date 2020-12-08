import React from 'react'
import Button from './component'

export default {
  component: Button,
  title: 'Custom dimensions',
}

export const customDimensions = () => (
  <Button padding="paddingxl" gapxl gapXxl testB />
)
