import { renderHook } from '@testing-library/react'
import useSpacing from '../useSpacing'

describe('useSpacing', () => {
  it('returns spacing function with default base (rootSize/2 = 8)', () => {
    const { result } = renderHook(() => useSpacing())
    expect(result.current(1)).toBe('8px')
    expect(result.current(2)).toBe('16px')
    expect(result.current(0.5)).toBe('4px')
  })

  it('accepts custom base unit', () => {
    const { result } = renderHook(() => useSpacing(4))
    expect(result.current(1)).toBe('4px')
    expect(result.current(3)).toBe('12px')
  })

  it('returns stable function across rerenders', () => {
    const { result, rerender } = renderHook(() => useSpacing())
    const first = result.current
    rerender()
    expect(result.current).toBe(first)
  })
})
