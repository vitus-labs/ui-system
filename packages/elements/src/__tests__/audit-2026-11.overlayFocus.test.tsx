/**
 * Regression tests for the 2026-11 elements audit (Overlay): nested focus
 * traps, hidden focusables, and hover overlays blocked by a nested overlay.
 */
import { act, fireEvent, render, screen } from '@testing-library/react'
import { breakpoints, Provider } from '@vitus-labs/unistyle'
import { forwardRef } from 'react'
import Overlay from '../Overlay/component'

const Btn = forwardRef<HTMLButtonElement, any>(
  ({ active, showContent, hideContent, ...p }, ref) => (
    <button type="button" ref={ref} {...p} />
  ),
)

const wrapper = ({ children }: any) => (
  <Provider theme={breakpoints}>{children}</Provider>
)
const pressTab = (el: HTMLElement, shiftKey = false) => {
  const ev = new KeyboardEvent('keydown', {
    key: 'Tab',
    bubbles: true,
    cancelable: true,
    shiftKey,
  })
  act(() => {
    el.dispatchEvent(ev)
  })
  return ev
}
afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})
describe('focus trap', () => {
  beforeEach(() => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0)
      return 0
    })
  })

  const Inner = forwardRef<HTMLDivElement, any>((_p, ref) => (
    <div ref={ref} data-testid="inner">
      <button type="button" data-testid="i1">
        i1
      </button>
      <button type="button" data-testid="i2">
        i2
      </button>
      <button type="button" data-testid="i3">
        i3
      </button>
    </div>
  ))
  const Outer = forwardRef<HTMLDivElement, any>((_p, ref) => (
    <div ref={ref} data-testid="outer">
      <button type="button" data-testid="o1">
        o1
      </button>
      <Overlay
        type="modal"
        closeOn="clickOutsideContent"
        trigger={<Btn data-testid="innerTrigger">open inner</Btn>}
      >
        <Inner />
      </Overlay>
    </div>
  ))

  const openNested = () => {
    render(
      <Overlay
        type="modal"
        closeOn="clickOutsideContent"
        trigger={<Btn data-testid="outerTrigger">open</Btn>}
      >
        <Outer />
      </Overlay>,
      { wrapper },
    )
    act(() => {
      fireEvent.click(screen.getByTestId('outerTrigger'))
    })
    act(() => {
      fireEvent.click(screen.getByTestId('innerTrigger'))
    })
  }

  it('only the topmost (nested) modal trap handles Tab', () => {
    openNested()
    expect(document.activeElement).toBe(screen.getByTestId('i1'))

    act(() => {
      screen.getByTestId('i2').focus()
    })
    const ev = pressTab(screen.getByTestId('i2'))
    // Not the last control: no trap intervenes (the outer one used to pull
    // focus back to its first control).
    expect(ev.defaultPrevented).toBe(false)
    expect(document.activeElement).toBe(screen.getByTestId('i2'))

    // Wrap still works inside the inner trap.
    act(() => {
      screen.getByTestId('i3').focus()
    })
    const wrap = pressTab(screen.getByTestId('i3'))
    expect(wrap.defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(screen.getByTestId('i1'))
  })

  it('outer trap resumes once the nested modal closes', () => {
    openNested()
    // Close the inner modal by clicking outside its content (inside outer).
    act(() => {
      fireEvent.click(screen.getByTestId('o1'))
    })
    expect(screen.queryByTestId('inner')).toBeNull()

    const outerButtons = screen
      .getByTestId('outer')
      .querySelectorAll<HTMLElement>('button')
    const last = outerButtons[outerButtons.length - 1] as HTMLElement
    act(() => {
      last.focus()
    })
    const ev = pressTab(last)
    expect(ev.defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(screen.getByTestId('o1'))
  })

  const Form = forwardRef<HTMLFormElement, any>((_p, ref) => (
    <form ref={ref} data-testid="dlg">
      <input type="hidden" name="csrf" value="x" />
      <div hidden>
        <button type="button" data-testid="hiddenBtn">
          hidden
        </button>
      </div>
      <button type="button" data-testid="a">
        a
      </button>
      <button type="button" data-testid="b">
        b
      </button>
      <div {...({ inert: true } as any)}>
        <button type="button" data-testid="inertBtn">
          inert
        </button>
      </div>
      <input type="hidden" name="trailing" value="y" />
    </form>
  ))

  it('autofocus skips input[type=hidden] and [hidden] subtrees', () => {
    render(
      <Overlay type="modal" trigger={<Btn data-testid="t">open</Btn>}>
        <Form />
      </Overlay>,
      { wrapper },
    )
    act(() => {
      screen.getByTestId('t').focus()
      fireEvent.click(screen.getByTestId('t'))
    })
    expect(document.activeElement).toBe(screen.getByTestId('a'))
  })

  it('Tab wraps from the last real control (trailing hidden / inert ignored)', () => {
    render(
      <Overlay type="modal" trigger={<Btn data-testid="t">open</Btn>}>
        <Form />
      </Overlay>,
      { wrapper },
    )
    act(() => {
      fireEvent.click(screen.getByTestId('t'))
    })
    act(() => {
      screen.getByTestId('b').focus()
    })
    const ev = pressTab(screen.getByTestId('b'))
    expect(ev.defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(screen.getByTestId('a'))

    const back = pressTab(screen.getByTestId('a'), true)
    expect(back.defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(screen.getByTestId('b'))
  })
})
describe('hover overlay blocked by a nested overlay', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0)
      return 0
    })
  })

  const ParentContent = forwardRef<HTMLDivElement, any>((_p, ref) => (
    <div ref={ref} data-testid="pc">
      <Overlay
        openOn="click"
        closeOn="clickOutsideContent"
        trigger={<Btn data-testid="ct">child</Btn>}
      >
        <div data-testid="cc">child content</div>
      </Overlay>
    </div>
  ))

  const openBoth = () => {
    render(
      <Overlay
        openOn="hover"
        closeOn="hover"
        trigger={<Btn data-testid="pt">parent</Btn>}
      >
        <ParentContent />
      </Overlay>,
      { wrapper },
    )
    act(() => {
      fireEvent.mouseEnter(screen.getByTestId('pt'))
    })
    act(() => {
      fireEvent.mouseLeave(screen.getByTestId('pt'))
      fireEvent.mouseEnter(screen.getByTestId('pc'))
    })
    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(screen.queryByTestId('pc')).not.toBeNull()
    act(() => {
      fireEvent.click(screen.getByTestId('ct'))
    })
    expect(screen.queryByTestId('cc')).not.toBeNull()
  }

  it('closes after the nested overlay closes if the pointer left meanwhile', () => {
    openBoth()
    // Pointer leaves the parent content while it's blocked by the child.
    act(() => {
      fireEvent.mouseLeave(screen.getByTestId('pc'))
    })
    // Still blocked: must not close while the nested overlay is open.
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(screen.queryByTestId('pc')).not.toBeNull()

    // Dismiss the child by clicking elsewhere on the page (no focus restore).
    act(() => {
      fireEvent.pointerDown(document.body)
      fireEvent.click(document.body)
    })
    expect(screen.queryByTestId('cc')).toBeNull()
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(screen.queryByTestId('pc')).toBeNull()
  })

  it('stays open after the nested overlay closes if the pointer is still over it', () => {
    openBoth()
    act(() => {
      fireEvent.keyDown(window, { key: 'Escape' })
    })
    expect(screen.queryByTestId('cc')).toBeNull()
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(screen.queryByTestId('pc')).not.toBeNull()
  })
})
