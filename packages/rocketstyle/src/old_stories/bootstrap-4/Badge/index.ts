import { element } from '../base'

export const createState = (bgColor) => ({
  bgColor,
  borderColor: bgColor,
})

const styles = (css) => css`
  white-space: nowrap;
`

export default element
  .config({
    name: 'bootstrap-4/Badge',
  })
  .attrs({
    useDefaultOutline: true,
    tag: 'span',
  })
  .styles(styles)
  .theme((t) => ({
    hideEmpty: true,
    paddingY: t.spacing.xs,
    paddingX: 6,
    fontSize: t.fontSize.smallest,
    fontWeight: t.fontWeight.bold,
    color: t.color.white,
    borderRadius: t.borderRadius.base,
    borderWidth: t.borderWidth,
    borderStyle: 'solid',
    lineHeight: 1,
    ...createState(t.color.black),
  }))
  .states((t) => ({
    primary: createState(t.color.primary),
    secondary: createState(t.color.secondary),
    success: createState(t.color.success),
    danger: createState(t.color.danger),
    warning: createState(t.color.warning),
    info: createState(t.color.info),
    light: {
      ...createState(t.color.light),
      color: t.color.gray900,
    },
    dark: createState(t.color.dark),
  }))
  .multiple((t) => ({
    outline: true,
    pill: {
      paddingX: '.6em',
      borderRadius: t.borderRadius.extra,
    },
  }))
