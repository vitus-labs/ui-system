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

  it('falls back to the timeout (and warns) when ref.current is null', () => {
    const onEnd = vi.fn()
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const ref = { current: null }

    renderHook(() =>
      useAnimationEnd({
        ref: ref as React.RefObject<HTMLElement | null>,
        onEnd,
        active: true,
        timeout: 100,
      }),
    )

    act(() => {
      vi.advanceTimersByTime(99)
    })
    expect(onEnd).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(2)
    })
    expect(onEnd).toHaveBeenCalledTimes(1)
    expect(warn).toHaveBeenCalledTimes(1)
    warn.mockRestore()
  })

  it('restarts the fallback timer when the phase changes while active', () => {
    const onEnd = vi.fn()
    const ref = createMockRef()

    const { rerender } = renderHook(
      ({ phase }) =>
        useAnimationEnd({ ref, onEnd, active: true, timeout: 100, phase }),
      { initialProps: { phase: 'entering' } },
    )

    act(() => {
      vi.advanceTimersByTime(60)
    })
    rerender({ phase: 'leaving' })
    act(() => {
      vi.advanceTimersByTime(60)
    })
    // 120ms since mount, but only 60ms since the phase change
    expect(onEnd).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(50)
    })
    expect(onEnd).toHaveBeenCalledTimes(1)
  })

  describe('computed styles', () => {
    const mockStyle = (el: HTMLElement, values: Record<string, string>) => {
      vi.spyOn(window, 'getComputedStyle').mockImplementation(
        (target) =>
          (target === el ? values : {}) as unknown as CSSStyleDeclaration,
      )
    }
    afterEach(() => vi.restoreAllMocks())

    const fire = (el: HTMLElement, propertyName: string) => {
      const event = new Event('transitionend', { bubbles: true })
      Object.defineProperty(event, 'target', { value: el })
      Object.defineProperty(event, 'propertyName', { value: propertyName })
      el.dispatchEvent(event)
    }

    it('waits while another transition is still running', () => {
      const onEnd = vi.fn()
      const ref = createMockRef()
      let running = [{ transitionProperty: 'transform' }]
      ;(ref.current as { getAnimations?: unknown }).getAnimations = () =>
        running

      renderHook(() => useAnimationEnd({ ref, onEnd, active: true }))

      act(() => fire(ref.current, 'opacity'))
      expect(onEnd).not.toHaveBeenCalled()

      running = []
      act(() => fire(ref.current, 'transform'))
      expect(onEnd).toHaveBeenCalledTimes(1)
    })

    it('completes on a following frame when durations are explicitly 0s', () => {
      const onEnd = vi.fn()
      const ref = createMockRef()
      mockStyle(ref.current, {
        transitionProperty: 'all',
        transitionDuration: '0s',
        transitionDelay: '0s',
        animationDuration: '0s',
        animationDelay: '0s',
      })
      const rafs: FrameRequestCallback[] = []
      vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
        rafs.push(cb)
        return rafs.length
      })

      renderHook(() => useAnimationEnd({ ref, onEnd, active: true }))

      for (let i = 0; i < 3; i++) act(() => rafs.shift()?.(0))
      expect(onEnd).toHaveBeenCalledTimes(1)
    })

    it('does not complete early when a transition has a non-zero duration', () => {
      const onEnd = vi.fn()
      const ref = createMockRef()
      mockStyle(ref.current, {
        transitionProperty: 'all',
        transitionDuration: '0.3s',
        transitionDelay: '0s',
        animationDuration: '0s',
        animationDelay: '0s',
      })
      const rafs: FrameRequestCallback[] = []
      vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
        rafs.push(cb)
        return rafs.length
      })

      renderHook(() => useAnimationEnd({ ref, onEnd, active: true }))

      for (let i = 0; i < 3; i++) act(() => rafs.shift()?.(0))
      expect(onEnd).not.toHaveBeenCalled()
    })
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
