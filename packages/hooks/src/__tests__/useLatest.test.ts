import { renderHook } from '@testing-library/react'
import useLatest from '../useLatest'

describe('useLatest', () => {
  it('returns a ref with the current value', () => {
    const { result } = renderHook(() => useLatest(42))
    expect(result.current.current).toBe(42)
  })

  it('updates .current on rerender without creating a new ref', () => {
    const { result, rerender } = renderHook(({ val }) => useLatest(val), {
      initialProps: { val: 'a' },
    })

    const firstRef = result.current
    expect(firstRef.current).toBe('a')

    rerender({ val: 'b' })
    expect(result.current).toBe(firstRef)
    expect(result.current.current).toBe('b')
  })
})
