import React from 'react'
import { Container, Inner } from './Composition'

export default {
  component: Container,
  title: 'ELEMENTS | Element',
}

export const composition = () => (
  <>
    <Container>
      <Inner>Hello</Inner>
    </Container>
    <Container>
      <p>
        This is some text <a href="#">with link</a>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining
        essentially unchanged. It was popularised in the 1960s with the release
        of Letraset sheets containing Lorem Ipsum passages, and more recently
        with desktop publishing software like Aldus PageMaker including versions
        of Lorem Ipsum.
      </p>
    </Container>
    <Container>
      <span>This is some text</span>
      <span>This is some text</span>
      <span>This is some text</span>
    </Container>
  </>
)
