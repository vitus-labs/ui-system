import Element from '~/Element'
import List from '~/List'

const Item = props => (
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
        injectProps
        primary
        passProps={['primary']}
      />
    )
  })
  .add('List with children', () => {
    return (
      <List injectProps passProps={['primary']} primary>
        <Item>Label</Item>
        <Item>Label</Item>
        <Item>Label</Item>
        <Item>Label</Item>
        <Item>Label</Item>
      </List>
    )
  })
