import { renderHook } from '@testing-library/react'
import useThrottledCallback from '../useThrottledCallback'

describe('useThrottledCallback', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('calls immediately on first invocation (leading)', () => {
    const fn = vi.fn()
    const { result } = renderHook(() => useThrottledCallback(fn, 100))

    result.current('a')
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('a')
  })

  it('throttles subsequent calls', () => {
    const fn = vi.fn()
    const { result } = renderHook(() => useThrottledCallback(fn, 100))

    result.current('a')
    result.current('b')
    result.current('c')

    expect(fn).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn).toHaveBeenLastCalledWith('c')
  })

  it('cancel stops pending trailing call', () => {
    const fn = vi.fn()
    const { result } = renderHook(() => useThrottledCallback(fn, 100))

    result.current('a')
    result.current('b')
    result.current.cancel()

    vi.advanceTimersByTime(200)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('always calls the latest callback', () => {
    let value = 0
    const { result, rerender } = renderHook(
      ({ cb }) => useThrottledCallback(cb, 100),
      { initialProps: { cb: () => (value = 1) } },
    )

    result.current()
    expect(value).toBe(1)

    rerender({ cb: () => (value = 2) })
    vi.advanceTimersByTime(100)
    result.current()
    expect(value).toBe(2)
  })
})
