import { rgba } from 'polished'
import base from '../base'

export default base
  .config({
    name: 'Card.Header'
  })
  .styles(
    css => css`
      &:first-child {
        border-radius: calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0;
      }
    `
  )
  .theme(t => ({
    paddingY: t.spacing.base,
    paddingX: t.spacing.xl,
    borderWidthBottom: t.borderWidth,
    borderStyleBottom: 'solid',
    borderColorBottom: rgba(t.color.black, 0.125),
    bgColor: rgba(t.color.black, 0.03),
    marginBottom: t.spacing.reset
  }))
