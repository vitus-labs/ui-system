import { renderHook } from '@testing-library/react'
import useBreakpoint from '../useBreakpoint'

describe('useBreakpoint', () => {
  it('returns undefined when no context is available', () => {
    const { result } = renderHook(() => useBreakpoint())
    expect(result.current).toBeUndefined()
  })
})
