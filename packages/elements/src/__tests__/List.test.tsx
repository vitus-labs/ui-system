import { Provider, breakpoints } from '@vitus-labs/unistyle'
import { render, screen } from '@testing-library/react'
import List from '../List/component'

const TextItem = ({ children, ...props }: any) => (
  <span data-testid="item" {...props}>
    {children}
  </span>
)

const wrapper = ({ children }: any) => (
  <Provider theme={breakpoints}>{children}</Provider>
)

describe('List', () => {
  describe('statics', () => {
    it('has displayName', () => {
      expect(List.displayName).toBe('@vitus-labs/elements/List')
    })

    it('has pkgName', () => {
      expect(List.pkgName).toBe('@vitus-labs/elements')
    })
  })

  describe('without rootElement (default)', () => {
    it('renders items as fragment', () => {
      render(
        <List component={TextItem} data={['a', 'b', 'c']} />,
        { wrapper },
      )
      const items = screen.getAllByTestId('item')
      expect(items).toHaveLength(3)
      expect(items[0]).toHaveTextContent('a')
      expect(items[1]).toHaveTextContent('b')
      expect(items[2]).toHaveTextContent('c')
    })

    it('renders children directly', () => {
      render(
        <List>
          <span data-testid="child">Direct</span>
        </List>,
        { wrapper },
      )
      expect(screen.getByTestId('child')).toHaveTextContent('Direct')
    })

    it('returns null for empty data', () => {
      const { container } = render(
        <List component={TextItem} data={[]} />,
        { wrapper },
      )
      expect(container.innerHTML).toBe('')
    })
  })

  describe('with rootElement', () => {
    it('wraps items in Element', () => {
      render(
        <List rootElement component={TextItem} data={['x', 'y']} />,
        { wrapper },
      )
      const items = screen.getAllByTestId('item')
      expect(items).toHaveLength(2)
      // Items should be inside a styled element container
      expect(items[0].parentElement).not.toBeNull()
    })

    it('passes non-iterator props to Element wrapper', () => {
      render(
        <List
          rootElement
          component={TextItem}
          data={['a']}
          data-testid="list-root"
          tag="nav"
        />,
        { wrapper },
      )
      const root = screen.getByTestId('list-root')
      expect(root.tagName).toBe('NAV')
    })
  })

  describe('Iterator features through List', () => {
    it('supports valueName', () => {
      const Item = ({ title }: any) => (
        <span data-testid="item">{title}</span>
      )
      render(
        <List component={Item} data={['hello']} valueName="title" />,
        { wrapper },
      )
      expect(screen.getByTestId('item')).toHaveTextContent('hello')
    })

    it('supports object array data', () => {
      const Item = ({ name }: any) => (
        <span data-testid="item">{name}</span>
      )
      render(
        <List
          component={Item}
          data={[{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]}
        />,
        { wrapper },
      )
      const items = screen.getAllByTestId('item')
      expect(items).toHaveLength(2)
      expect(items[0]).toHaveTextContent('Alice')
    })

    it('supports wrapComponent', () => {
      const Wrap = ({ children }: any) => (
        <div data-testid="wrap">{children}</div>
      )
      render(
        <List component={TextItem} data={['a', 'b']} wrapComponent={Wrap} />,
        { wrapper },
      )
      expect(screen.getAllByTestId('wrap')).toHaveLength(2)
    })
  })
})
