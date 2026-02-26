import { act, renderHook } from '@testing-library/react'
import { Provider } from '@vitus-labs/core'
import type { ReactNode } from 'react'
import { createElement } from 'react'
import useBreakpoint from '../useBreakpoint'

// ── matchMedia mock ──────────────────────────────────────────────────
// Each call to window.matchMedia registers a listener set keyed by query.
// We can later trigger change events by invoking handlers in the set.
const listeners: Map<string, Set<() => void>> = new Map()
const removedListeners: Map<string, Set<() => void>> = new Map()

const installMatchMedia = () => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn((query: string) => {
      const set = new Set<() => void>()
      listeners.set(query, set)

      const removed = new Set<() => void>()
      removedListeners.set(query, removed)

      return {
        matches: false,
        media: query,
        addEventListener: vi.fn((_event: string, handler: () => void) => {
          set.add(handler)
        }),
        removeEventListener: vi.fn((_event: string, handler: () => void) => {
          set.delete(handler)
          removed.add(handler)
        }),
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }
    }),
  })
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
  listeners.clear()
  removedListeners.clear()
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

  // 6. Sets up matchMedia listeners
  it('sets up matchMedia listeners when breakpoints are provided', () => {
    setWindowWidth(800)
    const wrapper = createWrapper({ breakpoints })
    renderHook(() => useBreakpoint(), { wrapper })

    // Should create one matchMedia listener per breakpoint
    const breakpointCount = Object.keys(breakpoints).length
    expect(listeners.size).toBe(breakpointCount)

    // Each listener set should have exactly one handler
    for (const [, set] of listeners) {
      expect(set.size).toBe(1)
    }
  })

  it('creates matchMedia queries with correct min-width values', () => {
    setWindowWidth(800)
    const wrapper = createWrapper({ breakpoints })
    renderHook(() => useBreakpoint(), { wrapper })

    const queries = Array.from(listeners.keys())
    for (const value of Object.values(breakpoints)) {
      expect(queries).toContain(`(min-width: ${value}px)`)
    }
  })

  // 7. Cleans up listeners on unmount
  it('cleans up all matchMedia listeners on unmount', () => {
    setWindowWidth(800)
    const wrapper = createWrapper({ breakpoints })
    const { unmount } = renderHook(() => useBreakpoint(), { wrapper })

    // Verify listeners are registered before unmount
    for (const [, set] of listeners) {
      expect(set.size).toBe(1)
    }

    unmount()

    // After unmount, all listener sets should be empty (handlers removed)
    for (const [, set] of listeners) {
      expect(set.size).toBe(0)
    }

    // All handlers should have been passed to removeEventListener
    for (const [, removed] of removedListeners) {
      expect(removed.size).toBe(1)
    }
  })

  // 8. Updates when matchMedia fires change event
  it('updates the breakpoint when matchMedia fires a change event', () => {
    setWindowWidth(800)
    const wrapper = createWrapper({ breakpoints })
    const { result } = renderHook(() => useBreakpoint(), { wrapper })
    expect(result.current).toBe('md')

    // Simulate a viewport resize to 1300px by changing innerWidth
    // and triggering one of the matchMedia handlers
    setWindowWidth(1300)
    act(() => {
      // Trigger any one handler — the update() function reads window.innerWidth
      const firstSet = listeners.values().next().value as
        | Set<() => void>
        | undefined
      if (firstSet) {
        for (const handler of firstSet) {
          handler()
        }
      }
    })

    expect(result.current).toBe('xl')
  })

  it('updates to a smaller breakpoint when window shrinks', () => {
    setWindowWidth(1300)
    const wrapper = createWrapper({ breakpoints })
    const { result } = renderHook(() => useBreakpoint(), { wrapper })
    expect(result.current).toBe('xl')

    setWindowWidth(400)
    act(() => {
      const firstSet = listeners.values().next().value as
        | Set<() => void>
        | undefined
      if (firstSet) {
        for (const handler of firstSet) {
          handler()
        }
      }
    })

    expect(result.current).toBe('xs')
  })

  // 9. Returns undefined when breakpoints object is empty
  it('returns undefined when breakpoints object is empty', () => {
    setWindowWidth(800)
    const wrapper = createWrapper({ breakpoints: {} })
    const { result } = renderHook(() => useBreakpoint(), { wrapper })
    expect(result.current).toBeUndefined()
  })

  it('does not set up matchMedia listeners when breakpoints are empty', () => {
    const wrapper = createWrapper({ breakpoints: {} })
    renderHook(() => useBreakpoint(), { wrapper })
    expect(listeners.size).toBe(0)
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
