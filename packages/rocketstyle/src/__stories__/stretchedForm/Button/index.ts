import { darken } from 'polished'
import { link as element } from '../base'

const createState = (bgColor, color) => ({
  base: {
    bgColor,
    borderColor: bgColor,
    color,
  },
  hover: {
    bgColor: darken(0.1, bgColor),
    borderColor: bgColor,
    color,
  },
  active: {
    bgColor: darken(0.15, bgColor),
    borderColor: bgColor,
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
    useDefaultOutline: true,
    useDefaultHover: true,
    contentAlignX: 'center',
  })
  .theme((t) => ({
    borderStyle: 'solid',
    borderWidth: t.borderWidth.base,
    borderRadius: t.borderRadius.base,
    transition: t.transition.base,
    marginX: 0,
    marginY: t.spacing.base,
  }))
  .multiple({ outline: true })
  .sizes({
    base: createSize(38, 15),
    sm: createSize(32, 14),
    md: createSize(38, 15),
    lg: createSize(48, 16),
    xl: createSize(54, 22),
  })
  .states((t) => ({
    base: createState(t.color.primary, t.color.white),
    primary: createState(t.color.primary, t.color.white),
    light: createState(t.color.light, t.color.gray900),
    secondary: createState(t.color.secondary, t.color.white),
    danger: createState(t.color.danger, t.color.white),
    google: createState(t.color.google, t.color.white),
    facebook: createState(t.color.facebook, t.color.white),
    link: {
      base: {
        bgColor: t.color.transparent,
        borderColor: t.color.transparent,
        color: t.color.gray900,
        fontWeight: t.fontWeight.bolder,
      },
      hover: {
        bgColor: 'rgba(0,0,0,0.04)',
        borderColor: t.color.transparent,
        color: t.color.gray900,
      },
      active: {
        bgColor: t.color.transparent,
        borderColor: t.color.transparent,
        color: t.color.gray900,
      },
    },
  }))
