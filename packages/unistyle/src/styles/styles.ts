import { config } from '@vitus-labs/core'
import { value } from './utils/unit'

interface Styles {
  theme: Partial<import('./styles.types').Theme>
  css: any
  rootSize: number
}

export default ({ theme: t, css, rootSize }: Styles) => css`
  ${config.isWeb &&
  t.hideEmpty &&
  css`
    &:empty {
      display: none;
    }
  `};

  ${config.isWeb &&
  t.clearFix &&
  css`
    &::after: {
      clear: both;
      content: '';
      display: table;
    }
  `};

  ${t.fullScreen &&
  css`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  `};

  /* POSITION attributes */
  all: ${t.resetAll};
  display: ${t.display};
  position: ${t.position};
  box-sizing: ${t.boxSizing};

  top: ${value(rootSize, [t.top, t.positionY])};
  bottom: ${value(rootSize, [t.bottom, t.positionY])};
  left: ${value(rootSize, [t.left, t.positionX])};
  right: ${value(rootSize, [t.right, t.positionX])};

  /* SIZE attributes */
  width: ${value(rootSize, [t.width, t.size])};
  min-width: ${value(rootSize, [t.minWidth, t.minSize])};
  max-width: ${value(rootSize, [t.maxWidth, t.maxSize])};

  height: ${value(rootSize, [t.height, t.size])};
  min-height: ${value(rootSize, [t.minHeight, t.minSize])};
  max-height: ${value(rootSize, [t.maxHeight, t.maxSize])};

  /* SPACING attributes */
  margin: ${value(rootSize, [t.margin])};
  margin-top: ${value(rootSize, [t.marginTop, t.marginY])};
  margin-bottom: ${value(rootSize, [t.marginBottom, t.marginY])};
  margin-left: ${value(rootSize, [t.marginLeft, t.marginX])};
  margin-right: ${value(rootSize, [t.marginRight, t.marginX])};

  padding: ${value(rootSize, [t.padding])};
  padding-top: ${value(rootSize, [t.paddingTop, t.paddingY])};
  padding-bottom: ${value(rootSize, [t.paddingBottom, t.paddingY])};
  padding-left: ${value(rootSize, [t.paddingLeft, t.paddingX])};
  padding-right: ${value(rootSize, [t.paddingRight, t.paddingX])};

  /* POSITIONING attrs */
  object-fit: ${t.objectFit};
  object-position: ${t.objectPosition};
  order: ${t.order};
  resize: ${t.resize};

  /* FONT attributes */
  line-height: ${t.lineHeight};
  font-family: ${t.fontFamily};
  font-size: ${value(rootSize, [t.fontSize])};
  font-style: ${t.fontStyle};
  font-weight: ${t.fontWeight};
  text-align: ${t.textAlign};
  text-transform: ${t.textTransform};
  text-decoration: ${t.textDecoration};
  letter-spacing: ${t.letterSpacing};
  text-shadow: ${t.textShadow};
  text-overflow: ${t.textOverflow};
  text-indent: ${t.textIndent};
  white-space: ${t.whiteSpace};
  word-break: ${t.wordBreak};
  word-wrap: ${t.wordWrap};
  writing-mode: ${t.writingMode};

  /* LIST attributes */
  list-style: ${t.listStyle};
  list-style-type: ${t.listStyleType};
  list-style-position: ${t.listStylePosition};
  list-style-image: ${t.listStyleImage};

  /* COLORS attributes */
  color: ${t.color};
  background-color: ${t.bgColor};
  ${t.bgImg &&
  css`
    background-image: url(${t.bgImg});
  `};
  background-clip: ${t.bgClip};
  background-origin: ${t.bgOrigin};
  background-position: ${t.bgPosition};
  background-repeat: ${t.bgRepeat};
  background-size: ${t.bgSize};

  /* BORDERS attributes */
  border-radius: ${value(rootSize, [t.borderRadius])};
  border-top-left-radius: ${value(rootSize, [
    t.borderRadiusTopLeft,
    t.borderRadiusLeft,
    t.borderRadiusTop,
  ])};
  border-top-right-radius: ${value(rootSize, [
    t.borderRadiusTopRight,
    t.borderRadiusRight,
    t.borderRadiusTop,
  ])};
  border-bottom-left-radius: ${value(rootSize, [
    t.borderRadiusBottomLeft,
    t.borderRadiusLeft,
    t.borderRadiusBottom,
  ])};
  border-bottom-right-radius: ${value(rootSize, [
    t.borderRadiusBottomRight,
    t.borderRadiusRight,
    t.borderRadiusBottom,
  ])};

  border: ${t.border};
  border-top: ${t.borderTop};
  border-bottom: ${t.borderBottom};
  border-left: ${t.borderLeft};
  border-right: ${t.borderRight};

  border-width: ${value(rootSize, [t.borderWidth], 'px')};
  border-style: ${t.borderStyle};
  border-color: ${t.borderColor};

  border-top-width: ${value(
    rootSize,
    [t.borderWidthTop, t.borderWidthY],
    'px'
  )};
  border-top-style: ${t.borderStyleTop || t.borderStyleY};
  border-top-color: ${t.borderColorTop || t.borderColorY};

  border-bottom-width: ${value(
    rootSize,
    [t.borderWidthBottom, t.borderWidthY],
    'px'
  )};
  border-bottom-style: ${t.borderStyleBottom || t.borderStyleY};
  border-bottom-color: ${t.borderColorBottom || t.borderColorY};

  border-left-width: ${value(
    rootSize,
    [t.borderWidthLeft, t.borderWidthX],
    'px'
  )};
  border-left-style: ${t.borderStyleLeft || t.borderStyleX};
  border-left-color: ${t.borderColorLeft || t.borderColorX};

  border-right-width: ${value(
    rootSize,
    [t.borderWidthRight, t.borderWidthX],
    'px'
  )};
  border-right-style: ${t.borderStyleRight || t.borderStyleX};
  border-right-color: ${t.borderColorRight || t.borderColorX};

  /* OTHER ATTRIBUTES */
  outline: ${t.outline};
  transition: ${t.transition};
  animation: ${t.keyframe} ${t.animation};
  z-index: ${t.zIndex};
  box-shadow: ${t.boxShadow};
  transform: ${t.transform};
  opacity: ${t.opacity};
  overflow: ${t.overflow};
  overflow-x: ${t.overflowX};
  overflow-y: ${t.overflowY};
  cursor: ${t.cursor};

  visibility: ${t.visibility};
  user-select: ${t.userSelect};
  pointer-events: ${t.pointerEvents};
  direction: ${t.writingDirection};

  ${t.extendCss};
`

// ${() => {
//   if (t.borderWidth && t.borderStyle && t.borderColor) {
//     const params = `${normalizeUnit({ param: t.borderWidth, rootSize })} ${
//       t.borderStyle
//     } ${t.borderColor};`
//     if (t.borderSide) return css`border-${t.borderSide}: ${params};`

//     return css`
//       border: ${params};
//     `
//   }

//   return null
// }};
