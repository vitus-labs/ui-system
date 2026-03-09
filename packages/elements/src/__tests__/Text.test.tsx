import { render, screen } from '@testing-library/react'
import { breakpoints, Provider } from '@vitus-labs/unistyle'
import Text from '../Text/component'

const wrapper = ({ children }: any) => (
  <Provider theme={breakpoints}>{children}</Provider>
)

describe('Text', () => {
  describe('statics', () => {
    it('has displayName', () => {
      expect(Text.displayName).toBe('@vitus-labs/elements/Text')
    })

    it('has isText flag', () => {
      expect(Text.isText).toBe(true)
    })

    it('has pkgName', () => {
      expect(Text.pkgName).toBe('@vitus-labs/elements')
    })
  })

  describe('rendering', () => {
    it('renders children', () => {
      render(<Text>Hello</Text>, { wrapper })
      expect(screen.getByText('Hello')).toBeInTheDocument()
    })

    it('renders label prop as fallback', () => {
      render(<Text label="Label text" />, { wrapper })
      expect(screen.getByText('Label text')).toBeInTheDocument()
    })

    it('prefers children over label', () => {
      render(<Text label="Label">Children</Text>, { wrapper })
      expect(screen.getByText('Children')).toBeInTheDocument()
      expect(screen.queryByText('Label')).not.toBeInTheDocument()
    })
  })

  describe('tag prop', () => {
    it('renders with paragraph prop as p tag', () => {
      const { container } = render(<Text paragraph>Paragraph</Text>, {
        wrapper,
      })
      expect(container.querySelector('p')).toHaveTextContent('Paragraph')
    })

    it('renders with custom tag', () => {
      const { container } = render(<Text tag="h1">Heading</Text>, {
        wrapper,
      })
      expect(container.querySelector('h1')).toHaveTextContent('Heading')
    })
  })

  describe('tag prop edge cases', () => {
    it('renders without tag or paragraph (no as prop)', () => {
      const { container } = render(<Text>No tag</Text>, { wrapper })
      // Should render default element (no specific tag override)
      expect(container.textContent).toBe('No tag')
    })

    it('renders with tag taking precedence when paragraph is false', () => {
      const { container } = render(
        <Text tag="h2" paragraph={false}>
          Heading
        </Text>,
        { wrapper },
      )
      expect(container.querySelector('h2')).toHaveTextContent('Heading')
    })

    it('renders with paragraph=false and no tag (finalTag stays undefined)', () => {
      const { container } = render(<Text paragraph={false}>Default</Text>, {
        wrapper,
      })
      // No explicit tag set, should render with default styled element
      expect(container.textContent).toBe('Default')
    })

    it('renders span tag explicitly', () => {
      const { container } = render(<Text tag="span">Inline</Text>, { wrapper })
      expect(container.querySelector('span')).toHaveTextContent('Inline')
    })
  })

  describe('css (extraStyles) prop', () => {
    it('renders without css prop (no extraStyles)', () => {
      render(<Text>No extra styles</Text>, { wrapper })
      expect(screen.getByText('No extra styles')).toBeInTheDocument()
    })

    it('renders with css prop (extraStyles present)', () => {
      render(<Text css="color: red;">With extra styles</Text>, { wrapper })
      expect(screen.getByText('With extra styles')).toBeInTheDocument()
    })
  })

  describe('ref forwarding', () => {
    it('forwards ref', () => {
      const ref = { current: null }
      render(<Text ref={ref}>Hello</Text>, { wrapper })
      expect(ref.current).toBeInstanceOf(HTMLElement)
    })
  })
})
