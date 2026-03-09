import { act, renderHook } from '@testing-library/react'
import useElementSize from '../useElementSize'

// Mock ResizeObserver
class MockResizeObserver {
  callback: ResizeObserverCallback
  static instances: MockResizeObserver[] = []

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback
    MockResizeObserver.instances.push(this)
  }

  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()

  trigger(width: number, height: number) {
    this.callback(
      [{ contentRect: { width, height } } as ResizeObserverEntry],
      this as any,
    )
  }
}

beforeAll(() => {
  vi.stubGlobal('ResizeObserver', MockResizeObserver)
})

beforeEach(() => {
  MockResizeObserver.instances = []
})

afterAll(() => {
  vi.unstubAllGlobals()
})

describe('useElementSize', () => {
  it('returns initial size of 0x0', () => {
    const { result } = renderHook(() => useElementSize())
    expect(result.current[1]).toEqual({ width: 0, height: 0 })
  })

  it('reads size when ref is attached', () => {
    const { result } = renderHook(() => useElementSize())

    const el = document.createElement('div')
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
      width: 200,
      height: 100,
    } as DOMRect)

    act(() => result.current[0](el))

    expect(result.current[1]).toEqual({ width: 200, height: 100 })
  })

  it('updates on ResizeObserver callback', () => {
    const { result } = renderHook(() => useElementSize())

    const el = document.createElement('div')
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
      width: 100,
      height: 50,
    } as DOMRect)

    act(() => result.current[0](el))

    const observer = MockResizeObserver.instances.at(-1)!
    act(() => observer.trigger(300, 150))

    expect(result.current[1]).toEqual({ width: 300, height: 150 })
  })

  it('bails out when ResizeObserver fires with same dimensions', () => {
    const { result } = renderHook(() => useElementSize())

    const el = document.createElement('div')
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
      width: 100,
      height: 50,
    } as DOMRect)

    act(() => result.current[0](el))
    expect(result.current[1]).toEqual({ width: 100, height: 50 })

    const sizeBefore = result.current[1]
    const observer = MockResizeObserver.instances.at(-1)!

    // Fire with the same dimensions — should bail out (return prev)
    act(() => observer.trigger(100, 50))
    expect(result.current[1]).toBe(sizeBefore) // same reference = no re-render
  })

  it('bails out on initial read when dimensions match current state', () => {
    const { result } = renderHook(() => useElementSize())

    // First element sets size to 200x100
    const el1 = document.createElement('div')
    vi.spyOn(el1, 'getBoundingClientRect').mockReturnValue({
      width: 200,
      height: 100,
    } as DOMRect)
    act(() => result.current[0](el1))
    expect(result.current[1]).toEqual({ width: 200, height: 100 })

    const sizeBefore = result.current[1]

    // Second element has the same dimensions — bail-out in the initial read
    const el2 = document.createElement('div')
    vi.spyOn(el2, 'getBoundingClientRect').mockReturnValue({
      width: 200,
      height: 100,
    } as DOMRect)
    act(() => result.current[0](el2))
    expect(result.current[1]).toBe(sizeBefore) // same reference
  })

  it('does nothing when ResizeObserver fires with empty entries', () => {
    const { result } = renderHook(() => useElementSize())

    const el = document.createElement('div')
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
      width: 200,
      height: 100,
    } as DOMRect)

    act(() => result.current[0](el))
    expect(result.current[1]).toEqual({ width: 200, height: 100 })

    const sizeBefore = result.current[1]
    const observer = MockResizeObserver.instances.at(-1)!

    // Fire with empty entries array — the !entry guard should bail out
    act(() => {
      observer.callback([] as any, observer as any)
    })
    expect(result.current[1]).toBe(sizeBefore) // same reference, no update
  })

  it('disconnects when ref is set to null', () => {
    const { result } = renderHook(() => useElementSize())

    const el = document.createElement('div')
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
      width: 100,
      height: 50,
    } as DOMRect)

    act(() => result.current[0](el))
    const observer = MockResizeObserver.instances.at(-1)!

    act(() => result.current[0](null))
    expect(observer.disconnect).toHaveBeenCalled()
  })
})
