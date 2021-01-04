import React from 'react'
import { Element } from '@vitus-labs/elements'
import ListGroup, { Item } from '.'
import Badge from '../Badge'
import Heading from '../Heading'
import Text from '../Text'

export default {
  component: ListGroup,
  title: 'ListGroup',
}

const data = [
  { children: 'Cras justo odio' },
  { children: 'Dapibus ac facilisis in' },
  { children: 'Morbi leo risus' },
  { children: 'Porta ac consectetur ac' },
  { children: 'Vestibulum at eros' },
]

const data1 = [
  { children: 'Cras justo odio', active: true },
  { children: 'Dapibus ac facilisis in' },
  { children: 'Morbi leo risus' },
  { children: 'Porta ac consectetur ac' },
  { children: 'Vestibulum at eros', disabled: true },
]

const data2 = [
  { children: 'Cras justo odio' },
  {
    children: 'A simple primary list group item',
    primary: true,
  },
  {
    children: 'A simple secondary list group item',
    secondary: true,
  },
  {
    children: 'A simple success list group item',
    success: true,
  },
  { children: 'A simple danger list group item', danger: true },
  {
    children: 'A simple warning list group item',
    warning: true,
  },
  { children: 'A simple info list group item', info: true },
  { children: 'A simple light list group item', light: true },
  { children: 'A simple dark list group item', dark: true },
]

const data_2 = [
  { onClick: () => {}, label: 'Cras justo odio' },
  {
    onClick: () => {},
    label: 'A simple primary list group item',
    primary: true,
  },
  {
    onClick: () => {},
    label: 'A simple secondary list group item',
    secondary: true,
  },
  {
    onClick: () => {},
    label: 'A simple success list group item',
    success: true,
  },
  { onClick: () => {}, label: 'A simple danger list group item', danger: true },
  {
    onClick: () => {},
    label: 'A simple warning list group item',
    warning: true,
  },
  { onClick: () => {}, label: 'A simple info list group item', info: true },
  { onClick: () => {}, label: 'A simple light list group item', light: true },
  { onClick: () => {}, label: 'A simple dark list group item', dark: true },
]

const data3 = [
  {
    label: 'Cras justo odio',
    afterContent: <Badge primary rounded label={14} />,
  },
  {
    label: 'Dapibus ac facilisis in',
    afterContent: <Badge primary rounded label={14} />,
  },
  {
    label: 'Morbi leo risus',
    afterContent: <Badge primary rounded label={14} />,
  },
  {
    label: 'Porta ac consectetur ac',
    afterContent: <Badge primary rounded label={14} />,
  },
  {
    label: 'Vestibulum at eros',
    afterContent: <Badge primary rounded label={14} />,
  },
]

export const basicExample = () => (
  <>
    <ListGroup data={data} />
    <ListGroup>
      <Item>Cras justo odio</Item>
      <Item>Dapibus ac facilisis in</Item>
      <Item>Morbi leo risus</Item>
      <Item>Porta ac consectetur ac</Item>
    </ListGroup>
  </>
)

export const activeItems = () => (
  <>
    <ListGroup>
      <Item active>Cras justo odio</Item>
      <Item>Dapibus ac facilisis in</Item>
      <Item>Morbi leo risus</Item>
      <Item>Porta ac consectetur ac</Item>
    </ListGroup>
  </>
)

export const disableditems = () => (
  <>
    <ListGroup>
      <Item>Cras justo odio</Item>
      <Item>Dapibus ac facilisis in</Item>
      <Item>Morbi leo risus</Item>
      <Item disabled>Porta ac consectetur ac</Item>
    </ListGroup>
  </>
)

export const linksAndButtons = () => (
  <>
    <ListGroup dynamic>
      <Item tag="a" href="#" active>
        Cras justo odio
      </Item>
      <Item tag="a" href="#">
        Dapibus ac facilisis in
      </Item>
      <Item tag="a" href="#">
        Morbi leo risus
      </Item>
      <Item disabled>Porta ac consectetur ac</Item>
    </ListGroup>

    <ListGroup dynamic>
      <Item tag="button" href="#" active>
        Cras justo odio
      </Item>
      <Item tag="button" href="#">
        Dapibus ac facilisis in
      </Item>
      <Item tag="button" href="#">
        Morbi leo risus
      </Item>
      <Item disabled>Porta ac consectetur ac</Item>
    </ListGroup>
  </>
)

export const flush = () => (
  <ListGroup flush>
    <Item>Cras justo odio</Item>
    <Item>Dapibus ac facilisis in</Item>
    <Item>Morbi leo risus</Item>
    <Item>Porta ac consectetur ac</Item>
  </ListGroup>
)

export const horizontal = () => (
  <ListGroup vertical={false}>
    <Item>Cras justo odio</Item>
    <Item>Dapibus ac facilisis in</Item>
    <Item>Morbi leo risus</Item>
    <Item>Porta ac consectetur ac</Item>
  </ListGroup>
)

export const contextualClasses = () => (
  <>
    <ListGroup data={data2} />
    <ListGroup dynamic data={data_2} />
  </>
)

export const withBadges = () => <ListGroup data={data3} />

export const customContent = () => {
  const ItemComponent = ({ active }) => (
    <Item tag="a" dynamic active={active}>
      <Element
        block
        afterContent={
          <Text tag="small" small>
            3 days ago
          </Text>
        }
      >
        <Heading h5>List group item heading</Heading>
      </Element>
      <Text>
        Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget
        risus varius blandit.
      </Text>
      <Text tag="small" small>
        Donec id elit non mi porta.
      </Text>
    </Item>
  )

  return (
    <Fragment>
      <ListGroup tag="div" style={{ maxWidth: 400 }}>
        <ItemComponent active />
        <ItemComponent />
        <ItemComponent />
      </ListGroup>
    </Fragment>
  )
}
