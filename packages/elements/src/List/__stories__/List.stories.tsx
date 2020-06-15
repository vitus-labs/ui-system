import React from 'react'
import Element from '~/Element'
import List, { withActiveState } from '~/List'

const ActiveList = withActiveState(List)

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
      />
    )
  })
  .add('With single active state', () => {
    const data = [{ name: 'a' }, { name: 'b' }, { name: 'c' }, { name: 'd' }]
    const itemProps = (props) => {
      return {
        onClick: () => ({}),
        surname: 'hello',
      }
    }

    const Item = ({
      onClick,
      active,
      name,
      surname,
      handleItemActive,
      ...props
    }) => {
      return (
        <button
          {...props}
          onClick={(e) => {
            onClick(e)
            handleItemActive()
          }}
        >
          {name} {surname} {active ? 'yes' : 'no'}
        </button>
      )
    }

    return (
      <ActiveList
        type="single"
        activeItems={3}
        activeItemRequired
        data={data}
        component={Item}
        itemProps={itemProps}
      />
    )
  })
  .add('With multi active state', () => {
    const data = [{ name: 'a' }, { name: 'b' }, { name: 'c' }, { name: 'd' }]
    const itemProps = (props) => {
      return {
        onClick: () => {},
        surname: 'hello',
      }
    }

    const Item = ({ onClick, active, name, surname, ...props }) => {
      return (
        <button
          {...props}
          onClick={(e) => {
            onClick(e)
            props.handleItemActive()
          }}
        >
          {name} {surname} {active ? 'yes' : 'no'}
        </button>
      )
    }

    return (
      <ActiveList
        type="multi"
        activeItems={3}
        activeItemRequired
        data={data}
        component={Item}
        itemProps={itemProps}
      />
    )
  })
