import { config } from '@vitus-labs/core'
import type { PropertyValue, Defaults, Color } from '~/types'

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

export type TextDecoration =
  | 'none'
  | 'underline'
  | 'overline'
  | 'line-through'
  | 'blink'
  | Defaults

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

export type Overflow = 'visible' | 'hidden' | 'scroll' | 'auto' | Defaults

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
  inset: PropertyValue
  insetX: PropertyValue
  insetY: PropertyValue
  top: PropertyValue
  bottom: PropertyValue
  left: PropertyValue
  right: PropertyValue
  positionX: PropertyValue
  positionY: PropertyValue
  width: PropertyValue
  height: PropertyValue
  size: PropertyValue
  minWidth: PropertyValue
  minHeight: PropertyValue
  minSize: PropertyValue
  maxWidth: PropertyValue
  maxHeight: PropertyValue
  maxSize: PropertyValue
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
  alignContent:
    | 'center'
    | 'flex-start'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
    | 'stretch'
    | Defaults
  alignItems:
    | 'baseline'
    | 'center'
    | 'flex-start'
    | 'flex-end'
    | 'stretch'
    | Defaults
  alignSelf:
    | 'auto'
    | 'baseline'
    | 'center'
    | 'start'
    | 'end'
    | 'self-start'
    | 'self-end'
    | 'flex-start'
    | 'flex-end'
    | 'stretch'
    | Defaults
  all: 'unset' | 'revert' | Defaults
  animation: string
  backfaceVisibility: 'visible' | 'hidden' | Defaults
  background: string
  backgroundAttachment: 'scroll' | 'fixed' | Defaults
  backgroundClip: 'border-box' | 'padding-box' | 'content-box' | Defaults
  backgroundColor: Color
  backgroundImage: string | 'none' | Defaults
  backgroundOrigin: 'padding-box' | 'border-box' | 'content-box' | Defaults
  backgroundPosition: any
  backgroundRepeat: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat' | Defaults
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
  boxShadow: string
  boxSizing: 'content-box' | 'border-box' | Defaults
  captionSide: 'top' | 'bottom' | Defaults
  clear: 'left' | 'right' | 'auto' | 'both' | 'none' | Defaults
  clip: 'shape' | 'auto' | Defaults
  clipPath: string
  color: Color
  content:
    | 'normal'
    | 'none'
    | 'counter'
    | 'open-quote'
    | 'close-quote'
    | 'no-open-quote'
    | 'no-close-quote'
    | Defaults
    | string
  contentVisibility: 'visible' | 'hidden' | 'auto'
  counterIncrement: string
  counterReset: string
  cursor: Cursor
  direction: 'ltr' | 'rtl' | Defaults
  display:
    | 'inline'
    | 'block'
    | 'contents'
    | 'flex'
    | 'flow'
    | 'flow-root'
    | 'grid'
    | 'inline-block'
    | 'inline-flex'
    | 'inline-grid'
    | 'inline-table'
    | 'list-item'
    | 'run-in'
    | 'table'
    | 'table-caption'
    | 'table-column-group'
    | 'table-header-group'
    | 'table-footer-group'
    | 'table-row-group'
    | 'table-cell'
    | 'table-column'
    | 'table-row'
    | 'none'
  emptyCells: 'show' | 'hide' | Defaults
  filter: string
  flex: PrimitiveValue
  flexBasis: PrimitiveValue
  flexDirection: 'row' | 'row-reverse' | 'column' | 'column-reverse' | Defaults
  flexFlow: string
  flexGrow: number | Defaults
  flexShrink: number | Defaults
  flexWrap: 'nowrap' | 'wrap' | 'wrap-reverse' | Defaults
  float: 'left' | 'right' | 'none'
  font: string
  fontFamily: string
  fontSize: FontSize
  fontSizeAdjust: number | 'none' | Defaults
  fontStretch:
    | 'normal'
    | 'ultra-condensed'
    | 'extra-condensed'
    | 'condensed'
    | 'semi-condensed'
    | 'semi-expanded'
    | 'expanded'
    | 'extra-expanded'
    | 'ultra-expanded'
  fontStyle: 'normal' | 'italic' | 'oblique' | Defaults
  fontVariant: 'normal' | 'small-caps' | Defaults
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

  gridArea: string
  gridAutoColumns: 'auto' | 'max-content' | 'min-content' | PropertyValue
  gridAutoFlow: 'row' | 'column' | 'dense' | 'row dense' | 'column dense'
  gridAutoRows: 'auto' | 'max-content' | 'min-content' | PropertyValue
  gridColumn: number | `${'auto' | string | number} / ${GridProperty}`
  gridColumnEnd: GridProperty
  gridColumnGap: PropertyValue
  gridColumnStart: GridProperty
  gridGap: PropertyValue
  gridRow: number | `${'auto' | string | number} / ${GridProperty}`
  gridRowStart: GridProperty
  gridRowEnd: GridProperty
  gridRowGap: PropertyValue
  gridTemplate: PrimitiveValue
  gridTemplateAreas: PrimitiveValue
  gridTemplateColumns: PrimitiveValue
  gridTemplateRows: PrimitiveValue

  justifyContent:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
  keyframe: any
  letterSpacing: 'normal' | PropertyValue
  lineHeight: PropertyValue | 'normal' | 'revert' | 'unset' | Defaults
  listStyle: string
  listStyleImage: 'none' | string | Defaults
  listStylePosition: string
  listStyleType: ListStyleType
  objectFit:
    | 'fill'
    | 'contain'
    | 'cover'
    | 'scale-down'
    | 'none'
    | 'initial'
    | 'inherit'
  objectPosition: any
  opacity: number
  order: number | Defaults
  outline: string
  outlineColor: string
  outlineOffset: PropertyValue
  outlineStyle:
    | 'none'
    | 'dotted'
    | 'dashed'
    | 'solid'
    | 'double'
    | 'groove'
    | 'ridge'
    | 'inset'
    | 'outset'
    | Defaults
  outlineWidth: PropertyValue | 'thin' | 'medium' | 'thick'
  overflow: Overflow
  overflowWrap: 'normal' | 'break-word' | Defaults
  overflowX: Overflow
  overflowY: Overflow
  // pageBreakAfter: 'auto' | 'always' | 'avoid' | 'left' | 'right' | Defaults
  // pageBreakBefore: 'auto' | 'always' | 'avoid' | 'left' | 'right' | Defaults
  // pageBreakInside: 'auto' | 'avoid' | Defaults
  perspective: string
  perspectiveOrigin: string
  pointerEvents: 'auto' | 'none' | Defaults
  position: 'static' | 'relative' | 'fixed' | 'absolute' | 'sticky' | Defaults
  quotes: string
  resize: 'none' | 'both' | 'horizontal' | 'vertical' | Defaults
  tabSize: PropertyValue
  tableLayout: 'auto' | 'fixed' | Defaults
  textAlign: 'left' | 'right' | 'center' | 'justify' | Defaults
  textAlignLast:
    | 'auto'
    | 'start'
    | 'end'
    | 'left'
    | 'right'
    | 'center'
    | 'justify'
    | Defaults
  textDecoration: TextDecoration
  textDecorationColor: PropertyValue
  textDecorationLine: TextDecoration
  textDecorationStyle:
    | 'solid'
    | 'double'
    | 'dotted'
    | 'dashed'
    | 'wavy'
    | Defaults
  textIndent: PropertyValue
  textJustify: 'auto' | 'none' | 'inter-word' | 'distribute' | Defaults
  textOverflow: 'clip' | 'ellipsis' | string | Defaults
  textShadow: string
  textTransform: 'none' | 'capitalize' | 'uppercase' | 'lowercase' | Defaults
  transform: string
  transformOrigin: string
  transformStyle: string
  transition: string
  transitionDelay: string
  transitionDuration: string
  transitionProperty: string
  transitionTimingFunction:
    | 'linear'
    | 'ease'
    | 'ease-in'
    | 'ease-out'
    | 'ease-in-out'
    | `cubic-bezier(${number},${number},${number},${number})`
    | `cubic-bezier(${number}, ${number}, ${number}, ${number})`
    | Defaults
  userSelect: 'auto' | 'none' | 'text' | 'all' | Defaults
  verticalAlign:
    | 'baseline'
    | 'sub'
    | 'super'
    | 'top'
    | 'text-top'
    | 'middle'
    | 'bottom'
    | 'text-bottom'
    | PropertyValue
    | Defaults
  visibility: 'visible' | 'hidden' | 'collapse' | Defaults
  whiteSpace: 'normal' | 'nowrap' | 'pre' | 'pre-line' | 'pre-wrap' | Defaults
  wordBreak: 'normal' | 'break-all' | 'keep-all' | 'break-word' | Defaults
  wordWrap: 'normal' | 'break-word' | Defaults

  writingMode: 'horizontal-tb' | 'vertical-rl' | 'vertical-lr'
  zIndex: number

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
