import { clipDiamond } from '../presets'
import { withEasing } from '../utils'

// Even-odd point-in-polygon test over a `polygon(x% y%, ...)` string.
const inside = (poly: string, x: number, y: number) => {
  const pts = [...poly.matchAll(/(-?[\d.]+)% (-?[\d.]+)%/g)].map((m) => [
    Number(m[1]) / 100,
    Number(m[2]) / 100,
  ]) as [number, number][]
  let r = false
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i] as [number, number]
    const [xj, yj] = pts[j] as [number, number]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) r = !r
  }
  return r
}

describe('clipDiamond', () => {
  it('end state uncovers the whole box, corners included', () => {
    const end = clipDiamond.enterToStyle?.clipPath as string
    for (const [x, y] of [
      [0.01, 0.01],
      [0.99, 0.01],
      [0.99, 0.99],
      [0.01, 0.99],
      [0.2, 0.15],
    ] as const)
      expect(inside(end, x, y)).toBe(true)
    expect(clipDiamond.leaveStyle?.clipPath).toBe(end)
  })

  it('start state is a symmetric point at the centre', () => {
    expect(clipDiamond.enterStyle?.clipPath).toBe(
      'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)',
    )
  })
})

describe('withEasing — multi-property transitions', () => {
  it('rewrites the easing of every segment', () => {
    const preset = {
      enterTransition: 'opacity 300ms ease-out, transform 300ms ease-out',
      leaveTransition:
        'opacity 200ms cubic-bezier(0.4, 0, 1, 1), transform 200ms ease-in',
    }
    const r = withEasing(preset, 'linear', 'ease')
    expect(r.enterTransition).toBe(
      'opacity 300ms linear, transform 300ms linear',
    )
    expect(r.leaveTransition).toBe('opacity 200ms ease, transform 200ms ease')
  })

  it('leaves segments without an easing untouched', () => {
    expect(
      withEasing({ enterTransition: 'opacity 1s, transform 1s ease' }, 'linear')
        .enterTransition,
    ).toBe('opacity 1s, transform 1s linear')
  })
})
