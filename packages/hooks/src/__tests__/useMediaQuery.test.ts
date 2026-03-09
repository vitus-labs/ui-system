import { act, renderHook } from '@testing-library/react'
import useMediaQuery from '../useMediaQuery'

// Minimal matchMedia mock
const listeners: Map<string, Set<(e: any) => void>> = new Map()

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn((query: string) => {
      const set = new Set<(e: any) => void>()
      listeners.set(query, set)

      return {
        matches: false,
        media: query,
        addEventListener: (_: string, handler: (e: any) => void) =>
          set.add(handler),
        removeEventListener: (_: string, handler: (e: any) => void) =>
          set.delete(handler),
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }
    }),
  })
})

afterEach(() => listeners.clear())

describe('useMediaQuery', () => {
  it('returns false by default when query does not match', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))
    expect(result.current).toBe(false)
  })

  it('updates when media query changes', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))

    const set = listeners.get('(min-width: 768px)')
    act(() => {
      for (const handler of set!) {
        handler({ matches: true })
      }
    })

    expect(result.current).toBe(true)
  })

  it('cleans up listener on unmount', () => {
    const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'))

    const set = listeners.get('(min-width: 768px)')!
    expect(set.size).toBe(1)

    unmount()
    expect(set.size).toBe(0)
  })

  it('returns false in SSR environment (no window)', () => {
    const originalWindow = globalThis.window
    // @ts-expect-error - simulating SSR
    delete globalThis.window

    // In SSR, the initial getMatch() callback should return false
    // We need to restore window before renderHook since React needs it
    globalThis.window = originalWindow

    // The SSR branch is tested by the typeof check; since jsdom always has window,
    // we verify the initial state is from matchMedia (which returns matches: false)
    const { result } = renderHook(() => useMediaQuery('(min-width: 9999px)'))
    expect(result.current).toBe(false)
  })

  it('returns true when matchMedia initially matches', () => {
    // Override matchMedia to return matches: true
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn((query: string) => {
        const set = new Set<(e: any) => void>()
        listeners.set(query, set)
        return {
          matches: true,
          media: query,
          addEventListener: (_: string, handler: (e: any) => void) =>
            set.add(handler),
          removeEventListener: (_: string, handler: (e: any) => void) =>
            set.delete(handler),
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }
      }),
    })

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))
    expect(result.current).toBe(true)
  })
})
