/**
 * Pure positioning math for the Overlay component. No React, no DOM mutations.
 * Given the current trigger and content rects (plus alignment options), computes
 * the final viewport-relative position and the alignment that was actually used
 * (which may differ from the requested alignment when an edge would be clipped).
 */
import { IS_DEVELOPMENT } from '~/utils'

export type OverlayPosition = Partial<{
  top: number | string
  bottom: number | string
  left: number | string
  right: number | string
}>

export type Align = 'bottom' | 'top' | 'left' | 'right'
export type AlignX = 'left' | 'center' | 'right'
export type AlignY = 'bottom' | 'top' | 'center'

export type OverlayType =
  | 'dropdown'
  | 'tooltip'
  | 'popover'
  | 'modal'
  | 'custom'

export type PositionResult = {
  pos: OverlayPosition
  resolvedAlignX: AlignX
  resolvedAlignY: AlignY
}

export type ComputeResult = {
  pos: OverlayPosition
  resolvedAlignX?: AlignX
  resolvedAlignY?: AlignY
}

const sel = <T>(cond: boolean, a: T, b: T): T => (cond ? a : b)

const devWarn = (msg: string) => {
  if (!IS_DEVELOPMENT) return
  // biome-ignore lint/suspicious/noConsole: dev-mode warning
  console.warn(msg)
}

const calcDropdownVertical = (
  c: DOMRect,
  t: DOMRect,
  align: 'top' | 'bottom',
  alignX: AlignX,
  offsetX: number,
  offsetY: number,
): PositionResult => {
  const pos: OverlayPosition = {}

  const topPos = t.top - offsetY - c.height
  const bottomPos = t.bottom + offsetY
  const leftPos = t.left + offsetX
  const rightPos = t.right - offsetX - c.width

  const fitsTop = topPos >= 0
  const fitsBottom = bottomPos + c.height <= window.innerHeight
  const fitsLeft = leftPos + c.width <= window.innerWidth
  const fitsRight = rightPos >= 0

  const useTop = sel(align === 'top', fitsTop, !fitsBottom)
  pos.top = sel(useTop, topPos, bottomPos)
  const resolvedAlignY: AlignY = sel(useTop, 'top', 'bottom')

  let resolvedAlignX: AlignX = alignX
  if (alignX === 'left') {
    pos.left = sel(fitsLeft, leftPos, rightPos)
    resolvedAlignX = sel(fitsLeft, 'left', 'right')
  } else if (alignX === 'right') {
    pos.left = sel(fitsRight, rightPos, leftPos)
    resolvedAlignX = sel(fitsRight, 'right', 'left')
  } else {
    const center = t.left + (t.right - t.left) / 2 - c.width / 2
    const fitsCL = center >= 0
    const fitsCR = center + c.width <= window.innerWidth

    if (fitsCL && fitsCR) {
      resolvedAlignX = 'center'
      pos.left = center
    } else if (fitsCL) {
      resolvedAlignX = 'left'
      pos.left = leftPos
    } else if (fitsCR) {
      resolvedAlignX = 'right'
      pos.left = rightPos
    }
  }

  return { pos, resolvedAlignX, resolvedAlignY }
}

const calcDropdownHorizontal = (
  c: DOMRect,
  t: DOMRect,
  align: 'left' | 'right',
  alignY: AlignY,
  offsetX: number,
  offsetY: number,
): PositionResult => {
  const pos: OverlayPosition = {}

  const leftPos = t.left - offsetX - c.width
  const rightPos = t.right + offsetX
  const topPos = t.top + offsetY
  const bottomPos = t.bottom - offsetY - c.height

  const fitsLeft = leftPos >= 0
  const fitsRight = rightPos + c.width <= window.innerWidth
  const fitsTop = topPos + c.height <= window.innerHeight
  const fitsBottom = bottomPos >= 0

  const useLeft = sel(align === 'left', fitsLeft, !fitsRight)
  pos.left = sel(useLeft, leftPos, rightPos)
  const resolvedAlignX: AlignX = sel(useLeft, 'left', 'right')

  let resolvedAlignY: AlignY = alignY
  if (alignY === 'top') {
    pos.top = sel(fitsTop, topPos, bottomPos)
    resolvedAlignY = sel(fitsTop, 'top', 'bottom')
  } else if (alignY === 'bottom') {
    pos.top = sel(fitsBottom, bottomPos, topPos)
    resolvedAlignY = sel(fitsBottom, 'bottom', 'top')
  } else {
    const center = t.top + (t.bottom - t.top) / 2 - c.height / 2
    const fitsCT = center >= 0
    const fitsCB = center + c.height <= window.innerHeight

    if (fitsCT && fitsCB) {
      resolvedAlignY = 'center'
      pos.top = center
    } else if (fitsCT) {
      resolvedAlignY = 'top'
      pos.top = topPos
    } else if (fitsCB) {
      resolvedAlignY = 'bottom'
      pos.top = bottomPos
    }
  }

  return { pos, resolvedAlignX, resolvedAlignY }
}

