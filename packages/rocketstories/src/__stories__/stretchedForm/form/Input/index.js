import { element } from '../../base'

export default element
  .config({ name: 'base/form/Input' })
  .attrs({
    tag: 'input',
    type: 'text'
  })
  .styles(
    css => css`
      border: none;
      outline: none;
    `
  )
  .theme(t => ({
    color: 'inherit',
    fontWeight: 'inherit',
    fontSize: 'inherit',
    bgColor: t.color.transparent,
    paddingY: t.spacing.reset,
    paddingX: t.spacing.xs,
    height: '36px',
    width: '100%'
  }))
