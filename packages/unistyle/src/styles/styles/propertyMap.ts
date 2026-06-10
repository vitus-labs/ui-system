import camelToKebab from './camelToKebab'
import type { InnerTheme } from './types'

/**
 * Descriptor types for the data-driven CSS property map.
 *
 * - `simple`           — CSS pass-through (no unit conversion).
 * - `convert`          — Number values are converted via `values()` (px→rem).
 * - `convert_fallback` — Picks first non-null from multiple theme keys, then converts.
 * - `edge`             — Spacing shorthand (margin, padding, inset, border-*) via `edge()`.
 * - `border_radius`    — Border radius shorthand via `borderRadius()`.
 * - `special`          — One-off logic (fullScreen, backgroundImage, animation, etc.).
 */
type EdgeProperty =
  | 'inset'
  | 'margin'
  | 'padding'
  | 'border-width'
  | 'border-style'
  | 'border-color'

type EdgeKeys = {
  full: keyof InnerTheme
  x: keyof InnerTheme
  y: keyof InnerTheme
  top: keyof InnerTheme
  left: keyof InnerTheme
  bottom: keyof InnerTheme
  right: keyof InnerTheme
}

type BorderRadiusKeys = {
  full: keyof InnerTheme
  top: keyof InnerTheme
  bottom: keyof InnerTheme
  left: keyof InnerTheme
  right: keyof InnerTheme
  topLeft: keyof InnerTheme
  topRight: keyof InnerTheme
  bottomLeft: keyof InnerTheme
  bottomRight: keyof InnerTheme
}

export type PropertyDescriptor =
  | { kind: 'simple'; css: string; key: keyof InnerTheme }
  | { kind: 'convert'; css: string; key: keyof InnerTheme }
  | { kind: 'convert_fallback'; css: string; keys: (keyof InnerTheme)[] }
  | {
      kind: 'edge'
      property: EdgeProperty
      keys: EdgeKeys
    }
  | { kind: 'border_radius'; keys: BorderRadiusKeys }
  | { kind: 'special'; id: string }

/**
 * Authoring-time variant of `PropertyDescriptor`: `css` is omitted for
 * `simple`/`convert` descriptors because it always equals
 * `camelToKebab(key)` — it is derived once at module load (see the fill
 * pass below), so consumers (`processDescriptor`) always see it present.
 * Keeping ~240 redundant string literals out of the source trims the
 * bundle by ~1 KB gzipped.
 */
type AuthoredPropertyDescriptor =
  | { kind: 'simple'; css?: string; key: keyof InnerTheme }
  | { kind: 'convert'; css?: string; key: keyof InnerTheme }
  | Exclude<PropertyDescriptor, { kind: 'simple' } | { kind: 'convert' }>

