import { act, renderHook } from '@testing-library/react'
import { Provider } from '@vitus-labs/core'
import type { ReactNode } from 'react'
import { createElement } from 'react'
import useBreakpoint from '../useBreakpoint'

// ── window resize listener mock ──────────────────────────────────────
// Each render of the hook attaches a single rAF-throttled `resize` listener
// to `window`. We track those handlers so tests can dispatch a resize.
const resizeHandlers: Set<EventListener> = new Set()
const removedResizeHandlers: Set<EventListener> = new Set()
const originalAdd = window.addEventListener.bind(window)
const originalRemove = window.removeEventListener.bind(window)

const installMatchMedia = () => {
  resizeHandlers.clear()
  removedResizeHandlers.clear()

  window.addEventListener = vi.fn(
    (type: string, listener: EventListenerOrEventListenerObject, opts?) => {
      if (type === 'resize' && typeof listener === 'function') {
        resizeHandlers.add(listener as EventListener)
      }
      return originalAdd(type as any, listener as any, opts as any)
    },
  ) as typeof window.addEventListener

  window.removeEventListener = vi.fn(
    (type: string, listener: EventListenerOrEventListenerObject, opts?) => {
      if (type === 'resize' && typeof listener === 'function') {
        resizeHandlers.delete(listener as EventListener)
        removedResizeHandlers.add(listener as EventListener)
      }
      return originalRemove(type as any, listener as any, opts as any)
    },
  ) as typeof window.removeEventListener

  // Make rAF synchronous in tests so resize updates flush immediately
  ;(window as any).requestAnimationFrame = (cb: FrameRequestCallback) => {
    cb(0)
    return 1
  }
  ;(window as any).cancelAnimationFrame = () => undefined
}

// ── window.innerWidth helper ─────────────────────────────────────────
const setWindowWidth = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
}

// ── Standard breakpoints ─────────────────────────────────────────────
const breakpoints = { xs: 0, sm: 576, md: 768, lg: 992, xl: 1200 }

// ── Wrapper factory ──────────────────────────────────────────────────
const createWrapper =
  (theme: Record<string, unknown>) =>
  ({ children }: { children: ReactNode }) =>
    createElement(Provider, { theme }, children)

// ── Test suite ───────────────────────────────────────────────────────
beforeEach(() => {
  installMatchMedia()
  // Reset to a sane default width
  setWindowWidth(1024)
})

