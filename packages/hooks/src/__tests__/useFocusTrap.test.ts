import { renderHook } from '@testing-library/react'
import useFocusTrap from '../useFocusTrap'

describe('useFocusTrap', () => {
  let container: HTMLDivElement
  let btn1: HTMLButtonElement
  let btn2: HTMLButtonElement
  let btn3: HTMLButtonElement

  beforeEach(() => {
    container = document.createElement('div')
    btn1 = document.createElement('button')
    btn2 = document.createElement('button')
    btn3 = document.createElement('button')
    container.append(btn1, btn2, btn3)
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  it('wraps focus from last to first on Tab', () => {
    const ref = { current: container }
    renderHook(() => useFocusTrap(ref))

    btn3.focus()
    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true })
    const prevented = vi.spyOn(event, 'preventDefault')
    document.dispatchEvent(event)

    expect(prevented).toHaveBeenCalled()
  })

  it('wraps focus from first to last on Shift+Tab', () => {
    const ref = { current: container }
    renderHook(() => useFocusTrap(ref))

    btn1.focus()
    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
    })
    const prevented = vi.spyOn(event, 'preventDefault')
    document.dispatchEvent(event)

    expect(prevented).toHaveBeenCalled()
  })

  it('does nothing when disabled', () => {
    const ref = { current: container }
    renderHook(() => useFocusTrap(ref, false))

    btn3.focus()
    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true })
    const prevented = vi.spyOn(event, 'preventDefault')
    document.dispatchEvent(event)

    expect(prevented).not.toHaveBeenCalled()
  })

  it('ignores non-Tab keys', () => {
    const ref = { current: container }
    renderHook(() => useFocusTrap(ref))

    btn3.focus()
    const event = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
    })
    const prevented = vi.spyOn(event, 'preventDefault')
    document.dispatchEvent(event)

    expect(prevented).not.toHaveBeenCalled()
  })

  it('does nothing when ref.current is null', () => {
    const ref = { current: null as HTMLElement | null }
    renderHook(() => useFocusTrap(ref))

    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true })
    const prevented = vi.spyOn(event, 'preventDefault')
    document.dispatchEvent(event)

    expect(prevented).not.toHaveBeenCalled()
  })

  it('does nothing when container has no focusable children', () => {
    const emptyContainer = document.createElement('div')
    emptyContainer.appendChild(document.createElement('div'))
    document.body.appendChild(emptyContainer)

    const ref = { current: emptyContainer }
    renderHook(() => useFocusTrap(ref))

    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true })
    const prevented = vi.spyOn(event, 'preventDefault')
    document.dispatchEvent(event)

    expect(prevented).not.toHaveBeenCalled()
    document.body.removeChild(emptyContainer)
  })

  it('does not wrap when Tab pressed at a middle element', () => {
    const ref = { current: container }
    renderHook(() => useFocusTrap(ref))

    btn2.focus()
    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true })
    const prevented = vi.spyOn(event, 'preventDefault')
    document.dispatchEvent(event)

    // Middle element: neither first+shiftKey nor last+noShiftKey, so no wrap
    expect(prevented).not.toHaveBeenCalled()
  })

  it('wraps focus from last to first on Tab and focuses the target', () => {
    const ref = { current: container }
    renderHook(() => useFocusTrap(ref))

    btn3.focus()
    expect(document.activeElement).toBe(btn3)

    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true })
    document.dispatchEvent(event)

    // wrapFocus should have called focus() on the first element
    expect(document.activeElement).toBe(btn1)
  })

  it('wraps focus from first to last on Shift+Tab and focuses the target', () => {
    const ref = { current: container }
    renderHook(() => useFocusTrap(ref))

    btn1.focus()
    expect(document.activeElement).toBe(btn1)

    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
    })
    document.dispatchEvent(event)

    // wrapFocus should have called focus() on the last element
    expect(document.activeElement).toBe(btn3)
  })

  it('cleans up event listener on unmount', () => {
    const ref = { current: container }
    const removeSpy = vi.spyOn(document, 'removeEventListener')
    const { unmount } = renderHook(() => useFocusTrap(ref))

    unmount()

    expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
    removeSpy.mockRestore()
  })
})
