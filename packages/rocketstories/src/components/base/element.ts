/**
 * Base rocketstyle element used internally by rocketstories for
 * layout wrappers and story containers. Applies a default Arial
 * font family via the theme and renders unistyle-based CSS.
 */
import { Element } from '@vitus-labs/elements'
import rocketstyle from '@vitus-labs/rocketstyle'
import { styles } from '@vitus-labs/unistyle'

export default rocketstyle()({
  component: Element,
  name: 'element',
})
  .theme({
    fontFamily: 'Arial',
  })
  .styles(
    (css) => css`
      ${({ $rocketstyle }: any) => {
        const baseTheme = styles({ theme: $rocketstyle, css, rootSize: 16 })

        return css`
          ${baseTheme};
        `
      }};
    `,
  )
