import { render, screen } from '@testing-library/react'
import { Provider } from '@vitus-labs/unistyle'
import Col from '../Col/component'
import Container from '../Container/component'
import Row from '../Row/component'

const theme = { rootSize: 16, breakpoints: { xs: 0 } }
const wrapper = ({ children }: any) => (
  <Provider theme={theme}>{children}</Provider>
)

describe('Col', () => {
  describe('statics', () => {
    it('has displayName', () => {
      expect(Col.displayName).toBe('@vitus-labs/coolgrid/Col')
    })

    it('has pkgName', () => {
      expect(Col.pkgName).toBe('@vitus-labs/coolgrid')
    })

    it('has VITUS_LABS__COMPONENT', () => {
      expect(Col.VITUS_LABS__COMPONENT).toBe('@vitus-labs/coolgrid/Col')
    })
  })

  it('renders children', () => {
    render(
      <Container columns={12}>
        <Row>
          <Col size={6}>
            <div data-testid="child">Content</div>
          </Col>
        </Row>
      </Container>,
      { wrapper },
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('adds data-coolgrid attribute in dev mode', () => {
    const { container } = render(
      <Container columns={12}>
        <Row>
          <Col size={6}>
            <div>Content</div>
          </Col>
        </Row>
      </Container>,
      { wrapper },
    )
    const colEl = container.querySelector('[data-coolgrid="col"]')
    expect(colEl).toBeTruthy()
  })

  it('accepts size prop', () => {
    render(
      <Container columns={12} gap={16}>
        <Row>
          <Col size={4}>
            <div data-testid="col4">Col 4</div>
          </Col>
          <Col size={8}>
            <div data-testid="col8">Col 8</div>
          </Col>
        </Row>
      </Container>,
      { wrapper },
    )
    expect(screen.getByTestId('col4')).toBeInTheDocument()
    expect(screen.getByTestId('col8')).toBeInTheDocument()
  })

  it('accepts css prop', () => {
    render(
      <Container columns={12}>
        <Row>
          <Col size={6} css="background: green;">
            <div data-testid="child">Content</div>
          </Col>
        </Row>
      </Container>,
      { wrapper },
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('accepts padding prop', () => {
    render(
      <Container columns={12}>
        <Row>
          <Col size={6} padding={8}>
            <div data-testid="child">Content</div>
          </Col>
        </Row>
      </Container>,
      { wrapper },
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('works standalone without Row/Container', () => {
    render(
      <Col columns={12} size={6}>
        <div data-testid="child">Content</div>
      </Col>,
      { wrapper },
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('renders with size 0 (hidden)', () => {
    render(
      <Container columns={12}>
        <Row>
          <Col size={0}>
            <div data-testid="hidden">Hidden</div>
          </Col>
        </Row>
      </Container>,
      { wrapper },
    )
    // Element still renders but should be positioned off-screen
    expect(screen.getByTestId('hidden')).toBeInTheDocument()
  })
})
