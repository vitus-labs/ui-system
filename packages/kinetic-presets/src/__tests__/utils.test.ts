import { fade, fadeUp, scaleIn, slideUp } from '../presets'
import type { Preset } from '../types'
import { compose, reverse, withDelay, withDuration, withEasing } from '../utils'

describe('compose', () => {
  it('merges enterStyle objects', () => {
    const a: Preset = { enterStyle: { opacity: 0 } }
    const b: Preset = { enterStyle: { transform: 'translateY(16px)' } }
    const result = compose(a, b)
    expect(result.enterStyle).toEqual({
      opacity: 0,
      transform: 'translateY(16px)',
    })
  })

  it('later preset overrides same style keys', () => {
    const a: Preset = { enterStyle: { opacity: 0, transform: 'scale(0.9)' } }
    const b: Preset = { enterStyle: { transform: 'translateY(16px)' } }
    const result = compose(a, b)
    expect(result.enterStyle).toEqual({
      opacity: 0,
      transform: 'translateY(16px)',
    })
  })

  it('last preset transition wins', () => {
    const result = compose(fade, slideUp)
    expect(result.enterTransition).toBe(slideUp.enterTransition)
    expect(result.leaveTransition).toBe(slideUp.leaveTransition)
  })

  it('merges all style fields', () => {
    const result = compose(fade, scaleIn)
    expect(result.enterStyle).toBeDefined()
    expect(result.enterToStyle).toBeDefined()
    expect(result.leaveStyle).toBeDefined()
    expect(result.leaveToStyle).toBeDefined()
  })

  it('concatenates class names with space', () => {
    const a: Preset = { enter: 'class-a', enterFrom: 'from-a' }
    const b: Preset = { enter: 'class-b', enterFrom: 'from-b' }
    const result = compose(a, b)
    expect(result.enter).toBe('class-a class-b')
    expect(result.enterFrom).toBe('from-a from-b')
  })

  it('handles single preset', () => {
    const result = compose(fade)
    expect(result.enterStyle).toEqual(fade.enterStyle)
    expect(result.enterTransition).toBe(fade.enterTransition)
  })

  it('handles empty presets', () => {
    const result = compose({}, fade)
    expect(result.enterStyle).toEqual(fade.enterStyle)
  })

  it('composes three presets', () => {
    const a: Preset = { enterStyle: { opacity: 0 } }
    const b: Preset = { enterStyle: { color: 'red' } }
    const c: Preset = { enterStyle: { background: 'blue' } }
    const result = compose(a, b, c)
    expect(result.enterStyle).toEqual({
      opacity: 0,
      color: 'red',
      background: 'blue',
    })
  })
})

describe('withDuration', () => {
  it('overrides both enter and leave duration', () => {
    const result = withDuration(fade, 500)
    expect(result.enterTransition).toContain('500ms')
    expect(result.leaveTransition).toContain('500ms')
  })

  it('overrides enter and leave separately', () => {
    const result = withDuration(fade, 500, 200)
    expect(result.enterTransition).toContain('500ms')
    expect(result.leaveTransition).toContain('200ms')
  })

  it('preserves easing', () => {
    const result = withDuration(fade, 500)
    expect(result.enterTransition).toContain('ease-out')
  })

  it('preserves style properties', () => {
    const result = withDuration(fadeUp, 500)
    expect(result.enterStyle).toEqual(fadeUp.enterStyle)
    expect(result.enterToStyle).toEqual(fadeUp.enterToStyle)
  })
})

describe('withEasing', () => {
  it('overrides easing for both enter and leave', () => {
    const result = withEasing(fade, 'linear')
    expect(result.enterTransition).toContain('linear')
    expect(result.leaveTransition).toContain('linear')
  })

  it('overrides enter and leave separately', () => {
    const result = withEasing(fade, 'ease-out', 'ease-in-out')
    expect(result.leaveTransition).toContain('ease-in-out')
  })

  it('handles cubic-bezier easing', () => {
    const spring = 'cubic-bezier(0.34, 1.56, 0.64, 1)'
    const result = withEasing(fadeUp, spring)
    expect(result.enterTransition).toContain(spring)
  })

  it('preserves duration', () => {
    const result = withEasing(fade, 'linear')
    expect(result.enterTransition).toContain('300ms')
  })
})

describe('withDelay', () => {
  it('adds delay to both transitions', () => {
    const result = withDelay(fade, 100)
    expect(result.enterTransition).toContain('100ms')
    expect(result.leaveTransition).toContain('100ms')
  })

  it('adds different delays for enter and leave', () => {
    const result = withDelay(fade, 200, 0)
    expect(result.enterTransition).toContain('200ms')
    expect(result.leaveTransition).toContain('0ms')
  })

  it('preserves original duration', () => {
    const result = withDelay(fade, 100)
    expect(result.enterTransition).toContain('300ms')
  })
})

describe('reverse', () => {
  it('swaps enter and leave styles', () => {
    const reversed = reverse(fadeUp)
    expect(reversed.enterStyle).toEqual(fadeUp.leaveStyle)
    expect(reversed.enterToStyle).toEqual(fadeUp.leaveToStyle)
    expect(reversed.leaveStyle).toEqual(fadeUp.enterStyle)
    expect(reversed.leaveToStyle).toEqual(fadeUp.enterToStyle)
  })

  it('swaps enter and leave transitions', () => {
    const reversed = reverse(fadeUp)
    expect(reversed.enterTransition).toBe(fadeUp.leaveTransition)
    expect(reversed.leaveTransition).toBe(fadeUp.enterTransition)
  })

  it('swaps class-based properties', () => {
    const preset: Preset = {
      enter: 'enter-class',
      enterFrom: 'enter-from',
      enterTo: 'enter-to',
      leave: 'leave-class',
      leaveFrom: 'leave-from',
      leaveTo: 'leave-to',
    }
    const reversed = reverse(preset)
    expect(reversed.enter).toBe('leave-class')
    expect(reversed.enterFrom).toBe('leave-from')
    expect(reversed.enterTo).toBe('leave-to')
    expect(reversed.leave).toBe('enter-class')
    expect(reversed.leaveFrom).toBe('enter-from')
    expect(reversed.leaveTo).toBe('enter-to')
  })

  it('double reverse returns original', () => {
    const original = fadeUp
    const doubleReversed = reverse(reverse(original))
    expect(doubleReversed.enterStyle).toEqual(original.enterStyle)
    expect(doubleReversed.enterToStyle).toEqual(original.enterToStyle)
    expect(doubleReversed.leaveStyle).toEqual(original.leaveStyle)
    expect(doubleReversed.leaveToStyle).toEqual(original.leaveToStyle)
  })
})
