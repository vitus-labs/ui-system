import { render, screen } from '@testing-library/react'
import Iterator from '../helpers/Iterator/component'

const TextItem = ({ children, ...props }: any) => (
  <span data-testid="item" {...props}>
    {children}
  </span>
)

describe('Iterator', () => {
  describe('static properties', () => {
    it('has isIterator flag', () => {
      expect(Iterator.isIterator).toBe(true)
    })

    it('has RESERVED_PROPS', () => {
      expect(Iterator.RESERVED_PROPS).toContain('children')
      expect(Iterator.RESERVED_PROPS).toContain('component')
      expect(Iterator.RESERVED_PROPS).toContain('data')
      expect(Iterator.RESERVED_PROPS).toContain('itemKey')
      expect(Iterator.RESERVED_PROPS).toContain('valueName')
      expect(Iterator.RESERVED_PROPS).toContain('itemProps')
      expect(Iterator.RESERVED_PROPS).toContain('wrapComponent')
      expect(Iterator.RESERVED_PROPS).toContain('wrapProps')
    })
  })

  describe('children mode', () => {
    it('renders children directly', () => {
      render(
        <Iterator>
          <span data-testid="child-1">A</span>
          <span data-testid="child-2">B</span>
        </Iterator>,
      )
      expect(screen.getByTestId('child-1')).toHaveTextContent('A')
      expect(screen.getByTestId('child-2')).toHaveTextContent('B')
    })

    it('renders single child', () => {
      render(
        <Iterator>
          <span data-testid="only">Only</span>
        </Iterator>,
      )
      expect(screen.getByTestId('only')).toBeInTheDocument()
    })

    it('returns null when children is null/undefined', () => {
      const { container } = render(<Iterator />)
      expect(container.innerHTML).toBe('')
    })

    it('renders fragment children', () => {
      render(
        <Iterator>
          <>
            <span data-testid="frag-1">A</span>
            <span data-testid="frag-2">B</span>
          </>
        </Iterator>,
      )
      expect(screen.getByTestId('frag-1')).toBeInTheDocument()
      expect(screen.getByTestId('frag-2')).toBeInTheDocument()
    })

    it('children take priority over data', () => {
      render(
        <Iterator component={TextItem} data={['x', 'y']}>
          <span data-testid="child">Child wins</span>
        </Iterator>,
      )
      expect(screen.getByTestId('child')).toHaveTextContent('Child wins')
      expect(screen.queryAllByTestId('item')).toHaveLength(0)
    })
  })

  describe('simple array mode', () => {
    it('renders string array with component', () => {
      render(<Iterator component={TextItem} data={['hello', 'world']} />)
      const items = screen.getAllByTestId('item')
      expect(items).toHaveLength(2)
      expect(items[0]).toHaveTextContent('hello')
      expect(items[1]).toHaveTextContent('world')
    })

    it('renders number array with component', () => {
      render(<Iterator component={TextItem} data={[1, 2, 3]} />)
      const items = screen.getAllByTestId('item')
      expect(items).toHaveLength(3)
      expect(items[0]).toHaveTextContent('1')
      expect(items[1]).toHaveTextContent('2')
      expect(items[2]).toHaveTextContent('3')
    })

    it('filters null/undefined from data', () => {
      render(
        <Iterator component={TextItem} data={['a', null, 'b', undefined]} />,
      )
      const items = screen.getAllByTestId('item')
      expect(items).toHaveLength(2)
    })

    it('returns null for empty array', () => {
      const { container } = render(<Iterator component={TextItem} data={[]} />)
      expect(container.innerHTML).toBe('')
    })

    it('returns null for all-null array', () => {
      const { container } = render(
        <Iterator component={TextItem} data={[null, null]} />,
      )
      expect(container.innerHTML).toBe('')
    })

    it('uses valueName to set prop name', () => {
      const Item = ({ title }: any) => (
        <span data-testid="item">{title}</span>
      )
      render(
        <Iterator component={Item} data={['hello']} valueName="title" />,
      )
      expect(screen.getByTestId('item')).toHaveTextContent('hello')
    })

    it('defaults valueName to children', () => {
      render(<Iterator component={TextItem} data={['test']} />)
      expect(screen.getByTestId('item')).toHaveTextContent('test')
    })
  })

  describe('object array mode', () => {
    it('renders object array with component', () => {
      const Item = ({ name }: any) => (
        <span data-testid="item">{name}</span>
      )
      render(
        <Iterator
          component={Item}
          data={[
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' },
          ]}
        />,
      )
      const items = screen.getAllByTestId('item')
      expect(items).toHaveLength(2)
      expect(items[0]).toHaveTextContent('Alice')
      expect(items[1]).toHaveTextContent('Bob')
    })

    it('filters empty objects from data', () => {
      const Item = ({ name }: any) => (
        <span data-testid="item">{name}</span>
      )
      render(
        <Iterator
          component={Item}
          data={[{ name: 'Alice' }, {}, { name: 'Bob' }]}
        />,
      )
      const items = screen.getAllByTestId('item')
      expect(items).toHaveLength(2)
    })

    it('supports per-item component override', () => {
      const Default = ({ label }: any) => (
        <span data-testid="default">{label}</span>
      )
      const Custom = ({ label }: any) => (
        <em data-testid="custom">{label}</em>
      )
      render(
        <Iterator
          component={Default}
          data={[
            { label: 'one' },
            { label: 'two', component: Custom },
          ]}
        />,
      )
      expect(screen.getByTestId('default')).toHaveTextContent('one')
      expect(screen.getByTestId('custom')).toHaveTextContent('two')
    })

    it('uses itemKey string to pick key from item', () => {
      const Item = ({ slug }: any) => (
        <span data-testid="item">{slug}</span>
      )
      render(
        <Iterator
          component={Item}
          data={[{ slug: 'a' }, { slug: 'b' }]}
          itemKey="slug"
        />,
      )
      const items = screen.getAllByTestId('item')
      expect(items).toHaveLength(2)
    })

    it('uses itemKey function for custom keys', () => {
      const keyFn = jest.fn((_item, index) => `custom-${index}`)
      const Item = ({ name }: any) => (
        <span data-testid="item">{name}</span>
      )
      render(
        <Iterator
          component={Item}
          data={[{ name: 'a' }, { name: 'b' }]}
          itemKey={keyFn}
        />,
      )
      expect(keyFn).toHaveBeenCalledTimes(2)
    })

    it('falls back to id/key/itemId for keys', () => {
      const Item = ({ name }: any) => (
        <span data-testid="item">{name}</span>
      )
      // Should not throw with id-based keys
      render(
        <Iterator
          component={Item}
          data={[
            { id: 'x', name: 'Alice' },
            { key: 'y', name: 'Bob' },
            { itemId: 'z', name: 'Charlie' },
          ]}
        />,
      )
      expect(screen.getAllByTestId('item')).toHaveLength(3)
    })
  })

  describe('itemProps', () => {
    it('passes static itemProps to items', () => {
      const Item = ({ children, extra }: any) => (
        <span data-testid="item" data-extra={extra}>
          {children}
        </span>
      )
      render(
        <Iterator
          component={Item}
          data={['hello']}
          itemProps={{ extra: 'yes' }}
        />,
      )
      expect(screen.getByTestId('item')).toHaveAttribute('data-extra', 'yes')
    })

    it('passes itemProps callback with extended props', () => {
      const itemPropsFn = jest.fn((_item, extended) => ({
        pos: extended.position,
        isFirst: extended.first,
        isLast: extended.last,
      }))
      const Item = ({ children, pos, isFirst, isLast }: any) => (
        <span
          data-testid="item"
          data-pos={pos}
          data-first={String(isFirst)}
          data-last={String(isLast)}
        >
          {children}
        </span>
      )
      render(
        <Iterator
          component={Item}
          data={['a', 'b', 'c']}
          itemProps={itemPropsFn}
        />,
      )
      const items = screen.getAllByTestId('item')
      expect(items[0]).toHaveAttribute('data-first', 'true')
      expect(items[0]).toHaveAttribute('data-last', 'false')
      expect(items[2]).toHaveAttribute('data-first', 'false')
      expect(items[2]).toHaveAttribute('data-last', 'true')
    })
  })

  describe('wrapComponent', () => {
    it('wraps each item with wrapComponent', () => {
      const Wrap = ({ children }: any) => (
        <div data-testid="wrap">{children}</div>
      )
      render(
        <Iterator
          component={TextItem}
          data={['a', 'b']}
          wrapComponent={Wrap}
        />,
      )
      expect(screen.getAllByTestId('wrap')).toHaveLength(2)
      expect(screen.getAllByTestId('item')).toHaveLength(2)
    })

    it('wraps children with wrapComponent', () => {
      const Wrap = ({ children }: any) => (
        <div data-testid="wrap">{children}</div>
      )
      render(
        <Iterator wrapComponent={Wrap}>
          <span data-testid="child-a">A</span>
          <span data-testid="child-b">B</span>
        </Iterator>,
      )
      expect(screen.getAllByTestId('wrap')).toHaveLength(2)
    })

    it('passes wrapProps to wrapComponent', () => {
      const Wrap = ({ children, extra }: any) => (
        <div data-testid="wrap" data-extra={extra}>
          {children}
        </div>
      )
      render(
        <Iterator
          component={TextItem}
          data={['a']}
          wrapComponent={Wrap}
          wrapProps={{ extra: 'val' }}
        />,
      )
      expect(screen.getByTestId('wrap')).toHaveAttribute('data-extra', 'val')
    })

    it('passes wrapProps callback with extended props', () => {
      const wrapPropsFn = jest.fn((_item, extended) => ({
        'data-pos': extended.position,
      }))
      const Wrap = ({ children, ...rest }: any) => (
        <div data-testid="wrap" {...rest}>
          {children}
        </div>
      )
      render(
        <Iterator
          component={TextItem}
          data={['a', 'b']}
          wrapComponent={Wrap}
          wrapProps={wrapPropsFn}
        />,
      )
      const wraps = screen.getAllByTestId('wrap')
      expect(wraps[0]).toHaveAttribute('data-pos', '1')
      expect(wraps[1]).toHaveAttribute('data-pos', '2')
    })

    it('skips wrapComponent for items with custom component in object array', () => {
      const Default = ({ label }: any) => (
        <span data-testid="default">{label}</span>
      )
      const Custom = ({ label }: any) => (
        <em data-testid="custom">{label}</em>
      )
      const Wrap = ({ children }: any) => (
        <div data-testid="wrap">{children}</div>
      )
      render(
        <Iterator
          component={Default}
          data={[
            { label: 'one' },
            { label: 'two', component: Custom },
          ]}
          wrapComponent={Wrap}
        />,
      )
      // Only the default item gets wrapped
      expect(screen.getAllByTestId('wrap')).toHaveLength(1)
      expect(screen.getByTestId('custom')).toBeInTheDocument()
    })
  })

  describe('children with itemProps (no wrapComponent)', () => {
    it('injects itemProps into children without wrapping', () => {
      const itemPropsFn = jest.fn(() => ({ 'data-injected': 'yes' }))
      render(
        <Iterator itemProps={itemPropsFn}>
          <span data-testid="child-a">A</span>
          <span data-testid="child-b">B</span>
        </Iterator>,
      )
      expect(itemPropsFn).toHaveBeenCalled()
    })

    it('injects itemProps into single child', () => {
      const itemPropsFn = jest.fn(() => ({}))
      render(
        <Iterator itemProps={itemPropsFn}>
          <span data-testid="only">Only</span>
        </Iterator>,
      )
      expect(itemPropsFn).toHaveBeenCalled()
    })
  })

  describe('edge cases', () => {
    it('returns null when component is missing but data exists', () => {
      const { container } = render(
        <Iterator data={['a', 'b']} />,
      )
      expect(container.innerHTML).toBe('')
    })

    it('returns null when data is not an array', () => {
      const { container } = render(
        <Iterator component={TextItem} data={'not-array' as any} />,
      )
      expect(container.innerHTML).toBe('')
    })

    it('returns null for mixed simple and object array', () => {
      const { container } = render(
        <Iterator component={TextItem} data={['hello', { name: 'world' }] as any} />,
      )
      expect(container.innerHTML).toBe('')
    })

    it('returns null for unsupported data types in array', () => {
      const { container } = render(
        <Iterator component={TextItem} data={[true, false] as any} />,
      )
      expect(container.innerHTML).toBe('')
    })

    it('handles itemKey as number (fallback to index)', () => {
      const Item = ({ name }: any) => (
        <span data-testid="item">{name}</span>
      )
      render(
        <Iterator
          component={Item}
          data={[{ name: 'Alice' }, { name: 'Bob' }]}
          itemKey={42 as any}
        />,
      )
      expect(screen.getAllByTestId('item')).toHaveLength(2)
    })
  })
})
