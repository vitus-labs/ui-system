import type { CSSProperties } from 'react'
import type { Preset } from './types'

/**
 * Internal helper: create a symmetric preset where leave reverses enter.
 * This dramatically reduces boilerplate for 65+ preset definitions.
 */
const s = (
  hidden: CSSProperties,
  visible: CSSProperties,
  enterDuration = '300ms',
  leaveDuration = '200ms',
  enterEasing = 'ease-out',
  leaveEasing = 'ease-in',
): Preset => ({
  enterStyle: hidden,
  enterToStyle: visible,
  enterTransition: `all ${enterDuration} ${enterEasing}`,
  leaveStyle: visible,
  leaveToStyle: hidden,
  leaveTransition: `all ${leaveDuration} ${leaveEasing}`,
})

/** Spring: overshoot easing for bouncy enter animations. */
const SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)'

/** Bounce: elastic easing for playful animations. */
const BOUNCE = 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'

// ─── Fades ──────────────────────────────────────────────────────────
// Opacity transitions with optional directional movement.

/** Pure opacity fade. */
export const fade: Preset = s({ opacity: 0 }, { opacity: 1 })

/** Fade in while sliding upward (starts 16px below). */
export const fadeUp: Preset = s(
  { opacity: 0, transform: 'translateY(16px)' },
  { opacity: 1, transform: 'translateY(0)' },
)

/** Fade in while sliding downward (starts 16px above). */
export const fadeDown: Preset = s(
  { opacity: 0, transform: 'translateY(-16px)' },
  { opacity: 1, transform: 'translateY(0)' },
)

/** Fade in while sliding left (starts 16px to the right). */
export const fadeLeft: Preset = s(
  { opacity: 0, transform: 'translateX(16px)' },
  { opacity: 1, transform: 'translateX(0)' },
)

/** Fade in while sliding right (starts 16px to the left). */
export const fadeRight: Preset = s(
  { opacity: 0, transform: 'translateX(-16px)' },
  { opacity: 1, transform: 'translateX(0)' },
)

/** Fade + slide up, dramatic distance (48px). */
export const fadeUpBig: Preset = s(
  { opacity: 0, transform: 'translateY(48px)' },
  { opacity: 1, transform: 'translateY(0)' },
)

/** Fade + slide down, dramatic distance (48px). */
export const fadeDownBig: Preset = s(
  { opacity: 0, transform: 'translateY(-48px)' },
  { opacity: 1, transform: 'translateY(0)' },
)

/** Fade + slide left, dramatic distance (48px). */
export const fadeLeftBig: Preset = s(
  { opacity: 0, transform: 'translateX(48px)' },
  { opacity: 1, transform: 'translateX(0)' },
)

/** Fade + slide right, dramatic distance (48px). */
export const fadeRightBig: Preset = s(
  { opacity: 0, transform: 'translateX(-48px)' },
  { opacity: 1, transform: 'translateX(0)' },
)

/** Fade in with subtle scale (from 95%). */
export const fadeScale: Preset = s(
  { opacity: 0, transform: 'scale(0.95)' },
  { opacity: 1, transform: 'scale(1)' },
)

// ─── Slides ─────────────────────────────────────────────────────────
// Directional movement with opacity. Standard (16px) and big (48px) variants.

/** Slide up with fade (16px). */
export const slideUp: Preset = s(
  { opacity: 0, transform: 'translateY(16px)' },
  { opacity: 1, transform: 'translateY(0)' },
)

/** Slide down with fade (16px). */
export const slideDown: Preset = s(
  { opacity: 0, transform: 'translateY(-16px)' },
  { opacity: 1, transform: 'translateY(0)' },
)

/** Slide left with fade (16px). */
export const slideLeft: Preset = s(
  { opacity: 0, transform: 'translateX(16px)' },
  { opacity: 1, transform: 'translateX(0)' },
)

/** Slide right with fade (16px). */
export const slideRight: Preset = s(
  { opacity: 0, transform: 'translateX(-16px)' },
  { opacity: 1, transform: 'translateX(0)' },
)

/** Slide up with fade, dramatic (48px). */
export const slideUpBig: Preset = s(
  { opacity: 0, transform: 'translateY(48px)' },
  { opacity: 1, transform: 'translateY(0)' },
)

/** Slide down with fade, dramatic (48px). */
export const slideDownBig: Preset = s(
  { opacity: 0, transform: 'translateY(-48px)' },
  { opacity: 1, transform: 'translateY(0)' },
)

/** Slide left with fade, dramatic (48px). */
export const slideLeftBig: Preset = s(
  { opacity: 0, transform: 'translateX(48px)' },
  { opacity: 1, transform: 'translateX(0)' },
)

/** Slide right with fade, dramatic (48px). */
export const slideRightBig: Preset = s(
  { opacity: 0, transform: 'translateX(-48px)' },
  { opacity: 1, transform: 'translateX(0)' },
)

