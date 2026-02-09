import { render, screen } from '@testing-library/react'
import { Provider } from '@vitus-labs/unistyle'
import Container from '../Container/component'
import Row from '../Row/component'

const theme = { rootSize: 16, breakpoints: { xs: 0 } }
const wrapper = ({ children }: any) => (
  <Provider theme={theme}>{children}</Provider>
)

describe('Row', () => {
  describe('statics', () => {
    it('has displayName', () => {
      expect(Row.displayName).toBe('@vitus-labs/coolgrid/Row')
    })

    it('has pkgName', () => {
      expect(Row.pkgName).toBe('@vitus-labs/coolgrid')
    })

    it('has VITUS_LABS__COMPONENT', () => {
      expect(Row.VITUS_LABS__COMPONENT).toBe('@vitus-labs/coolgrid/Row')
    })
  })

  it('renders children', () => {
    render(
      <Container>
        <Row>
          <div data-testid="child">Content</div>
        </Row>
      </Container>,
      { wrapper },
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('adds data-coolgrid attribute in dev mode', () => {
    const { container } = render(
      <Container>
        <Row>
          <div>Content</div>
        </Row>
      </Container>,
      { wrapper },
    )
    const rowEl = container.querySelector('[data-coolgrid="row"]')
    expect(rowEl).toBeTruthy()
  })

  it('inherits context from Container', () => {
    render(
      <Container columns={12} gap={16}>
        <Row>
          <div data-testid="child">Content</div>
        </Row>
      </Container>,
      { wrapper },
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('accepts css prop', () => {
    render(
      <Container>
        <Row css="background: blue;">
          <div data-testid="child">Content</div>
        </Row>
      </Container>,
      { wrapper },
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('accepts contentAlignX prop', () => {
    render(
      <Container>
        <Row contentAlignX="center">
          <div data-testid="child">Content</div>
        </Row>
      </Container>,
      { wrapper },
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('works standalone without Container', () => {
    render(
      <Row columns={12} gap={16}>
        <div data-testid="child">Content</div>
      </Row>,
      { wrapper },
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })
})
