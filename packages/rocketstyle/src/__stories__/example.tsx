import React from 'react'
import { Element } from '@vitus-labs/elements'
import { Theme } from '@vitus-labs/unistyle/lib/types/styles/styles.types'
import rocketstyle from '~/init'

const theme = {
  fontSize: {
    a: 12,
    b: 12,
  },
}

const defaultDimensions = {
  gaps: 'state',
  sizes: 'size',
  variants: 'variant',
  multiple: { propName: 'multiple', multi: true },
} as const

const Test = rocketstyle<typeof theme, Theme>()({
  useBooleans: true,
  dimensions: defaultDimensions,
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
  .theme((t, css) => ({
    a: t.fontSize.a,
    extendCss: css`
      text-align: center;
    `,
  }))
  .attrs({
    test: null,
    beforeContentAlignX: 'center',
    afterContentAlignX: 'right',
  })
  .attrs(({ contentAlignX }) => ({
    contentAlignX,
    beforeContentAlignX: 'left',
  }))
  .variants({
    variantA: {
      fontFamily: 'something',
      someExtra: 'string',
    },
  })

const Component = (props) => (
  <Test
    contentAlignX="right"
    direction="inline"
    beforeContent
    afterContentAlignX
    beforeContentDirection="inline"
    {...props}
  />
)

// const def = {
//   test: 'hello',
// }

// const example = (a: typeof def) => {
//   const c = a === 'hello' ? 'c' : 'd'

//   return {
//     something: 'b',
//     c,
//   }
// }

// const smth = example(def)
