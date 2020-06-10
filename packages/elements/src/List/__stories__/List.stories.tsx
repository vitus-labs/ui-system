import React from 'react'
import Element from '~/Element'
import List from '~/List'

const Item = (props) => (
  <Element
    {...props}
    css={`
      font-size: 36px;
      color: ${({ primary }) => (primary ? 'blue' : 'black')};
    `}
  />
)

storiesOf('ELEMENTS | List', module)
  .add('List', () => {
    return (
      <List
        component={Item}
        data={[{ label: 'a' }, { label: 'b' }, { label: 'c' }, { label: 'd' }]}
        itemProps={{ primary: true }}
      />
    )
  })
  .add('List with children', () => {
    return (
      <List>
        <Item>Label</Item>
        <Item>Label</Item>
        <Item>Label</Item>
        <Item>Label</Item>
        <Item>Label</Item>
      </List>
    )
  })
  .add('Render without root element', () => {
    return (
      <List
        rootElement={false}
        component={Item}
        data={[{ label: 'a' }, { label: 'b' }, { label: 'c' }, { label: 'd' }]}
        itemProps={{ primary: true }}
        itemKey
      />
    )
  })
