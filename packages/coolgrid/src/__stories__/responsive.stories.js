import Container from '../Container'
import Row from '../Row'
import Col from '../Col'

const colCss = css => css`
  background-color: #e0e0eb;
  border: 1px solid #b3b3cc;
  padding: 20px;
`

storiesOf('COOLGRID | Responsive Examples', module)
  .add('Defined column sizes on each Column component', () => {
    return (
      <Container colCss={colCss}>
        <Row gap={0}>
          <Col xs={12} md={4} lg={6}>
            xs:12, md:4, lg:6
          </Col>
          <Col xs={12} md={4} lg={6}>
            xs:12, md:4, lg:6
          </Col>
          <Col xs={12} md={4} lg={6}>
            xs:12, md:4, lg:6
          </Col>
          <Col xs={12} md={4} lg={6}>
            xs:12, md:4, lg:6
          </Col>
          <Col xs={12} md={4} lg={6}>
            xs:12, md:4, lg:6
          </Col>
          <Col xs={12} md={4} lg={6}>
            xs:12, md:4, lg:6
          </Col>
        </Row>
      </Container>
    )
  })
  .add('Defined column sizes on Row component', () => {
    return (
      <Container colCss={colCss}>
        <Row gap={0} xs={12} md={4} lg={6}>
          <Col>xs:12, md:4, lg:6</Col>
          <Col>xs:12, md:4, lg:6</Col>
          <Col>xs:12, md:4, lg:6</Col>
          <Col>xs:12, md:4, lg:6</Col>
          <Col>xs:12, md:4, lg:6</Col>
          <Col>xs:12, md:4, lg:6</Col>
        </Row>
        <Row gap={10} xs={12} md={4} lg={6}>
          <Col>xs:12, md:4, lg:6</Col>
          <Col>xs:12, md:4, lg:6</Col>
          <Col>xs:12, md:4, lg:6</Col>
          <Col>xs:12, md:4, lg:6</Col>
          <Col>xs:12, md:4, lg:6</Col>
          <Col>xs:12, md:4, lg:6</Col>
        </Row>
      </Container>
    )
  })
  .add('Defined column sizes on Container component', () => {
    return (
      <Container colCss={colCss} xs={12} md={4} lg={6}>
        <Row gap={0} xs={6}>
          <Col size={4}>xs:12, md:4, lg:6</Col>
          <Col>xs:12, md:4, lg:6</Col>
          <Col>xs:12, md:4, lg:6</Col>
          <Col>xs:12, md:4, lg:6</Col>
          <Col>xs:12, md:4, lg:6</Col>
          <Col>xs:12, md:4, lg:6</Col>
        </Row>
        <Row gap={10} xs={12} md={4} lg={6}>
          <Col>xs:12, md:4, lg:6</Col>
          <Col>xs:12, md:4, lg:6</Col>
          <Col>xs:12, md:4, lg:6</Col>
          <Col>xs:12, md:4, lg:6</Col>
          <Col>xs:12, md:4, lg:6</Col>
          <Col>xs:12, md:4, lg:6</Col>
        </Row>
      </Container>
    )
  })
  .add('Overriding', () => {
    return (
      <Container xs={12} md={4} lg={6} colCss={colCss}>
        <Row gap={0}>
          <Col>xs:12, md:4, lg:6</Col>
          <Col>xs:12, md:4, lg:6</Col>
          <Col>xs:12, md:4, lg:6</Col>
          <Col>xs:12, md:4, lg:6</Col>
          <Col>xs:12, md:4, lg:6</Col>
          <Col>xs:12, md:4, lg:6</Col>
        </Row>

        <Row gap={10} size={6}>
          <Col>col 6</Col>
          <Col>col 6</Col>
          <Col>col 6</Col>
          <Col>col 6</Col>
          <Col>col 6</Col>
          <Col>col 6</Col>
          <Col>col 6</Col>
          <Col>col 6</Col>
          <Col>col 6</Col>
        </Row>
      </Container>
    )
  })
  .add('Responsive paddings', () => {
    return (
      <Container
        xs={12}
        md={4}
        lg={6}
        colCss={colCss}
        padding={{ xs: 30, md: 10, lg: 60 }}
      >
        <Row gap={0}>
          <Col>xs:12, md:4, lg:6</Col>
          <Col>xs:12, md:4, lg:6</Col>
          <Col>xs:12, md:4, lg:6</Col>
          <Col>xs:12, md:4, lg:6</Col>
          <Col>xs:12, md:4, lg:6</Col>
          <Col>xs:12, md:4, lg:6</Col>
        </Row>

        <Row gap={10} xs={6}>
          <Col>col 6</Col>
          <Col>col 6</Col>
          <Col>col 6</Col>
          <Col>col 6</Col>
          <Col>col 6</Col>
          <Col>col 6</Col>
          <Col>col 6</Col>
          <Col>col 6</Col>
          <Col>col 6</Col>
        </Row>
      </Container>
    )
  })
