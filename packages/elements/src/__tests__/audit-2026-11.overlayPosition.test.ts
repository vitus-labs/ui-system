/**
 * Regression tests for the 2026-11 elements audit (Overlay): center-align
 * overflow fallback picks the side that pulls content back on-screen.
 */
import { computePosition } from '../Overlay/positionMath'

describe('center-align overflow fallback', () => {
  const el = (r: {
    left: number
    top: number
    width: number
    height: number
  }) =>
    ({
      getBoundingClientRect: () => ({
        ...r,
        right: r.left + r.width,
        bottom: r.top + r.height,
        x: r.left,
        y: r.top,
      }),
    }) as any
  const origin = { top: 0, left: 0 }

  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      value: 1000,
      configurable: true,
    })
    Object.defineProperty(window, 'innerHeight', {
      value: 800,
      configurable: true,
    })
  })

  it('alignX=center near the right edge right-aligns to the trigger', () => {
    const trigger = el({ left: 900, top: 100, width: 80, height: 30 })
    const content = el({ left: 0, top: 0, width: 200, height: 100 })
    const r = computePosition(
      'dropdown',
      'bottom',
      'center',
      'bottom',
      0,
      0,
      trigger,
      content,
      origin,
    )
    expect(r.resolvedAlignX).toBe('right')
    // Content's right edge sits on the trigger's right edge (980) → fits.
    // Centering would put it at 840..1040 (overflow); the old fallback put
    // it at 900..1100 (even further off-screen).
    expect(r.pos.left).toBe(780)
  })

  it('alignX=center near the left edge left-aligns to the trigger', () => {
    const trigger = el({ left: 20, top: 100, width: 80, height: 30 })
    const content = el({ left: 0, top: 0, width: 200, height: 100 })
    const r = computePosition(
      'dropdown',
      'bottom',
      'center',
      'bottom',
      0,
      0,
      trigger,
      content,
      origin,
    )
    expect(r.resolvedAlignX).toBe('left')
    expect(r.pos.left).toBe(20)
  })

  it('alignY=center near the bottom edge bottom-aligns to the trigger', () => {
    const trigger = el({ left: 100, top: 740, width: 80, height: 40 })
    const content = el({ left: 0, top: 0, width: 100, height: 200 })
    const r = computePosition(
      'dropdown',
      'right',
      'left',
      'center',
      0,
      0,
      trigger,
      content,
      origin,
    )
    expect(r.resolvedAlignY).toBe('bottom')
    // Content's bottom edge sits on the trigger's bottom edge (780) → fits.
    expect(r.pos.top).toBe(580)
  })

  it('alignY=center near the top edge top-aligns to the trigger', () => {
    const trigger = el({ left: 100, top: 20, width: 80, height: 40 })
    const content = el({ left: 0, top: 0, width: 100, height: 200 })
    const r = computePosition(
      'dropdown',
      'right',
      'left',
      'center',
      0,
      0,
      trigger,
      content,
      origin,
    )
    expect(r.resolvedAlignY).toBe('top')
    expect(r.pos.top).toBe(20)
  })
})
