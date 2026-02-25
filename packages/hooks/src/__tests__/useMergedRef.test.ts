import { renderHook } from '@testing-library/react'
import { createRef } from 'react'
import useMergedRef from '../useMergedRef'

describe('useMergedRef', () => {
  it('sets object refs', () => {
    const ref1 = createRef<HTMLDivElement>()
    const ref2 = createRef<HTMLDivElement>()

    const { result } = renderHook(() => useMergedRef(ref1, ref2))

    const node = document.createElement('div')
    result.current(node)

    expect(ref1.current).toBe(node)
    expect(ref2.current).toBe(node)
  })

  it('calls callback refs', () => {
    const cb = vi.fn()
    const objRef = createRef<HTMLDivElement>()

    const { result } = renderHook(() => useMergedRef(cb, objRef))

    const node = document.createElement('div')
    result.current(node)

    expect(cb).toHaveBeenCalledWith(node)
    expect(objRef.current).toBe(node)
  })

  it('skips undefined refs', () => {
    const ref = createRef<HTMLDivElement>()
    const { result } = renderHook(() => useMergedRef(undefined, ref))

    const node = document.createElement('div')
    result.current(node)

    expect(ref.current).toBe(node)
  })

  it('handles null node (unmount)', () => {
    const cb = vi.fn()
    const { result } = renderHook(() => useMergedRef(cb))

    result.current(null)
    expect(cb).toHaveBeenCalledWith(null)
  })
})
