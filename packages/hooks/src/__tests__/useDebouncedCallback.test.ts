import { renderHook } from '@testing-library/react'
import useDebouncedCallback from '../useDebouncedCallback'

describe('useDebouncedCallback', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('debounces the callback', () => {
    const fn = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(fn, 100))

    result.current('a')
    result.current('b')
    result.current('c')

    expect(fn).not.toHaveBeenCalled()
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('c')
  })

  it('cancel prevents the callback', () => {
    const fn = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(fn, 100))

    result.current('a')
    result.current.cancel()
    vi.advanceTimersByTime(200)

    expect(fn).not.toHaveBeenCalled()
  })

  it('flush invokes immediately', () => {
    const fn = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(fn, 100))

    result.current('x')
    result.current.flush()

    expect(fn).toHaveBeenCalledWith('x')
  })

  it('always calls the latest callback', () => {
    let value = 0
    const { result, rerender } = renderHook(
      ({ cb }) => useDebouncedCallback(cb, 100),
      { initialProps: { cb: () => (value = 1) } },
    )

    result.current()
    rerender({ cb: () => (value = 2) })
    vi.advanceTimersByTime(100)

    expect(value).toBe(2)
  })
})
