import type { FC } from 'react'
import Element from '~/Element'
import List from '~/List'

export default {
  name: 'List',
  component: List,
}

const Item = (props: any) => (
  <Element
    {...props}
    css={`
      font-size: 36px;
      color: ${({ primary }: any) => (primary ? 'blue' : 'black')};
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
    <Item>Label</Item>
    <Item>Label</Item>
    <Item>Label</Item>
    <Item>Label</Item>
    <Item>Label</Item>
  </List>
)

export const listWithSingleChildren = () => (
  <List>
    <Item>Label</Item>
  </List>
)

export const listUsingWrappComponent = () => {
  const Wrapper = ({ children }: any) => <li>{children}</li>
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
  const Item = ({ label, ...props }: any) => <span {...props}>{label}</span>

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

  const Item = ({ name, surname, ...props }: any) => (
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
    ({ name, surname, ...props }: any) => (
      <span {...props}>
        | {name} - {surname} |
      </span>
    )

  return <List data={data} component={Item as any} itemProps={itemProps} />
}

export const ItemPropsAsAFunction = () => {
  const data = [{ name: 'a' }, { name: 'b' }, { name: 'c' }, { name: 'd' }]
  const itemProps = () => ({
    surname: 'hello',
  })
  const Item = ({ name, surname, ...props }: any) => (
    <span {...props}>
      {name} - {surname}
    </span>
  )

  return <List data={data} component={Item} itemProps={itemProps} />
}

export const renderCustomComponentInItem = () => {
  const CustomComponent: FC = () => <span>I&apos;m custom component</span>
  const Item: FC<any> = ({ name, surname, ...props }: any) => (
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
  const itemProps = () => ({
    // biome-ignore lint/suspicious/noEmptyBlockStatements: story demo
    onClick: () => {},
  })

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
