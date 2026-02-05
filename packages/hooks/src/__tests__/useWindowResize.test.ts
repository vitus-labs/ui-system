import { renderHook, act } from '@testing-library/react'
import useWindowResize from '../useWindowResize'

describe('useWindowResize', () => {
  const originalInnerWidth = window.innerWidth
  const originalInnerHeight = window.innerHeight

  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    })
  })

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: originalInnerHeight,
    })
  })

  it('returns initial window dimensions after mount', () => {
    const { result } = renderHook(() => useWindowResize())
    expect(result.current.width).toBe(1024)
    expect(result.current.height).toBe(768)
  })

  it('accepts initial values before mount effect runs', () => {
    const { result } = renderHook(() =>
      useWindowResize({}, { width: 500, height: 300 })
    )
    // after mount, it reads actual window dimensions
    expect(result.current.width).toBe(1024)
    expect(result.current.height).toBe(768)
  })

  it('updates on window resize', () => {
    jest.useFakeTimers()

    const { result } = renderHook(() =>
      useWindowResize({ throttleDelay: 100 })
    )

    act(() => {
      Object.defineProperty(window, 'innerWidth', { value: 800 })
      Object.defineProperty(window, 'innerHeight', { value: 600 })
      window.dispatchEvent(new Event('resize'))
      jest.advanceTimersByTime(200)
    })

    expect(result.current.width).toBe(800)
    expect(result.current.height).toBe(600)

    jest.useRealTimers()
  })

  it('calls onChange callback', () => {
    jest.useFakeTimers()
    const onChange = jest.fn()

    renderHook(() => useWindowResize({ throttleDelay: 100, onChange }))

    // onChange is called on mount
    expect(onChange).toHaveBeenCalledWith({ width: 1024, height: 768 })

    jest.useRealTimers()
  })

  it('cleans up event listener on unmount', () => {
    const removeSpy = jest.spyOn(window, 'removeEventListener')

    const { unmount } = renderHook(() => useWindowResize())
    unmount()

    expect(removeSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function),
      false
    )

    removeSpy.mockRestore()
  })
})
