import { act, renderHook } from '@testing-library/react'
import useReducedMotion from '../useReducedMotion'

const listeners = new Map<string, Set<(e: any) => void>>()

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn((query: string) => {
      const set = new Set<(e: any) => void>()
      listeners.set(query, set)
      const mql = {
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
      mqls.set(query, mql)
      return mql
    }),
  })
})

// MediaQueryList.matches is live in browsers: it already reflects the new
// state when `change` fires, and the hook reads it via useSyncExternalStore.
const mqls = new Map<string, { matches: boolean }>()

afterEach(() => {
  listeners.clear()
  mqls.clear()
})

describe('useReducedMotion', () => {
  it('returns false by default', () => {
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(false)
  })

  it('returns true when prefers-reduced-motion matches', () => {
    const { result } = renderHook(() => useReducedMotion())

    const set = listeners.get('(prefers-reduced-motion: reduce)')
    act(() => {
      mqls.get('(prefers-reduced-motion: reduce)')!.matches = true
      for (const handler of set ?? []) {
        handler({ matches: true })
      }
    })

    expect(result.current).toBe(true)
  })
})
