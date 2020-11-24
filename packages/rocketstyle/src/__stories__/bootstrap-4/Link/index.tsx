import { darken } from 'polished'
import { element } from '../base'

export const createState = (color) => ({
  color,
  textDecoration: 'none',
  hover: { color: darken(0.2, color), textDecoration: 'underline' },
})

const styles = (css) => css`
  text-decoration-skip: objects; /* stylelint-disable-line */
`

export default element
  .config({
    name: 'bootstrap-4/Link',
  })
  .styles(styles)
  .attrs(({ disabled }) => ({
    tag: 'a',
    tabindex: disabled ? '-1' : undefined,
    'aria-disabled': disabled ? 'true' : undefined,
  }))
  .theme((t) => ({
    bgColor: t.color.transparent,
    ...createState(t.color.primary),
  }))
  .states((t) => ({
    primary: createState(t.color.primary),
    secondary: createState(t.color.secondary),
    success: createState(t.color.success),
    danger: createState(t.color.danger),
    warning: createState(t.color.warning),
    info: createState(t.color.info),
    light: createState(t.color.light),
    dark: createState(t.color.dark),
    disabled: createState(t.color.gray600),
  }))
