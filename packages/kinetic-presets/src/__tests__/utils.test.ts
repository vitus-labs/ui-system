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

describe('compose — edge cases', () => {
  it('handles presets with only class-based fields (no styles)', () => {
    const a: Preset = { enter: 'e-a', leave: 'l-a' }
    const b: Preset = { enterFrom: 'ef-b', leaveFrom: 'lf-b' }
    const result = compose(a, b)
    expect(result.enter).toBe('e-a')
    expect(result.enterFrom).toBe('ef-b')
    expect(result.leave).toBe('l-a')
    expect(result.leaveFrom).toBe('lf-b')
  })

  it('does not concatenate when first preset has no class', () => {
    const a: Preset = {}
    const b: Preset = { enter: 'enter-b' }
    const result = compose(a, b)
    expect(result.enter).toBe('enter-b')
  })

  it('preserves first preset class when second has none', () => {
    const a: Preset = { enter: 'enter-a' }
    const b: Preset = {}
    const result = compose(a, b)
    expect(result.enter).toBe('enter-a')
  })

  it('mergeStyle returns a when b is undefined', () => {
    const a: Preset = { enterStyle: { opacity: 0 } }
    const b: Preset = {}
    const result = compose(a, b)
    expect(result.enterStyle).toEqual({ opacity: 0 })
  })

  it('transitions from last preset override earlier', () => {
    const a: Preset = { enterTransition: 'all 100ms ease' }
    const b: Preset = { enterTransition: 'all 500ms linear' }
    const result = compose(a, b)
    expect(result.enterTransition).toBe('all 500ms linear')
  })

  it('does not override transitions when later preset omits them', () => {
    const a: Preset = { enterTransition: 'all 100ms ease' }
    const b: Preset = {}
    const result = compose(a, b)
    expect(result.enterTransition).toBe('all 100ms ease')
  })
})

describe('withDuration — edge cases', () => {
  it('handles preset with empty transition string', () => {
    const preset: Preset = { enterTransition: '', leaveTransition: '' }
    const result = withDuration(preset, 500)
    // replaceDuration on empty string — no match, returns unchanged
    expect(result.enterTransition).toBeDefined()
    expect(result.leaveTransition).toBeDefined()
  })

  it('handles preset with no transition (undefined ?? fallback)', () => {
    const preset: Preset = {}
    const result = withDuration(preset, 500)
    expect(result.enterTransition).toBeDefined()
    expect(result.leaveTransition).toBeDefined()
  })
})

describe('withEasing — undefined transitions', () => {
  it('handles preset with no transition (undefined ?? fallback)', () => {
    const preset: Preset = {}
    const result = withEasing(preset, 'ease-out')
    expect(result.enterTransition).toBeDefined()
    expect(result.leaveTransition).toBeDefined()
  })
})

describe('withEasing — edge cases', () => {
  it('handles original cubic-bezier easing', () => {
    const preset: Preset = {
      enterTransition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
      leaveTransition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    }
    const result = withEasing(preset, 'ease-out')
    expect(result.enterTransition).toContain('ease-out')
    expect(result.enterTransition).not.toContain('cubic-bezier')
  })

  it('uses leaveEasing when provided', () => {
    const result = withEasing(fade, 'ease-out', 'ease-in')
    expect(result.enterTransition).toContain('ease-out')
    expect(result.leaveTransition).toContain('ease-in')
  })
})

describe('withDelay — edge cases', () => {
  it('uses leaveDelayMs when provided', () => {
    const result = withDelay(fade, 100, 50)
    expect(result.enterTransition).toContain('100ms')
    expect(result.leaveTransition).toContain('50ms')
  })

  it('handles preset with no transition string', () => {
    const preset: Preset = {}
    const result = withDelay(preset, 100)
    expect(result.enterTransition).toBeDefined()
    expect(result.leaveTransition).toBeDefined()
  })

  it('inserts delay between duration and easing', () => {
    const preset: Preset = {
      enterTransition: 'opacity 300ms ease-out',
      leaveTransition: 'opacity 200ms ease-in',
    }
    const result = withDelay(preset, 150)
    expect(result.enterTransition).toBe('opacity 300ms 150ms ease-out')
  })
})

describe('withEasing — replaceEasing edge cases', () => {
  it('replaces ease-in-out easing', () => {
    const preset: Preset = {
      enterTransition: 'all 300ms ease-in-out',
      leaveTransition: 'all 200ms ease-in-out',
    }
    const result = withEasing(preset, 'linear')
    expect(result.enterTransition).toBe('all 300ms linear')
  })

  it('replaces linear easing', () => {
    const preset: Preset = {
      enterTransition: 'all 300ms linear',
      leaveTransition: 'all 200ms linear',
    }
    const result = withEasing(preset, 'ease-out')
    expect(result.enterTransition).toBe('all 300ms ease-out')
  })

  it('replaces ease easing', () => {
    const preset: Preset = {
      enterTransition: 'all 300ms ease',
      leaveTransition: 'all 200ms ease',
    }
    const result = withEasing(preset, 'ease-in')
    expect(result.enterTransition).toBe('all 300ms ease-in')
  })
})