describe('useBreakpoint', () => {
  // 1. No context
  it('returns undefined when no context is available', () => {
    const { result } = renderHook(() => useBreakpoint())
    expect(result.current).toBeUndefined()
  })

  // 2. Returns a breakpoint name when context has breakpoints
  it('returns a breakpoint name when context provides breakpoints', () => {
    setWindowWidth(800)
    const wrapper = createWrapper({ breakpoints })
    const { result } = renderHook(() => useBreakpoint(), { wrapper })
    expect(typeof result.current).toBe('string')
    expect(result.current).toBeDefined()
  })

  // 3. Returns correct breakpoint for a mid-range width
  it('returns the correct breakpoint based on window width (800px -> md)', () => {
    setWindowWidth(800)
    const wrapper = createWrapper({ breakpoints })
    const { result } = renderHook(() => useBreakpoint(), { wrapper })
    expect(result.current).toBe('md')
  })

  // 4. Returns smallest breakpoint for small widths
  it('returns the smallest breakpoint for very small widths', () => {
    setWindowWidth(100)
    const wrapper = createWrapper({ breakpoints })
    const { result } = renderHook(() => useBreakpoint(), { wrapper })
    expect(result.current).toBe('xs')
  })

  // 5. Returns largest breakpoint for large widths
  it('returns the largest breakpoint for very large widths', () => {
    setWindowWidth(2000)
    const wrapper = createWrapper({ breakpoints })
    const { result } = renderHook(() => useBreakpoint(), { wrapper })
    expect(result.current).toBe('xl')
  })

  // Additional boundary checks
  it('returns sm at exactly 576px', () => {
    setWindowWidth(576)
    const wrapper = createWrapper({ breakpoints })
    const { result } = renderHook(() => useBreakpoint(), { wrapper })
    expect(result.current).toBe('sm')
  })

  it('returns xs at 575px (just below sm)', () => {
    setWindowWidth(575)
    const wrapper = createWrapper({ breakpoints })
    const { result } = renderHook(() => useBreakpoint(), { wrapper })
    expect(result.current).toBe('xs')
  })

  it('returns lg at exactly 992px', () => {
    setWindowWidth(992)
    const wrapper = createWrapper({ breakpoints })
    const { result } = renderHook(() => useBreakpoint(), { wrapper })
    expect(result.current).toBe('lg')
  })

  it('returns xl at exactly 1200px', () => {
    setWindowWidth(1200)
    const wrapper = createWrapper({ breakpoints })
    const { result } = renderHook(() => useBreakpoint(), { wrapper })
    expect(result.current).toBe('xl')
  })

  // 6. Sets up a single resize listener
  it('sets up a single resize listener when breakpoints are provided', () => {
    setWindowWidth(800)
    const wrapper = createWrapper({ breakpoints })
    renderHook(() => useBreakpoint(), { wrapper })

    expect(resizeHandlers.size).toBe(1)
  })

  // 7. Cleans up resize listener on unmount
  it('cleans up the resize listener on unmount', () => {
    setWindowWidth(800)
    const wrapper = createWrapper({ breakpoints })
    const { unmount } = renderHook(() => useBreakpoint(), { wrapper })

    expect(resizeHandlers.size).toBe(1)

    unmount()

    expect(resizeHandlers.size).toBe(0)
    expect(removedResizeHandlers.size).toBe(1)
  })

  // 8. Updates when window resizes
  const fireResize = () => {
    for (const handler of resizeHandlers) handler(new Event('resize'))
  }

  it('updates the breakpoint when window resizes upward', () => {
    setWindowWidth(800)
    const wrapper = createWrapper({ breakpoints })
    const { result } = renderHook(() => useBreakpoint(), { wrapper })
    expect(result.current).toBe('md')

    setWindowWidth(1300)
    act(fireResize)

    expect(result.current).toBe('xl')
  })

  it('updates to a smaller breakpoint when window shrinks', () => {
    setWindowWidth(1300)
    const wrapper = createWrapper({ breakpoints })
    const { result } = renderHook(() => useBreakpoint(), { wrapper })
    expect(result.current).toBe('xl')

    setWindowWidth(400)
    act(fireResize)

    expect(result.current).toBe('xs')
  })

  // 9. Returns undefined when breakpoints object is empty
  it('returns undefined when breakpoints object is empty', () => {
    setWindowWidth(800)
    const wrapper = createWrapper({ breakpoints: {} })
    const { result } = renderHook(() => useBreakpoint(), { wrapper })
    expect(result.current).toBeUndefined()
  })

  it('does not set up a resize listener when breakpoints are empty', () => {
    const wrapper = createWrapper({ breakpoints: {} })
    renderHook(() => useBreakpoint(), { wrapper })
    expect(resizeHandlers.size).toBe(0)
  })

  // Edge case: single breakpoint
  it('works with a single breakpoint', () => {
    setWindowWidth(500)
    const wrapper = createWrapper({ breakpoints: { mobile: 0 } })
    const { result } = renderHook(() => useBreakpoint(), { wrapper })
    expect(result.current).toBe('mobile')
  })

  // Edge case: breakpoints not in sorted order
  it('handles unsorted breakpoint values correctly', () => {
    setWindowWidth(800)
    const wrapper = createWrapper({
      breakpoints: { xl: 1200, xs: 0, md: 768, sm: 576, lg: 992 },
    })
    const { result } = renderHook(() => useBreakpoint(), { wrapper })
    expect(result.current).toBe('md')
  })

  // Edge case: theme without breakpoints key
  it('returns undefined when theme has no breakpoints key', () => {
    const wrapper = createWrapper({ colors: { primary: '#000' } })
    const { result } = renderHook(() => useBreakpoint(), { wrapper })
    expect(result.current).toBeUndefined()
  })
})
