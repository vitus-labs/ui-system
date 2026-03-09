import { renderHook } from '@testing-library/react'
import useClickOutside from '../useClickOutside'

describe('useClickOutside', () => {
  it('calls handler on mousedown outside the ref element', () => {
    const handler = vi.fn()
    const el = document.createElement('div')
    document.body.appendChild(el)
    const ref = { current: el }

    renderHook(() => useClickOutside(ref, handler))

    // Click outside
    document.dispatchEvent(new Event('mousedown'))
    expect(handler).toHaveBeenCalledTimes(1)

    document.body.removeChild(el)
  })

  it('does not call handler on mousedown inside the ref element', () => {
    const handler = vi.fn()
    const el = document.createElement('div')
    document.body.appendChild(el)
    const ref = { current: el }

    renderHook(() => useClickOutside(ref, handler))

    // Click inside
    el.dispatchEvent(new Event('mousedown', { bubbles: true }))
    expect(handler).not.toHaveBeenCalled()

    document.body.removeChild(el)
  })

  it('does not call handler when ref is null', () => {
    const handler = vi.fn()
    const ref = { current: null }

    renderHook(() => useClickOutside(ref, handler))

    document.dispatchEvent(new Event('mousedown'))
    expect(handler).not.toHaveBeenCalled()
  })

  it('always calls the latest handler', () => {
    let value: number = 0
    const el = document.createElement('div')
    document.body.appendChild(el)
    const ref = { current: el }

    const { rerender } = renderHook(({ cb }) => useClickOutside(ref, cb), {
      initialProps: {
        cb: () => {
          value = 1
        },
      },
    })

    rerender({
      cb: () => {
        value = 2
      },
    })
    document.dispatchEvent(new Event('mousedown'))
    expect(value).toBe(2)

    document.body.removeChild(el)
  })
})
