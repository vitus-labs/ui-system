import Container from '../Container'
import Row from '../Row'
import Col from '../Col'

const columnCss = (css) => css`
  background-color: #e0e0eb;
  border: 1px solid #b3b3cc;
  padding: 20px;
`

const columnCss1 = (css) => css`
  background-color: #efefef;
  border: 1px solid #e0e0e0;
  padding: 20px;
`

storiesOf('COOLGRID | Context usage', module)
  .add('Define gap and size on Container', () => {
    return (
      <Container gap={10} size={4} colCss={columnCss}>
        <Row>
          <Col>gap-10</Col>
          <Col>gap-10</Col>
          <Col>gap-10</Col>
          <Col>gap-10</Col>
          <Col>gap-10</Col>
          <Col>gap-10</Col>
        </Row>
        <Row>
          <Col>gap-10</Col>
          <Col>gap-10</Col>
          <Col>gap-10</Col>
        </Row>
      </Container>
    )
  })
  .add('Define gap and size on Rows', () => {
    return (
      <Container colCss={columnCss}>
        <Row gap={10} size={4}>
          <Col>gap-10</Col>
          <Col>gap-10</Col>
          <Col>gap-10</Col>
          <Col>gap-10</Col>
          <Col>gap-10</Col>
          <Col>gap-10</Col>
        </Row>
        <Row gap={20} size={3}>
          <Col>gap-20</Col>
          <Col>gap-20</Col>
          <Col>gap-20</Col>
          <Col>gap-20</Col>
        </Row>
      </Container>
    )
  })
  .add('Different Col styles', () => {
    return (
      <Container colCss={columnCss}>
        <Row>
          <Col>gap-0</Col>
          <Col>gap-0</Col>
          <Col>gap-0</Col>
          <Col>gap-0</Col>
          <Col>gap-0</Col>
        </Row>
        <Row gap={10} colCss={columnCss1}>
          <Col>gap-10</Col>
          <Col>gap-10</Col>
          <Col>gap-10</Col>
          <Col>gap-10</Col>
          <Col>gap-10</Col>
        </Row>
        <Row gap={20}>
          <Col>gap-20</Col>
          <Col>gap-20</Col>
          <Col>gap-20</Col>
          <Col>gap-20</Col>
          <Col>gap-20</Col>
        </Row>
        <Row gap={20} colCss={columnCss1}>
          <Col>gap-30</Col>
          <Col>gap-30</Col>
          <Col>gap-30</Col>
          <Col>gap-30</Col>
          <Col>gap-30</Col>
        </Row>
        <Row gap={40}>
          <Col>gap-40</Col>
          <Col>gap-40</Col>
          <Col>gap-40</Col>
          <Col>gap-40</Col>
          <Col>gap-40</Col>
        </Row>
      </Container>
    )
  })
