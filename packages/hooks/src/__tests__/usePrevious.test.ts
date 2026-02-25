import { renderHook } from '@testing-library/react'
import usePrevious from '../usePrevious'

describe('usePrevious', () => {
  it('returns undefined on first render', () => {
    const { result } = renderHook(() => usePrevious(1))
    expect(result.current).toBeUndefined()
  })

  it('returns the previous value after rerender', () => {
    const { result, rerender } = renderHook(({ val }) => usePrevious(val), {
      initialProps: { val: 'a' },
    })
    expect(result.current).toBeUndefined()

    rerender({ val: 'b' })
    expect(result.current).toBe('a')

    rerender({ val: 'c' })
    expect(result.current).toBe('b')
  })
})
