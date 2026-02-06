import { element } from '../../base'

export default element
  .config({ name: 'base/form/Input' })
  .attrs<{
    type?: string
    name?: string
    id?: string
    placeholder?: string
    disabled: boolean
    readOnly: boolean
    required: boolean
  }>({
    tag: 'input',
    type: 'text',
  })
  .theme((t) => ({
    color: 'inherit',
    fontWeight: 'inherit',
    fontSize: 'inherit',
    bgColor: t.color.transparent,
    paddingY: t.spacing.reset,
    paddingX: t.spacing.xs,
    height: '36px',
    width: '100%',
  }))
  .styles(
    (css) => css`
      border: none;
      outline: none;
    `,
  )
