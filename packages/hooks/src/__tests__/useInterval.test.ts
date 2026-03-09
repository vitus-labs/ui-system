import { renderHook } from '@testing-library/react'
import useInterval from '../useInterval'

describe('useInterval', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('calls callback at the specified interval', () => {
    const fn = vi.fn()
    renderHook(() => useInterval(fn, 100))

    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('does not call callback when delay is null', () => {
    const fn = vi.fn()
    renderHook(() => useInterval(fn, null))

    vi.advanceTimersByTime(1000)
    expect(fn).not.toHaveBeenCalled()
  })

  it('cleans up on unmount', () => {
    const fn = vi.fn()
    const { unmount } = renderHook(() => useInterval(fn, 100))

    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)

    unmount()
    vi.advanceTimersByTime(500)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('pauses when delay changes to null', () => {
    const fn = vi.fn()
    const { rerender } = renderHook(({ delay }) => useInterval(fn, delay), {
      initialProps: { delay: 100 as number | null },
    })

    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)

    rerender({ delay: null })
    vi.advanceTimersByTime(500)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('always calls the latest callback', () => {
    let value: number = 0
    const { rerender } = renderHook(({ cb }) => useInterval(cb, 100), {
      initialProps: {
        cb: () => {
          value = 1
        },
      },
    })

    rerender({
      cb: () => {
        value = 2
      },
    })
    vi.advanceTimersByTime(100)
    expect(value).toBe(2)
  })
})
