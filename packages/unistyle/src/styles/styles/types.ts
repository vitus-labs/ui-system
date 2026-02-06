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
  // ─── INSET & POSITION ───────────────────────────────────────────
  inset: PropertyValue
  insetX: PropertyValue
  insetY: PropertyValue
  top: PropertyValue
  bottom: PropertyValue
  left: PropertyValue
  right: PropertyValue

  // ─── SIZING ─────────────────────────────────────────────────────
  width: PropertyValue | Size
  height: PropertyValue | Size
  size: PropertyValue | Size
  minWidth: PropertyValue | Size
  minHeight: PropertyValue | Size
  minSize: PropertyValue | Size
  maxWidth: PropertyValue | Size
  maxHeight: PropertyValue | Size
  maxSize: PropertyValue | Size
  aspectRatio: CSSProperties['aspectRatio']

  // ─── SPACING ────────────────────────────────────────────────────
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

  // ─── LAYOUT ─────────────────────────────────────────────────────
  alignContent: CSSProperties['alignContent']
  alignItems: CSSProperties['alignItems']
  alignSelf: CSSProperties['alignSelf']
  all: CSSProperties['all']
  display: CSSProperties['display']
  position: CSSProperties['position']
  boxSizing: CSSProperties['boxSizing']
  float: CSSProperties['float']

  // ─── CONTAINER QUERIES ──────────────────────────────────────────
  contain: CSSProperties['contain']
  containerType: CSSProperties['containerType']
  containerName: CSSProperties['containerName']
  container: CSSProperties['container']

  // ─── FLEX ───────────────────────────────────────────────────────
  flex: CSSProperties['flex']
  flexBasis: CSSProperties['flexBasis']
  flexDirection: CSSProperties['flexDirection']
  flexFlow: CSSProperties['flexFlow']
  flexGrow: CSSProperties['flexGrow']
  flexShrink: CSSProperties['flexShrink']
  flexWrap: CSSProperties['flexWrap']
  justifyContent: CSSProperties['justifyContent']
  justifyItems: CSSProperties['justifyItems']
  justifySelf: CSSProperties['justifySelf']
  placeItems: CSSProperties['placeItems']
  placeContent: CSSProperties['placeContent']
  placeSelf: CSSProperties['placeSelf']
  rowGap: PropertyValue
  columnGap: PropertyValue

  // ─── GRID ───────────────────────────────────────────────────────
  grid: CSSProperties['grid']
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

  // ─── POSITIONING ────────────────────────────────────────────────
  objectFit: CSSProperties['objectFit']
  objectPosition: CSSProperties['objectPosition']
  order: CSSProperties['order']
  opacity: CSSProperties['opacity']
  resize: CSSProperties['resize']
  verticalAlign: CSSProperties['verticalAlign']

  // ─── FONT & TEXT ────────────────────────────────────────────────
  lineHeight: CSSProperties['lineHeight']
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
  fontKerning: CSSProperties['fontKerning']
  fontFeatureSettings: CSSProperties['fontFeatureSettings']
  fontVariationSettings: CSSProperties['fontVariationSettings']
  fontOpticalSizing: CSSProperties['fontOpticalSizing']
  textAlign: CSSProperties['textAlign']
  textAlignLast: CSSProperties['textAlignLast']
  textTransform: CSSProperties['textTransform']
  textDecoration: CSSProperties['textDecoration']
  textDecorationColor: CSSProperties['textDecorationColor']
  textDecorationLine: CSSProperties['textDecorationLine']
  textDecorationStyle: CSSProperties['textDecorationStyle']
  textDecorationThickness: CSSProperties['textDecorationThickness']
  textUnderlineOffset: CSSProperties['textUnderlineOffset']
  textEmphasis: CSSProperties['textEmphasis']
  textEmphasisColor: CSSProperties['textEmphasisColor']
  textEmphasisStyle: CSSProperties['textEmphasisStyle']
  letterSpacing: CSSProperties['letterSpacing']
  wordSpacing: CSSProperties['wordSpacing']
  textIndent: CSSProperties['textIndent']
  textJustify: CSSProperties['textJustify']
  textOverflow: CSSProperties['textOverflow']
  textShadow: CSSProperties['textShadow']
  textWrap: CSSProperties['textWrap']
  textRendering: CSSProperties['textRendering']
  whiteSpace: CSSProperties['whiteSpace']
  wordBreak: CSSProperties['wordBreak']
  wordWrap: CSSProperties['wordWrap']
  writingMode: CSSProperties['writingMode']
  direction: CSSProperties['direction']
  hyphens: CSSProperties['hyphens']

  // ─── LIST ───────────────────────────────────────────────────────
  listStyle: CSSProperties['listStyle']
  listStyleImage: CSSProperties['listStyleImage']
  listStylePosition: CSSProperties['listStylePosition']
  listStyleType: ListStyleType

  // ─── BACKGROUND & COLORS ───────────────────────────────────────
  color: Color
  background: string
  backgroundColor: Color
  backgroundImage: string | 'none' | Defaults
  backgroundAttachment: CSSProperties['backgroundAttachment']
  backgroundClip: CSSProperties['backgroundClip']
  backgroundOrigin: CSSProperties['backgroundOrigin']
  backgroundPosition: CSSProperties['backgroundPosition']
  backgroundRepeat: CSSProperties['backgroundRepeat']
  backgroundSize: 'auto' | PropertyValue | 'cover' | 'contain' | Defaults

  // ─── BORDERS ────────────────────────────────────────────────────
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

  // ─── VISUAL EFFECTS ─────────────────────────────────────────────
  backfaceVisibility: CSSProperties['backfaceVisibility']
  boxShadow: CSSProperties['boxShadow']
  filter: CSSProperties['filter']
  backdropFilter: CSSProperties['backdropFilter']
  mixBlendMode: CSSProperties['mixBlendMode']
  backgroundBlendMode: CSSProperties['backgroundBlendMode']
  isolation: CSSProperties['isolation']
  outline: CSSProperties['outline']
  outlineColor: CSSProperties['outlineColor']
  outlineOffset: CSSProperties['outlineOffset']
  outlineStyle: CSSProperties['outlineStyle']
  outlineWidth: CSSProperties['outlineWidth']

  // ─── ANIMATIONS ─────────────────────────────────────────────────
  animation: CSSProperties['animation']
  keyframe: any
  animationName: CSSProperties['animationName']
  animationDuration: CSSProperties['animationDuration']
  animationTimingFunction: CSSProperties['animationTimingFunction']
  animationDelay: CSSProperties['animationDelay']
  animationIterationCount: CSSProperties['animationIterationCount']
  animationDirection: CSSProperties['animationDirection']
  animationFillMode: CSSProperties['animationFillMode']
  animationPlayState: CSSProperties['animationPlayState']
  transition: CSSProperties['transition']
  transitionDelay: CSSProperties['transitionDelay']
  transitionDuration: CSSProperties['transitionDuration']
  transitionProperty: CSSProperties['transitionProperty']
  transitionTimingFunction:
    | CSSProperties['transitionTimingFunction']
    | `cubic-bezier(${number},${number},${number},${number})`
    | `cubic-bezier(${number}, ${number}, ${number}, ${number})`

  // ─── TRANSFORM ──────────────────────────────────────────────────
  transform: CSSProperties['transform']
  transformOrigin: CSSProperties['transformOrigin']
  transformStyle: CSSProperties['transformStyle']
  translate: CSSProperties['translate']
  rotate: CSSProperties['rotate']
  scale: CSSProperties['scale']
  willChange: CSSProperties['willChange']

  // ─── SCROLL ─────────────────────────────────────────────────────
  scrollBehavior: CSSProperties['scrollBehavior']
  scrollSnapType: CSSProperties['scrollSnapType']
  scrollSnapAlign: CSSProperties['scrollSnapAlign']
  scrollSnapStop: CSSProperties['scrollSnapStop']
  scrollMargin: CSSProperties['scrollMargin']
  scrollPadding: CSSProperties['scrollPadding']
  overscrollBehavior: CSSProperties['overscrollBehavior']
  overscrollBehaviorX: CSSProperties['overscrollBehaviorX']
  overscrollBehaviorY: CSSProperties['overscrollBehaviorY']

  // ─── INTERACTION ────────────────────────────────────────────────
  cursor: Cursor
  pointerEvents: CSSProperties['pointerEvents']
  userSelect: CSSProperties['userSelect']
  touchAction: CSSProperties['touchAction']
  scrollbarWidth: CSSProperties['scrollbarWidth']
  scrollbarColor: CSSProperties['scrollbarColor']
  scrollbarGutter: CSSProperties['scrollbarGutter']
  caretColor: CSSProperties['caretColor']
  accentColor: CSSProperties['accentColor']
  colorScheme: CSSProperties['colorScheme']

  // ─── LOGICAL PROPERTIES ─────────────────────────────────────────
  inlineSize: PropertyValue | Size
  blockSize: PropertyValue | Size
  minInlineSize: PropertyValue | Size
  minBlockSize: PropertyValue | Size
  maxInlineSize: PropertyValue | Size
  maxBlockSize: PropertyValue | Size
  marginInline: PropertyValue
  marginInlineStart: PropertyValue
  marginInlineEnd: PropertyValue
  marginBlock: PropertyValue
  marginBlockStart: PropertyValue
  marginBlockEnd: PropertyValue
  paddingInline: PropertyValue
  paddingInlineStart: PropertyValue
  paddingInlineEnd: PropertyValue
  paddingBlock: PropertyValue
  paddingBlockStart: PropertyValue
  paddingBlockEnd: PropertyValue
  borderInline: string
  borderBlock: string
  borderInlineStart: string
  borderInlineEnd: string
  borderBlockStart: string
  borderBlockEnd: string
  insetInline: PropertyValue
  insetInlineStart: PropertyValue
  insetInlineEnd: PropertyValue
  insetBlock: PropertyValue
  insetBlockStart: PropertyValue
  insetBlockEnd: PropertyValue

  // ─── OTHER ──────────────────────────────────────────────────────
  captionSide: CSSProperties['captionSide']
  clear: CSSProperties['clear']
  clip: CSSProperties['clip']
  clipPath: CSSProperties['clipPath']
  content: CSSProperties['content']
  contentVisibility: CSSProperties['contentVisibility']
  counterIncrement: CSSProperties['counterIncrement']
  counterReset: CSSProperties['counterReset']
  emptyCells: CSSProperties['emptyCells']
  zIndex: CSSProperties['zIndex']
  overflow: CSSProperties['overflow']
  overflowWrap: CSSProperties['overflowWrap']
  overflowX: CSSProperties['overflowX']
  overflowY: CSSProperties['overflowY']
  perspective: CSSProperties['perspective']
  perspectiveOrigin: CSSProperties['perspectiveOrigin']
  quotes: CSSProperties['quotes']
  tabSize: CSSProperties['tabSize']
  tableLayout: CSSProperties['tableLayout']
  visibility: CSSProperties['visibility']
  appearance: CSSProperties['appearance']
  imageRendering: CSSProperties['imageRendering']

  // ─── MASKS ──────────────────────────────────────────────────────
  maskImage: CSSProperties['maskImage']
  maskSize: CSSProperties['maskSize']
  maskPosition: CSSProperties['maskPosition']
  maskRepeat: CSSProperties['maskRepeat']

  // ─── SHAPES ─────────────────────────────────────────────────────
  shapeOutside: CSSProperties['shapeOutside']
  shapeMargin: CSSProperties['shapeMargin']
  shapeImageThreshold: CSSProperties['shapeImageThreshold']

  // ─── COLUMNS ────────────────────────────────────────────────────
  columnCount: CSSProperties['columnCount']
  columnWidth: CSSProperties['columnWidth']
  columnRule: CSSProperties['columnRule']
  columns: CSSProperties['columns']

  // ─── FRAGMENTATION ──────────────────────────────────────────────
  breakBefore: CSSProperties['breakBefore']
  breakAfter: CSSProperties['breakAfter']
  breakInside: CSSProperties['breakInside']
  orphans: CSSProperties['orphans']
  widows: CSSProperties['widows']
  printColorAdjust: CSSProperties['printColorAdjust']

  // ─── CUSTOM ─────────────────────────────────────────────────────
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
