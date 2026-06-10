import { act, renderHook } from '@testing-library/react'
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
      useWindowResize({}, { width: 500, height: 300 }),
    )
    // after mount, it reads actual window dimensions
    expect(result.current.width).toBe(1024)
    expect(result.current.height).toBe(768)
  })

  it('updates on window resize', () => {
    vi.useFakeTimers()

    const { result } = renderHook(() => useWindowResize({ throttleDelay: 100 }))

    act(() => {
      Object.defineProperty(window, 'innerWidth', { value: 800 })
      Object.defineProperty(window, 'innerHeight', { value: 600 })
      window.dispatchEvent(new Event('resize'))
      vi.advanceTimersByTime(200)
    })

    expect(result.current.width).toBe(800)
    expect(result.current.height).toBe(600)

    vi.useRealTimers()
  })

  it('does not re-render when resize resolves to identical dimensions', () => {
    vi.useFakeTimers()
    const onChange = vi.fn()

    let renderCount = 0
    const { result } = renderHook(() => {
      renderCount += 1
      return useWindowResize({ throttleDelay: 100, onChange })
    })

    // mount effect already read 1024x768 and re-rendered
    expect(onChange).toHaveBeenCalledTimes(1)

    // warm-up: React may render once more to confirm the bail-out
    // before eager dispatch comparisons kick in
    act(() => {
      window.dispatchEvent(new Event('resize'))
      vi.advanceTimersByTime(200)
    })
    const rendersAfterSettle = renderCount

    act(() => {
      // dimensions unchanged — leading + trailing throttle calls
      window.dispatchEvent(new Event('resize'))
      vi.advanceTimersByTime(200)
    })

    expect(result.current).toEqual({ width: 1024, height: 768 })
    expect(renderCount).toBe(rendersAfterSettle)
    expect(onChange).toHaveBeenCalledTimes(1)

    vi.useRealTimers()
  })

  it('calls onChange callback', () => {
    vi.useFakeTimers()
    const onChange = vi.fn()

    renderHook(() => useWindowResize({ throttleDelay: 100, onChange }))

    // onChange is called on mount
    expect(onChange).toHaveBeenCalledWith({ width: 1024, height: 768 })

    vi.useRealTimers()
  })

  it('cleans up event listener on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener')

    const { unmount } = renderHook(() => useWindowResize())
    unmount()

    expect(removeSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function),
      false,
    )

    removeSpy.mockRestore()
  })
})
