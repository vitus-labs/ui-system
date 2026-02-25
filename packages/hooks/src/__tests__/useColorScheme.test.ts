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

describe('useColorScheme', () => {
  it('returns "light" by default', () => {
    const { result } = renderHook(() => useColorScheme())
    expect(result.current).toBe('light')
  })

  it('returns "dark" when prefers-color-scheme matches', () => {
    const { result } = renderHook(() => useColorScheme())

    const set = listeners.get('(prefers-color-scheme: dark)')!
    act(() => {
      for (const handler of set) {
        handler({ matches: true })
      }
    })

    expect(result.current).toBe('dark')
  })
})
