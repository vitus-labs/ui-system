import { describe, expect, it } from 'vitest'
import {
  addClasses,
  mergeClassNames,
  mergeStyles,
  nextFrame,
  removeClasses,
} from '~/utils'

describe('mergeClassNames', () => {
  it('merges two class strings', () => {
    expect(mergeClassNames('a', 'b')).toBe('a b')
  })

  it('returns existing when additional is undefined', () => {
    expect(mergeClassNames('a', undefined)).toBe('a')
  })

  it('returns additional when existing is undefined', () => {
    expect(mergeClassNames(undefined, 'b')).toBe('b')
  })

  it('returns undefined when both are undefined', () => {
    expect(mergeClassNames(undefined, undefined)).toBeUndefined()
  })

  it('returns undefined when both are empty strings', () => {
    expect(mergeClassNames('', '')).toBeUndefined()
  })

  it('filters out empty strings', () => {
    expect(mergeClassNames('a', '')).toBe('a')
  })
})

describe('mergeStyles', () => {
  it('merges two style objects with b taking precedence', () => {
    const a = { color: 'red', fontSize: '12px' } as React.CSSProperties
    const b = { color: 'blue' } as React.CSSProperties
    expect(mergeStyles(a, b)).toEqual({ color: 'blue', fontSize: '12px' })
  })

  it('returns undefined when both are undefined', () => {
    expect(mergeStyles(undefined, undefined)).toBeUndefined()
  })

  it('returns b when a is undefined', () => {
    const b = { color: 'blue' } as React.CSSProperties
    expect(mergeStyles(undefined, b)).toBe(b)
  })

  it('returns a when b is undefined', () => {
    const a = { color: 'red' } as React.CSSProperties
    expect(mergeStyles(a, undefined)).toBe(a)
  })
})

describe('addClasses', () => {
  it('adds space-separated classes to an element', () => {
    const el = document.createElement('div')
    addClasses(el, 'foo bar')
    expect(el.classList.contains('foo')).toBe(true)
    expect(el.classList.contains('bar')).toBe(true)
  })

  it('does nothing when classes is undefined', () => {
    const el = document.createElement('div')
    addClasses(el, undefined)
    expect(el.classList.length).toBe(0)
  })

  it('does nothing when classes is empty string', () => {
    const el = document.createElement('div')
    addClasses(el, '')
    expect(el.classList.length).toBe(0)
  })

  it('does nothing when classes is whitespace-only', () => {
    const el = document.createElement('div')
    addClasses(el, '   ')
    expect(el.classList.length).toBe(0)
  })
})

describe('removeClasses', () => {
  it('removes space-separated classes from an element', () => {
    const el = document.createElement('div')
    el.classList.add('foo', 'bar', 'baz')
    removeClasses(el, 'foo bar')
    expect(el.classList.contains('foo')).toBe(false)
    expect(el.classList.contains('bar')).toBe(false)
    expect(el.classList.contains('baz')).toBe(true)
  })

  it('does nothing when classes is undefined', () => {
    const el = document.createElement('div')
    el.classList.add('foo')
    removeClasses(el, undefined)
    expect(el.classList.contains('foo')).toBe(true)
  })

  it('does nothing when classes is empty string', () => {
    const el = document.createElement('div')
    el.classList.add('foo')
    removeClasses(el, '')
    expect(el.classList.contains('foo')).toBe(true)
  })

  it('does nothing when classes is whitespace-only', () => {
    const el = document.createElement('div')
    el.classList.add('foo')
    removeClasses(el, '   ')
    expect(el.classList.contains('foo')).toBe(true)
  })
})

describe('nextFrame', () => {
  it('calls callback after double rAF', () => {
    const callbacks: (() => void)[] = []
    const originalRaf = globalThis.requestAnimationFrame
    globalThis.requestAnimationFrame = ((cb: () => void) => {
      callbacks.push(cb)
      return callbacks.length
    }) as typeof requestAnimationFrame

    const fn = vi.fn()
    nextFrame(fn)

    // First rAF queued
    expect(callbacks.length).toBe(1)
    expect(fn).not.toHaveBeenCalled()

    // Execute first rAF — queues second
    callbacks[0]!()
    expect(callbacks.length).toBe(2)
    expect(fn).not.toHaveBeenCalled()

    // Execute second rAF — callback fires
    callbacks[1]!()
    expect(fn).toHaveBeenCalledTimes(1)

    globalThis.requestAnimationFrame = originalRaf
  })

  // Regression: the prior `nextFrame` returned only the OUTER rAF id, so
  // callers that wanted to abort could only cancel the outer frame — the
  // inner rAF fired against potentially-stale or detached elements on rapid
  // toggles. `nextFrame` now returns a canceller that aborts BOTH frames.
  it('returns a canceller that suppresses the callback after the outer frame fires', () => {
    const callbacks: (() => void)[] = []
    const originalRaf = globalThis.requestAnimationFrame
    globalThis.requestAnimationFrame = ((cb: () => void) => {
      callbacks.push(cb)
      return callbacks.length
    }) as typeof requestAnimationFrame

    const fn = vi.fn()
    const cancel = nextFrame(fn)

    // Outer rAF fires — queues the inner rAF
    callbacks[0]!()
    expect(callbacks.length).toBe(2)

    // Cancel BEFORE the inner rAF runs
    cancel()
    // Inner rAF executes — must be a no-op due to the cancelled flag
    callbacks[1]!()
    expect(fn).not.toHaveBeenCalled()

    globalThis.requestAnimationFrame = originalRaf
  })

  it('cancels the outer rAF when cancelled before either frame fires', () => {
    const cancelledIds: number[] = []
    const originalRaf = globalThis.requestAnimationFrame
    const originalCancel = globalThis.cancelAnimationFrame
    let nextId = 0
    globalThis.requestAnimationFrame = ((_cb: () => void) => {
      nextId++
      return nextId
    }) as typeof requestAnimationFrame
    globalThis.cancelAnimationFrame = ((id: number) => {
      cancelledIds.push(id)
    }) as typeof cancelAnimationFrame

    const cancel = nextFrame(vi.fn())
    cancel()
    expect(cancelledIds).toContain(1)

    globalThis.requestAnimationFrame = originalRaf
    globalThis.cancelAnimationFrame = originalCancel
  })
})
