import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import useLocalStorage from '../useLocalStorage'

// Bun's vitest+jsdom integration doesn't expose Web Storage; back it
// with a Map so the hook's persistence path is exercised end-to-end.
const installLocalStorageStub = () => {
  const store = new Map<string, string>()
  const stub: Storage = {
    getItem: (k) => (store.has(k) ? store.get(k)! : null),
    setItem: (k, v) => {
      store.set(k, String(v))
    },
    removeItem: (k) => {
      store.delete(k)
    },
    clear: () => store.clear(),
    key: (i) => Array.from(store.keys())[i] ?? null,
    get length() {
      return store.size
    },
  }
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    writable: true,
    value: stub,
  })
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    writable: true,
    value: stub,
  })
  return stub
}

describe('useLocalStorage', () => {
  beforeEach(() => {
    installLocalStorageStub()
  })
  afterEach(() => {
    localStorage.clear()
  })

  it('returns the initial value when no entry exists', () => {
    const { result } = renderHook(() => useLocalStorage('k1', 'default'))
    expect(result.current[0]).toBe('default')
  })

  it('hydrates from an existing localStorage entry', () => {
    localStorage.setItem('k2', JSON.stringify('persisted'))
    const { result } = renderHook(() => useLocalStorage('k2', 'default'))
    expect(result.current[0]).toBe('persisted')
  })

  it('persists updates back to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage<number>('k3', 0))
    act(() => result.current[1](42))
    expect(result.current[0]).toBe(42)
    expect(JSON.parse(localStorage.getItem('k3')!)).toBe(42)
  })

  it('supports an updater function', () => {
    const { result } = renderHook(() => useLocalStorage<number>('k4', 10))
    act(() => result.current[1]((p) => p + 5))
    expect(result.current[0]).toBe(15)
  })

  it('remove() clears the entry and resets to initialValue', () => {
    const { result } = renderHook(() => useLocalStorage('k5', 'init'))
    act(() => result.current[1]('changed'))
    expect(localStorage.getItem('k5')).not.toBeNull()
    act(() => result.current[2]())
    expect(result.current[0]).toBe('init')
    expect(localStorage.getItem('k5')).toBeNull()
  })

  it('falls back to initialValue when stored JSON is corrupt', () => {
    localStorage.setItem('k6', '{not valid json')
    const { result } = renderHook(() => useLocalStorage('k6', 'safe'))
    expect(result.current[0]).toBe('safe')
  })

  it('tolerates write failures (private mode / quota) without throwing', () => {
    const stub = installLocalStorageStub()
    const orig = stub.setItem.bind(stub)
    stub.setItem = () => {
      throw new Error('QuotaExceededError')
    }
    try {
      const { result } = renderHook(() => useLocalStorage('k7', 'x'))
      expect(() => act(() => result.current[1]('y'))).not.toThrow()
      // In-memory value still updated even though persist failed.
      expect(result.current[0]).toBe('y')
    } finally {
      stub.setItem = orig
    }
  })
})
