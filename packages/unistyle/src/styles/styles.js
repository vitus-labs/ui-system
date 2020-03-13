import config from '@vitus-labs/core'
import { normalizeUnit, value } from './utils/unit'

export default ({ theme: t, css, rootSize }) => css`
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
    t.borderTopLeftRadius,
    t.borderLeftRadius,
    t.borderTopRadius
  ])};
  border-top-right-radius: ${value(rootSize, [
    t.borderTopRightRadius,
    t.borderRightRadius,
    t.borderTopRadius
  ])};
  border-bottom-left-radius: ${value(rootSize, [
    t.borderBottomLeftRadius,
    t.borderLeftRadius,
    t.borderBottomRadius
  ])};
  border-bottom-right-radius: ${value(rootSize, [
    t.borderBottomRightRadius,
    t.borderRightRadius,
    t.borderBottomRadius
  ])};

  border: ${t.border};
  border-top: ${t.borderTop};
  border-bottom: ${t.borderBottom};
  border-left: ${t.borderLeft};
  border-right: ${t.borderRight};

  border-style: ${t.borderStyle};
  border-color: ${t.borderColor};
  border-width: ${t.borderWidth};

  border-top-style: ${t.borderTopStyle};
  border-top-color: ${t.borderTopColor};
  border-top-width: ${t.borderTopWidth};

  border-bottom-style: ${t.borderBottomStyle};
  border-bottom-color: ${t.borderBottomColor};
  border-bottom-width: ${t.borderBottomWidth};

  border-left-style: ${t.borderLeftStyle};
  border-left-color: ${t.borderLeftColor};
  border-left-width: ${t.borderLeftWidth};

  border-right-style: ${t.borderRightStyle};
  border-right-color: ${t.borderRightColor};
  border-right-width: ${t.borderRightWidth};

  ${() => {
    if (t.borderWidth && t.borderStyle && t.borderColor) {
      const params = `${normalizeUnit({ param: t.borderWidth, rootSize })} ${
        t.borderStyle
      } ${t.borderColor};`
      if (t.borderSide) return css`border-${t.borderSide}: ${params};`

      return css`
        border: ${params};
      `
    }

    return null
  }};

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
