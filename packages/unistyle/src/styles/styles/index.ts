import { borderRadius, edge } from '~/styles/shorthands'
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
  const shorthand = edge(rootSize)

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

    ${shorthand('inset', {
      full: t.inset,
      x: t.insetX,
      y: t.insetY,
      top: t.top,
      left: t.left,
      bottom: t.bottom,
      right: t.right,
    })};

    width: ${value(t.width, t.size)};
    min-width: ${value(t.minWidth, t.minSize)};
    max-width: ${value(t.maxWidth, t.maxSize)};

    height: ${value(t.height, t.size)};
    min-height: ${value(t.minHeight, t.minSize)};
    max-height: ${value(t.maxHeight, t.maxSize)};

    gap: ${value(t.gap)};

    /* ------------------------------------------------- */
    /* SPACING attributes */
    /* ------------------------------------------------- */
    ${shorthand('margin', {
      full: t.margin,
      x: t.marginX,
      y: t.marginY,
      top: t.marginTop,
      left: t.marginLeft,
      bottom: t.marginBottom,
      right: t.marginRight,
    })};

    ${shorthand('padding', {
      full: t.padding,
      x: t.paddingX,
      y: t.paddingY,
      top: t.paddingTop,
      left: t.paddingLeft,
      bottom: t.paddingBottom,
      right: t.paddingRight,
    })};

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
    /* GRID attributes */
    /* ------------------------------------------------- */
    grid-area: ${t.gridArea};
    grid-auto-columns: ${value(t.gridAutoColumns)};
    grid-auto-flow: ${t.gridAutoFlow};
    grid-auto-rows: ${value(t.gridAutoRows)};
    grid-column: ${t.gridColumn};
    grid-column-end: ${t.gridColumnEnd};
    grid-column-gap: ${value(t.gridColumnGap)};
    grid-column-start: ${value(t.gridColumnStart)};
    grid-gap: ${value(t.gridGap)};
    grid-row: ${t.gridRow};
    grid-row-start: ${t.gridRowStart};
    grid-row-end: ${t.gridRowEnd};
    grid-row-gap: ${value(t.gridRowGap)};
    grid-template: ${t.gridTemplate};
    grid-template-areas: ${t.gridTemplateAreas};
    grid-template-columns: ${t.gridTemplateColumns};
    grid-template-rows: ${t.gridTemplateRows};

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
    ${borderRadius(rootSize)({
      full: t.borderRadius,
      top: t.borderRadiusTop,
      bottom: t.borderRadiusBottom,
      left: t.borderRadiusLeft,
      right: t.borderRadiusRight,
      topLeft: t.borderRadiusTopLeft,
      topRight: t.borderRadiusTopRight,
      bottomLeft: t.borderRadiusBottomLeft,
      bottomRight: t.borderRadiusBottomRight,
    })};

    ${shorthand('border-width', {
      full: t.borderWidth,
      y: t.borderWidthY,
      x: t.borderWidthX,
      top: t.borderWidthTop,
      bottom: t.borderWidthBottom,
      left: t.borderWidthLeft,
      right: t.borderWidthRight,
    })};

    ${shorthand('border-style', {
      full: t.borderStyle,
      y: t.borderStyleY,
      x: t.borderStyleX,
      top: t.borderStyleTop,
      bottom: t.borderStyleBottom,
      left: t.borderStyleLeft,
      right: t.borderStyleRight,
    })};

    ${shorthand('border-color', {
      full: t.borderColor,
      y: t.borderColorY,
      x: t.borderColorX,
      top: t.borderColorTop,
      bottom: t.borderColorBottom,
      left: t.borderColorLeft,
      right: t.borderColorRight,
    })};

    border: ${t.border};
    border-top: ${t.borderTop};
    border-bottom: ${t.borderBottom};
    border-left: ${t.borderLeft};
    border-right: ${t.borderRight};

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
