import React from 'react'
import Container from '../Container'
import Row from '../Row'
import Col from '../Col'

const columnCss = (css) => css`
  background-color: #e0e0eb;
  border: 1px solid #b3b3cc;
  padding: 20px;
`

export default {
  component: Container,
  title: 'Custom Grid Examples',
}

export const FiveColumnGrid = () => (
  <Container columns={5} colCss={columnCss}>
    <Row>
      <Col />
      <Col />
      <Col />
      <Col />
      <Col />
    </Row>

    <Row gap={120} gutter={0}>
      <Col size={3}>xs-3</Col>
      <Col size={2}>xs-2</Col>
      <Col size={1}>xs-1</Col>
      <Col size={3}>xs-3</Col>
      <Col size={1}>xs-1</Col>
    </Row>
  </Container>
)

export const SevenColumnGrid = () => (
  <Container columns={7} colCss={columnCss}>
    <Row>
      <Col />
      <Col />
      <Col />
      <Col />
      <Col />
      <Col />
      <Col />
    </Row>

    <Row>
      <Col xs={4}>xs-4</Col>
      <Col xs={3}>xs-3</Col>
      <Col xs={2}>xs-2</Col>
      <Col xs={3}>xs-3</Col>
      <Col xs={2}>xs-2</Col>
    </Row>
  </Container>
)

export const CustomEndpointsGrid = () => {
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
}
