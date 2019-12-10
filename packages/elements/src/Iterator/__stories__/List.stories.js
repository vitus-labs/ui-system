import Iterator from '..'

const Item = ({ name }) => <p>{name}</p>
storiesOf('ELEMENTS | Iterator', module)
  .add('Plain', () => {
    const data = ['a', 'b', 'c', 'd']
    return <Iterator data={data} component={Item} itemKeyName="name" />
  })
  .add('Data as object', () => {
    const data = [{ name: 'a' }, { name: 'b' }, { name: 'c' }, { name: 'd' }]
    return <Iterator data={data} component={Item} />
  })