// ─── Scales ─────────────────────────────────────────────────────────
// Scale transforms with opacity. "In" = grow to normal, "Out" = shrink to normal.

/** Scale up from 90% with fade. */
export const scaleIn: Preset = s(
  { opacity: 0, transform: 'scale(0.9)' },
  { opacity: 1, transform: 'scale(1)' },
)

/** Scale down from 110% with fade. */
export const scaleOut: Preset = s(
  { opacity: 0, transform: 'scale(1.1)' },
  { opacity: 1, transform: 'scale(1)' },
)

/** Dramatic scale from 50% with fade. */
export const scaleUp: Preset = s(
  { opacity: 0, transform: 'scale(0.5)' },
  { opacity: 1, transform: 'scale(1)' },
)

/** Dramatic scale from 150% with fade. */
export const scaleDown: Preset = s(
  { opacity: 0, transform: 'scale(1.5)' },
  { opacity: 1, transform: 'scale(1)' },
)

/** Scale from 90% + slide up (16px). */
export const scaleInUp: Preset = s(
  { opacity: 0, transform: 'scale(0.9) translateY(16px)' },
  { opacity: 1, transform: 'scale(1) translateY(0)' },
)

/** Scale from 90% + slide down (16px). */
export const scaleInDown: Preset = s(
  { opacity: 0, transform: 'scale(0.9) translateY(-16px)' },
  { opacity: 1, transform: 'scale(1) translateY(0)' },
)

/** Scale from 90% + slide left (16px). */
export const scaleInLeft: Preset = s(
  { opacity: 0, transform: 'scale(0.9) translateX(16px)' },
  { opacity: 1, transform: 'scale(1) translateX(0)' },
)

/** Scale from 90% + slide right (16px). */
export const scaleInRight: Preset = s(
  { opacity: 0, transform: 'scale(0.9) translateX(-16px)' },
  { opacity: 1, transform: 'scale(1) translateX(0)' },
)

// ─── Zooms ──────────────────────────────────────────────────────────
// Dramatic scale effects (from 0 or 2x) for attention-grabbing entrances.

/** Zoom from nothing (scale 0) to full size. */
export const zoomIn: Preset = s(
  { opacity: 0, transform: 'scale(0)' },
  { opacity: 1, transform: 'scale(1)' },
  '400ms',
  '250ms',
)

/** Zoom from 2x size down to normal. */
export const zoomOut: Preset = s(
  { opacity: 0, transform: 'scale(2)' },
  { opacity: 1, transform: 'scale(1)' },
  '400ms',
  '250ms',
)

/** Zoom in from below (scale 0.5 + translateY 48px). */
export const zoomInUp: Preset = s(
  { opacity: 0, transform: 'scale(0.5) translateY(48px)' },
  { opacity: 1, transform: 'scale(1) translateY(0)' },
  '400ms',
  '250ms',
)

/** Zoom in from above (scale 0.5 + translateY -48px). */
export const zoomInDown: Preset = s(
  { opacity: 0, transform: 'scale(0.5) translateY(-48px)' },
  { opacity: 1, transform: 'scale(1) translateY(0)' },
  '400ms',
  '250ms',
)

/** Zoom in from right (scale 0.5 + translateX 48px). */
export const zoomInLeft: Preset = s(
  { opacity: 0, transform: 'scale(0.5) translateX(48px)' },
  { opacity: 1, transform: 'scale(1) translateX(0)' },
  '400ms',
  '250ms',
)

/** Zoom in from left (scale 0.5 + translateX -48px). */
export const zoomInRight: Preset = s(
  { opacity: 0, transform: 'scale(0.5) translateX(-48px)' },
  { opacity: 1, transform: 'scale(1) translateX(0)' },
  '400ms',
  '250ms',
)

// ─── Flips ──────────────────────────────────────────────────────────
// 3D rotation around X/Y axis with perspective.

/** Flip around X axis (top-to-bottom rotation). */
export const flipX: Preset = s(
  { opacity: 0, transform: 'perspective(600px) rotateX(90deg)' },
  { opacity: 1, transform: 'perspective(600px) rotateX(0)' },
  '500ms',
  '300ms',
)

/** Flip around Y axis (left-to-right rotation). */
export const flipY: Preset = s(
  { opacity: 0, transform: 'perspective(600px) rotateY(90deg)' },
  { opacity: 1, transform: 'perspective(600px) rotateY(0)' },
  '500ms',
  '300ms',
)

/** Reverse flip around X axis. */
export const flipXReverse: Preset = s(
  { opacity: 0, transform: 'perspective(600px) rotateX(-90deg)' },
  { opacity: 1, transform: 'perspective(600px) rotateX(0)' },
  '500ms',
  '300ms',
)

/** Reverse flip around Y axis. */
export const flipYReverse: Preset = s(
  { opacity: 0, transform: 'perspective(600px) rotateY(-90deg)' },
  { opacity: 1, transform: 'perspective(600px) rotateY(0)' },
  '500ms',
  '300ms',
)