describe('reverse', () => {
  const asym: Preset = {
    enterStyle: { transform: 'translateY(16px)' },
    enterToStyle: { transform: 'none' },
    leaveStyle: { transform: 'none' },
    leaveToStyle: { transform: 'translateY(-16px)' },
  }

  it('swaps the motion direction and keeps the visible end state', () => {
    const reversed = reverse(asym)
    expect(reversed.enterStyle).toEqual(asym.leaveToStyle)
    expect(reversed.leaveToStyle).toEqual(asym.enterStyle)
    // visible states are unchanged
    expect(reversed.enterToStyle).toEqual(asym.enterToStyle)
    expect(reversed.leaveStyle).toEqual(asym.leaveStyle)
  })

  it('never ends the enter in the hidden state', () => {
    for (const p of [fade, fadeUp, asym]) {
      expect(reverse(p).enterToStyle).toEqual(p.enterToStyle)
    }
    expect(reverse(fadeUp).enterToStyle).toEqual({
      opacity: 1,
      transform: 'translateY(0)',
    })
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
    expect(reversed.enterFrom).toBe('leave-to')
    expect(reversed.enterTo).toBe('enter-to')
    expect(reversed.leave).toBe('enter-class')
    expect(reversed.leaveFrom).toBe('leave-from')
    expect(reversed.leaveTo).toBe('enter-from')
  })

  it('double reverse returns original', () => {
    const original = fadeUp
    const doubleReversed = reverse(reverse(original))
    expect(doubleReversed.enterStyle).toEqual(original.enterStyle)
    expect(doubleReversed.enterToStyle).toEqual(original.enterToStyle)
    expect(doubleReversed.leaveStyle).toEqual(original.leaveStyle)
    expect(doubleReversed.leaveToStyle).toEqual(original.leaveToStyle)
  })

  it('handles preset with undefined fields', () => {
    const sparse: Preset = { enterStyle: { opacity: 0 } }
    const reversed = reverse(sparse)
    expect(reversed.leaveToStyle).toEqual({ opacity: 0 })
    expect(reversed.enterStyle).toBeUndefined()
    expect(reversed.enterToStyle).toBeUndefined()
    expect(reversed.enterTransition).toBeUndefined()
    expect(reversed.leaveTransition).toBeUndefined()
    expect(reversed.enter).toBeUndefined()
    expect(reversed.leave).toBeUndefined()
  })
})

describe('compose — mergeStyles transitions', () => {
  it('does not override leaveTransition when later preset omits it', () => {
    const a: Preset = {
      leaveTransition: 'all 200ms ease',
    }
    const b: Preset = {}
    const result = compose(a, b)
    expect(result.leaveTransition).toBe('all 200ms ease')
  })

  it('later preset leaveTransition overrides earlier', () => {
    const a: Preset = { leaveTransition: 'all 200ms ease' }
    const b: Preset = { leaveTransition: 'all 500ms linear' }
    const result = compose(a, b)
    expect(result.leaveTransition).toBe('all 500ms linear')
  })

  it('merges leaveStyle and leaveToStyle', () => {
    const a: Preset = {
      leaveStyle: { opacity: 1 },
      leaveToStyle: { opacity: 0 },
    }
    const b: Preset = {
      leaveStyle: { transform: 'scale(1)' },
      leaveToStyle: { transform: 'scale(0)' },
    }
    const result = compose(a, b)
    expect(result.leaveStyle).toEqual({ opacity: 1, transform: 'scale(1)' })
    expect(result.leaveToStyle).toEqual({ opacity: 0, transform: 'scale(0)' })
  })

  it('concatenates all leave class fields', () => {
    const a: Preset = { leave: 'l-a', leaveFrom: 'lf-a', leaveTo: 'lt-a' }
    const b: Preset = { leave: 'l-b', leaveFrom: 'lf-b', leaveTo: 'lt-b' }
    const result = compose(a, b)
    expect(result.leave).toBe('l-a l-b')
    expect(result.leaveFrom).toBe('lf-a lf-b')
    expect(result.leaveTo).toBe('lt-a lt-b')
  })

  it('concatenates enterTo classes', () => {
    const a: Preset = { enterTo: 'et-a' }
    const b: Preset = { enterTo: 'et-b' }
    const result = compose(a, b)
    expect(result.enterTo).toBe('et-a et-b')
  })
})

describe('withDuration / withDelay — multi-segment and decimals', () => {
  const multi: Preset = {
    enterTransition:
      'opacity .3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s ease-out',
    leaveTransition: 'opacity 200ms ease',
  }

  it('replaces the duration in every comma-separated segment', () => {
    expect(withDuration(multi, 100).enterTransition).toBe(
      'opacity 100ms cubic-bezier(0.4, 0, 0.2, 1), transform 100ms ease-out',
    )
  })

  it('does not split on commas inside cubic-bezier()', () => {
    const preset: Preset = {
      enterTransition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    }
    expect(withDuration(preset, 500).enterTransition).toBe(
      'all 500ms cubic-bezier(0.4, 0, 0.2, 1)',
    )
  })

  it('handles decimal durations like .3s', () => {
    const preset: Preset = { enterTransition: 'opacity .3s ease' }
    expect(withDuration(preset, 500).enterTransition).toBe('opacity 500ms ease')
    expect(withDelay(preset, 100).enterTransition).toBe(
      'opacity .3s 100ms ease',
    )
  })

  it('adds the delay to every segment', () => {
    expect(withDelay(multi, 100).enterTransition).toBe(
      'opacity .3s 100ms cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s 100ms ease-out',
    )
  })

  it('replaces an existing delay instead of adding a third time', () => {
    const preset: Preset = { enterTransition: 'all 300ms ease 50ms' }
    expect(withDelay(preset, 100).enterTransition).toBe('all 300ms ease 100ms')
    const inline: Preset = { enterTransition: 'all 300ms 50ms ease' }
    expect(withDelay(inline, 100).enterTransition).toBe('all 300ms 100ms ease')
    // repeated application is stable
    expect(withDelay(withDelay(inline, 100), 100).enterTransition).toBe(
      'all 300ms 100ms ease',
    )
  })
})
