import React from 'react'
import Container from '~/Container'
import Row from '~/Row'
import Col from '~/Col'

const columnCss = (css) => css`
  background-color: #e0e0eb;
  border: 1px solid #b3b3cc;
  padding: 20px;
`

export default {
  component: Container,
  title: 'Responsive Examples',
}

export const definedColumnSizesOnEachColumnComponent = () => (
  <Container colCss={columnCss}>
    <Row gap={0}>
      <Col size={{ xs: 12, md: 4, lg: 6 }}>xs:12, md:4, lg:6</Col>
      <Col size={{ xs: 12, md: 4, lg: 6 }}>xs:12, md:4, lg:6</Col>
      <Col size={{ xs: 12, md: 4, lg: 6 }}>xs:12, md:4, lg:6</Col>
      <Col size={{ xs: 12, md: 4, lg: 6 }}>xs:12, md:4, lg:6</Col>
      <Col size={{ xs: 12, md: 4, lg: 6 }}>xs:12, md:4, lg:6</Col>
      <Col size={{ xs: 12, md: 4, lg: 6 }}>xs:12, md:4, lg:6</Col>
    </Row>
  </Container>
)

export const definedColumnSizesOnRowComponent = () => (
  <Container colCss={columnCss}>
    <Row gap={0} size={{ xs: 12, md: 4, lg: 6 }}>
      <Col>xs:12, md:4, lg:6</Col>
      <Col>xs:12, md:4, lg:6</Col>
      <Col>xs:12, md:4, lg:6</Col>
      <Col>xs:12, md:4, lg:6</Col>
      <Col>xs:12, md:4, lg:6</Col>
      <Col>xs:12, md:4, lg:6</Col>
    </Row>
    <Row gap={10} size={{ xs: 12, md: 4, lg: 6 }}>
      <Col>xs:12, md:4, lg:6</Col>
      <Col>xs:12, md:4, lg:6</Col>
      <Col>xs:12, md:4, lg:6</Col>
      <Col>xs:12, md:4, lg:6</Col>
      <Col>xs:12, md:4, lg:6</Col>
      <Col>xs:12, md:4, lg:6</Col>
    </Row>
  </Container>
)

export const definedColumnSizesOnContainerComponent = () => (
  <Container colCss={columnCss} size={{ xs: 12, md: 4, lg: 6 }}>
    <Row gap={0} xs={6}>
      <Col size={4}>xs:12, md:4, lg:6</Col>
      <Col>xs:12, md:4, lg:6</Col>
      <Col>xs:12, md:4, lg:6</Col>
      <Col>xs:12, md:4, lg:6</Col>
      <Col>xs:12, md:4, lg:6</Col>
      <Col>xs:12, md:4, lg:6</Col>
    </Row>
    <Row gap={10} size={{ xs: 12, md: 4, lg: 6 }}>
      <Col>xs:12, md:4, lg:6</Col>
      <Col>xs:12, md:4, lg:6</Col>
      <Col>xs:12, md:4, lg:6</Col>
      <Col>xs:12, md:4, lg:6</Col>
      <Col>xs:12, md:4, lg:6</Col>
      <Col>xs:12, md:4, lg:6</Col>
    </Row>
  </Container>
)

export const overriding = () => (
  <Container size={{ xs: 12, md: 4, lg: 6 }} colCss={columnCss}>
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

export const responsivePaddings = () => (
  <Container
    size={{ xs: 12, md: 4, lg: 6 }}
    colCss={columnCss}
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
