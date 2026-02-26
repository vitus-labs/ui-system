// ─── Types ──────────────────────────────────────────────────────────

// ─── Factories ──────────────────────────────────────────────────────
export {
  createBlur,
  createFade,
  createRotate,
  createScale,
  createSlide,
} from './factories'

// ─── 122 Presets (named exports for tree-shaking) ───────────────────
export {
  // Back
  backInDown,
  backInLeft,
  backInRight,
  backInUp,
  // Blur
  blurIn,
  blurInDown,
  blurInLeft,
  blurInRight,
  blurInUp,
  blurScale,
  // Bounce / Spring
  bounceIn,
  bounceInDown,
  bounceInLeft,
  bounceInRight,
  bounceInUp,
  // Clip Path
  clipBottom,
  clipCenter,
  clipCircle,
  clipCorner,
  clipDiamond,
  clipLeft,
  clipRight,
  clipTop,
  // Drop / Rise
  drop,
  // Expand
  expandX,
  expandY,
  // Fades
  fade,
  fadeDown,
  fadeDownBig,
  fadeDownLeft,
  fadeDownRight,
  fadeLeft,
  fadeLeftBig,
  fadeRight,
  fadeRightBig,
  fadeScale,
  fadeUp,
  fadeUpBig,
  fadeUpLeft,
  fadeUpRight,
  // Flips
  flipDiagonal,
  flipDiagonalReverse,
  flipX,
  flipXReverse,
  flipY,
  flipYReverse,
  // Float
  floatDown,
  floatLeft,
  floatRight,
  floatUp,
  // Fly
  flyInDown,
  flyInLeft,
  flyInRight,
  flyInUp,
  // Light Speed
  lightSpeedInLeft,
  lightSpeedInRight,
  // Newspaper
  newspaperIn,
  // Perspective
  perspectiveDown,
  perspectiveLeft,
  perspectiveRight,
  perspectiveUp,
  // Pop
  popIn,
  // All presets as object
  presets,
  // Puff
  puffIn,
  puffOut,
  // Push
  pushInLeft,
  pushInRight,
  rise,
  // Roll
  rollInLeft,
  rollInRight,
  // Rotations
  rotateIn,
  rotateInDown,
  rotateInReverse,
  rotateInUp,
  // Rubber
  rubberIn,
  // Scales
  scaleDown,
  scaleIn,
  scaleInDown,
  scaleInLeft,
  scaleInRight,
  scaleInUp,
  scaleOut,
  scaleRotateIn,
  scaleUp,
  // Skew
  skewIn,
  skewInReverse,
  skewInY,
  skewInYReverse,
  // Slides
  slideDown,
  slideDownBig,
  slideLeft,
  slideLeftBig,
  slideRight,
  slideRightBig,
  slideUp,
  slideUpBig,
  // Slit
  slitHorizontal,
  slitVertical,
  spinIn,
  spinInReverse,
  springIn,
  // Squish
  squishX,
  squishY,
  // Swing
  swingInBottom,
  swingInLeft,
  swingInRight,
  swingInTop,
  // Swirl
  swirlIn,
  swirlInReverse,
  // Tilt
  tiltInDown,
  tiltInLeft,
  tiltInRight,
  tiltInUp,
  // Zooms
  zoomIn,
  zoomInDown,
  zoomInLeft,
  zoomInRight,
  zoomInUp,
  zoomOut,
  zoomOutDown,
  zoomOutLeft,
  zoomOutRight,
  zoomOutUp,
} from './presets'
export type {
  BlurOptions,
  Direction,
  FadeOptions,
  Preset,
  RotateOptions,
  ScaleOptions,
  SlideOptions,
} from './types'

// ─── Utilities ──────────────────────────────────────────────────────
export {
  compose,
  reverse,
  withDelay,
  withDuration,
  withEasing,
} from './utils'
