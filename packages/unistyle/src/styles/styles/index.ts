import { value as unitValue } from '~/units'
import type { Theme } from './types'
import type { Css } from '~/types'

export type { Theme as StylesTheme }

export type Styles = ({
  theme,
  css,
  rootSize,
}: {
  theme: Theme
  css: Css
  rootSize?: number
}) => ReturnType<typeof css>

const styles: Styles = ({ theme: t, css, rootSize }) => {
  const value = (...values) => unitValue(values, rootSize)
  const pxValue = (...values) => unitValue(values, rootSize, 'px')

  return css`
    ${__WEB__ &&
    t.hideEmpty &&
    css`
      &:empty {
        display: none;
      }
    `};

    ${__WEB__ &&
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

    top: ${value(t.top, t.positionY)};
    bottom: ${value(t.bottom, t.positionY)};
    left: ${value(t.left, t.positionX)};
    right: ${value(t.right, t.positionX)};

    /* SIZE attributes */
    width: ${value(t.width, t.size)};
    min-width: ${value(t.minWidth, t.minSize)};
    max-width: ${value(t.maxWidth, t.maxSize)};

    height: ${value(t.height, t.size)};
    min-height: ${value(t.minHeight, t.minSize)};
    max-height: ${value(t.maxHeight, t.maxSize)};

    /* SPACING attributes */
    margin: ${value(t.margin)};
    margin-top: ${value(t.marginTop, t.marginY)};
    margin-bottom: ${value(t.marginBottom, t.marginY)};
    margin-left: ${value(t.marginLeft, t.marginX)};
    margin-right: ${value(t.marginRight, t.marginX)};

    padding: ${value(t.padding)};
    padding-top: ${value(t.paddingTop, t.paddingY)};
    padding-bottom: ${value(t.paddingBottom, t.paddingY)};
    padding-left: ${value(t.paddingLeft, t.paddingX)};
    padding-right: ${value(t.paddingRight, t.paddingX)};

    /* POSITIONING attrs */
    object-fit: ${t.objectFit};
    object-position: ${t.objectPosition};
    order: ${t.order};
    resize: ${t.resize};

    /* FONT attributes */
    line-height: ${t.lineHeight};
    font-family: ${t.fontFamily};
    font-size: ${value(t.fontSize)};
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
    background: ${t.background};
    background-color: ${t.backgroundColor};
    ${t.backgroundImage &&
    css`
      background-image: url(${t.backgroundImage});
    `};
    background-clip: ${t.backgroundClip};
    background-origin: ${t.backgroundOrigin};
    background-position: ${t.backgroundPosition};
    background-repeat: ${t.backgroundRepeat};
    background-size: ${t.backgroundSize};

    /* BORDERS attributes */
    border-radius: ${value(t.borderRadius)};
    border-top-left-radius: ${value(
      t.borderRadiusTopLeft,
      t.borderRadiusLeft,
      t.borderRadiusTop
    )};
    border-top-right-radius: ${value(
      t.borderRadiusTopRight,
      t.borderRadiusRight,
      t.borderRadiusTop
    )};
    border-bottom-left-radius: ${value(
      t.borderRadiusBottomLeft,
      t.borderRadiusLeft,
      t.borderRadiusBottom
    )};
    border-bottom-right-radius: ${value(
      t.borderRadiusBottomRight,
      t.borderRadiusRight,
      t.borderRadiusBottom
    )};

    border: ${t.border};
    border-top: ${t.borderTop};
    border-bottom: ${t.borderBottom};
    border-left: ${t.borderLeft};
    border-right: ${t.borderRight};

    border-width: ${pxValue(t.borderWidth)};
    border-style: ${t.borderStyle};
    border-color: ${t.borderColor};

    border-top-width: ${pxValue(t.borderWidthTop, t.borderWidthY)};
    border-top-style: ${t.borderStyleTop || t.borderStyleY};
    border-top-color: ${t.borderColorTop || t.borderColorY};

    border-bottom-width: ${pxValue(t.borderWidthBottom, t.borderWidthY)};
    border-bottom-style: ${t.borderStyleBottom || t.borderStyleY};
    border-bottom-color: ${t.borderColorBottom || t.borderColorY};

    border-left-width: ${pxValue(t.borderWidthLeft, t.borderWidthX)};
    border-left-style: ${t.borderStyleLeft || t.borderStyleX};
    border-left-color: ${t.borderColorLeft || t.borderColorX};

    border-right-width: ${pxValue(t.borderWidthRight, t.borderWidthX)};
    border-right-style: ${t.borderStyleRight || t.borderStyleX};
    border-right-color: ${t.borderColorRight || t.borderColorX};

    /* OTHER ATTRIBUTES */
    clip-path: ${t.clipPath};
    inset: ${t.inset};
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
    overflow-wrap: ${t.overflowWrap};
    cursor: ${t.cursor};

    visibility: ${t.visibility};
    user-select: ${t.userSelect};
    pointer-events: ${t.pointerEvents};
    direction: ${t.writingDirection};

    ${t.extendCss};
  `
}

export default styles