const propertyMap: AuthoredPropertyDescriptor[] = [
  // ─── SPECIAL: fullScreen ──────────────────────────────────────────
  { kind: 'special', id: 'fullScreen' },

  // ─── POSITION ─────────────────────────────────────────────────────
  { kind: 'simple', key: 'all' },
  { kind: 'simple', key: 'display' },
  { kind: 'simple', key: 'position' },
  { kind: 'simple', key: 'boxSizing' },
  { kind: 'simple', key: 'float' },

  // ─── INSET (edge shorthand) ───────────────────────────────────────
  {
    kind: 'edge',
    property: 'inset',
    keys: {
      full: 'inset',
      x: 'insetX',
      y: 'insetY',
      top: 'top',
      left: 'left',
      bottom: 'bottom',
      right: 'right',
    },
  },

  // ─── SIZING ───────────────────────────────────────────────────────
  { kind: 'convert_fallback', css: 'width', keys: ['width', 'size'] },
  { kind: 'convert_fallback', css: 'min-width', keys: ['minWidth', 'minSize'] },
  { kind: 'convert_fallback', css: 'max-width', keys: ['maxWidth', 'maxSize'] },
  { kind: 'convert_fallback', css: 'height', keys: ['height', 'size'] },
  {
    kind: 'convert_fallback',
    css: 'min-height',
    keys: ['minHeight', 'minSize'],
  },
  {
    kind: 'convert_fallback',
    css: 'max-height',
    keys: ['maxHeight', 'maxSize'],
  },
  { kind: 'convert', key: 'gap' },
  { kind: 'simple', key: 'aspectRatio' },
  { kind: 'simple', key: 'contain' },
  { kind: 'simple', key: 'containerType' },
  { kind: 'simple', key: 'containerName' },
  { kind: 'simple', key: 'container' },
  { kind: 'convert', key: 'inlineSize' },
  { kind: 'convert', key: 'blockSize' },
  { kind: 'convert', key: 'minInlineSize' },
  { kind: 'convert', key: 'minBlockSize' },
  { kind: 'convert', key: 'maxInlineSize' },
  { kind: 'convert', key: 'maxBlockSize' },

  // ─── SPACING (edge shorthands) ────────────────────────────────────
  {
    kind: 'edge',
    property: 'margin',
    keys: {
      full: 'margin',
      x: 'marginX',
      y: 'marginY',
      top: 'marginTop',
      left: 'marginLeft',
      bottom: 'marginBottom',
      right: 'marginRight',
    },
  },
  {
    kind: 'edge',
    property: 'padding',
    keys: {
      full: 'padding',
      x: 'paddingX',
      y: 'paddingY',
      top: 'paddingTop',
      left: 'paddingLeft',
      bottom: 'paddingBottom',
      right: 'paddingRight',
    },
  },

  // Logical spacing
  { kind: 'convert', key: 'marginInline' },
  { kind: 'convert', key: 'marginInlineStart' },
  { kind: 'convert', key: 'marginInlineEnd' },
  { kind: 'convert', key: 'marginBlock' },
  { kind: 'convert', key: 'marginBlockStart' },
  { kind: 'convert', key: 'marginBlockEnd' },
  { kind: 'convert', key: 'paddingInline' },
  { kind: 'convert', key: 'paddingInlineStart' },
  { kind: 'convert', key: 'paddingInlineEnd' },
  { kind: 'convert', key: 'paddingBlock' },
  { kind: 'convert', key: 'paddingBlockStart' },
  { kind: 'convert', key: 'paddingBlockEnd' },

  // Logical inset
  { kind: 'convert', key: 'insetInline' },
  { kind: 'convert', key: 'insetInlineStart' },
  { kind: 'convert', key: 'insetInlineEnd' },
  { kind: 'convert', key: 'insetBlock' },
  { kind: 'convert', key: 'insetBlockStart' },
  { kind: 'convert', key: 'insetBlockEnd' },

  // ─── FLEX ─────────────────────────────────────────────────────────
  { kind: 'simple', key: 'alignContent' },
  { kind: 'simple', key: 'alignItems' },
  { kind: 'simple', key: 'alignSelf' },
  { kind: 'simple', key: 'flex' },
  { kind: 'simple', key: 'flexBasis' },
  { kind: 'simple', key: 'flexDirection' },
  { kind: 'simple', key: 'flexFlow' },
  { kind: 'simple', key: 'flexGrow' },
  { kind: 'simple', key: 'flexShrink' },
  { kind: 'simple', key: 'flexWrap' },
  { kind: 'simple', key: 'justifyContent' },
  { kind: 'simple', key: 'justifyItems' },
  { kind: 'simple', key: 'justifySelf' },
  { kind: 'simple', key: 'placeItems' },
  { kind: 'simple', key: 'placeContent' },
  { kind: 'simple', key: 'placeSelf' },
  { kind: 'convert', key: 'rowGap' },
  { kind: 'convert', key: 'columnGap' },

  // ─── GRID ─────────────────────────────────────────────────────────
  { kind: 'simple', key: 'grid' },
  { kind: 'simple', key: 'gridArea' },
  { kind: 'convert', key: 'gridAutoColumns' },
  { kind: 'simple', key: 'gridAutoFlow' },
  { kind: 'convert', key: 'gridAutoRows' },
  { kind: 'simple', key: 'gridColumn' },
  { kind: 'simple', key: 'gridColumnEnd' },
  { kind: 'convert', key: 'gridColumnGap' },
  { kind: 'convert', key: 'gridColumnStart' },
  { kind: 'convert', key: 'gridGap' },
  { kind: 'simple', key: 'gridRow' },
  { kind: 'simple', key: 'gridRowStart' },
  { kind: 'simple', key: 'gridRowEnd' },
  { kind: 'convert', key: 'gridRowGap' },
  { kind: 'simple', key: 'gridTemplate' },
  { kind: 'simple', key: 'gridTemplateAreas' },
  { kind: 'simple', key: 'gridTemplateColumns' },
  { kind: 'simple', key: 'gridTemplateRows' },

  // ─── POSITIONING ──────────────────────────────────────────────────
  { kind: 'simple', key: 'objectFit' },
  { kind: 'simple', key: 'objectPosition' },
  { kind: 'simple', key: 'order' },
  { kind: 'simple', key: 'opacity' },
  { kind: 'simple', key: 'resize' },
  { kind: 'simple', key: 'verticalAlign' },

  // ─── FONT & TEXT ──────────────────────────────────────────────────
  { kind: 'simple', key: 'lineHeight' },
  { kind: 'simple', key: 'font' },
  { kind: 'simple', key: 'fontFamily' },
  { kind: 'convert', key: 'fontSize' },
  { kind: 'convert', key: 'fontSizeAdjust' },
  { kind: 'convert', key: 'fontStretch' },
  { kind: 'simple', key: 'fontStyle' },
  { kind: 'simple', key: 'fontVariant' },
  { kind: 'simple', key: 'fontWeight' },
  { kind: 'simple', key: 'fontKerning' },
  { kind: 'simple', key: 'fontFeatureSettings' },
  { kind: 'simple', key: 'fontVariationSettings' },
  { kind: 'simple', key: 'fontOpticalSizing' },
  { kind: 'simple', key: 'textAlign' },
  { kind: 'simple', key: 'textAlignLast' },
  { kind: 'simple', key: 'textTransform' },
  { kind: 'simple', key: 'textDecoration' },
  { kind: 'simple', key: 'textDecorationColor' },
  { kind: 'simple', key: 'textDecorationLine' },
  { kind: 'simple', key: 'textDecorationStyle' },
  { kind: 'simple', key: 'textDecorationThickness' },
  { kind: 'simple', key: 'textUnderlineOffset' },
  { kind: 'simple', key: 'textEmphasis' },
  { kind: 'simple', key: 'textEmphasisColor' },
  { kind: 'simple', key: 'textEmphasisStyle' },
  { kind: 'simple', key: 'letterSpacing' },
  { kind: 'simple', key: 'wordSpacing' },
  { kind: 'simple', key: 'textIndent' },
  { kind: 'simple', key: 'textJustify' },
  { kind: 'simple', key: 'textOverflow' },
  { kind: 'simple', key: 'textShadow' },
  { kind: 'simple', key: 'textWrap' },
  { kind: 'simple', key: 'textRendering' },
  { kind: 'simple', key: 'whiteSpace' },
  { kind: 'simple', key: 'wordBreak' },
  { kind: 'simple', key: 'wordWrap' },
  { kind: 'simple', key: 'writingMode' },
  { kind: 'simple', key: 'direction' },
  { kind: 'simple', key: 'hyphens' },

  // ─── LIST ─────────────────────────────────────────────────────────
  { kind: 'simple', key: 'listStyle' },
  { kind: 'simple', key: 'listStyleImage' },
  { kind: 'simple', key: 'listStylePosition' },
  { kind: 'simple', key: 'listStyleType' },

  // ─── BACKGROUND & COLORS ─────────────────────────────────────────
  { kind: 'simple', key: 'color' },
  { kind: 'simple', key: 'background' },
  { kind: 'simple', key: 'backgroundColor' },
  { kind: 'special', id: 'backgroundImage' },
  { kind: 'simple', key: 'backgroundAttachment' },
  { kind: 'simple', key: 'backgroundClip' },
  { kind: 'simple', key: 'backgroundOrigin' },
  { kind: 'simple', key: 'backgroundPosition' },
  { kind: 'simple', key: 'backgroundRepeat' },
  { kind: 'simple', key: 'backgroundSize' },

  // ─── BORDERS ──────────────────────────────────────────────────────
  {
    kind: 'border_radius',
    keys: {
      full: 'borderRadius',
      top: 'borderRadiusTop',
      bottom: 'borderRadiusBottom',
      left: 'borderRadiusLeft',
      right: 'borderRadiusRight',
      topLeft: 'borderRadiusTopLeft',
      topRight: 'borderRadiusTopRight',
      bottomLeft: 'borderRadiusBottomLeft',
      bottomRight: 'borderRadiusBottomRight',
    },
  },
  { kind: 'simple', key: 'border' },
  { kind: 'simple', key: 'borderTop' },
  { kind: 'simple', key: 'borderBottom' },
  { kind: 'simple', key: 'borderLeft' },
  { kind: 'simple', key: 'borderRight' },
  {
    kind: 'edge',
    property: 'border-width',
    keys: {
      full: 'borderWidth',
      x: 'borderWidthX',
      y: 'borderWidthY',
      top: 'borderWidthTop',
      left: 'borderWidthLeft',
      bottom: 'borderWidthBottom',
      right: 'borderWidthRight',
    },
  },
  {
    kind: 'edge',
    property: 'border-style',
    keys: {
      full: 'borderStyle',
      x: 'borderStyleX',
      y: 'borderStyleY',
      top: 'borderStyleTop',
      left: 'borderStyleLeft',
      bottom: 'borderStyleBottom',
      right: 'borderStyleRight',
    },
  },
  {
    kind: 'edge',
    property: 'border-color',
    keys: {
      full: 'borderColor',
      x: 'borderColorX',
      y: 'borderColorY',
      top: 'borderColorTop',
      left: 'borderColorLeft',
      bottom: 'borderColorBottom',
      right: 'borderColorRight',
    },
  },
  { kind: 'simple', key: 'borderImage' },
  { kind: 'simple', key: 'borderImageOutset' },
  { kind: 'simple', key: 'borderImageRepeat' },
  { kind: 'simple', key: 'borderImageSlice' },
  { kind: 'simple', key: 'borderImageSource' },
  { kind: 'simple', key: 'borderImageWidth' },
  { kind: 'simple', key: 'borderSpacing' },
  { kind: 'simple', key: 'borderCollapse' },

  // Logical borders
  { kind: 'simple', key: 'borderInline' },
  { kind: 'simple', key: 'borderBlock' },
  { kind: 'simple', key: 'borderInlineStart' },
  { kind: 'simple', key: 'borderInlineEnd' },
  { kind: 'simple', key: 'borderBlockStart' },
  { kind: 'simple', key: 'borderBlockEnd' },

  // ─── VISUAL EFFECTS ───────────────────────────────────────────────
  { kind: 'simple', key: 'backfaceVisibility' },
  { kind: 'simple', key: 'boxShadow' },
  { kind: 'simple', key: 'filter' },
  { kind: 'simple', key: 'backdropFilter' },
  { kind: 'simple', key: 'mixBlendMode' },
  { kind: 'simple', key: 'backgroundBlendMode' },
  { kind: 'simple', key: 'isolation' },
  { kind: 'simple', key: 'outline' },
  { kind: 'simple', key: 'outlineColor' },
  { kind: 'simple', key: 'outlineOffset' },
  { kind: 'simple', key: 'outlineStyle' },
  { kind: 'simple', key: 'outlineWidth' },

  // ─── ANIMATIONS ───────────────────────────────────────────────────
  { kind: 'special', id: 'animation' },
  { kind: 'simple', key: 'animationName' },
  { kind: 'simple', key: 'animationDuration' },
  { kind: 'simple', key: 'animationTimingFunction' },
  { kind: 'simple', key: 'animationDelay' },
  { kind: 'simple', key: 'animationIterationCount' },
  { kind: 'simple', key: 'animationDirection' },
  { kind: 'simple', key: 'animationFillMode' },
  { kind: 'simple', key: 'animationPlayState' },
  { kind: 'simple', key: 'transition' },
  { kind: 'simple', key: 'transitionDelay' },
  { kind: 'simple', key: 'transitionDuration' },
  { kind: 'simple', key: 'transitionProperty' },
  { kind: 'simple', key: 'transitionTimingFunction' },

  // ─── TRANSFORM ────────────────────────────────────────────────────
  { kind: 'simple', key: 'transform' },
  { kind: 'simple', key: 'transformOrigin' },
  { kind: 'simple', key: 'transformStyle' },
  { kind: 'simple', key: 'translate' },
  { kind: 'simple', key: 'rotate' },
  { kind: 'simple', key: 'scale' },
  { kind: 'simple', key: 'willChange' },

  // ─── SCROLL ───────────────────────────────────────────────────────
  { kind: 'simple', key: 'scrollBehavior' },
  { kind: 'simple', key: 'scrollSnapType' },
  { kind: 'simple', key: 'scrollSnapAlign' },
  { kind: 'simple', key: 'scrollSnapStop' },
  { kind: 'simple', key: 'scrollMargin' },
  { kind: 'simple', key: 'scrollPadding' },
  { kind: 'simple', key: 'overscrollBehavior' },
  { kind: 'simple', key: 'overscrollBehaviorX' },
  { kind: 'simple', key: 'overscrollBehaviorY' },

  // ─── INTERACTION ──────────────────────────────────────────────────
  { kind: 'simple', key: 'cursor' },
  { kind: 'simple', key: 'pointerEvents' },
  { kind: 'simple', key: 'userSelect' },
  { kind: 'simple', key: 'touchAction' },
  { kind: 'simple', key: 'scrollbarWidth' },
  { kind: 'simple', key: 'scrollbarColor' },
  { kind: 'simple', key: 'scrollbarGutter' },
  { kind: 'simple', key: 'caretColor' },
  { kind: 'simple', key: 'accentColor' },
  { kind: 'simple', key: 'colorScheme' },

  // ─── OTHER ────────────────────────────────────────────────────────
  { kind: 'simple', key: 'captionSide' },
  { kind: 'simple', key: 'clear' },
  { kind: 'simple', key: 'clip' },
  { kind: 'simple', key: 'clipPath' },
  { kind: 'simple', key: 'content' },
  { kind: 'simple', key: 'contentVisibility' },
  { kind: 'simple', key: 'counterIncrement' },
  { kind: 'simple', key: 'counterReset' },
  { kind: 'simple', key: 'emptyCells' },
  { kind: 'simple', key: 'zIndex' },
  { kind: 'simple', key: 'overflow' },
  { kind: 'simple', key: 'overflowWrap' },
  { kind: 'simple', key: 'overflowX' },
  { kind: 'simple', key: 'overflowY' },
  { kind: 'simple', key: 'perspective' },
  { kind: 'simple', key: 'perspectiveOrigin' },
  { kind: 'simple', key: 'quotes' },
  { kind: 'simple', key: 'tabSize' },
  { kind: 'simple', key: 'tableLayout' },
  { kind: 'simple', key: 'visibility' },
  { kind: 'simple', key: 'appearance' },
  { kind: 'simple', key: 'imageRendering' },

  // Masks
  { kind: 'simple', key: 'maskImage' },
  { kind: 'simple', key: 'maskSize' },
  { kind: 'simple', key: 'maskPosition' },
  { kind: 'simple', key: 'maskRepeat' },

  // Shapes
  { kind: 'simple', key: 'shapeOutside' },
  { kind: 'simple', key: 'shapeMargin' },
  { kind: 'simple', key: 'shapeImageThreshold' },

  // Columns
  { kind: 'simple', key: 'columnCount' },
  { kind: 'simple', key: 'columnWidth' },
  { kind: 'simple', key: 'columnRule' },
  { kind: 'simple', key: 'columns' },

  // Fragmentation
  { kind: 'simple', key: 'breakBefore' },
  { kind: 'simple', key: 'breakAfter' },
  { kind: 'simple', key: 'breakInside' },
  { kind: 'simple', key: 'orphans' },
  { kind: 'simple', key: 'widows' },
  { kind: 'simple', key: 'printColorAdjust' },

  // ─── CUSTOM ATTRIBUTES ────────────────────────────────────────────
  { kind: 'special', id: 'hideEmpty' },
  { kind: 'special', id: 'clearFix' },
  { kind: 'special', id: 'extendCss' },
]

// One pass at module load: derive the kebab-case CSS property name from
// the camelCase theme key for every `simple`/`convert` descriptor that
// omits it. Mutating the descriptor objects once at init keeps
// `processDescriptor` unchanged — it always sees `css` present.
for (const d of propertyMap) {
  if ((d.kind === 'simple' || d.kind === 'convert') && d.css === undefined) {
    d.css = camelToKebab(d.key)
  }
}

export default propertyMap as PropertyDescriptor[]