// ─── Rotations ──────────────────────────────────────────────────────
// Subtle and dramatic rotation effects.

/** Rotate in from -15deg with fade. */
export const rotateIn: Preset = s(
  { opacity: 0, transform: 'rotate(-15deg)' },
  { opacity: 1, transform: 'rotate(0)' },
)

/** Rotate in from +15deg with fade. */
export const rotateInReverse: Preset = s(
  { opacity: 0, transform: 'rotate(15deg)' },
  { opacity: 1, transform: 'rotate(0)' },
)

/** Rotate in from -5deg + slide up (16px). */
export const rotateInUp: Preset = s(
  { opacity: 0, transform: 'rotate(-5deg) translateY(16px)' },
  { opacity: 1, transform: 'rotate(0) translateY(0)' },
)

/** Rotate in from +5deg + slide down (16px). */
export const rotateInDown: Preset = s(
  { opacity: 0, transform: 'rotate(5deg) translateY(-16px)' },
  { opacity: 1, transform: 'rotate(0) translateY(0)' },
)

/** Full 180deg clockwise spin with fade. */
export const spinIn: Preset = s(
  { opacity: 0, transform: 'rotate(-180deg)' },
  { opacity: 1, transform: 'rotate(0)' },
  '500ms',
  '300ms',
)

/** Full 180deg counter-clockwise spin with fade. */
export const spinInReverse: Preset = s(
  { opacity: 0, transform: 'rotate(180deg)' },
  { opacity: 1, transform: 'rotate(0)' },
  '500ms',
  '300ms',
)

// ─── Bounce / Spring ────────────────────────────────────────────────
// Overshooting animations using spring/bounce easing curves.

/** Bouncy scale entrance from 50%. */
export const bounceIn: Preset = s(
  { opacity: 0, transform: 'scale(0.5)' },
  { opacity: 1, transform: 'scale(1)' },
  '500ms',
  '200ms',
  BOUNCE,
)

/** Bouncy slide up from 40px below. */
export const bounceInUp: Preset = s(
  { opacity: 0, transform: 'translateY(40px)' },
  { opacity: 1, transform: 'translateY(0)' },
  '500ms',
  '200ms',
  BOUNCE,
)

/** Bouncy slide down from 40px above. */
export const bounceInDown: Preset = s(
  { opacity: 0, transform: 'translateY(-40px)' },
  { opacity: 1, transform: 'translateY(0)' },
  '500ms',
  '200ms',
  BOUNCE,
)

/** Bouncy slide from 40px right. */
export const bounceInLeft: Preset = s(
  { opacity: 0, transform: 'translateX(40px)' },
  { opacity: 1, transform: 'translateX(0)' },
  '500ms',
  '200ms',
  BOUNCE,
)

/** Bouncy slide from 40px left. */
export const bounceInRight: Preset = s(
  { opacity: 0, transform: 'translateX(-40px)' },
  { opacity: 1, transform: 'translateX(0)' },
  '500ms',
  '200ms',
  BOUNCE,
)

/** Spring scale entrance from 80% — gentle overshoot. */
export const springIn: Preset = s(
  { opacity: 0, transform: 'scale(0.8)' },
  { opacity: 1, transform: 'scale(1)' },
  '400ms',
  '200ms',
  SPRING,
)

// ─── Blur ───────────────────────────────────────────────────────────
// Blur filter transitions with opacity.

/** Blur in from 8px with fade. */
export const blurIn: Preset = s(
  { opacity: 0, filter: 'blur(8px)' },
  { opacity: 1, filter: 'blur(0px)' },
)

/** Blur in from 8px + slide up (16px). */
export const blurInUp: Preset = s(
  { opacity: 0, filter: 'blur(8px)', transform: 'translateY(16px)' },
  { opacity: 1, filter: 'blur(0px)', transform: 'translateY(0)' },
)

/** Blur in from 8px + slide down (16px). */
export const blurInDown: Preset = s(
  { opacity: 0, filter: 'blur(8px)', transform: 'translateY(-16px)' },
  { opacity: 1, filter: 'blur(0px)', transform: 'translateY(0)' },
)

/** Blur in from 8px + scale from 95%. */
export const blurScale: Preset = s(
  { opacity: 0, filter: 'blur(8px)', transform: 'scale(0.95)' },
  { opacity: 1, filter: 'blur(0px)', transform: 'scale(1)' },
)

// ─── Clip Path ──────────────────────────────────────────────────────
// Reveal effects using CSS clip-path.

/** Reveal from top edge. */
export const clipTop: Preset = s(
  { clipPath: 'inset(0 0 100% 0)' },
  { clipPath: 'inset(0 0 0 0)' },
  '400ms',
  '250ms',
)

/** Reveal from bottom edge. */
export const clipBottom: Preset = s(
  { clipPath: 'inset(100% 0 0 0)' },
  { clipPath: 'inset(0 0 0 0)' },
  '400ms',
  '250ms',
)

