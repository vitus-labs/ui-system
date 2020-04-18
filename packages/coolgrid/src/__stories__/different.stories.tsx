import Container from '../Container'
import Row from '../Row'
import Col from '../Col'

const columnCss = (css) => css`
  background-color: #e0e0eb;
  border: 1px solid #b3b3cc;
  padding: 20px;
`

storiesOf('COOLGRID | __EXAMPLES__', module)
  .add('5 Columns Grid without using Container', () => {
    return (
      <Fragment>
        <Row columns={5} colCss={columnCss}>
          <Col />
          <Col />
          <Col />
          <Col />
          <Col />
        </Row>

        <Row columns={5} colCss={columnCss}>
          <Col xs={3}>xs-3</Col>
          <Col xs={2}>xs-2</Col>
          <Col xs={1}>xs-1</Col>
          <Col xs={3}>xs-3</Col>
          <Col xs={1}>xs-1</Col>
        </Row>
      </Fragment>
    )
  })
  .add('7 Columns Grid without using Container', () => {
    return (
      <Fragment>
        <Row columns={7} colCss={columnCss}>
          <Col />
          <Col />
          <Col />
          <Col />
          <Col />
          <Col />
          <Col />
        </Row>

        <Row columns={7} colCss={columnCss}>
          <Col xs={4}>xs-4</Col>
          <Col xs={3}>xs-3</Col>
          <Col xs={2}>xs-2</Col>
          <Col xs={3}>xs-3</Col>
          <Col xs={2}>xs-2</Col>
        </Row>
      </Fragment>
    )
  })

  .add('Custom Endpoints Grid', () => {
    const breakpoints = {
      phone: 320,
      tablet: 768,
      notebook: 1366,
    }

    const width = {
      phone: 300,
      tablet: 740,
      notebook: 1200,
    }

    return (
      <Container breakpoints={breakpoints} width={width} colCss={columnCss}>
        <Row>
          <Col size={2} />
          <Col size={3} />
          <Col size={7} />
        </Row>
        <Row>
          <Col phone={6} tablet={4} notebook={3}>
            phone-6, tablet-4, notebook-4
          </Col>
          <Col phone={6} tablet={4} notebook={3}>
            phone-6, tablet-4, notebook-3
          </Col>
          <Col phone={12} tablet={4} notebook={3}>
            phone-12, tablet-4, notebook-3
          </Col>
        </Row>
      </Container>
    )
  })
