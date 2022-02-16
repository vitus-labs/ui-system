import { config } from '@vitus-labs/core'
import { Value, Defaults, Color } from '~/types'

type BorderColor = Color | Defaults

type BorderImageRepeat = 'stretch' | 'repeat' | 'round' | 'space' | Defaults

type TextDecoration =
  | 'none'
  | 'underline'
  | 'overline'
  | 'line-through'
  | 'blink'
  | Defaults

type BorderStyle =
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

type FontSize =
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
  | Value

type ListStyleType =
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

type Overflow = 'visible' | 'hidden' | 'scroll' | 'auto' | Defaults

type Cursor =
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
  inset: string
  top: Value
  bottom: Value
  left: Value
  right: Value
  positionX: Value
  positionY: Value
  width: Value
  height: Value
  size: Value
  minWidth: Value
  minHeight: Value
  minSize: Value
  maxWidth: Value
  maxHeight: Value
  maxSize: Value
  margin: Value
  marginTop: Value
  marginBottom: Value
  marginLeft: Value
  marginRight: Value
  marginX: Value
  marginY: Value
  padding: Value
  paddingTop: Value
  paddingBottom: Value
  paddingLeft: Value
  paddingRight: Value
  paddingX: Value
  paddingY: Value

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
  backgroundSize: 'auto' | Value | 'cover' | 'contain' | Defaults
  border: string
  borderTop: string
  borderBottom: string
  borderLeft: string
  borderRight: string
  borderWidth: Value
  borderWidthX: Value
  borderWidthY: Value
  borderWidthTop: Value
  borderWidthBottom: Value
  borderWidthLeft: Value
  borderWidthRight: Value
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
  borderImageSlice: Value
  borderImageSource: string
  borderImageWidth: string
  borderSpacing: string
  borderRadius: Value | Defaults
  borderRadiusTopLeft: Value | Defaults
  borderRadiusLeft: Value | Defaults
  borderRadiusTop: Value | Defaults
  borderRadiusTopRight: Value | Defaults
  borderRadiusRight: Value | Defaults
  borderRadiusBottomLeft: Value | Defaults
  borderRadiusBottom: Value | Defaults
  borderRadiusBottomRight: Value | Defaults
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
  flex: Value
  flexBasis: Value
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
  justifyContent:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
  keyframe: any
  letterSpacing: 'normal' | Value | Defaults
  lineHeight: Value | 'normal' | 'revert' | 'unset' | Defaults
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
  outlineOffset: Value
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
  outlineWidth: Value | 'thin' | 'medium' | 'thick'
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
  tabSize: Value | Defaults
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
  textDecorationColor: Value
  textDecorationLine: TextDecoration
  textDecorationStyle:
    | 'solid'
    | 'double'
    | 'dotted'
    | 'dashed'
    | 'wavy'
    | Defaults
  textIndent: Value | Defaults
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
    | Value
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

export type Theme = {
  [I in keyof ITheme]: ITheme[I] | null | undefined
}