/** Reveal from left edge. */
export const clipLeft: Preset = s(
  { clipPath: 'inset(0 100% 0 0)' },
  { clipPath: 'inset(0 0 0 0)' },
  '400ms',
  '250ms',
)

/** Reveal from right edge. */
export const clipRight: Preset = s(
  { clipPath: 'inset(0 0 0 100%)' },
  { clipPath: 'inset(0 0 0 0)' },
  '400ms',
  '250ms',
)

// ─── Perspective / 3D ───────────────────────────────────────────────
// Subtle 3D tilt effects.

/** Tilt in from above (3D perspective + rotateX). */
export const perspectiveUp: Preset = s(
  { opacity: 0, transform: 'perspective(600px) rotateX(15deg)' },
  { opacity: 1, transform: 'perspective(600px) rotateX(0)' },
)

/** Tilt in from below (3D perspective + rotateX). */
export const perspectiveDown: Preset = s(
  { opacity: 0, transform: 'perspective(600px) rotateX(-15deg)' },
  { opacity: 1, transform: 'perspective(600px) rotateX(0)' },
)

/** Tilt in from left (3D perspective + rotateY). */
export const perspectiveLeft: Preset = s(
  { opacity: 0, transform: 'perspective(600px) rotateY(-15deg)' },
  { opacity: 1, transform: 'perspective(600px) rotateY(0)' },
)

/** Tilt in from right (3D perspective + rotateY). */
export const perspectiveRight: Preset = s(
  { opacity: 0, transform: 'perspective(600px) rotateY(15deg)' },
  { opacity: 1, transform: 'perspective(600px) rotateY(0)' },
)

// ─── Expand ─────────────────────────────────────────────────────────
// Scale along a single axis.

/** Expand horizontally from scaleX(0) with fade. */
export const expandX: Preset = s(
  { opacity: 0, transform: 'scaleX(0)' },
  { opacity: 1, transform: 'scaleX(1)' },
)

/** Expand vertically from scaleY(0) with fade. */
export const expandY: Preset = s(
  { opacity: 0, transform: 'scaleY(0)' },
  { opacity: 1, transform: 'scaleY(1)' },
)

// ─── Skew ───────────────────────────────────────────────────────────
// Skew transform effects.

/** Skew in from -5deg on X axis with fade. */
export const skewIn: Preset = s(
  { opacity: 0, transform: 'skewX(-5deg)' },
  { opacity: 1, transform: 'skewX(0)' },
)

/** Skew in from +5deg on X axis with fade. */
export const skewInReverse: Preset = s(
  { opacity: 0, transform: 'skewX(5deg)' },
  { opacity: 1, transform: 'skewX(0)' },
)

// ─── Drop / Rise ────────────────────────────────────────────────────
// Full-distance vertical movement.

/** Drop from above (translateY -100%). */
export const drop: Preset = s(
  { opacity: 0, transform: 'translateY(-100%)' },
  { opacity: 1, transform: 'translateY(0)' },
  '400ms',
  '250ms',
)

/** Rise from below (translateY 100%). */
export const rise: Preset = s(
  { opacity: 0, transform: 'translateY(100%)' },
  { opacity: 1, transform: 'translateY(0)' },
  '400ms',
  '250ms',
)

// ─── Diagonal Fades ────────────────────────────────────────────────
// Fade + diagonal movement (both X and Y axes).

/** Fade in from below-right corner (16px diagonal). */
export const fadeUpLeft: Preset = s(
  { opacity: 0, transform: 'translate(16px, 16px)' },
  { opacity: 1, transform: 'translate(0, 0)' },
)

/** Fade in from below-left corner (16px diagonal). */
export const fadeUpRight: Preset = s(
  { opacity: 0, transform: 'translate(-16px, 16px)' },
  { opacity: 1, transform: 'translate(0, 0)' },
)

/** Fade in from above-right corner (16px diagonal). */
export const fadeDownLeft: Preset = s(
  { opacity: 0, transform: 'translate(16px, -16px)' },
  { opacity: 1, transform: 'translate(0, 0)' },
)

/** Fade in from above-left corner (16px diagonal). */
export const fadeDownRight: Preset = s(
  { opacity: 0, transform: 'translate(-16px, -16px)' },
  { opacity: 1, transform: 'translate(0, 0)' },
)

// ─── Zoom Out Directional ──────────────────────────────────────────
// Zoom down from 2x + directional movement.

/** Zoom from 2x while sliding upward. */
export const zoomOutUp: Preset = s(
  { opacity: 0, transform: 'scale(2) translateY(48px)' },
  { opacity: 1, transform: 'scale(1) translateY(0)' },
  '400ms',
  '250ms',
)

/** Zoom from 2x while sliding downward. */
export const zoomOutDown: Preset = s(
  { opacity: 0, transform: 'scale(2) translateY(-48px)' },
  { opacity: 1, transform: 'scale(1) translateY(0)' },
  '400ms',
  '250ms',
)

