import { darken } from 'polished'
import { link as element } from '../base'

const createState = (backgroundColor, color) => ({
  backgroundColor,
  borderColor: backgroundColor,
  color,

  hover: {
    backgroundColor: darken(0.1, backgroundColor),
    borderColor: backgroundColor,
    color,
  },
  active: {
    backgroundColor: darken(0.15, backgroundColor),
    borderColor: backgroundColor,
    color,
  },
})

const createSize = (height, fontSize) => ({
  height: `${height}px`,
  fontSize: `${fontSize}px`,
})

export default element
  .config({ name: 'base/Button' })
  .styles(
    (css) => css`
      outline: none;
      cursor: pointer;
      white-space: nowrap;
    `
  )
  .attrs({
    // useDefaultOutline: true,
    // useDefaultHover: true,
    contentAlignX: 'center',
  })
  .theme((t) => ({
    borderStyle: 'solid',
    borderWidth: t.borderWidth.base,
    borderRadius: t.borderRadius.base,
    transition: t.transition.base,
    marginX: 0,
    marginY: t.spacing.base,
    ...createState(t.color.primary, t.color.white),
    ...createSize(38, 15),
  }))
  .multiple({ outline: true })
  .sizes({
    sm: createSize(32, 14),
    md: createSize(38, 15),
    lg: createSize(48, 16),
    xl: createSize(54, 22),
  })
  .states((t) => ({
    primary: createState(t.color.primary, t.color.white),
    light: createState(t.color.light, t.color.gray900),
    secondary: createState(t.color.secondary, t.color.white),
    danger: createState(t.color.danger, t.color.white),
    google: createState(t.color.google, t.color.white),
    facebook: createState(t.color.facebook, t.color.white),
    link: {
      backgroundColor: t.color.transparent,
      borderColor: t.color.transparent,
      color: t.color.gray900,
      fontWeight: t.fontWeight.bolder,

      hover: {
        backgroundColor: 'rgba(0,0,0,0.04)',
        borderColor: t.color.transparent,
        color: t.color.gray900,
      },
      active: {
        backgroundColor: t.color.transparent,
        borderColor: t.color.transparent,
        color: t.color.gray900,
      },
    },
  }))
