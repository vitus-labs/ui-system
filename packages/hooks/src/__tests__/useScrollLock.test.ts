import { renderHook } from '@testing-library/react'
import useScrollLock from '../useScrollLock'

describe('useScrollLock', () => {
  afterEach(() => {
    document.body.style.overflow = ''
  })

  it('sets overflow hidden when enabled', () => {
    renderHook(() => useScrollLock(true))
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('does not set overflow when disabled', () => {
    renderHook(() => useScrollLock(false))
    expect(document.body.style.overflow).toBe('')
  })

  it('restores original overflow on unmount', () => {
    document.body.style.overflow = 'auto'
    const { unmount } = renderHook(() => useScrollLock(true))
    expect(document.body.style.overflow).toBe('hidden')

    unmount()
    expect(document.body.style.overflow).toBe('auto')
  })

  it('restores overflow when toggled off', () => {
    const { rerender } = renderHook(({ on }) => useScrollLock(on), {
      initialProps: { on: true },
    })
    expect(document.body.style.overflow).toBe('hidden')

    rerender({ on: false })
    expect(document.body.style.overflow).toBe('')
  })

  it('handles concurrent scroll locks (reference counting)', () => {
    const { unmount: unmount1 } = renderHook(() => useScrollLock(true))
    expect(document.body.style.overflow).toBe('hidden')

    const { unmount: unmount2 } = renderHook(() => useScrollLock(true))
    expect(document.body.style.overflow).toBe('hidden')

    // Unmounting first lock should NOT restore overflow (still 1 lock active)
    unmount1()
    expect(document.body.style.overflow).toBe('hidden')

    // Unmounting second lock should restore overflow
    unmount2()
    expect(document.body.style.overflow).toBe('')
  })

  it('preserves original overflow across concurrent locks', () => {
    document.body.style.overflow = 'scroll'

    const { unmount: unmount1 } = renderHook(() => useScrollLock(true))
    expect(document.body.style.overflow).toBe('hidden')

    const { unmount: unmount2 } = renderHook(() => useScrollLock(true))
    expect(document.body.style.overflow).toBe('hidden')

    unmount1()
    expect(document.body.style.overflow).toBe('hidden')

    // Last unlock restores original
    unmount2()
    expect(document.body.style.overflow).toBe('scroll')
  })

  it('restores empty string when originalOverflow is undefined', () => {
    // When body has no explicit overflow set
    document.body.style.overflow = ''
    const { unmount } = renderHook(() => useScrollLock(true))
    expect(document.body.style.overflow).toBe('hidden')

    unmount()
    expect(document.body.style.overflow).toBe('')
  })

  it('restores empty string via nullish coalescing when originalOverflow is nullish', () => {
    // Temporarily make document.body.style.overflow return undefined
    // so that originalOverflow is stored as undefined, triggering the ?? '' fallback
    const descriptor =
      Object.getOwnPropertyDescriptor(
        CSSStyleDeclaration.prototype,
        'overflow',
      ) ?? Object.getOwnPropertyDescriptor(document.body.style, 'overflow')

    Object.defineProperty(document.body.style, 'overflow', {
      get: () => undefined,
      set: descriptor?.set
        ? descriptor.set.bind(document.body.style)
        : (_v: string) => {
            // noop fallback
          },
      configurable: true,
    })

    const { unmount } = renderHook(() => useScrollLock(true))

    // Restore the real property so subsequent set calls work
    if (descriptor) {
      Object.defineProperty(document.body.style, 'overflow', descriptor)
    } else {
      // jsdom 29+: just delete the override to restore default behavior
      delete (document.body.style as any).overflow
    }

    unmount()
    // originalOverflow was undefined, so ?? '' should produce ''
    expect(document.body.style.overflow).toBe('')
  })
})
