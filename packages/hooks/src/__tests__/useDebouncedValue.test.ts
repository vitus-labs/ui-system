import { act, renderHook } from '@testing-library/react'
import useDebouncedValue from '../useDebouncedValue'

describe('useDebouncedValue', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebouncedValue('hello', 300))
    expect(result.current).toBe('hello')
  })

  it('debounces value updates', () => {
    const { result, rerender } = renderHook(
      ({ val }) => useDebouncedValue(val, 300),
      { initialProps: { val: 'a' } },
    )

    rerender({ val: 'b' })
    expect(result.current).toBe('a')

    act(() => vi.advanceTimersByTime(300))
    expect(result.current).toBe('b')
  })

  it('resets timer on rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ val }) => useDebouncedValue(val, 300),
      { initialProps: { val: 'a' } },
    )

    rerender({ val: 'b' })
    act(() => vi.advanceTimersByTime(200))
    rerender({ val: 'c' })
    act(() => vi.advanceTimersByTime(200))

    expect(result.current).toBe('a')

    act(() => vi.advanceTimersByTime(100))
    expect(result.current).toBe('c')
  })
})
