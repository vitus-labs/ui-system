import { act, renderHook } from '@testing-library/react'
import { useRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import useEventListener from '../useEventListener'

describe('useEventListener', () => {
  it('attaches a window listener by default and removes on unmount', () => {
    const handler = vi.fn()
    const { unmount } = renderHook(() => useEventListener('click', handler))

    act(() => {
      window.dispatchEvent(new Event('click'))
    })
    expect(handler).toHaveBeenCalledTimes(1)

    unmount()
    act(() => {
      window.dispatchEvent(new Event('click'))
    })
    expect(handler).toHaveBeenCalledTimes(1) // not called again
  })

  it('targets a ref when provided', () => {
    const handler = vi.fn()
    const target = document.createElement('div')

    const { result } = renderHook(() => {
      const ref = useRef(target)
      useEventListener('click', handler, ref)
      return ref
    })

    act(() => {
      result.current.current.dispatchEvent(new Event('click'))
    })
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('uses the latest handler without re-attaching on every render', () => {
    const first = vi.fn()
    const second = vi.fn()
    const { rerender } = renderHook(
      ({ h }: { h: () => void }) => useEventListener('click', h),
      { initialProps: { h: first } },
    )
    act(() => {
      window.dispatchEvent(new Event('click'))
    })
    expect(first).toHaveBeenCalledTimes(1)

    rerender({ h: second })
    act(() => {
      window.dispatchEvent(new Event('click'))
    })
    expect(second).toHaveBeenCalledTimes(1)
    expect(first).toHaveBeenCalledTimes(1)
  })

  it('does nothing when target is null', () => {
    expect(() =>
      renderHook(() => useEventListener('click', () => undefined, null)),
    ).not.toThrow()
  })

  it('does nothing when the ref points at a target without addEventListener', () => {
    const ref = { current: {} as EventTarget } // missing addEventListener
    expect(() =>
      renderHook(() => useEventListener('click', () => undefined, ref)),
    ).not.toThrow()
  })

  it('passes addEventListener options through', () => {
    const handler = vi.fn()
    const target = document.createElement('div')
    const ref = { current: target }
    const addSpy = vi.spyOn(target, 'addEventListener')
    renderHook(() =>
      useEventListener('click', handler, ref, { capture: true, once: true }),
    )
    expect(addSpy).toHaveBeenCalledWith('click', expect.any(Function), {
      capture: true,
      once: true,
    })
    addSpy.mockRestore()
  })
})
