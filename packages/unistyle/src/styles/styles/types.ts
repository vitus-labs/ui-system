import type { config } from '@vitus-labs/core'
import type { CSSProperties } from 'react'
import type { Color, Defaults, PropertyValue, Size } from '~/types'

export type Func<T> = (...args: any) => T

export type PrimitiveValue = string | number

export type BorderColor = Color | Defaults

export type BorderImageRepeat =
  | 'stretch'
  | 'repeat'
  | 'round'
  | 'space'
  | Defaults

export type GridProperty = 'auto' | number | `span ${number}`

export type BorderStyle =
  | 'none'
  | 'hidden'
  | 'dotted'
  | 'dashed'
  | 'solid'
  | 'double'
  | 'groove'
  | 'ridge'
  | 'inset'
  | 'outset'
  | Defaults

export type FontSize =
  | 'medium'
  | 'xx-small'
  | 'x-small'
  | 'small'
  | 'large'
  | 'x-large'
  | 'xx-large'
  | 'smaller'
  | 'larger'
  | 'initial'
  | 'inherit'
  | PropertyValue

export type ListStyleType =
  | 'disc'
  | 'armenian'
  | 'circle'
  | 'cjk-ideographic'
  | 'decimal'
  | 'decimal-leading-zero'
  | 'georgian'
  | 'hebrew'
  | 'hiragana'
  | 'hiragana-iroha'
  | 'katakana'
  | 'katakana-iroha'
  | 'lower-alpha'
  | 'lower-greek'
  | 'lower-latin'
  | 'lower-roman'
  | 'none'
  | 'square'
  | 'upper-alpha'
  | 'upper-greek'
  | 'upper-latin'
  | 'upper-roman'
  | Defaults

export type Cursor =
  | 'alias'
  | 'all-scroll'
  | 'auto'
  | 'cell'
  | 'context-menu'
  | 'col-resize'
  | 'copy'
  | 'crosshair'
  | 'default'
  | 'e-resize'
  | 'ew-resize'
  | 'grab'
  | 'grabbing'
  | 'help'
  | 'move'
  | 'n-resize'
  | 'ne-resize'
  | 'nesw-resize'
  | 'ns-resize'
  | 'nw-resize'
  | 'nwse-resize'
  | 'no-drop'
  | 'none'
  | 'not-allowed'
  | 'pointer'
  | 'progress'
  | 'row-resize'
  | 's-resize'
  | 'se-resize'
  | 'sw-resize'
  | 'text'
  | 'URL'
  | 'vertical-text'
  | 'w-resize'
  | 'wait'
  | 'zoom-in'
  | 'zoom-out'
  | Defaults