/** Zoom from 2x while sliding left. */
export const zoomOutLeft: Preset = s(
  { opacity: 0, transform: 'scale(2) translateX(48px)' },
  { opacity: 1, transform: 'scale(1) translateX(0)' },
  '400ms',
  '250ms',
)

/** Zoom from 2x while sliding right. */
export const zoomOutRight: Preset = s(
  { opacity: 0, transform: 'scale(2) translateX(-48px)' },
  { opacity: 1, transform: 'scale(1) translateX(0)' },
  '400ms',
  '250ms',
)

// ─── Blur Horizontal ───────────────────────────────────────────────

/** Blur in from 8px + slide from right (16px). */
export const blurInLeft: Preset = s(
  { opacity: 0, filter: 'blur(8px)', transform: 'translateX(16px)' },
  { opacity: 1, filter: 'blur(0px)', transform: 'translateX(0)' },
)

/** Blur in from 8px + slide from left (16px). */
export const blurInRight: Preset = s(
  { opacity: 0, filter: 'blur(8px)', transform: 'translateX(-16px)' },
  { opacity: 1, filter: 'blur(0px)', transform: 'translateX(0)' },
)

// ─── Skew Y ────────────────────────────────────────────────────────

/** Skew in from -5deg on Y axis with fade. */
export const skewInY: Preset = s(
  { opacity: 0, transform: 'skewY(-5deg)' },
  { opacity: 1, transform: 'skewY(0)' },
)

/** Skew in from +5deg on Y axis with fade. */
export const skewInYReverse: Preset = s(
  { opacity: 0, transform: 'skewY(5deg)' },
  { opacity: 1, transform: 'skewY(0)' },
)

// ─── Back ──────────────────────────────────────────────────────────
// Scale from 70% + large directional movement. Depth "receding/approaching" effect.

/** Approach from below at reduced scale. */
export const backInUp: Preset = s(
  { opacity: 0, transform: 'scale(0.7) translateY(80px)' },
  { opacity: 1, transform: 'scale(1) translateY(0)' },
  '400ms',
  '250ms',
)

/** Approach from above at reduced scale. */
export const backInDown: Preset = s(
  { opacity: 0, transform: 'scale(0.7) translateY(-80px)' },
  { opacity: 1, transform: 'scale(1) translateY(0)' },
  '400ms',
  '250ms',
)

/** Approach from the right at reduced scale. */
export const backInLeft: Preset = s(
  { opacity: 0, transform: 'scale(0.7) translateX(80px)' },
  { opacity: 1, transform: 'scale(1) translateX(0)' },
  '400ms',
  '250ms',
)

/** Approach from the left at reduced scale. */
export const backInRight: Preset = s(
  { opacity: 0, transform: 'scale(0.7) translateX(-80px)' },
  { opacity: 1, transform: 'scale(1) translateX(0)' },
  '400ms',
  '250ms',
)

// ─── Light Speed ───────────────────────────────────────────────────
// Dramatic skew + horizontal movement for a speed-streak effect.

/** Speed streak entrance from the right. */
export const lightSpeedInLeft: Preset = s(
  { opacity: 0, transform: 'translateX(100%) skewX(-30deg)' },
  { opacity: 1, transform: 'translateX(0) skewX(0)' },
  '400ms',
  '250ms',
)

/** Speed streak entrance from the left. */
export const lightSpeedInRight: Preset = s(
  { opacity: 0, transform: 'translateX(-100%) skewX(30deg)' },
  { opacity: 1, transform: 'translateX(0) skewX(0)' },
  '400ms',
  '250ms',
)

// ─── Roll ──────────────────────────────────────────────────────────
// Rotation + horizontal translation — like a wheel rolling into view.

/** Roll in from the left (rotate + translateX). */
export const rollInLeft: Preset = s(
  { opacity: 0, transform: 'translateX(-100%) rotate(-120deg)' },
  { opacity: 1, transform: 'translateX(0) rotate(0)' },
  '500ms',
  '300ms',
)

/** Roll in from the right (rotate + translateX). */
export const rollInRight: Preset = s(
  { opacity: 0, transform: 'translateX(100%) rotate(120deg)' },
  { opacity: 1, transform: 'translateX(0) rotate(0)' },
  '500ms',
  '300ms',
)

// ─── Clip Path Shapes ──────────────────────────────────────────────
// Non-rectangular clip-path reveal effects.

/** Reveal with expanding circle from center. */
export const clipCircle: Preset = s(
  { clipPath: 'circle(0% at 50% 50%)' },
  { clipPath: 'circle(75% at 50% 50%)' },
  '500ms',
  '300ms',
)

/** Reveal from center outward (rectangular inset). */
export const clipCenter: Preset = s(
  { clipPath: 'inset(50% 50% 50% 50%)' },
  { clipPath: 'inset(0 0 0 0)' },
  '400ms',
  '250ms',
)

/** Reveal with expanding diamond shape from center. */
export const clipDiamond: Preset = s(
  { clipPath: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)' },
  { clipPath: 'polygon(50% -10%, 110% 50%, 50% 110%, -10% 50%)' },
  '500ms',
  '300ms',
)

