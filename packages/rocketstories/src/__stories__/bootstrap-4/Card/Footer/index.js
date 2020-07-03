import { rgba } from 'polished'
import base from '../base'

export default base
  .config({
    name: 'Card.Footer'
  })
  .styles(
    css => css`
      &:last-child {
        border-radius: 0 0 calc(0.25rem - 1px) calc(0.25rem - 1px);
      }
    `
  )
  .theme(t => ({
    color: t.color.gray600,
    borderWidthTop: t.borderWidth,
    borderStyleTop: 'solid',
    borderColorTop: rgba(t.color.black, 0.125),
    bgColor: rgba(t.color.black, 0.03),
    paddingY: t.spacing.base,
    paddingX: t.spacing.xl
  }))
