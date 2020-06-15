import Iterator from '..'
import withActiveState from '../../../List/withActiveState'

const ActiveList = withActiveState(Iterator)

const Item = ({ name, surname, ...props }) => {
  return (
    <button {...props}>
      {name} {surname}
    </button>
  )
}

storiesOf('ELEMENTS | Iterator', module)
  .add('Data as array', () => {
    const data = ['a', 'b', 'c', 'd']
    return <Iterator data={data} component={Item} itemKey="name" />
  })
  .add('Data as object', () => {
    const data = [{ name: 'a' }, { name: 'b' }, { name: 'c' }, { name: 'd' }]
    return <Iterator data={data} component={Item} />
  })
  .add('Add item props as an object', () => {
    const data = [{ name: 'a' }, { name: 'b' }, { name: 'c' }, { name: 'd' }]
    const itemProps = (props) => ({
      surname: 'hello',
    })

    return <Iterator data={data} component={Item} itemProps={itemProps} />
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
  .add('Add item props as a function', () => {
    const data = [{ name: 'a' }, { name: 'b' }, { name: 'c' }, { name: 'd' }]
    const itemProps = (props) => {
      const { key, first, last, odd, even, position } = props

      return {
        onClick: () => {
          console.log(key, first, last, odd, even, position)
        },
      }
    }
    return <Iterator data={data} component={Item} itemProps={itemProps} />
  })
  .add('Render custom component as 2nd child', () => {
    const CustomComponent = () => <span>I'm custom component</span>
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
    return <Iterator data={data} component={Item} itemProps={itemProps} />
  })
