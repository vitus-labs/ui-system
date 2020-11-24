import React from 'react'
import Heading from '.'

export default {
  component: Heading,
  title: 'Heading',
}

export const examples = () =>
  ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((value) => (
    <Heading tag={value} {...{ [value]: true }}>
      Example heading
    </Heading>
  ))

export const displayHeadingExamples = () =>
  ['display1', 'display2', 'display3', 'display4'].map((value, i) => (
    <Heading {...{ [value]: true }}>Display {i + 1}</Heading>
  ))
