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
  title: 'Hidden cols example',
}

export const hiddenColumn = () => (
  <Container colCss={columnCss}>
    <Row gap={0}>
      <Col size={{ xs: 0, sm: 1, md: 4 }}>gap-0</Col>
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
