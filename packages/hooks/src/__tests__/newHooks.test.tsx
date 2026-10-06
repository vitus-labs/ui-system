import { act, renderHook } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import useIsClient from '../useIsClient'
import useOnlineStatus from '../useOnlineStatus'
import usePageVisibility from '../usePageVisibility'
import useWindowScroll from '../useWindowScroll'

describe('useIsClient', () => {
  it('is false in server render and true after mount', () => {
    const Probe = () => <span>{String(useIsClient())}</span>
    expect(renderToString(<Probe />)).toContain('false')
    const { result } = renderHook(() => useIsClient())
    expect(result.current).toBe(true)
  })
})

describe('useOnlineStatus', () => {
  afterEach(() => {
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      value: true,
    })
  })

  it('reflects online/offline events', () => {
    const { result } = renderHook(() => useOnlineStatus())
    expect(result.current).toBe(true)
    act(() => {
      Object.defineProperty(navigator, 'onLine', {
        configurable: true,
        value: false,
      })
      window.dispatchEvent(new Event('offline'))
    })
    expect(result.current).toBe(false)
    act(() => {
      Object.defineProperty(navigator, 'onLine', {
        configurable: true,
        value: true,
      })
      window.dispatchEvent(new Event('online'))
    })
    expect(result.current).toBe(true)
  })

  it('assumes online on the server', () => {
    const Probe = () => <span>{String(useOnlineStatus())}</span>
    expect(renderToString(<Probe />)).toContain('true')
  })
})

describe('usePageVisibility', () => {
  afterEach(() => {
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      value: 'visible',
    })
  })

  it('tracks visibilitychange', () => {
    const { result } = renderHook(() => usePageVisibility())
    expect(result.current).toBe(true)
    act(() => {
      Object.defineProperty(document, 'visibilityState', {
        configurable: true,
        value: 'hidden',
      })
      document.dispatchEvent(new Event('visibilitychange'))
    })
    expect(result.current).toBe(false)
  })
})

describe('useWindowScroll', () => {
  it('returns rAF-throttled scroll position', () => {
    const cbs: FrameRequestCallback[] = []
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      cbs.push(cb)
      return cbs.length
    })
    vi.stubGlobal('cancelAnimationFrame', () => {})
    const { result, unmount } = renderHook(() => useWindowScroll())
    expect(result.current).toEqual({ x: 0, y: 0 })

    Object.defineProperty(window, 'scrollX', { configurable: true, value: 5 })
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 120 })
    window.dispatchEvent(new Event('scroll'))
    window.dispatchEvent(new Event('scroll'))
    expect(cbs).toHaveLength(1)
    act(() => cbs[0]!(0))
    expect(result.current).toEqual({ x: 5, y: 120 })

    unmount()
    vi.unstubAllGlobals()
  })
})
