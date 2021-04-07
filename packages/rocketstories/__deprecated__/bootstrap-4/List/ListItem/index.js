import { lighten, darken, rgba } from 'polished'
import { element } from '../../base'

const createState = color => ({
  base: {
    color: darken(0.24, color),
    bgColor: lighten(0.4, color),
    borderColor: 'rgba(0, 0, 0, 0.125)'
  },
  hover: {
    color: darken(0.24, color),
    bgColor: lighten(0.35, color),
    zIndex: 1
  },
  active: {
    bgColor: lighten(0.33, color)
  }
})

const createStaticState = (color, bgColor, borderColor) => ({
  base: {
    color,
    bgColor,
    borderColor
  }
})

const styles = css => css`
  ${({ flush, rocketstyle: t }) => {
    return css`
      ${flush &&
        css`
          border-right: 0;
          border-left: 0;

          &:first-child {
            border-top: 0;
          }
        `};
    `
  }};
`

export default element
  .config({
    name: 'ListItem',
    consumer: ({ variant }) => ({ variant, [variant]: true })
  })
  .styles(styles)
  .attrs(({ disabled }) => ({
    tag: 'li',
    block: true,
    contentDirection: 'rows',
    'aria-disabled': disabled ? true : undefined
  }))
  .theme(t => ({
    paddingY: t.spacing.base,
    paddingX: t.spacing.xl,
    fontSize: 'inherit',
    borderRadius: t.borderRadius.base,
    borderStyle: 'solid',
    borderWidth: t.borderWidth
  }))
  .states(t => ({
    base: {
      base: {
        text: 'inherit',
        bgColor: t.color.white,
        borderColor: 'rgba(0, 0, 0, 0.125)'
      },
      hover: {
        text: 'inherit',
        bgColor: darken(0.05, t.color.white)
      },
      active: {
        bgColor: darken(0.07, t.color.white)
      }
    },
    primary: createState(t.color.primary),
    secondary: createState(t.color.secondary),
    success: createState(t.color.success),
    danger: createState(t.color.danger),
    warning: createState(t.color.warning),
    info: createState(t.color.info),
    light: {
      base: {
        text: 'inherit',
        bgColor: t.color.light,
        borderColor: 'rgba(0, 0, 0, 0.125)'
      },
      hover: {
        text: 'inherit',
        bgColor: darken(0.05, t.color.light)
      },
      active: {
        bgColor: darken(0.07, t.color.light)
      }
    },
    dark: createState(t.color.dark),
    disabled: createStaticState(
      t.color.gray600,
      t.color.white,
      'rgba(0, 0, 0, 0.125)'
    ),
    active: createStaticState(t.color.white, t.color.primary, 'rgba(0, 0, 0, 0.125)')
  }))
  .variants({
    flush: {
      borderRadius: 0
    }
  })
