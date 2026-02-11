import { render, screen } from '@testing-library/react'
import { Provider } from '@vitus-labs/unistyle'
import Container from '../Container/component'

const theme = { rootSize: 16, breakpoints: { xs: 0 } }
const wrapper = ({ children }: any) => (
  <Provider theme={theme}>{children}</Provider>
)

describe('Container', () => {
  describe('statics', () => {
    it('has displayName', () => {
      expect(Container.displayName).toBe('@vitus-labs/coolgrid/Container')
    })

    it('has pkgName', () => {
      expect(Container.pkgName).toBe('@vitus-labs/coolgrid')
    })

    it('has VITUS_LABS__COMPONENT', () => {
      expect(Container.VITUS_LABS__COMPONENT).toBe(
        '@vitus-labs/coolgrid/Container',
      )
    })
  })

  it('renders children', () => {
    render(
      <Container>
        <div data-testid="child">Content</div>
      </Container>,
      { wrapper },
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('adds data-coolgrid attribute in dev mode', () => {
    const { container } = render(
      <Container>
        <div>Content</div>
      </Container>,
      { wrapper },
    )
    const styledEl = container.lastElementChild as HTMLElement
    expect(styledEl.getAttribute('data-coolgrid')).toBe('container')
  })

  it('accepts custom width prop', () => {
    render(
      <Container width={{ xs: 600 }}>
        <div data-testid="child">Content</div>
      </Container>,
      { wrapper },
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('accepts width as function', () => {
    render(
      <Container width={(containerWidth: any) => containerWidth}>
        <div data-testid="child">Content</div>
      </Container>,
      { wrapper },
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('accepts css prop', () => {
    render(
      <Container css="background: red;">
        <div data-testid="child">Content</div>
      </Container>,
      { wrapper },
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('provides grid context to children', () => {
    render(
      <Container columns={12} gap={16} gutter={8}>
        <div data-testid="child">Content</div>
      </Container>,
      { wrapper },
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })
})
