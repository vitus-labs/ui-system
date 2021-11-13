import { config } from '@vitus-labs/core'

type value = 'auto' | 'inital' | 'inherit' | number | string
type defaults = 'initial' | 'inherit'
type length = number | string

type borderColor = string | 'transparent' | defaults

type borderStyle =
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
  | defaults

type fontSize =
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
  | value

type listStyleType =
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
  | defaults

type overflow = 'visible' | 'hidden' | 'scroll' | 'auto' | defaults

type cursor =
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
  | defaults

export type Theme = Partial<{
  hideEmpty: boolean
  clearFix: boolean
  fullScreen: boolean
  resetAll: defaults | 'unset' | 'revert'
  display: 'inline' | 'block' | 'inline-block' | 'flex' | 'inline-flex' | 'none'
  position: 'static' | 'relative' | 'fixed' | 'absolute' | 'sticky'
  boxSizing: 'content-box' | 'border-box' | defaults
  top: value
  bottom: value
  left: value
  right: value
  positionX: value
  positionY: value
  width: value
  height: value
  size: value
  minWidth: value
  minHeight: value
  minSize: value
  maxWidth: value
  maxHeight: value
  maxSize: value
  margin: value
  marginTop: value
  marginBottom: value
  marginLeft: value
  marginRight: value
  marginX: value
  marginY: value
  padding: value
  paddingTop: value
  paddingBottom: value
  paddingLeft: value
  paddingRight: value
  paddingX: value
  paddingY: value
  objectFit:
    | 'fill'
    | 'contain'
    | 'cover'
    | 'scale-down'
    | 'none'
    | 'initial'
    | 'inherit'
  objectPosition: any
  order: number | defaults
  resize: 'none' | 'both' | 'horizontal' | 'vertical' | defaults
  fontFamily: string
  lineHeight: 'normal' | defaults | length
  fontSize: fontSize
  fontStyle: 'normal' | 'italic' | 'oblique' | defaults
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
    | defaults
  textAlign: 'left' | 'right' | 'center' | 'justify' | defaults
  textTransform: 'none' | 'capitalize' | 'uppercase' | 'lowercase' | defaults
  textDecoration: string | defaults
  letterSpacing: 'normal' | value | defaults
  textShadow: string
  textOverflow: 'clip' | 'ellipsis' | string | defaults
  textIndent: value | defaults
  whiteSpace: 'normal' | 'nowrap' | 'pre' | 'pre-line' | 'pre-wrap' | defaults
  wordBreak: 'normal' | 'break-all' | 'keep-all' | 'break-word' | defaults
  wordWrap: 'normal' | 'break-word' | defaults
  writingMode: 'horizontal-tb' | 'vertical-rl' | 'vertical-lr'
  listStyle: string
  listStyleType: listStyleType
  listStyleImage: 'none' | string | defaults
  listStylePosition: string
  color: string
  background: string
  backgroundColor: string | 'transparent' | defaults
  backgroundImage: string | 'none' | defaults
  backgroundClip: 'border-box' | 'padding-box' | 'content-box' | defaults
  backgroundOrigin: 'padding-box' | 'border-box' | 'content-box' | defaults
  backgroundPosition: any
  backgroundRepeat: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat' | defaults
  backgroundSize: 'auto' | value | 'cover' | 'contain' | defaults
  borderRadius: value | defaults
  borderRadiusTopLeft: value | defaults
  borderRadiusLeft: value | defaults
  borderRadiusTop: value | defaults
  borderRadiusTopRight: value | defaults
  borderRadiusRight: value | defaults
  borderRadiusBottomLeft: value | defaults
  borderRadiusBottom: value | defaults
  borderRadiusBottomRight: value | defaults
  border: string
  borderTop: string
  borderBottom: string
  borderLeft: string
  borderRight: string
  borderWidth: value
  borderWidthX: value
  borderWidthY: value
  borderWidthTop: value
  borderWidthBottom: value
  borderWidthLeft: value
  borderWidthRight: value
  borderStyle: borderStyle
  borderStyleX: borderStyle
  borderStyleY: borderStyle
  borderStyleTop: borderStyle
  borderStyleBottom: borderStyle
  borderStyleLeft: borderStyle
  borderStyleRight: borderStyle
  borderColor: borderColor
  borderColorX: borderColor
  borderColorY: borderColor
  borderColorTop: borderColor
  borderColorBottom: borderColor
  borderColorLeft: borderColor
  borderColorRight: borderColor
  clipPath: string
  inset: string
  outline: string
  transition: string
  keyframe: any
  animation: string
  zIndex: number
  boxShadow: string
  transform: string
  opacity: number
  overflow: overflow
  overflowX: overflow
  overflowY: overflow
  overflowWrap: 'normal' | 'break-word' | defaults
  visibility: 'visible' | 'hidden' | 'collapse' | defaults
  cursor: cursor
  userSelect: 'auto' | 'none' | 'text' | 'all' | defaults
  pointerEvents: 'auto' | 'none' | defaults
  writingDirection: 'ltr' | 'rtl' | defaults
  extendCss: ReturnType<typeof config.css> | string
}>
