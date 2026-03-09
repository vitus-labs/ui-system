import { act, renderHook } from '@testing-library/react'
import useAnimationEnd from '../useAnimationEnd'

const createMockRef = () => {
  const el = document.createElement('div')
  return { current: el }
}

describe('useAnimationEnd', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('calls onEnd when transitionend fires on the element', () => {
    const onEnd = vi.fn()
    const ref = createMockRef()

    renderHook(() => useAnimationEnd({ ref, onEnd, active: true }))

    act(() => {
      const event = new Event('transitionend', { bubbles: true })
      Object.defineProperty(event, 'target', { value: ref.current })
      ref.current.dispatchEvent(event)
    })

    expect(onEnd).toHaveBeenCalledTimes(1)
  })

  it('calls onEnd when animationend fires on the element', () => {
    const onEnd = vi.fn()
    const ref = createMockRef()

    renderHook(() => useAnimationEnd({ ref, onEnd, active: true }))

    act(() => {
      const event = new Event('animationend', { bubbles: true })
      Object.defineProperty(event, 'target', { value: ref.current })
      ref.current.dispatchEvent(event)
    })

    expect(onEnd).toHaveBeenCalledTimes(1)
  })

  it('ignores bubbled events from children', () => {
    const onEnd = vi.fn()
    const ref = createMockRef()
    const child = document.createElement('span')
    ref.current.appendChild(child)

    renderHook(() => useAnimationEnd({ ref, onEnd, active: true }))

    act(() => {
      const event = new Event('transitionend', { bubbles: true })
      child.dispatchEvent(event)
    })

    expect(onEnd).not.toHaveBeenCalled()
  })

  it('fires timeout fallback when no event fires', () => {
    const onEnd = vi.fn()
    const ref = createMockRef()

    renderHook(() =>
      useAnimationEnd({ ref, onEnd, active: true, timeout: 1000 }),
    )

    expect(onEnd).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(onEnd).toHaveBeenCalledTimes(1)
  })

  it('uses default timeout of 5000ms', () => {
    const onEnd = vi.fn()
    const ref = createMockRef()

    renderHook(() => useAnimationEnd({ ref, onEnd, active: true }))

    act(() => {
      vi.advanceTimersByTime(4999)
    })
    expect(onEnd).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(onEnd).toHaveBeenCalledTimes(1)
  })

  it('only fires onEnd once even if multiple events fire', () => {
    const onEnd = vi.fn()
    const ref = createMockRef()

    renderHook(() => useAnimationEnd({ ref, onEnd, active: true }))

    act(() => {
      const event1 = new Event('transitionend', { bubbles: true })
      Object.defineProperty(event1, 'target', { value: ref.current })
      ref.current.dispatchEvent(event1)

      const event2 = new Event('animationend', { bubbles: true })
      Object.defineProperty(event2, 'target', { value: ref.current })
      ref.current.dispatchEvent(event2)
    })

    expect(onEnd).toHaveBeenCalledTimes(1)
  })

  it('does not fire when active is false', () => {
    const onEnd = vi.fn()
    const ref = createMockRef()

    renderHook(() =>
      useAnimationEnd({ ref, onEnd, active: false, timeout: 100 }),
    )

    act(() => {
      vi.advanceTimersByTime(200)
    })

    expect(onEnd).not.toHaveBeenCalled()
  })

  it('cleans up listeners on unmount', () => {
    const onEnd = vi.fn()
    const ref = createMockRef()

    const { unmount } = renderHook(() =>
      useAnimationEnd({ ref, onEnd, active: true, timeout: 1000 }),
    )

    unmount()

    act(() => {
      const event = new Event('transitionend', { bubbles: true })
      Object.defineProperty(event, 'target', { value: ref.current })
      ref.current.dispatchEvent(event)
      vi.advanceTimersByTime(1000)
    })

    expect(onEnd).not.toHaveBeenCalled()
  })

  it('resets when active changes from false to true', () => {
    const onEnd = vi.fn()
    const ref = createMockRef()

    const { rerender } = renderHook(
      ({ active }) => useAnimationEnd({ ref, onEnd, active, timeout: 1000 }),
      { initialProps: { active: false } },
    )

    rerender({ active: true })

    act(() => {
      const event = new Event('transitionend', { bubbles: true })
      Object.defineProperty(event, 'target', { value: ref.current })
      ref.current.dispatchEvent(event)
    })

    expect(onEnd).toHaveBeenCalledTimes(1)
  })

  it('always calls the latest onEnd callback', () => {
    let value: number = 0
    const ref = createMockRef()

    const { rerender } = renderHook(
      ({ cb }) => useAnimationEnd({ ref, onEnd: cb, active: true }),
      {
        initialProps: {
          cb: () => {
            value = 1
          },
        },
      },
    )

    rerender({
      cb: () => {
        value = 2
      },
    })

    act(() => {
      const event = new Event('transitionend', { bubbles: true })
      Object.defineProperty(event, 'target', { value: ref.current })
      ref.current.dispatchEvent(event)
    })

    expect(value).toBe(2)
  })

  it('does not fire when active=true but ref.current is null', () => {
    const onEnd = vi.fn()
    const ref = { current: null }

    renderHook(() =>
      useAnimationEnd({
        ref: ref as React.RefObject<HTMLElement | null>,
        onEnd,
        active: true,
        timeout: 100,
      }),
    )

    // No timer should be set when ref is null
    act(() => {
      vi.advanceTimersByTime(200)
    })

    expect(onEnd).not.toHaveBeenCalled()
  })

  it('does not call onEnd twice when transitionend fires and then timeout fires', () => {
    const onEnd = vi.fn()
    const ref = createMockRef()

    renderHook(() =>
      useAnimationEnd({ ref, onEnd, active: true, timeout: 1000 }),
    )

    // First: transitionend fires — calls done()
    act(() => {
      const event = new Event('transitionend', { bubbles: true })
      Object.defineProperty(event, 'target', { value: ref.current })
      ref.current.dispatchEvent(event)
    })

    expect(onEnd).toHaveBeenCalledTimes(1)

    // Second: timeout fires — should be no-op because calledRef.current is true
    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(onEnd).toHaveBeenCalledTimes(1)
  })

  it('does not call onEnd twice when timeout fires and then transitionend fires', () => {
    const onEnd = vi.fn()
    const ref = createMockRef()

    renderHook(() =>
      useAnimationEnd({ ref, onEnd, active: true, timeout: 500 }),
    )

    // First: timeout fires — calls done()
    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(onEnd).toHaveBeenCalledTimes(1)

    // Second: transitionend fires — should be no-op via calledRef guard
    act(() => {
      const event = new Event('transitionend', { bubbles: true })
      Object.defineProperty(event, 'target', { value: ref.current })
      ref.current.dispatchEvent(event)
    })

    expect(onEnd).toHaveBeenCalledTimes(1)
  })

  it('resets calledRef when active transitions from true to false', () => {
    const onEnd = vi.fn()
    const ref = createMockRef()

    const { rerender } = renderHook(
      ({ active }) => useAnimationEnd({ ref, onEnd, active, timeout: 1000 }),
      { initialProps: { active: true } },
    )

    // Fire to set calledRef = true
    act(() => {
      const event = new Event('transitionend', { bubbles: true })
      Object.defineProperty(event, 'target', { value: ref.current })
      ref.current.dispatchEvent(event)
    })

    expect(onEnd).toHaveBeenCalledTimes(1)

    // Deactivate — resets calledRef
    rerender({ active: false })

    // Re-activate
    rerender({ active: true })

    // Should be able to fire again
    act(() => {
      const event = new Event('transitionend', { bubbles: true })
      Object.defineProperty(event, 'target', { value: ref.current })
      ref.current.dispatchEvent(event)
    })

    expect(onEnd).toHaveBeenCalledTimes(2)
  })
})
