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

  describe('ref forwarding', () => {
    it('forwards ref', () => {
      const ref = { current: null }
      render(<Text ref={ref}>Hello</Text>, { wrapper })
      expect(ref.current).toBeInstanceOf(HTMLElement)
    })
  })
})
