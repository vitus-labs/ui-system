import { act, renderHook } from '@testing-library/react'
import useTimeout from '../useTimeout'

describe('useTimeout', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('calls callback after delay', () => {
    const fn = vi.fn()
    renderHook(() => useTimeout(fn, 200))

    vi.advanceTimersByTime(200)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('does not call callback when delay is null', () => {
    const fn = vi.fn()
    renderHook(() => useTimeout(fn, null))

    vi.advanceTimersByTime(1000)
    expect(fn).not.toHaveBeenCalled()
  })

  it('clears on unmount', () => {
    const fn = vi.fn()
    const { unmount } = renderHook(() => useTimeout(fn, 200))

    unmount()
    vi.advanceTimersByTime(500)
    expect(fn).not.toHaveBeenCalled()
  })

  it('clear() prevents the callback', () => {
    const fn = vi.fn()
    const { result } = renderHook(() => useTimeout(fn, 200))

    act(() => result.current.clear())
    vi.advanceTimersByTime(500)
    expect(fn).not.toHaveBeenCalled()
  })

  it('reset() restarts the timer', () => {
    const fn = vi.fn()
    const { result } = renderHook(() => useTimeout(fn, 200))

    vi.advanceTimersByTime(150)
    act(() => result.current.reset())

    vi.advanceTimersByTime(150)
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(50)
    expect(fn).toHaveBeenCalledTimes(1)
  })
})
