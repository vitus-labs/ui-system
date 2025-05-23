import React, { type FC } from 'react'
import Element from '~/Element'
import List, { withActiveState } from '~/List'

export default {
  name: 'List',
  component: List,
}

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

export const list = () => (
  <List
    component={Item}
    data={[{ label: 'a' }, { label: 'b' }, { label: 'c' }, { label: 'd' }]}
    itemProps={{ primary: true }}
  />
)

export const listWithChildren = () => (
  <List>
    <Item>Label</Item>
    <Item>Label</Item>
    <Item>Label</Item>
    <Item>Label</Item>
    <Item>Label</Item>
  </List>
)

export const listWithFragmentChildren = () => (
  <List>
    <>
      <Item>Label</Item>
      <Item>Label</Item>
      <Item>Label</Item>
      <Item>Label</Item>
      <Item>Label</Item>
    </>
  </List>
)

export const listWithSingleChildren = () => (
  <List>
    <Item>Label</Item>
  </List>
)

export const listUsingWrappComponent = () => {
  const Wrapper = ({ children }) => <li>{children}</li>
  return (
    <List tag="ul" wrapComponent={Wrapper}>
      <Item>Label</Item>
      <Item>Label</Item>
      <Item>Label</Item>
      <Item>Label</Item>
      <Item>Label</Item>
    </List>
  )
}

export const dataAsAnArrayOfStrings = () => {
  const data = ['a', 'b', null, undefined, 'c', 'd']
  const Item = ({ label, ...props }) => <span {...props}>{label}</span>

  return <List data={data} component={Item} valueName="label" />
}

export const dataAsAnArrayOfObjects = () => {
  const data = [
    { name: 'a' },
    {},
    null,
    undefined,
    { name: 'b' },
    { name: 'c' },
    { name: 'd' },
  ]

  const Item = ({ name, surname, ...props }) => (
    <span {...props}>
      {name} - {surname}
    </span>
  )

  return <List data={data} component={Item} />
}

export const ItemPropsAsAnObject = () => {
  const data = [{ name: 'a' }, { name: 'b' }, { name: 'c' }, { name: 'd' }]
  const itemProps = {
    surname: 'hello',
  }
  const Item =
    () =>
    // eslint-disable-next-line react/no-unstable-nested-components
    ({ name, surname, ...props }) =>
      (
        <span {...props}>
          | {name} - {surname} |
        </span>
      )

  return <List data={data} component={Item} itemProps={itemProps} />
}

export const ItemPropsAsAFunction = () => {
  const data = [{ name: 'a' }, { name: 'b' }, { name: 'c' }, { name: 'd' }]
  const itemProps = () => ({
    surname: 'hello',
  })
  // eslint-disable-next-line react/no-unstable-nested-components
  const Item = ({ name, surname, ...props }) => (
    <span {...props}>
      {name} - {surname}
    </span>
  )

  return <List data={data} component={Item} itemProps={itemProps} />
}

export const renderCustomComponentInItem = () => {
  const CustomComponent: FC = () => <span>I&apos;m custom component</span>
  const Item: FC = ({ name, surname, ...props }) => (
    <span {...props}>
      {name} {surname}
    </span>
  )

  const data = [
    { name: 'a' },
    { component: CustomComponent },
    { name: 'c' },
    { name: 'd' },
  ]
  const itemProps = (props) => {
    const { key, first, last, odd, even, position } = props

    return {
      onClick: () => {
        console.log(key, first, last, odd, even, position)
      },
    }
  }

  return <List data={data} component={Item} itemProps={itemProps} />
}

export const renderWihoutRootElement = () => (
  <List
    rootElement={false}
    component={Item}
    data={[{ label: 'a' }, { label: 'b' }, { label: 'c' }, { label: 'd' }]}
    itemProps={{ primary: true }}
  />
)

export const withSingleActiveState = () => {
  const data = [{ name: 'a' }, { name: 'b' }, { name: 'c' }, { name: 'd' }]
  const itemProps = {
    onClick: () => ({}),
    surname: 'hello',
  }

  const Item = ({
    onClick,
    active,
    name,
    surname,
    handleItemActive,
    ...props
  }) => (
    <button
      type="button"
      {...props}
      onClick={(e) => {
        onClick(e)
        handleItemActive()
      }}
    >
      {name} {surname} {active ? 'yes' : 'no'}
    </button>
  )

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
}

export const withMultipleActiveState = () => {
  const data = [{ name: 'a' }, { name: 'b' }, { name: 'c' }, { name: 'd' }]
  const itemProps = () => ({
    onClick: () => ({}),
    surname: 'hello',
  })

  const Item = ({ onClick, active, name, surname, ...props }) => (
    <button
      type="button"
      {...props}
      onClick={(e) => {
        onClick(e)
        props.handleItemActive()
      }}
    >
      {name} {surname} {active ? 'yes' : 'no'}
    </button>
  )

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
}
