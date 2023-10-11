import { Element } from '@vitus-labs/elements'
import { attrs } from '~/index'

// --------------------------------------------------------
// basic Button component
// --------------------------------------------------------
const Button = attrs({ name: 'Button', component: Element })
  .attrs<{ href?: string }>({
    tag: 'button',
    label: 'something',
  })
  .attrs<{ something?: boolean }>(
    ({ content }) => ({
      tag: 'button',
      // label: true,
      contentAlignX: 'block',
      content,
      contentDirection: 'inline',
    }),
    { filter: ['something'] },
  )
  .attrs(({ content }) => ({
    tag: 'button',
    // label: true,
    contentAlignX: 'block',
    content,
  }))
  .attrs({
    tag: 'button',
    alignX: 'center',
    contentDirection: 'reverseInline',
    href: '',
  })

export default Button
