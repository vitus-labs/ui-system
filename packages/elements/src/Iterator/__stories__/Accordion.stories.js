import Iterator, { withActiveState } from '..'

const NewIterator = withActiveState(Iterator)

const Item = ({ name, active, toggleItemActive, ...props }) => (
  <div>
    <h1 onClick={toggleItemActive}>This is heading {name}</h1>
    {active && <div>Here is some text</div>}
  </div>
)

storiesOf('ELEMENTS | Iterator', module)
  .add('Accordion', () => {
    const data = ['a', 'b', 'c', 'd']
    return <NewIterator data={data} component={Item} itemKeyName="name" />
  })
  .add('Accordion with unsetAllAcive', () => {
    const data = ['a', 'b', 'c', 'd']
    const Wrapper = withActiveState(({ unsetAllItemsActive, ...props }) => (
      <div>
        <button onClick={unsetAllItemsActive}>collapse all</button>
        <Iterator {...props} />
      </div>
    ))
    return <Wrapper type="multi" data={data} component={Item} itemKeyName="name" />
  })
