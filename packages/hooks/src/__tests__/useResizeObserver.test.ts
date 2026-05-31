import { act, renderHook } from '@testing-library/react'
import { useRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import useResizeObserver from '../useResizeObserver'

// Capture the most-recent observer instance + callback so the test can
// drive observations manually (jsdom has no real layout engine).
type Cb = (entries: ResizeObserverEntry[]) => void
class MockResizeObserver {
  static lastCb: Cb | null = null
  static observed: Element[] = []
  static disconnects = 0
  constructor(cb: Cb) {
    MockResizeObserver.lastCb = cb
  }
  observe(el: Element) {
    MockResizeObserver.observed.push(el)
  }
  unobserve() {}
  disconnect() {
    MockResizeObserver.disconnects++
  }
}

describe('useResizeObserver', () => {
  it('returns null until first observation, then exposes contentRect', () => {
    ;(globalThis as any).ResizeObserver = MockResizeObserver
    MockResizeObserver.lastCb = null
    MockResizeObserver.observed = []
    MockResizeObserver.disconnects = 0

    const node = document.createElement('div')
    const { result, unmount } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(node)
      return useResizeObserver(ref)
    })

    expect(result.current).toBeNull()
    expect(MockResizeObserver.observed).toContain(node)

    // Drive a fake observation.
    const rect = { width: 200, height: 100 } as DOMRectReadOnly
    act(() => {
      MockResizeObserver.lastCb?.([
        { contentRect: rect } as ResizeObserverEntry,
      ])
    })
    expect(result.current).toBe(rect)

    unmount()
    expect(MockResizeObserver.disconnects).toBeGreaterThan(0)
  })

  it('returns null when ResizeObserver is unavailable in the env', () => {
    const orig = (globalThis as any).ResizeObserver
    ;(globalThis as any).ResizeObserver = undefined
    try {
      const { result } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(document.createElement('div'))
        return useResizeObserver(ref)
      })
      expect(result.current).toBeNull()
    } finally {
      ;(globalThis as any).ResizeObserver = orig
    }
  })
})