const calcModalPos = (
  c: DOMRect,
  alignX: AlignX,
  alignY: AlignY,
  offsetX: number,
  offsetY: number,
): OverlayPosition => {
  const pos: OverlayPosition = {}

  switch (alignX) {
    case 'right':
      pos.right = offsetX
      break
    case 'left':
      pos.left = offsetX
      break
    case 'center':
      pos.left = window.innerWidth / 2 - c.width / 2
      break
    default:
      pos.right = offsetX
  }

  switch (alignY) {
    case 'top':
      pos.top = offsetY
      break
    case 'center':
      pos.top = window.innerHeight / 2 - c.height / 2
      break
    case 'bottom':
      pos.bottom = offsetY
      break
    default:
      pos.top = offsetY
  }

  return pos
}

const adjustForAncestor = (
  pos: OverlayPosition,
  ancestor: { top: number; left: number },
): OverlayPosition => {
  if (ancestor.top === 0 && ancestor.left === 0) return pos

  const result = { ...pos }
  if (typeof result.top === 'number') result.top -= ancestor.top
  if (typeof result.bottom === 'number') result.bottom += ancestor.top
  if (typeof result.left === 'number') result.left -= ancestor.left
  if (typeof result.right === 'number') result.right += ancestor.left

  return result
}

export const computePosition = (
  type: OverlayType,
  align: Align,
  alignX: AlignX,
  alignY: AlignY,
  offsetX: number,
  offsetY: number,
  triggerEl: HTMLElement | null,
  contentEl: HTMLElement | null,
  ancestorOffset: { top: number; left: number },
): ComputeResult => {
  const isDropdown = ['dropdown', 'tooltip', 'popover'].includes(type)

  if (isDropdown && (!triggerEl || !contentEl)) {
    devWarn(
      `[@vitus-labs/elements] Overlay (${type}): ` +
        `${triggerEl ? 'contentRef' : 'triggerRef'} is not attached. ` +
        'Position cannot be calculated without both refs.',
    )
    return { pos: {} }
  }

  if (isDropdown && triggerEl && contentEl) {
    const c = contentEl.getBoundingClientRect()
    const t = triggerEl.getBoundingClientRect()
    const result =
      align === 'top' || align === 'bottom'
        ? calcDropdownVertical(c, t, align, alignX, offsetX, offsetY)
        : calcDropdownHorizontal(
            c,
            t,
            align as 'left' | 'right',
            alignY,
            offsetX,
            offsetY,
          )

    return {
      pos: adjustForAncestor(result.pos, ancestorOffset),
      resolvedAlignX: result.resolvedAlignX,
      resolvedAlignY: result.resolvedAlignY,
    }
  }

  if (type === 'modal') {
    if (!contentEl) {
      devWarn(
        '[@vitus-labs/elements] Overlay (modal): contentRef is not attached. ' +
          'Modal position cannot be calculated without a content element.',
      )
      return { pos: {} }
    }
    const c = contentEl.getBoundingClientRect()
    return {
      pos: adjustForAncestor(
        calcModalPos(c, alignX, alignY, offsetX, offsetY),
        ancestorOffset,
      ),
    }
  }

  return { pos: {} }
}

export const processVisibilityEvent = (
  e: Event,
  active: boolean,
  openOn: string,
  closeOn: string,
  isTrigger: (e: Event) => boolean,
  isContent: (e: Event) => boolean,
  showContent: () => void,
  hideContent: () => void,
) => {
  // Open on click (hover is handled by dedicated mouseenter/mouseleave)
  if (!active && openOn === 'click' && e.type === 'click' && isTrigger(e)) {
    showContent()
    return
  }

  if (!active) return

  // Close handlers
  if (closeOn === 'hover' && e.type === 'scroll') {
    hideContent()
    return
  }

  if (e.type !== 'click') return

  if (closeOn === 'click') {
    hideContent()
  } else if (closeOn === 'clickOnTrigger' && isTrigger(e)) {
    hideContent()
  } else if (closeOn === 'clickOutsideContent' && !isContent(e)) {
    hideContent()
  }
}
