import React from 'react'
import theme from '../themeDecorator'
import { ButtonGroup, ButtonToolbar } from '.'
import Button from '../Button'
import Utility from '../Utils/Box'

const data = [{ label: 'Left' }, { label: 'Middle' }, { label: 'Right' }]

const nestingData = [{ label: '1' }, { label: '2' }]

export default {
  component: ButtonGroup,
  title: 'ButtonGroup',
}

export const eample = () => <ButtonGroup primary data={data} />

export const buttonToolbar = () => (
  <>
    <ButtonToolbar>
      <Utility mr2>
        <ButtonGroup secondary data={data} />
      </Utility>
      <Utility mr2>
        <ButtonGroup secondary data={data} />
      </Utility>
      <ButtonGroup secondary data={data} />
    </ButtonToolbar>
  </>
)

export const sizing = () => (
  <>
    <ButtonGroup sm secondary data={data} />
    <ButtonGroup secondary data={data} />
    <ButtonGroup lg secondary data={data} />
  </>
)

export const nesting = () => (
  <>
    <ButtonGroup>
      <ButtonGroup primary data={data} />
      <ButtonGroup secondary data={data} />
      <ButtonGroup success data={data} />
      <ButtonGroup secondary data={nestingData} />
    </ButtonGroup>
  </>
)

export const verticalVariation = () => (
  <>
    <ButtonGroup secondary vertical data={data} style={{ width: '150px' }} />
    <ButtonGroup vertical secondary>
      <Button label="Button" />
      <Button label="Button" />
      <Button label="Button" />
      <Button label="Button" />
      <Button label="Button" />
      <Button label="Button" />
    </ButtonGroup>
  </>
)
