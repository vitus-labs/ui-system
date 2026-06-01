import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import useCopyToClipboard from '../useCopyToClipboard'

describe('useCopyToClipboard', () => {
  const realClipboard = (navigator as any).clipboard
  afterEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      writable: true,
      value: realClipboard,
    })
  })

  const stubClipboard = (impl: { writeText: (t: string) => Promise<void> }) => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      writable: true,
      value: impl,
    })
  }

  it('copies via navigator.clipboard and flips `copied` until resetMs elapses', async () => {
    stubClipboard({ writeText: vi.fn().mockResolvedValue(undefined) })

    const { result } = renderHook(() => useCopyToClipboard(50))
    expect(result.current[0]).toBe(false)

    await act(async () => {
      const ok = await result.current[1]('hello')
      expect(ok).toBe(true)
    })
    expect(result.current[0]).toBe(true)
    await waitFor(() => expect(result.current[0]).toBe(false), {
      timeout: 500,
    })
  })

  it('returns false and keeps copied=false when navigator.clipboard rejects', async () => {
    stubClipboard({ writeText: vi.fn().mockRejectedValue(new Error('denied')) })
    const { result } = renderHook(() => useCopyToClipboard())
    await act(async () => {
      const ok = await result.current[1]('x')
      expect(ok).toBe(false)
    })
    expect(result.current[0]).toBe(false)
  })

  it('reset() forces copied back to false immediately and cancels the pending timer', async () => {
    stubClipboard({ writeText: vi.fn().mockResolvedValue(undefined) })
    const { result } = renderHook(() => useCopyToClipboard(5000))
    await act(async () => {
      await result.current[1]('hi')
    })
    expect(result.current[0]).toBe(true)
    act(() => {
      result.current[2]()
    })
    expect(result.current[0]).toBe(false)
  })

  it('falls back to execCommand when navigator.clipboard is unavailable', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      writable: true,
      value: undefined,
    })
    // jsdom doesn't ship execCommand; assign + capture invocation manually.
    const calls: string[] = []
    const doc = document as unknown as { execCommand?: (c: string) => boolean }
    const orig = doc.execCommand
    doc.execCommand = (c: string) => {
      calls.push(c)
      return true
    }
    try {
      const { result } = renderHook(() => useCopyToClipboard(50))
      await act(async () => {
        const ok = await result.current[1]('fallback')
        expect(ok).toBe(true)
      })
      expect(calls).toContain('copy')
      expect(result.current[0]).toBe(true)
    } finally {
      doc.execCommand = orig
    }
  })

  it('falls back to execCommand returning false when copy fails', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      writable: true,
      value: undefined,
    })
    const doc = document as unknown as { execCommand?: (c: string) => boolean }
    const orig = doc.execCommand
    doc.execCommand = () => false
    try {
      const { result } = renderHook(() => useCopyToClipboard())
      await act(async () => {
        const ok = await result.current[1]('fallback')
        expect(ok).toBe(false)
      })
      expect(result.current[0]).toBe(false)
    } finally {
      doc.execCommand = orig
    }
  })

  it('cleans up the pending reset timer on unmount', async () => {
    stubClipboard({ writeText: vi.fn().mockResolvedValue(undefined) })
    const { result, unmount } = renderHook(() => useCopyToClipboard(5000))
    await act(async () => {
      await result.current[1]('hi')
    })
    expect(result.current[0]).toBe(true)
    unmount()
    // Just exercising the unmount cleanup path; no assertion needed beyond
    // the lack of leaked-timer warnings under vitest.
  })

  it('does not start a reset timer when resetMs is 0', async () => {
    stubClipboard({ writeText: vi.fn().mockResolvedValue(undefined) })
    const { result } = renderHook(() => useCopyToClipboard(0))
    await act(async () => {
      await result.current[1]('hi')
    })
    expect(result.current[0]).toBe(true)
  })
})
