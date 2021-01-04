import React from 'react'
import Badge from '.'
import Button from '../Button'
import Heading from '../Heading'

const renderExamples = (props = {}) =>
  [
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'light',
    'dark',
  ].map((value) => (
    <Badge key={value} label={value} {...{ [value]: true }} {...props} />
  ))

export default {
  component: Badge,
  title: 'Badge',
}

export const examples = () => (
  <>
    {['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((value) => (
      <Heading key={value} {...{ [value]: true }}>
        Example heading <Badge secondary label="New" />
      </Heading>
    ))}

    <Button primary>
      Primary&nbsp;
      <Badge light label="4" />
    </Button>
  </>
)

export const contextualVariations = () => renderExamples()

export const pillBadges = () => renderExamples({ pill: true })

export const outlinedBadges = () => renderExamples({ outline: true })

export const outlinedPillbadges = () =>
  renderExamples({ pill: true, outline: true })

export const links = () => renderExamples({ href: '#', tag: 'a' })
