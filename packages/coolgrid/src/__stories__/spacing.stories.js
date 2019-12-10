import Container from '../Container'
import Row from '../Row'
import Col from '../Col'

const colCss = css => css`
  background-color: #e0e0eb;
  border: 1px solid #b3b3cc;
  padding: 20px;
`

storiesOf('COOLGRID | Spacing Examples', module)
  .add('Row with 0px vs 10px gap', () => {
    return (
      <Container colCss={colCss}>
        <Row gap={0}>
          <Col size={4}>gap-0</Col>
          <Col size={4}>gap-0</Col>
          <Col size={4}>gap-0</Col>
          <Col size={4}>gap-0</Col>
          <Col size={4}>gap-0</Col>
          <Col size={4}>gap-0</Col>
        </Row>
        <Row gap={10}>
          <Col size={4}>gap-10</Col>
          <Col size={4}>gap-10</Col>
          <Col size={4}>gap-10</Col>
          <Col size={4}>gap-10</Col>
          <Col size={4}>gap-10</Col>
          <Col size={4}>gap-10</Col>
        </Row>
      </Container>
    )
  })
  .add('Grid with 0px vs. 10px gap', () => {
    return (
      <Container colCss={colCss}>
        <Row>
          <Col size={4}>gap-0</Col>
          <Col size={4}>gap-0</Col>
          <Col size={4}>gap-0</Col>
          <Col size={4}>gap-0</Col>
          <Col size={4}>gap-0</Col>
          <Col size={4}>gap-0</Col>
          <Col size={4}>gap-0</Col>
          <Col size={4}>gap-0</Col>
          <Col size={4}>gap-0</Col>
        </Row>
        <Row gap={10}>
          <Col size={4}>gap-10</Col>
          <Col size={4}>gap-10</Col>
          <Col size={4}>gap-10</Col>
          <Col size={4}>gap-10</Col>
          <Col size={4}>gap-10</Col>
          <Col size={4}>gap-10</Col>
          <Col size={4}>gap-10</Col>
          <Col size={4}>gap-10</Col>
          <Col size={4}>gap-10</Col>
        </Row>
      </Container>
    )
  })
  .add('Rows with different gaps', () => {
    return (
      <Container colCss={colCss}>
        <Row>
          <Col>gap-0</Col>
          <Col>gap-0</Col>
          <Col>gap-0</Col>
          <Col>gap-0</Col>
          <Col>gap-0</Col>
        </Row>
        <Row gap={10}>
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
        <Row gap={30}>
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
  .add('Rows with reset horizontal gaps', () => {
    return (
      <Container colCss={colCss}>
        <Row gap={10} gutter={0}>
          <Col size={4}>gap-0</Col>
          <Col size={4}>gap-0</Col>
          <Col size={4}>gap-0</Col>
          <Col size={4}>gap-0</Col>
          <Col size={4}>gap-0</Col>
          <Col size={4}>gap-0</Col>
        </Row>
        <Row gap={10} gutter={0}>
          <Col size={4}>gap-10</Col>
          <Col size={4}>gap-10</Col>
          <Col size={4}>gap-10</Col>
          <Col size={4}>gap-10</Col>
          <Col size={4}>gap-10</Col>
          <Col size={4}>gap-10</Col>
        </Row>
        <Row gap={20} gutter={0}>
          <Col size={4}>gap-20</Col>
          <Col size={4}>gap-20</Col>
          <Col size={4}>gap-20</Col>
          <Col size={4}>gap-20</Col>
          <Col size={4}>gap-20</Col>
          <Col size={4}>gap-20</Col>
        </Row>
      </Container>
    )
  })
  .add('Columns with padding', () => {
    const colCss = css => css`
      background-color: #e0e0eb;
      border: 1px solid #b3b3cc;
    `
    return (
      <Container colCss={colCss}>
        <Row gap={10} gutter={0} padding={20}>
          <Col size={4}>gap-0</Col>
          <Col size={4}>gap-0</Col>
          <Col size={4}>gap-0</Col>
          <Col size={4}>gap-0</Col>
          <Col size={4}>gap-0</Col>
          <Col size={4}>gap-0</Col>
        </Row>
        <Row gap={10} gutter={0} padding={10}>
          <Col size={4}>gap-10</Col>
          <Col size={4}>gap-10</Col>
          <Col size={4}>gap-10</Col>
          <Col size={4}>gap-10</Col>
          <Col size={4}>gap-10</Col>
          <Col size={4}>gap-10</Col>
        </Row>
        <Row gap={20} gutter={0} padding={5}>
          <Col size={4}>gap-20</Col>
          <Col size={4}>gap-20</Col>
          <Col size={4}>gap-20</Col>
          <Col size={4}>gap-20</Col>
          <Col size={4}>gap-20</Col>
          <Col size={4}>gap-20</Col>
        </Row>
      </Container>
    )
  })
