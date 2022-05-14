import rocketstyle from '@vitus-labs/rocketstyle'
import { Element } from '@vitus-labs/elements'
import { styles } from '@vitus-labs/unistyle'

export default rocketstyle()({
  component: Element,
  name: 'element',
})
  .theme({
    fontFamily: 'Arial',
  })
  .styles(
    (css) => css<any>`
      ${({ $rocketstyle }) => {
        const baseTheme = styles({ theme: $rocketstyle, css, rootSize: 16 })

        return css`
          ${baseTheme};
        `
      }};
    `
  )
