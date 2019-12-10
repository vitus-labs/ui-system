import { darken, rgba } from 'polished'
import { element } from '../base'

export const createSize = (padding, fontSize, borderRadius) => ({
  paddingY: padding,
  paddingX: padding * 2,
  fontSize,
  borderRadius
})

export const createState = color => ({
  base: {
    bgColor: color,
    borderColor: color
  },
  hover: {
    bgColor: darken(0.05, color),
    borderColor: darken(0.05, color),
    zIndex: 2
  },
  focus: {
    boxShadow: `0 0 0 0.2rem ${rgba(color, 0.5)}`,
    zIndex: 2
  },
  active: {
    bgColor: darken(0.15, color),
    borderColor: darken(0.15, color)
  }
})

const styles = css => css`
  text-transform: none;
  white-space: nowrap;
  text-decoration: none;
  user-select: none;
  outline: 0;

  ${({ as, block, rocketstyle: t }) => css`
    ${as === 'button' &&
      css`
        -webkit-appearance: button;
      `};

    // Button as a block full width element
    ${block &&
      css`
        & + & {
          margin-top: ${t.marginTopInBlock};
        }
      `};
  `}
`

export default element
  .config({
    name: 'bootstrap-4/Button'
  })
  .styles(styles)
  .attrs(({ tag, active, disabled }) => ({
    useDefaultOutline: true,
    tag: 'button',
    contentAlignX: 'center',
    type: tag === 'a' ? 'button' : undefined,
    role: tag === 'a' ? 'button' : undefined,
    tabIndex: tag === 'a' && disabled ? '-1' : undefined,
    'aria-pressed': active ? true : false,
    'aria-disabled': disabled ? true : undefined,
    // FIXME: use value helper
    beforeContentCss: css => css`
      margin-right: 0.75rem;
    `,
    afterContentCss: css => css`
      margin-left: 0.75rem;
    `
  }))
  .theme(t => ({
    marginX: t.spacing.reset,
    marginY: t.spacing.reset,
    fontWeight: t.fontWeight.base,
    borderWidth: t.borderWidth,
    borderColor: t.color.transparent,
    color: t.color.white,
    overflow: 'visible',
    transition: `
      color 0.15s ease-in-out,
      background-color 0.15s ease-in-out,
      border-color 0.15s ease-in-out,
      box-shadow 0.15s ease-in-out
    `,
    ...createSize(t.spacing.xsm, t.fontSize.base, t.borderRadius.base),
    ...createState(t.color.primary)
  }))
  .sizes(t => ({
    sm: createSize(t.spacing.xs, t.fontSize.sm, t.borderRadius.sm),
    md: createSize(t.spacing.xsm, t.fontSize.base, t.borderRadius.base),
    lg: createSize(t.spacing.sm, t.fontSize.lg, t.borderRadius.lg)
  }))
  .states(t => ({
    primary: createState(t.color.primary),
    secondary: createState(t.color.secondary),
    success: createState(t.color.success),
    danger: createState(t.color.danger),
    warning: { ...createState(t.color.warning), color: t.color.gray900 },
    info: createState(t.color.info),
    light: { ...createState(t.color.light), color: t.color.gray900 },
    dark: createState(t.color.dark),
    link: {
      base: {
        bgColor: t.color.transparent,
        border: t.color.transparent,
        color: t.color.primary
      },
      hover: {
        bgColor: t.color.transparent,
        borderColor: t.color.transparent,
        color: '#0056b3',
        textDecoration: 'underline'
      },
      focus: {
        boxShadow: false,
        textDecoration: 'underline'
      },
      active: {
        bgColor: t.color.transparent,
        borderColor: t.color.transparent
      }
    }
  }))
  .multiple(t => ({
    active: true,
    outline: true,
    disabled: {
      opacity: 0.65
    },
    block: {
      marginTopInBlock: t.spacing.sm
    },
    rounded: {
      borderRadius: t.borderRadius.extra
    }
  }))
