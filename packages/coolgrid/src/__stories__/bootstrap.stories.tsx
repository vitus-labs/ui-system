import Container from '../Container'
import Row from '../Row'
import Col from '../Col'

const colCss = (css) => css`
  background-color: #e0e0eb;
  border: 1px solid #b3b3cc;
  padding: 20px;
`

storiesOf('COOLGRID | Bootstrap Grid Examples', module)
  .add('Three Equal Columns', () => (
    <Container colCss={colCss}>
      <Row>
        <Col />
        <Col />
        <Col />
      </Row>
    </Container>
  ))
  .add('Three Equal Columns Using Numbers', () => (
    <Container colCss={colCss}>
      <Row>
        <Col size={4} />
        <Col size={4} />
        <Col size={4} />
      </Row>
      <Row>
        <Col xs={4} sm={4} md={4} lg={4} xl={4} />
        <Col xs={4} sm={4} md={4} lg={4} xl={4} />
        <Col xs={4} sm={4} md={4} lg={4} xl={4} />
      </Row>
    </Container>
  ))

  .add('Three Unequal columns', () => (
    <Container colCss={colCss}>
      <Row>
        <Col size={2} />
        <Col size={3} />
        <Col size={7} />
      </Row>
      <Row>
        <Col xs={2} sm={2} md={2} lg={2} xl={2} />
        <Col xs={3} sm={3} md={3} lg={3} xl={3} />
        <Col xs={7} sm={7} md={7} lg={7} xl={7} />
      </Row>
    </Container>
  ))
  .add('Setting One Column Width', () => (
    <Container colCss={colCss}>
      <Row>
        <Col />
        <Col size={6} />
        <Col />
      </Row>
      <Row>
        <Col />
        <Col xs={6} sm={6} md={6} lg={6} xl={6} />
        <Col />
      </Row>
    </Container>
  ))
  .add('More Equal Columns', () => (
    <Container colCss={colCss}>
      <Row>
        <Col />
        <Col />
      </Row>
      <Row>
        <Col />
        <Col />
        <Col />
        <Col />
      </Row>
      <Row>
        <Col />
        <Col />
        <Col />
        <Col />
        <Col />
        <Col />
      </Row>
    </Container>
  ))
  .add('More Unequal Columns', () => (
    <Container colCss={colCss}>
      <Row>
        <Col size={8} />
        <Col size={4} />
      </Row>
      <Row>
        <Col size={2} />
        <Col size={2} />
        <Col size={2} />
        <Col size={6} />
      </Row>
      <Row>
        <Col size={4} />
        <Col size={6} />
        <Col />
        <Col />
      </Row>
    </Container>
  ))
  .add('Equal Height', () => (
    <Container colCss={colCss}>
      <Row>
        <Col>
          Lorem ipsum dolor sit amet, cibo sensibus interesset no sit. Et dolor
          possim volutpat qui. No malis tollit iriure eam, et vel tale zril
          blandit, rebum vidisse nostrum qui eu. No nostrud dolorem legendos
          mea, ea eum mucius oporteat platonem.Eam an case scribentur, ei clita
          causae cum, alia debet eu vel.
        </Col>
        <Col />
        <Col />
      </Row>
    </Container>
  ))
  .add('Nested Columns', () => (
    <Container colCss={colCss}>
      <Row>
        <Col size={8}>
          <Row>
            <Col size={6}>col-6</Col>
            <Col size={6}>col-6</Col>
          </Row>
        </Col>
        <Col size={4} />
      </Row>
    </Container>
  ))
  .add('Mix and Match', () => (
    <Container colCss={colCss}>
      <Row>
        <Col size={6} sm={9}>
          col-6 col-sm-9
        </Col>
        <Col size={6} sm={3}>
          col-6 col-sm-3
        </Col>
      </Row>
      <Row>
        <Col size={7} lg={8}>
          col-7 col-lg-8
        </Col>
        <Col size={5} lg={4}>
          col-5 col-lg-4
        </Col>
      </Row>
      <Row>
        <Col sm={3} md={6} lg={4}>
          col-sm-3 col-md-6 col-lg-4
        </Col>
        <Col sm={9} md={6} lg={8}>
          col-sm-9 col-md-6 col-lg-8
        </Col>
      </Row>
    </Container>
  ))
  .add('Hidden for chosen breakpoints', () => (
    <Container colCss={colCss}>
      <Row>
        <Col size={6} xs={0} sm={9} md={0}>
          xs-hidden, col-6 col-sm-9, md-hidden
        </Col>
        <Col size={6} sm={3}>
          col-6 col-sm-3
        </Col>
      </Row>
      <Row>
        <Col size={7} lg={8}>
          col-7 col-lg-8
        </Col>
        <Col size={5} lg={4}>
          col-5 col-lg-4
        </Col>
      </Row>
    </Container>
  ))
