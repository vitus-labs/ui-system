import { element } from '../../base'

export default element
  .config({
    name: 'Card.Image'
  })
  .attrs({
    tag: 'img'
  })
  .theme({
    width: '100%'
  })
  .variants((_, css) => ({
    top: {
      extendCss: css`
        border-top-left-radius: calc(0.25rem - 1px);
        border-top-right-radius: calc(0.25rem - 1px);
      `
    },
    bottom: {
      extendCss: css`
        border-bottom-right-radius: calc(0.25rem - 1px);
        border-bottom-left-radius: calc(0.25rem - 1px);
      `
    }
  }))
