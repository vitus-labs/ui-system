import { renderHook, act } from '@testing-library/react'
import useHover from '../useHover'

describe('useHover', () => {
  it('initializes with hover=false by default', () => {
    const { result } = renderHook(() => useHover())
    expect(result.current.hover).toBe(false)
  })

  it('accepts custom initial value', () => {
    const { result } = renderHook(() => useHover(true))
    expect(result.current.hover).toBe(true)
  })

  it('sets hover to true on mouseEnter', () => {
    const { result } = renderHook(() => useHover())

    act(() => {
      result.current.onMouseEnter()
    })

    expect(result.current.hover).toBe(true)
  })

  it('sets hover to false on mouseLeave', () => {
    const { result } = renderHook(() => useHover(true))

    act(() => {
      result.current.onMouseLeave()
    })

    expect(result.current.hover).toBe(false)
  })

  it('returns stable callback references', () => {
    const { result, rerender } = renderHook(() => useHover())
    const firstEnter = result.current.onMouseEnter
    const firstLeave = result.current.onMouseLeave

    rerender()

    expect(result.current.onMouseEnter).toBe(firstEnter)
    expect(result.current.onMouseLeave).toBe(firstLeave)
  })

  it('toggles hover state correctly', () => {
    const { result } = renderHook(() => useHover())

    act(() => result.current.onMouseEnter())
    expect(result.current.hover).toBe(true)

    act(() => result.current.onMouseLeave())
    expect(result.current.hover).toBe(false)

    act(() => result.current.onMouseEnter())
    expect(result.current.hover).toBe(true)
  })
})