export type ITheme = {
  /**
   * The [inset](https://developer.mozilla.org/en-US/docs/Web/CSS/inset)
   * CSS property is a shorthand that corresponds to the top,
   * right, bottom, and/or left properties. It has the same multi-value
   * syntax of the margin shorthand.
   */
  inset: PropertyValue
  /**
   * Custom Shorthand to set marginx on axes X
   * The [inset](https://developer.mozilla.org/en-US/docs/Web/CSS/inset)
   * CSS property is a shorthand that corresponds to the top,
   * right, bottom, and/or left properties. It has the same multi-value
   * syntax of the margin shorthand.
   */
  insetX: PropertyValue
  /**
   * Custom Shorthand to set marginx on axes Y
   * The [inset](https://developer.mozilla.org/en-US/docs/Web/CSS/inset)
   * CSS property is a shorthand that corresponds to the top,
   * right, bottom, and/or left properties. It has the same multi-value
   * syntax of the margin shorthand.
   */
  insetY: PropertyValue
  /**
   * The [top](https://developer.mozilla.org/en-US/docs/Web/CSS/top)
   * CSS property participates in specifying the vertical position
   * of a positioned element. It has no effect on non-positioned elements.
   */
  top: PropertyValue
  bottom: PropertyValue
  left: PropertyValue
  right: PropertyValue
  positionX: PropertyValue
  positionY: PropertyValue
  width: PropertyValue | Size
  height: PropertyValue | Size
  size: PropertyValue | Size
  minWidth: PropertyValue | Size
  minHeight: PropertyValue | Size
  minSize: PropertyValue | Size
  maxWidth: PropertyValue | Size
  maxHeight: PropertyValue | Size
  maxSize: PropertyValue | Size
  margin: PropertyValue
  marginTop: PropertyValue
  marginBottom: PropertyValue
  marginLeft: PropertyValue
  marginRight: PropertyValue
  marginX: PropertyValue
  marginY: PropertyValue
  padding: PropertyValue
  paddingTop: PropertyValue
  paddingBottom: PropertyValue
  paddingLeft: PropertyValue
  paddingRight: PropertyValue
  paddingX: PropertyValue
  paddingY: PropertyValue
  gap: PropertyValue
  alignContent: CSSProperties['alignContent']
  alignItems: CSSProperties['alignItems']
  alignSelf: CSSProperties['alignSelf']
  all: CSSProperties['all']
  animation: CSSProperties['animation']
  backfaceVisibility: CSSProperties['backfaceVisibility']
  background: string
  backgroundAttachment: CSSProperties['backgroundAttachment']
  backgroundClip: CSSProperties['backgroundClip']
  backgroundColor: Color
  backgroundImage: string | 'none' | Defaults
  backgroundOrigin: CSSProperties['backgroundOrigin']
  backgroundPosition: CSSProperties['backgroundPosition']
  backgroundRepeat: CSSProperties['backgroundRepeat']
  backgroundSize: 'auto' | PropertyValue | 'cover' | 'contain' | Defaults
  border: string
  borderTop: string
  borderBottom: string
  borderLeft: string
  borderRight: string
  borderWidth: PropertyValue
  borderWidthX: PropertyValue
  borderWidthY: PropertyValue
  borderWidthTop: PropertyValue
  borderWidthBottom: PropertyValue
  borderWidthLeft: PropertyValue
  borderWidthRight: PropertyValue
  borderStyle: BorderStyle
  borderStyleX: BorderStyle
  borderStyleY: BorderStyle
  borderStyleTop: BorderStyle
  borderStyleBottom: BorderStyle
  borderStyleLeft: BorderStyle
  borderStyleRight: BorderStyle
  borderColor: BorderColor
  borderColorX: BorderColor
  borderColorY: BorderColor
  borderColorTop: BorderColor
  borderColorBottom: BorderColor
  borderColorLeft: BorderColor
  borderColorRight: BorderColor
  borderCollapse: 'separate' | 'collapse' | Defaults
  borderImage: string
  borderImageOutset: string
  borderImageRepeat:
    | `${BorderImageRepeat}`
    | `${BorderImageRepeat} ${BorderImageRepeat}`
  borderImageSlice: PropertyValue
  borderImageSource: string
  borderImageWidth: string
  borderSpacing: string
  borderRadius: PropertyValue
  borderRadiusTopLeft: PropertyValue
  borderRadiusLeft: PropertyValue
  borderRadiusTop: PropertyValue
  borderRadiusTopRight: PropertyValue
  borderRadiusRight: PropertyValue
  borderRadiusBottomLeft: PropertyValue
  borderRadiusBottom: PropertyValue
  borderRadiusBottomRight: PropertyValue
  boxShadow: CSSProperties['boxShadow']
  boxSizing: CSSProperties['boxSizing']
  captionSide: CSSProperties['captionSide']
  clear: CSSProperties['clear']
  clip: CSSProperties['clip']
  clipPath: CSSProperties['clipPath']
  color: Color
  content: CSSProperties['content']
  contentVisibility: CSSProperties['contentVisibility']
  counterIncrement: CSSProperties['counterIncrement']
  counterReset: CSSProperties['counterReset']
  cursor: Cursor
  direction: CSSProperties['direction']
  display: CSSProperties['display']
  emptyCells: CSSProperties['emptyCells']
  filter: CSSProperties['filter']
  flex: CSSProperties['flex']
  flexBasis: CSSProperties['flexBasis']
  flexDirection: CSSProperties['flexDirection']
  flexFlow: CSSProperties['flexFlow']
  flexGrow: CSSProperties['flexGrow']
  flexShrink: CSSProperties['flexShrink']
  flexWrap: CSSProperties['flexWrap']
  float: CSSProperties['float']
  font: CSSProperties['font']
  fontFamily: CSSProperties['fontFamily']
  fontSize: FontSize
  fontSizeAdjust: CSSProperties['fontSizeAdjust']
  fontStretch: CSSProperties['fontStretch']
  fontStyle: CSSProperties['fontStyle']
  fontVariant: CSSProperties['fontVariant']
  fontWeight:
    | 'normal'
    | 'bold'
    | 'bolder'
    | 'lighter'
    | 100
    | 200
    | 300
    | 400
    | 500
    | 600
    | 700
    | 800
    | 900
    | Defaults

  gridArea: CSSProperties['gridArea']
  gridAutoColumns: CSSProperties['gridAutoColumns']
  gridAutoFlow: CSSProperties['gridAutoFlow']
  gridAutoRows: CSSProperties['gridAutoRows']
  gridColumn: number | `${'auto' | string | number} / ${GridProperty}`
  gridColumnEnd: GridProperty
  gridColumnGap: PropertyValue
  gridColumnStart: GridProperty
  gridGap: PropertyValue
  gridRow: number | `${'auto' | string | number} / ${GridProperty}`
  gridRowStart: GridProperty
  gridRowEnd: GridProperty
  gridRowGap: PropertyValue
  gridTemplate: CSSProperties['gridTemplate']
  gridTemplateAreas: CSSProperties['gridTemplateAreas']
  gridTemplateColumns: CSSProperties['gridTemplateColumns']
  gridTemplateRows: CSSProperties['gridTemplateRows']

  justifyContent: CSSProperties['justifyContent']
  justifyItems: CSSProperties['justifyItems']
  keyframe: any
  letterSpacing: CSSProperties['letterSpacing']
  lineHeight: CSSProperties['lineHeight']
  listStyle: CSSProperties['listStyle']
  listStyleImage: CSSProperties['listStyleImage']
  listStylePosition: CSSProperties['listStylePosition']
  listStyleType: ListStyleType
  objectFit: CSSProperties['objectFit']
  objectPosition: CSSProperties['objectPosition']
  opacity: CSSProperties['opacity']
  order: CSSProperties['order']
  outline: CSSProperties['outline']
  outlineColor: CSSProperties['outlineColor']
  outlineOffset: CSSProperties['outlineOffset']
  outlineStyle: CSSProperties['outlineStyle']
  outlineWidth: CSSProperties['outlineWidth']
  overflow: CSSProperties['overflow']
  overflowWrap: CSSProperties['overflowWrap']
  overflowX: CSSProperties['overflowX']
  overflowY: CSSProperties['overflowY']
  perspective: CSSProperties['perspective']
  perspectiveOrigin: CSSProperties['perspectiveOrigin']
  pointerEvents: CSSProperties['pointerEvents']
  position: CSSProperties['position']
  quotes: CSSProperties['quotes']
  resize: CSSProperties['resize']
  tabSize: CSSProperties['tabSize']
  tableLayout: CSSProperties['tableLayout']
  textAlign: CSSProperties['textAlign']
  textAlignLast: CSSProperties['textAlignLast']
  textDecoration: CSSProperties['textDecoration']
  textDecorationColor: CSSProperties['textDecorationColor']
  textDecorationLine: CSSProperties['textDecorationLine']
  textDecorationStyle: CSSProperties['textDecorationStyle']
  textIndent: CSSProperties['textIndent']
  textJustify: CSSProperties['textJustify']
  textOverflow: CSSProperties['textOverflow']
  textShadow: CSSProperties['textShadow']
  textTransform: CSSProperties['textTransform']
  transform: CSSProperties['transform']
  transformOrigin: CSSProperties['transformOrigin']
  transformStyle: CSSProperties['transformStyle']
  transition: CSSProperties['transition']
  transitionDelay: CSSProperties['transitionDelay']
  transitionDuration: CSSProperties['transitionDuration']
  transitionProperty: CSSProperties['transitionProperty']
  transitionTimingFunction:
    | CSSProperties['transitionTimingFunction']
    | `cubic-bezier(${number},${number},${number},${number})`
    | `cubic-bezier(${number}, ${number}, ${number}, ${number})`
  userSelect: CSSProperties['userSelect']
  verticalAlign: CSSProperties['verticalAlign']
  visibility: CSSProperties['visibility']
  whiteSpace: CSSProperties['whiteSpace']
  wordBreak: CSSProperties['wordBreak']
  wordWrap: CSSProperties['wordWrap']

  writingMode: CSSProperties['writingMode']
  zIndex: CSSProperties['zIndex']

  hideEmpty: boolean
  clearFix: boolean
  fullScreen: boolean

  extendCss: ReturnType<typeof config.css> | string
}

export type InnerTheme = {
  [I in keyof ITheme]: ITheme[I] | null | undefined
}

export type Theme = {
  [I in keyof ITheme]: ITheme[I] | Func<ITheme[I]> | null | undefined
}
