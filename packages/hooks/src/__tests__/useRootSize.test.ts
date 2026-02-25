import { renderHook } from '@testing-library/react'
import useRootSize from '../useRootSize'

describe('useRootSize', () => {
  it('defaults rootSize to 16', () => {
    const { result } = renderHook(() => useRootSize())
    expect(result.current.rootSize).toBe(16)
  })

  it('pxToRem converts correctly with default rootSize', () => {
    const { result } = renderHook(() => useRootSize())
    expect(result.current.pxToRem(32)).toBe('2rem')
    expect(result.current.pxToRem(8)).toBe('0.5rem')
  })

  it('remToPx converts correctly with default rootSize', () => {
    const { result } = renderHook(() => useRootSize())
    expect(result.current.remToPx(2)).toBe(32)
    expect(result.current.remToPx(0.5)).toBe(8)
  })

  it('returns stable object across rerenders', () => {
    const { result, rerender } = renderHook(() => useRootSize())
    const first = result.current
    rerender()
    expect(result.current).toBe(first)
  })
})
