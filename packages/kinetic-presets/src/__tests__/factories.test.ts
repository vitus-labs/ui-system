import {
  createBlur,
  createFade,
  createRotate,
  createScale,
  createSlide,
} from '../factories'

describe('createFade', () => {
  it('creates pure opacity fade by default', () => {
    const p = createFade()
    expect(p.enterStyle).toEqual({ opacity: 0 })
    expect(p.enterToStyle).toEqual({ opacity: 1 })
    expect(p.enterTransition).toBe('all 300ms ease-out')
    expect(p.leaveTransition).toBe('all 200ms ease-in')
  })

  it('creates directional fade', () => {
    const p = createFade({ direction: 'up', distance: 24 })
    expect(p.enterStyle).toEqual({
      opacity: 0,
      transform: 'translateY(24px)',
    })
    expect(p.enterToStyle).toEqual({
      opacity: 1,
      transform: 'translateY(0)',
    })
  })

  it('creates fade with all directions', () => {
    expect(createFade({ direction: 'up' }).enterStyle).toHaveProperty(
      'transform',
      'translateY(16px)',
    )
    expect(createFade({ direction: 'down' }).enterStyle).toHaveProperty(
      'transform',
      'translateY(-16px)',
    )
    expect(createFade({ direction: 'left' }).enterStyle).toHaveProperty(
      'transform',
      'translateX(16px)',
    )
    expect(createFade({ direction: 'right' }).enterStyle).toHaveProperty(
      'transform',
      'translateX(-16px)',
    )
  })

  it('custom duration and easing', () => {
    const p = createFade({
      duration: 500,
      leaveDuration: 300,
      easing: 'linear',
    })
    expect(p.enterTransition).toBe('all 500ms linear')
    expect(p.leaveTransition).toBe('all 300ms ease-in')
  })

  it('custom leave easing', () => {
    const p = createFade({ leaveEasing: 'linear' })
    expect(p.leaveTransition).toBe('all 200ms linear')
  })
})

describe('createSlide', () => {
  it('defaults to up direction with 16px', () => {
    const p = createSlide()
    expect(p.enterStyle).toEqual({
      opacity: 0,
      transform: 'translateY(16px)',
    })
  })

  it('custom direction and distance', () => {
    const p = createSlide({ direction: 'right', distance: 32 })
    expect(p.enterStyle).toEqual({
      opacity: 0,
      transform: 'translateX(-32px)',
    })
    expect(p.enterToStyle).toEqual({
      opacity: 1,
      transform: 'translateX(0)',
    })
  })

  it('is symmetric', () => {
    const p = createSlide({ direction: 'left', distance: 20 })
    expect(p.enterStyle).toEqual(p.leaveToStyle)
    expect(p.enterToStyle).toEqual(p.leaveStyle)
  })
})

describe('createScale', () => {
  it('defaults to scale(0.9)', () => {
    const p = createScale()
    expect(p.enterStyle).toEqual({
      opacity: 0,
      transform: 'scale(0.9)',
    })
    expect(p.enterToStyle).toEqual({
      opacity: 1,
      transform: 'scale(1)',
    })
  })

  it('custom from value', () => {
    const p = createScale({ from: 0.5 })
    expect(p.enterStyle).toEqual({
      opacity: 0,
      transform: 'scale(0.5)',
    })
  })

  it('custom spring easing', () => {
    const p = createScale({
      from: 0.8,
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    })
    expect(p.enterTransition).toBe(
      'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
    )
  })
})

describe('createRotate', () => {
  it('defaults to 15 degrees', () => {
    const p = createRotate()
    expect(p.enterStyle).toEqual({
      opacity: 0,
      transform: 'rotate(-15deg)',
    })
    expect(p.leaveToStyle).toEqual({
      opacity: 0,
      transform: 'rotate(15deg)',
    })
  })

  it('custom degrees', () => {
    const p = createRotate({ degrees: 45 })
    expect(p.enterStyle).toEqual({
      opacity: 0,
      transform: 'rotate(-45deg)',
    })
    expect(p.leaveToStyle).toEqual({
      opacity: 0,
      transform: 'rotate(45deg)',
    })
  })

  it('negative degrees for counter-clockwise', () => {
    const p = createRotate({ degrees: -90 })
    expect(p.enterStyle).toEqual({
      opacity: 0,
      transform: 'rotate(90deg)',
    })
  })
})

describe('createBlur', () => {
  it('defaults to 8px blur', () => {
    const p = createBlur()
    expect(p.enterStyle).toEqual({
      opacity: 0,
      filter: 'blur(8px)',
    })
    expect(p.enterToStyle).toEqual({
      opacity: 1,
      filter: 'blur(0px)',
    })
  })

  it('custom blur amount', () => {
    const p = createBlur({ amount: 16 })
    expect(p.enterStyle).toEqual({
      opacity: 0,
      filter: 'blur(16px)',
    })
  })

  it('blur with scale', () => {
    const p = createBlur({ amount: 8, scale: 0.9 })
    expect(p.enterStyle).toEqual({
      opacity: 0,
      filter: 'blur(8px)',
      transform: 'scale(0.9)',
    })
    expect(p.enterToStyle).toEqual({
      opacity: 1,
      filter: 'blur(0px)',
      transform: 'scale(1)',
    })
  })

  it('custom duration', () => {
    const p = createBlur({ duration: 500, leaveDuration: 250 })
    expect(p.enterTransition).toBe('all 500ms ease-out')
    expect(p.leaveTransition).toBe('all 250ms ease-in')
  })
})
