import { value as unitValue } from '~/units'
import type { Css } from '~/types'
import type { Theme } from './types'

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
    ${t.fullScreen &&
    css`
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    `};

    /* ------------------------------------------------- */
    /* POSITION attributes */
    /* ------------------------------------------------- */
    all: ${t.all};
    display: ${t.display};
    position: ${t.position};
    box-sizing: ${t.boxSizing};
    float: ${t.float};

    inset: ${t.inset};
    top: ${value(t.top, t.positionY)};
    bottom: ${value(t.bottom, t.positionY)};
    left: ${value(t.left, t.positionX)};
    right: ${value(t.right, t.positionX)};

    width: ${value(t.width, t.size)};
    min-width: ${value(t.minWidth, t.minSize)};
    max-width: ${value(t.maxWidth, t.maxSize)};

    height: ${value(t.height, t.size)};
    min-height: ${value(t.minHeight, t.minSize)};
    max-height: ${value(t.maxHeight, t.maxSize)};

    /* ------------------------------------------------- */
    /* SPACING attributes */
    /* ------------------------------------------------- */
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

    /* ------------------------------------------------- */
    /* FLEX attributes */
    /* ------------------------------------------------- */
    align-content: ${t.alignContent};
    align-items: ${t.alignItems};
    align-self: ${t.alignSelf};
    flex: ${t.flex};
    flex-basis: ${t.flexBasis};
    flex-direction: ${t.flexDirection};
    flex-flow: ${t.flexFlow};
    flex-grow: ${t.flexGrow};
    flex-shrink: ${t.flexShrink};
    flex-wrap: ${t.flexWrap};
    justify-content: ${t.justifyContent};

    /* ------------------------------------------------- */
    /* POSITIONING attributes */
    /* ------------------------------------------------- */
    object-fit: ${t.objectFit};
    object-position: ${t.objectPosition};
    order: ${t.order};
    opacity: ${t.opacity};
    resize: ${t.resize};
    vertical-align: ${t.verticalAlign};

    /* ------------------------------------------------- */
    /* FONT attributes */
    /* ------------------------------------------------- */
    line-height: ${t.lineHeight};
    font: ${t.font};
    font-family: ${t.fontFamily};
    font-size: ${value(t.fontSize)};
    font-size-adjust: ${value(t.fontSizeAdjust)};
    font-stretch: ${value(t.fontStretch)};
    font-style: ${t.fontStyle};
    font-variant: ${t.fontVariant};
    font-weight: ${t.fontWeight};
    text-align: ${t.textAlign};
    text-align-last: ${t.textAlignLast};
    text-transform: ${t.textTransform};
    text-decoration: ${t.textDecoration};
    text-decoration-color: ${t.textDecorationColor};
    text-decoration-line: ${t.textDecorationLine};
    text-decoration-style: ${t.textDecorationStyle};
    letter-spacing: ${t.letterSpacing};
    text-indent: ${t.textIndent};
    text-justify: ${t.textJustify};
    text-overflow: ${t.textOverflow};
    text-shadow: ${t.textShadow};
    text-transform: ${t.textTransform};
    white-space: ${t.whiteSpace};
    word-break: ${t.wordBreak};
    word-wrap: ${t.wordWrap};
    writing-mode: ${t.writingMode};
    direction: ${t.direction};

    /* ------------------------------------------------- */
    /* LIST attributes */
    /* ------------------------------------------------- */
    list-style: ${t.listStyle};
    list-style-image: ${t.listStyleImage};
    list-style-position: ${t.listStylePosition};
    list-style-type: ${t.listStyleType};

    /* ------------------------------------------------- */
    /* BACKGROUND & COLORS attributes */
    /* ------------------------------------------------- */
    color: ${t.color};
    background: ${t.background};
    background-color: ${t.backgroundColor};
    ${t.backgroundImage &&
    css`
      background-image: url(${t.backgroundImage});
    `};
    background-attachment: ${t.backgroundAttachment};
    background-clip: ${t.backgroundClip};
    background-origin: ${t.backgroundOrigin};
    background-position: ${t.backgroundPosition};
    background-repeat: ${t.backgroundRepeat};
    background-size: ${t.backgroundSize};

    /* ------------------------------------------------- */
    /* BORDERS attributes */
    /* ------------------------------------------------- */
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

    border-image: ${t.borderImage};
    border-image-outset: ${t.borderImageOutset};
    border-image-repeat: ${t.borderImageRepeat};
    border-image-slice: ${t.borderImageSlice};
    border-image-source: ${t.borderImageSource};
    border-image-width: ${t.borderImageWidth};
    border-spacing: ${t.borderSpacing};

    /* ------------------------------------------------- */
    /* VISUAL EFFECTS attributes */
    /* ------------------------------------------------- */
    backface-visibility: ${t.backfaceVisibility};
    box-shadow: ${t.boxShadow};
    filter: ${t.filter};
    outline: ${t.outline};
    outline-color: ${t.outlineColor};
    outline-offset: ${t.outlineOffset};
    outline-style: ${t.outlineStyle};
    outline-width: ${t.outlineWidth};

    /* ------------------------------------------------- */
    /* ANIMATIONS attributes */
    /* ------------------------------------------------- */
    animation: ${t.keyframe} ${t.animation};
    transition: ${t.transition};
    transition-delay: ${t.transitionDelay};
    transition-duration: ${t.transitionDuration};
    transition-property: ${t.transitionProperty};
    transition-timing-function: ${t.transitionTimingFunction};

    /* ------------------------------------------------- */
    /* OTHER attributes */
    /* ------------------------------------------------- */
    caption-side: ${t.captionSide};
    clear: ${t.clear};
    clip: ${t.clip};
    clip-path: ${t.clipPath};
    content: ${t.content};
    counter-increment: ${t.counterIncrement};
    counter-reset: ${t.counterReset};
    cursor: ${t.cursor};
    empty-cells: ${t.emptyCells};
    z-index: ${t.zIndex};
    transform: ${t.transform};
    transform-origin: ${t.transformOrigin};
    transform-style: ${t.transformStyle};
    overflow: ${t.overflow};
    overflow-wrap: ${t.overflowWrap};
    overflow-x: ${t.overflowX};
    overflow-y: ${t.overflowY};
    perspective: ${t.perspective};
    perspective-origin: ${t.perspectiveOrigin};
    pointer-events: ${t.pointerEvents};
    quotes: ${t.quotes};
    tab-size: ${t.tabSize};
    table-layout: ${t.tableLayout};
    user-select: ${t.userSelect};
    visibility: ${t.visibility};

    /* ------------------------------------------------- */
    /* CUSTOM attributes */
    /* ------------------------------------------------- */
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

    ${t.extendCss};
  `
}

export default styles
