import { act, renderHook } from '@testing-library/react'
import useColorScheme from '../useColorScheme'

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

describe('useColorScheme', () => {
  it('returns "light" by default', () => {
    const { result } = renderHook(() => useColorScheme())
    expect(result.current).toBe('light')
  })

  it('returns "dark" when prefers-color-scheme matches', () => {
    const { result } = renderHook(() => useColorScheme())

    const set = listeners.get('(prefers-color-scheme: dark)')!
    act(() => {
      mqls.get('(prefers-color-scheme: dark)')!.matches = true
      for (const handler of set) {
        handler({ matches: true })
      }
    })

    expect(result.current).toBe('dark')
  })
})