/** Reveal expanding from top-left corner. */
export const clipCorner: Preset = s(
  { clipPath: 'polygon(0 0, 0 0, 0 0, 0 0)' },
  { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' },
  '500ms',
  '300ms',
)

// ─── Puff ──────────────────────────────────────────────────────────
// Scale + blur for a materialization effect.

/** Condense from a large blurry cloud into focus. */
export const puffIn: Preset = s(
  { opacity: 0, filter: 'blur(4px)', transform: 'scale(1.5)' },
  { opacity: 1, filter: 'blur(0px)', transform: 'scale(1)' },
  '400ms',
  '250ms',
)

/** Form from a tiny blurry spark into focus. */
export const puffOut: Preset = s(
  { opacity: 0, filter: 'blur(4px)', transform: 'scale(0.5)' },
  { opacity: 1, filter: 'blur(0px)', transform: 'scale(1)' },
  '400ms',
  '250ms',
)

// ─── Swing ─────────────────────────────────────────────────────────
// Edge-origin 3D rotation — like a panel swinging open from a hinge.

/** Swing in from top edge (hinged at top). */
export const swingInTop: Preset = s(
  {
    opacity: 0,
    transform: 'perspective(600px) rotateX(-90deg)',
    transformOrigin: 'top',
  },
  {
    opacity: 1,
    transform: 'perspective(600px) rotateX(0)',
    transformOrigin: 'top',
  },
  '500ms',
  '300ms',
)

/** Swing in from bottom edge (hinged at bottom). */
export const swingInBottom: Preset = s(
  {
    opacity: 0,
    transform: 'perspective(600px) rotateX(90deg)',
    transformOrigin: 'bottom',
  },
  {
    opacity: 1,
    transform: 'perspective(600px) rotateX(0)',
    transformOrigin: 'bottom',
  },
  '500ms',
  '300ms',
)

/** Swing in from left edge (hinged at left). */
export const swingInLeft: Preset = s(
  {
    opacity: 0,
    transform: 'perspective(600px) rotateY(90deg)',
    transformOrigin: 'left',
  },
  {
    opacity: 1,
    transform: 'perspective(600px) rotateY(0)',
    transformOrigin: 'left',
  },
  '500ms',
  '300ms',
)

/** Swing in from right edge (hinged at right). */
export const swingInRight: Preset = s(
  {
    opacity: 0,
    transform: 'perspective(600px) rotateY(-90deg)',
    transformOrigin: 'right',
  },
  {
    opacity: 1,
    transform: 'perspective(600px) rotateY(0)',
    transformOrigin: 'right',
  },
  '500ms',
  '300ms',
)

// ─── Slit ──────────────────────────────────────────────────────────
// 3D narrow slit that opens to reveal the element.

/** Reveal through a horizontal slit (rotateY + scaleX). */
export const slitHorizontal: Preset = s(
  {
    opacity: 0,
    transform: 'perspective(600px) rotateY(90deg) scaleX(0)',
  },
  {
    opacity: 1,
    transform: 'perspective(600px) rotateY(0) scaleX(1)',
  },
  '500ms',
  '300ms',
)

/** Reveal through a vertical slit (rotateX + scaleY). */
export const slitVertical: Preset = s(
  {
    opacity: 0,
    transform: 'perspective(600px) rotateX(90deg) scaleY(0)',
  },
  {
    opacity: 1,
    transform: 'perspective(600px) rotateX(0) scaleY(1)',
  },
  '500ms',
  '300ms',
)

// ─── Swirl ─────────────────────────────────────────────────────────
// Rotation + scale for a vortex/whirlpool effect.

/** Swirl in clockwise — 1.5 rotations + scale from 0. */
export const swirlIn: Preset = s(
  { opacity: 0, transform: 'rotate(-540deg) scale(0)' },
  { opacity: 1, transform: 'rotate(0) scale(1)' },
  '600ms',
  '400ms',
)

/** Swirl in counter-clockwise. */
export const swirlInReverse: Preset = s(
  { opacity: 0, transform: 'rotate(540deg) scale(0)' },
  { opacity: 1, transform: 'rotate(0) scale(1)' },
  '600ms',
  '400ms',
)

// ─── Flip Diagonal ─────────────────────────────────────────────────

/** Flip along the diagonal axis (top-left to bottom-right). */
export const flipDiagonal: Preset = s(
  {
    opacity: 0,
    transform: 'perspective(600px) rotate3d(1, 1, 0, 90deg)',
  },
  {
    opacity: 1,
    transform: 'perspective(600px) rotate3d(1, 1, 0, 0deg)',
  },
  '500ms',
  '300ms',
)

/** Flip along the anti-diagonal (top-right to bottom-left). */
export const flipDiagonalReverse: Preset = s(
  {
    opacity: 0,
    transform: 'perspective(600px) rotate3d(1, -1, 0, 90deg)',
  },
  {
    opacity: 1,
    transform: 'perspective(600px) rotate3d(1, -1, 0, 0deg)',
  },
  '500ms',
  '300ms',
)

// ─── Tilt ──────────────────────────────────────────────────────────
// Perspective tilt + directional translation.

/** Tilt in from below with upward movement. */
export const tiltInUp: Preset = s(
  {
    opacity: 0,
    transform: 'perspective(600px) rotateX(15deg) translateY(24px)',
  },
  {
    opacity: 1,
    transform: 'perspective(600px) rotateX(0) translateY(0)',
  },
)

/** Tilt in from above with downward movement. */
export const tiltInDown: Preset = s(
  {
    opacity: 0,
    transform: 'perspective(600px) rotateX(-15deg) translateY(-24px)',
  },
  {
    opacity: 1,
    transform: 'perspective(600px) rotateX(0) translateY(0)',
  },
)

/** Tilt in from the right with leftward movement. */
export const tiltInLeft: Preset = s(
  {
    opacity: 0,
    transform: 'perspective(600px) rotateY(-15deg) translateX(24px)',
  },
  {
    opacity: 1,
    transform: 'perspective(600px) rotateY(0) translateX(0)',
  },
)

/** Tilt in from the left with rightward movement. */
export const tiltInRight: Preset = s(
  {
    opacity: 0,
    transform: 'perspective(600px) rotateY(15deg) translateX(-24px)',
  },
  {
    opacity: 1,
    transform: 'perspective(600px) rotateY(0) translateX(0)',
  },
)

// ─── Fly ───────────────────────────────────────────────────────────
// Full-viewport-distance translations — element flies in from completely off-screen.

/** Fly in from below the viewport. */
export const flyInUp: Preset = s(
  { opacity: 0, transform: 'translateY(100vh)' },
  { opacity: 1, transform: 'translateY(0)' },
  '500ms',
  '300ms',
)

/** Fly in from above the viewport. */
export const flyInDown: Preset = s(
  { opacity: 0, transform: 'translateY(-100vh)' },
  { opacity: 1, transform: 'translateY(0)' },
  '500ms',
  '300ms',
)

/** Fly in from the right of the viewport. */
export const flyInLeft: Preset = s(
  { opacity: 0, transform: 'translateX(100vw)' },
  { opacity: 1, transform: 'translateX(0)' },
  '500ms',
  '300ms',
)

/** Fly in from the left of the viewport. */
export const flyInRight: Preset = s(
  { opacity: 0, transform: 'translateX(-100vw)' },
  { opacity: 1, transform: 'translateX(0)' },
  '500ms',
  '300ms',
)

// ─── Pop ───────────────────────────────────────────────────────────

/** Pop in with snappy spring overshoot from tiny. */
export const popIn: Preset = s(
  { opacity: 0, transform: 'scale(0.3)' },
  { opacity: 1, transform: 'scale(1)' },
  '300ms',
  '200ms',
  SPRING,
)

// ─── Squish ────────────────────────────────────────────────────────
// Non-uniform scale for a cartoon squash-and-stretch feel.

/** Squish horizontally — starts wide and narrow, snaps to normal. */
export const squishX: Preset = s(
  { opacity: 0, transform: 'scaleX(1.4) scaleY(0.6)' },
  { opacity: 1, transform: 'scaleX(1) scaleY(1)' },
  '400ms',
  '250ms',
  SPRING,
)

/** Squish vertically — starts tall and thin, snaps to normal. */
export const squishY: Preset = s(
  { opacity: 0, transform: 'scaleX(0.6) scaleY(1.4)' },
  { opacity: 1, transform: 'scaleX(1) scaleY(1)' },
  '400ms',
  '250ms',
  SPRING,
)

// ─── Rubber ────────────────────────────────────────────────────────

/** Elastic rubber-band scale entrance with heavy overshoot. */
export const rubberIn: Preset = s(
  { opacity: 0, transform: 'scale(0.6)' },
  { opacity: 1, transform: 'scale(1)' },
  '500ms',
  '250ms',
  'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
)

// ─── Scale Rotate ──────────────────────────────────────────────────

/** Spin in while scaling from nothing — dramatic entrance. */
export const scaleRotateIn: Preset = s(
  { opacity: 0, transform: 'scale(0) rotate(-180deg)' },
  { opacity: 1, transform: 'scale(1) rotate(0)' },
  '500ms',
  '300ms',
)

// ─── Newspaper ─────────────────────────────────────────────────────

/** Newspaper spin — dramatic zoom from 0 with double rotation. */
export const newspaperIn: Preset = s(
  { opacity: 0, transform: 'scale(0) rotate(-720deg)' },
  { opacity: 1, transform: 'scale(1) rotate(0)' },
  '700ms',
  '400ms',
)

// ─── Float ─────────────────────────────────────────────────────────
// Gentle movement with subtle scale — luxurious, Apple-like entrance.

/** Gentle float up with subtle scale and premium easing. */
export const floatUp: Preset = s(
  { opacity: 0, transform: 'translateY(32px) scale(0.97)' },
  { opacity: 1, transform: 'translateY(0) scale(1)' },
  '500ms',
  '300ms',
  'cubic-bezier(0.23, 1, 0.32, 1)',
)

/** Gentle float down with subtle scale and premium easing. */
export const floatDown: Preset = s(
  { opacity: 0, transform: 'translateY(-32px) scale(0.97)' },
  { opacity: 1, transform: 'translateY(0) scale(1)' },
  '500ms',
  '300ms',
  'cubic-bezier(0.23, 1, 0.32, 1)',
)

/** Gentle float from right with subtle scale. */
export const floatLeft: Preset = s(
  { opacity: 0, transform: 'translateX(32px) scale(0.97)' },
  { opacity: 1, transform: 'translateX(0) scale(1)' },
  '500ms',
  '300ms',
  'cubic-bezier(0.23, 1, 0.32, 1)',
)

/** Gentle float from left with subtle scale. */
export const floatRight: Preset = s(
  { opacity: 0, transform: 'translateX(-32px) scale(0.97)' },
  { opacity: 1, transform: 'translateX(0) scale(1)' },
  '500ms',
  '300ms',
  'cubic-bezier(0.23, 1, 0.32, 1)',
)

// ─── Push ──────────────────────────────────────────────────────────
// Directional slide + scale reduction for a "pushed in from the side" feel.

/** Push in from the left with slight scale. */
export const pushInLeft: Preset = s(
  { opacity: 0, transform: 'translateX(-48px) scale(0.9)' },
  { opacity: 1, transform: 'translateX(0) scale(1)' },
)

/** Push in from the right with slight scale. */
export const pushInRight: Preset = s(
  { opacity: 0, transform: 'translateX(48px) scale(0.9)' },
  { opacity: 1, transform: 'translateX(0) scale(1)' },
)

// ─── All Presets Map ────────────────────────────────────────────────

export const presets = {
  // Fades
  fade,
  fadeUp,
  fadeDown,
  fadeLeft,
  fadeRight,
  fadeUpBig,
  fadeDownBig,
  fadeLeftBig,
  fadeRightBig,
  fadeScale,
  fadeUpLeft,
  fadeUpRight,
  fadeDownLeft,
  fadeDownRight,
  // Slides
  slideUp,
  slideDown,
  slideLeft,
  slideRight,
  slideUpBig,
  slideDownBig,
  slideLeftBig,
  slideRightBig,
  // Scales
  scaleIn,
  scaleOut,
  scaleUp,
  scaleDown,
  scaleInUp,
  scaleInDown,
  scaleInLeft,
  scaleInRight,
  // Zooms
  zoomIn,
  zoomOut,
  zoomInUp,
  zoomInDown,
  zoomInLeft,
  zoomInRight,
  zoomOutUp,
  zoomOutDown,
  zoomOutLeft,
  zoomOutRight,
  // Flips
  flipX,
  flipY,
  flipXReverse,
  flipYReverse,
  flipDiagonal,
  flipDiagonalReverse,
  // Rotations
  rotateIn,
  rotateInReverse,
  rotateInUp,
  rotateInDown,
  spinIn,
  spinInReverse,
  scaleRotateIn,
  newspaperIn,
  // Bounce / Spring
  bounceIn,
  bounceInUp,
  bounceInDown,
  bounceInLeft,
  bounceInRight,
  springIn,
  popIn,
  rubberIn,
  squishX,
  squishY,
  // Blur
  blurIn,
  blurInUp,
  blurInDown,
  blurInLeft,
  blurInRight,
  blurScale,
  // Puff
  puffIn,
  puffOut,
  // Clip Path
  clipTop,
  clipBottom,
  clipLeft,
  clipRight,
  clipCircle,
  clipCenter,
  clipDiamond,
  clipCorner,
  // Perspective
  perspectiveUp,
  perspectiveDown,
  perspectiveLeft,
  perspectiveRight,
  // Tilt
  tiltInUp,
  tiltInDown,
  tiltInLeft,
  tiltInRight,
  // Expand
  expandX,
  expandY,
  // Skew
  skewIn,
  skewInReverse,
  skewInY,
  skewInYReverse,
  // Drop / Rise
  drop,
  rise,
  // Back
  backInUp,
  backInDown,
  backInLeft,
  backInRight,
  // Light Speed
  lightSpeedInLeft,
  lightSpeedInRight,
  // Roll
  rollInLeft,
  rollInRight,
  // Swing
  swingInTop,
  swingInBottom,
  swingInLeft,
  swingInRight,
  // Slit
  slitHorizontal,
  slitVertical,
  // Swirl
  swirlIn,
  swirlInReverse,
  // Fly
  flyInUp,
  flyInDown,
  flyInLeft,
  flyInRight,
  // Float
  floatUp,
  floatDown,
  floatLeft,
  floatRight,
  // Push
  pushInLeft,
  pushInRight,
} as const
