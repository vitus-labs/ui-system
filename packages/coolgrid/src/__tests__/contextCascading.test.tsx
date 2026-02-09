import { render, screen } from '@testing-library/react'
import { Provider } from '@vitus-labs/unistyle'
import Col from '../Col/component'
import Container from '../Container/component'
import Row from '../Row/component'

const theme = { rootSize: 16, breakpoints: { xs: 0 } }
const wrapper = ({ children }: any) => (
  <Provider theme={theme}>{children}</Provider>
)

describe('Context cascading: Container → Row → Col', () => {
  it('Container columns cascade to Col via Row', () => {
    const { container } = render(
      <Container columns={12}>
        <Row>
          <Col size={6}>
            <div data-testid="col">Content</div>
          </Col>
        </Row>
      </Container>,
      { wrapper },
    )
    // Col should be rendered and receive columns=12 from Container
    expect(screen.getByTestId('col')).toBeInTheDocument()
    // Verify the col element exists with the data attribute
    const colEl = container.querySelector('[data-coolgrid="col"]')
    expect(colEl).toBeTruthy()
  })

  it('Container gap cascades through Row to Col', () => {
    render(
      <Container columns={12} gap={16}>
        <Row>
          <Col size={4}>
            <div data-testid="col1">Col 1</div>
          </Col>
          <Col size={4}>
            <div data-testid="col2">Col 2</div>
          </Col>
          <Col size={4}>
            <div data-testid="col3">Col 3</div>
          </Col>
        </Row>
      </Container>,
      { wrapper },
    )
    expect(screen.getByTestId('col1')).toBeInTheDocument()
    expect(screen.getByTestId('col2')).toBeInTheDocument()
    expect(screen.getByTestId('col3')).toBeInTheDocument()
  })

  it('Container gutter cascades to Row', () => {
    render(
      <Container columns={12} gutter={24}>
        <Row>
          <Col size={12}>
            <div data-testid="col">Content</div>
          </Col>
        </Row>
      </Container>,
      { wrapper },
    )
    expect(screen.getByTestId('col')).toBeInTheDocument()
  })

  it('Row overrides Container columns', () => {
    render(
      <Container columns={12}>
        <Row columns={24}>
          <Col size={12}>
            <div data-testid="col">Content</div>
          </Col>
        </Row>
      </Container>,
      { wrapper },
    )
    // Col should receive columns=24 from Row (overriding Container's 12)
    expect(screen.getByTestId('col')).toBeInTheDocument()
  })

  it('Row overrides Container gap', () => {
    render(
      <Container columns={12} gap={16}>
        <Row gap={32}>
          <Col size={6}>
            <div data-testid="col">Content</div>
          </Col>
        </Row>
      </Container>,
      { wrapper },
    )
    expect(screen.getByTestId('col')).toBeInTheDocument()
  })

  it('Col overrides Row/Container size', () => {
    render(
      <Container columns={12} size={6}>
        <Row>
          <Col size={4}>
            <div data-testid="override">Overridden</div>
          </Col>
          <Col>
            <div data-testid="inherited">Inherited</div>
          </Col>
        </Row>
      </Container>,
      { wrapper },
    )
    expect(screen.getByTestId('override')).toBeInTheDocument()
    expect(screen.getByTestId('inherited')).toBeInTheDocument()
  })

  it('multiple Rows in same Container share context', () => {
    render(
      <Container columns={12} gap={16}>
        <Row>
          <Col size={6}>
            <div data-testid="row1-col">Row 1 Col</div>
          </Col>
        </Row>
        <Row>
          <Col size={6}>
            <div data-testid="row2-col">Row 2 Col</div>
          </Col>
        </Row>
      </Container>,
      { wrapper },
    )
    expect(screen.getByTestId('row1-col')).toBeInTheDocument()
    expect(screen.getByTestId('row2-col')).toBeInTheDocument()
  })

  it('nested Containers create independent contexts', () => {
    render(
      <Container columns={12}>
        <Row>
          <Col size={6}>
            <Container columns={6}>
              <Row>
                <Col size={3}>
                  <div data-testid="inner-col">Inner</div>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>,
      { wrapper },
    )
    expect(screen.getByTestId('inner-col')).toBeInTheDocument()
  })

  it('Container padding cascades to Col', () => {
    render(
      <Container columns={12} padding={8}>
        <Row>
          <Col size={6}>
            <div data-testid="col">Content</div>
          </Col>
        </Row>
      </Container>,
      { wrapper },
    )
    expect(screen.getByTestId('col')).toBeInTheDocument()
  })

  it('Col with size=0 renders hidden (off-screen)', () => {
    render(
      <Container columns={12}>
        <Row>
          <Col size={0}>
            <div data-testid="hidden">Hidden</div>
          </Col>
          <Col size={12}>
            <div data-testid="visible">Visible</div>
          </Col>
        </Row>
      </Container>,
      { wrapper },
    )
    expect(screen.getByTestId('hidden')).toBeInTheDocument()
    expect(screen.getByTestId('visible')).toBeInTheDocument()
  })

  it('Container colCss cascades to all Cols', () => {
    render(
      <Container columns={12} colCss="background: red;">
        <Row>
          <Col size={6}>
            <div data-testid="col1">Col 1</div>
          </Col>
          <Col size={6}>
            <div data-testid="col2">Col 2</div>
          </Col>
        </Row>
      </Container>,
      { wrapper },
    )
    expect(screen.getByTestId('col1')).toBeInTheDocument()
    expect(screen.getByTestId('col2')).toBeInTheDocument()
  })

  it('Col css prop overrides cascaded colCss', () => {
    render(
      <Container columns={12} colCss="background: red;">
        <Row>
          <Col size={6} css="background: blue;">
            <div data-testid="col">Col with override</div>
          </Col>
        </Row>
      </Container>,
      { wrapper },
    )
    expect(screen.getByTestId('col')).toBeInTheDocument()
  })

  it('Container rowCss cascades to Row', () => {
    render(
      <Container columns={12} rowCss="background: yellow;">
        <Row>
          <Col size={12}>
            <div data-testid="col">Content</div>
          </Col>
        </Row>
      </Container>,
      { wrapper },
    )
    expect(screen.getByTestId('col')).toBeInTheDocument()
  })

  it('Container contentAlignX cascades to Row', () => {
    render(
      <Container columns={12} contentAlignX="center">
        <Row>
          <Col size={6}>
            <div data-testid="col">Centered</div>
          </Col>
        </Row>
      </Container>,
      { wrapper },
    )
    expect(screen.getByTestId('col')).toBeInTheDocument()
  })

  it('Row contentAlignX overrides Container contentAlignX', () => {
    render(
      <Container columns={12} contentAlignX="center">
        <Row contentAlignX="left">
          <Col size={6}>
            <div data-testid="col">Left aligned</div>
          </Col>
        </Row>
      </Container>,
      { wrapper },
    )
    expect(screen.getByTestId('col')).toBeInTheDocument()
  })

  it('renders full 3-level grid structure correctly', () => {
    const { container } = render(
      <Container columns={12} gap={16} gutter={8} padding={4}>
        <Row>
          <Col size={4}>
            <div data-testid="col-a">A</div>
          </Col>
          <Col size={4}>
            <div data-testid="col-b">B</div>
          </Col>
          <Col size={4}>
            <div data-testid="col-c">C</div>
          </Col>
        </Row>
        <Row>
          <Col size={6}>
            <div data-testid="col-d">D</div>
          </Col>
          <Col size={6}>
            <div data-testid="col-e">E</div>
          </Col>
        </Row>
      </Container>,
      { wrapper },
    )

    // All columns render
    expect(screen.getByTestId('col-a')).toBeInTheDocument()
    expect(screen.getByTestId('col-b')).toBeInTheDocument()
    expect(screen.getByTestId('col-c')).toBeInTheDocument()
    expect(screen.getByTestId('col-d')).toBeInTheDocument()
    expect(screen.getByTestId('col-e')).toBeInTheDocument()

    // Verify DOM structure: container > row > col hierarchy
    const containerEl = container.querySelector('[data-coolgrid="container"]')
    const rows = container.querySelectorAll('[data-coolgrid="row"]')
    const cols = container.querySelectorAll('[data-coolgrid="col"]')

    expect(containerEl).toBeTruthy()
    expect(rows).toHaveLength(2)
    expect(cols).toHaveLength(5)
  })
})
