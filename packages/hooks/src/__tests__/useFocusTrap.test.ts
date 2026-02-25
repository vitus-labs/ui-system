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
})
