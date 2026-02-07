import { render, screen, fireEvent } from '@testing-library/react'
import withActiveState from '../List/withActiveState'

const MockList = ({ itemProps, ...rest }: any) => {
  const data = rest.data || []
  return (
    <div data-testid="list">
      {data.map((item: any, i: number) => {
        const key = typeof item === 'object' ? item.id : item
        const extended = {
          key,
          first: i === 0,
          last: i === data.length - 1,
          odd: i % 2 === 0,
          even: i % 2 === 1,
          position: i + 1,
        }
        const props = typeof itemProps === 'function' ? itemProps(extended) : {}
        return (
          <button
            type="button"
            key={key}
            data-testid={`item-${key}`}
            data-active={String(props.active ?? false)}
            onClick={props.handleItemActive}
          >
            {key}
          </button>
        )
      })}
    </div>
  )
}

MockList.displayName = 'MockList'

const EnhancedList = withActiveState(MockList)

describe('withActiveState', () => {
  describe('statics', () => {
    it('has displayName', () => {
      expect(EnhancedList.displayName).toBe(
        '@vitus-labs/elements/List/withActiveState(MockList)',
      )
    })

    it('has RESERVED_KEYS', () => {
      expect(EnhancedList.RESERVED_KEYS).toContain('type')
      expect(EnhancedList.RESERVED_KEYS).toContain('activeItems')
      expect(EnhancedList.RESERVED_KEYS).toContain('itemProps')
      expect(EnhancedList.RESERVED_KEYS).toContain('activeItemRequired')
    })
  })

  describe('single selection (default)', () => {
    it('no items active by default', () => {
      render(<EnhancedList data={['a', 'b', 'c']} />)
      expect(screen.getByTestId('item-a')).toHaveAttribute('data-active', 'false')
      expect(screen.getByTestId('item-b')).toHaveAttribute('data-active', 'false')
    })

    it('activates item on click', () => {
      render(<EnhancedList data={['a', 'b']} />)
      fireEvent.click(screen.getByTestId('item-a'))
      expect(screen.getByTestId('item-a')).toHaveAttribute('data-active', 'true')
      expect(screen.getByTestId('item-b')).toHaveAttribute('data-active', 'false')
    })

    it('deactivates item on second click', () => {
      render(<EnhancedList data={['a', 'b']} />)
      fireEvent.click(screen.getByTestId('item-a'))
      expect(screen.getByTestId('item-a')).toHaveAttribute('data-active', 'true')
      fireEvent.click(screen.getByTestId('item-a'))
      expect(screen.getByTestId('item-a')).toHaveAttribute('data-active', 'false')
    })

    it('switches active item', () => {
      render(<EnhancedList data={['a', 'b']} />)
      fireEvent.click(screen.getByTestId('item-a'))
      fireEvent.click(screen.getByTestId('item-b'))
      expect(screen.getByTestId('item-a')).toHaveAttribute('data-active', 'false')
      expect(screen.getByTestId('item-b')).toHaveAttribute('data-active', 'true')
    })

    it('initializes with activeItems', () => {
      render(<EnhancedList data={['a', 'b']} activeItems="b" />)
      expect(screen.getByTestId('item-a')).toHaveAttribute('data-active', 'false')
      expect(screen.getByTestId('item-b')).toHaveAttribute('data-active', 'true')
    })

    it('warns when activeItems is array in single mode', () => {
      const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
      render(<EnhancedList data={['a', 'b']} activeItems={['a', 'b']} />)
      expect(spy).toHaveBeenCalledWith(
        expect.stringContaining('activeItems` was passed as an array'),
      )
      spy.mockRestore()
    })
  })

  describe('single selection with activeItemRequired', () => {
    it('prevents deselecting the last active item', () => {
      render(
        <EnhancedList data={['a', 'b']} activeItems="a" activeItemRequired />,
      )
      expect(screen.getByTestId('item-a')).toHaveAttribute('data-active', 'true')
      fireEvent.click(screen.getByTestId('item-a'))
      expect(screen.getByTestId('item-a')).toHaveAttribute('data-active', 'true')
    })

    it('allows switching to another item', () => {
      render(
        <EnhancedList data={['a', 'b']} activeItems="a" activeItemRequired />,
      )
      fireEvent.click(screen.getByTestId('item-b'))
      expect(screen.getByTestId('item-b')).toHaveAttribute('data-active', 'true')
    })
  })

  describe('multi selection', () => {
    it('activates multiple items', () => {
      render(<EnhancedList type="multi" data={['a', 'b', 'c']} />)
      fireEvent.click(screen.getByTestId('item-a'))
      fireEvent.click(screen.getByTestId('item-c'))
      expect(screen.getByTestId('item-a')).toHaveAttribute('data-active', 'true')
      expect(screen.getByTestId('item-b')).toHaveAttribute('data-active', 'false')
      expect(screen.getByTestId('item-c')).toHaveAttribute('data-active', 'true')
    })

    it('toggles item off', () => {
      render(<EnhancedList type="multi" data={['a', 'b']} />)
      fireEvent.click(screen.getByTestId('item-a'))
      expect(screen.getByTestId('item-a')).toHaveAttribute('data-active', 'true')
      fireEvent.click(screen.getByTestId('item-a'))
      expect(screen.getByTestId('item-a')).toHaveAttribute('data-active', 'false')
    })

    it('initializes with activeItems array', () => {
      render(
        <EnhancedList type="multi" data={['a', 'b', 'c']} activeItems={['a', 'c']} />,
      )
      expect(screen.getByTestId('item-a')).toHaveAttribute('data-active', 'true')
      expect(screen.getByTestId('item-b')).toHaveAttribute('data-active', 'false')
      expect(screen.getByTestId('item-c')).toHaveAttribute('data-active', 'true')
    })

    it('initializes with single activeItems value', () => {
      render(
        <EnhancedList type="multi" data={['a', 'b']} activeItems="b" />,
      )
      expect(screen.getByTestId('item-a')).toHaveAttribute('data-active', 'false')
      expect(screen.getByTestId('item-b')).toHaveAttribute('data-active', 'true')
    })
  })

  describe('multi selection with activeItemRequired', () => {
    it('prevents deselecting the last active item', () => {
      render(
        <EnhancedList
          type="multi"
          data={['a', 'b']}
          activeItems={['a']}
          activeItemRequired
        />,
      )
      expect(screen.getByTestId('item-a')).toHaveAttribute('data-active', 'true')
      fireEvent.click(screen.getByTestId('item-a'))
      expect(screen.getByTestId('item-a')).toHaveAttribute('data-active', 'true')
    })

    it('allows deselecting when other items are active', () => {
      render(
        <EnhancedList
          type="multi"
          data={['a', 'b']}
          activeItems={['a', 'b']}
          activeItemRequired
        />,
      )
      fireEvent.click(screen.getByTestId('item-a'))
      expect(screen.getByTestId('item-a')).toHaveAttribute('data-active', 'false')
      expect(screen.getByTestId('item-b')).toHaveAttribute('data-active', 'true')
    })
  })

  describe('itemProps passthrough', () => {
    it('passes static itemProps to items', () => {
      const MockWithExtra = ({ itemProps, ...rest }: any) => {
        const data = rest.data || []
        return (
          <div>
            {data.map((item: any, i: number) => {
              const key = typeof item === 'object' ? item.id : item
              const extended = {
                key,
                first: i === 0,
                last: i === data.length - 1,
                odd: i % 2 === 0,
                even: i % 2 === 1,
                position: i + 1,
              }
              const props =
                typeof itemProps === 'function' ? itemProps(extended) : {}
              return (
                <span key={key} data-testid={`item-${key}`} data-extra={props.extra}>
                  {key}
                </span>
              )
            })}
          </div>
        )
      }
      MockWithExtra.displayName = 'MockWithExtra'
      const Enhanced = withActiveState(MockWithExtra)
      render(
        <Enhanced data={['a']} itemProps={{ extra: 'val' }} />,
      )
      expect(screen.getByTestId('item-a')).toHaveAttribute('data-extra', 'val')
    })

    it('passes function itemProps to items', () => {
      const MockWithExtra = ({ itemProps, ...rest }: any) => {
        const data = rest.data || []
        return (
          <div>
            {data.map((item: any, i: number) => {
              const key = typeof item === 'object' ? item.id : item
              const extended = {
                key,
                first: i === 0,
                last: i === data.length - 1,
                odd: i % 2 === 0,
                even: i % 2 === 1,
                position: i + 1,
              }
              const props =
                typeof itemProps === 'function' ? itemProps(extended) : {}
              return (
                <span
                  key={key}
                  data-testid={`item-${key}`}
                  data-pos={props.pos}
                >
                  {key}
                </span>
              )
            })}
          </div>
        )
      }
      MockWithExtra.displayName = 'MockWithExtra'
      const Enhanced = withActiveState(MockWithExtra)
      render(
        <Enhanced
          data={['a', 'b']}
          itemProps={(props: any) => ({ pos: props.position })}
        />,
      )
      expect(screen.getByTestId('item-a')).toHaveAttribute('data-pos', '1')
      expect(screen.getByTestId('item-b')).toHaveAttribute('data-pos', '2')
    })
  })
})
