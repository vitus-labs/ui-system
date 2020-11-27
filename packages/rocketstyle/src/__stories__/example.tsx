import React from 'react'
import { Element } from '@vitus-labs/elements'
import rocketstyle from '~/init'

const theme = {
  fontSize: {
    a: 12,
    b: 12,
  },
}

// const defaultDimensions = {
//   gaps: 'state',
//   sizes: 'size',
//   variants: 'variant',
//   multiple: ['multiple', { multi: true }],
// }

const Test = rocketstyle<typeof theme>({
  useBooleans: true,
})({
  component: Element,
  name: 'Hello',
})
  .config({
    provider: true,
    component: Element,
    consumer: ({ hover }) => ({ hover }),
    name: 'name',
    DEBUG: true,
  })
  .theme((t) => ({
    a: t.fontSize.a,
    b: t.fontSize.b,
  }))
  .sizes((t) => ({
    hello: t.fontSize.b,
  }))
  .sizes((t) => ({
    a: t.fontSize.b,
  }))
  .variants((t, css) => ({
    a: {
      test: t.fontSize.b,
      a: css`
        text-align: center;
      `,
    },
  }))

const Component = (props) => (
  <Test
    beforeContent
    afterContentAlignX
    beforeContentDirection="inline"
    {...props}
  />
)
