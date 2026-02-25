import { act, renderHook } from '@testing-library/react'
import useFocus from '../useFocus'

describe('useFocus', () => {
  it('defaults to false', () => {
    const { result } = renderHook(() => useFocus())
    expect(result.current.focused).toBe(false)
  })

  it('respects initial value', () => {
    const { result } = renderHook(() => useFocus(true))
    expect(result.current.focused).toBe(true)
  })

  it('sets focused on onFocus and clears on onBlur', () => {
    const { result } = renderHook(() => useFocus())
    act(() => result.current.onFocus())
    expect(result.current.focused).toBe(true)
    act(() => result.current.onBlur())
    expect(result.current.focused).toBe(false)
  })

  it('callbacks are stable across rerenders', () => {
    const { result, rerender } = renderHook(() => useFocus())
    const { onFocus, onBlur } = result.current
    rerender()
    expect(result.current.onFocus).toBe(onFocus)
    expect(result.current.onBlur).toBe(onBlur)
  })
})
