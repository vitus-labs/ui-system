import { act, renderHook } from '@testing-library/react'
import useIntersection from '../useIntersection'

class MockIntersectionObserver {
  callback: IntersectionObserverCallback
  static instances: MockIntersectionObserver[] = []

  constructor(
    callback: IntersectionObserverCallback,
    _options?: IntersectionObserverInit,
  ) {
    this.callback = callback
    MockIntersectionObserver.instances.push(this)
  }

  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()
  takeRecords = vi.fn(() => [])

  trigger(entry: Partial<IntersectionObserverEntry>) {
    this.callback([entry as IntersectionObserverEntry], this as any)
  }
}

beforeAll(() => {
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
})

beforeEach(() => {
  MockIntersectionObserver.instances = []
})

afterAll(() => {
  vi.unstubAllGlobals()
})

describe('useIntersection', () => {
  it('returns null initially', () => {
    const { result } = renderHook(() => useIntersection())
    expect(result.current[1]).toBeNull()
  })

  it('observes when ref is attached', () => {
    const { result } = renderHook(() => useIntersection())

    const el = document.createElement('div')
    act(() => result.current[0](el))

    const observer = MockIntersectionObserver.instances.at(-1)!
    expect(observer.observe).toHaveBeenCalledWith(el)
  })

  it('updates entry on intersection callback', () => {
    const { result } = renderHook(() => useIntersection())

    const el = document.createElement('div')
    act(() => result.current[0](el))

    const observer = MockIntersectionObserver.instances.at(-1)!
    const mockEntry = { isIntersecting: true, intersectionRatio: 1 }
    act(() => observer.trigger(mockEntry))

    expect(result.current[1]).toMatchObject(mockEntry)
  })

  it('sets entry to null when IntersectionObserver fires with empty entries', () => {
    const { result } = renderHook(() => useIntersection())

    const el = document.createElement('div')
    act(() => result.current[0](el))

    const observer = MockIntersectionObserver.instances.at(-1)!

    // First, trigger with a real entry so entry is non-null
    const mockEntry = { isIntersecting: true, intersectionRatio: 1 }
    act(() => observer.trigger(mockEntry))
    expect(result.current[1]).toMatchObject(mockEntry)

    // Now trigger with empty entries array — entries[0] is undefined, ?? null kicks in
    act(() => {
      observer.callback([], observer as any)
    })
    expect(result.current[1]).toBeNull()
  })

  it('disconnects when ref is set to null', () => {
    const { result } = renderHook(() => useIntersection())

    const el = document.createElement('div')
    act(() => result.current[0](el))

    const observer = MockIntersectionObserver.instances.at(-1)!
    act(() => result.current[0](null))

    expect(observer.disconnect).toHaveBeenCalled()
  })
})
