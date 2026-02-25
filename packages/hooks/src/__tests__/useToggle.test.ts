import { act, renderHook } from '@testing-library/react'
import useToggle from '../useToggle'

describe('useToggle', () => {
  it('defaults to false', () => {
    const { result } = renderHook(() => useToggle())
    expect(result.current[0]).toBe(false)
  })

  it('respects initial value', () => {
    const { result } = renderHook(() => useToggle(true))
    expect(result.current[0]).toBe(true)
  })

  it('toggle flips the value', () => {
    const { result } = renderHook(() => useToggle())
    act(() => result.current[1]())
    expect(result.current[0]).toBe(true)
    act(() => result.current[1]())
    expect(result.current[0]).toBe(false)
  })

  it('setTrue and setFalse work', () => {
    const { result } = renderHook(() => useToggle())
    act(() => result.current[2]()) // setTrue
    expect(result.current[0]).toBe(true)
    act(() => result.current[3]()) // setFalse
    expect(result.current[0]).toBe(false)
  })

  it('callbacks are stable across rerenders', () => {
    const { result, rerender } = renderHook(() => useToggle())
    const [, toggle1, setTrue1, setFalse1] = result.current
    rerender()
    expect(result.current[1]).toBe(toggle1)
    expect(result.current[2]).toBe(setTrue1)
    expect(result.current[3]).toBe(setFalse1)
  })
})
