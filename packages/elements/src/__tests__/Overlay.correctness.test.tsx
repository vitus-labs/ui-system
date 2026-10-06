import { act, fireEvent, render, screen } from '@testing-library/react'
import { breakpoints, Provider } from '@vitus-labs/unistyle'
import { forwardRef, StrictMode } from 'react'
import OverlayComponent from '../Overlay/component'

const Trigger = forwardRef<HTMLButtonElement, any>(
  ({ active, showContent, hideContent, ...props }, ref) => (
    <button type="button" ref={ref} data-testid="trigger" {...props}>
      trigger
    </button>
  ),
)
Trigger.displayName = 'Trigger'

const Content = forwardRef<HTMLDivElement, any>(
  ({ active, align, alignX, alignY, showContent, hideContent, ...p }, ref) => (
    <div ref={ref} data-testid="content" {...p}>
      <button type="button" data-testid="inside">
        inside
      </button>
    </div>
  ),
)
Content.displayName = 'Content'

const wrapper = ({ children }: any) => (
  <Provider theme={breakpoints}>{children}</Provider>
)

beforeEach(() => {
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
    cb(0)
    return 0
  })
})
afterEach(() => {
  vi.restoreAllMocks()
})

describe('Overlay lifecycle', () => {
  it('fires onClose exactly once per close', async () => {
    const onClose = vi.fn()
    const onOpen = vi.fn()
    render(
      <OverlayComponent trigger={Trigger} onClose={onClose} onOpen={onOpen}>
        {Content}
      </OverlayComponent>,
      { wrapper },
    )
    await act(async () => {
      fireEvent.click(screen.getByTestId('trigger'))
    })
    expect(onOpen).toHaveBeenCalledTimes(1)
    await act(async () => {
      fireEvent.click(screen.getByTestId('trigger'))
    })
    expect(screen.queryByTestId('content')).not.toBeInTheDocument()
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('fires onClose once on unmount while open', () => {
    const onClose = vi.fn()
    const { unmount } = render(
      <OverlayComponent trigger={Trigger} isOpen onClose={onClose}>
        {Content}
      </OverlayComponent>,
      { wrapper },
    )
    unmount()
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('StrictMode: no spurious onClose/onOpen pair when initially open', async () => {
    const onClose = vi.fn()
    const onOpen = vi.fn()
    render(
      <StrictMode>
        <OverlayComponent
          trigger={Trigger}
          isOpen
          onOpen={onOpen}
          onClose={onClose}
        >
          {Content}
        </OverlayComponent>
      </StrictMode>,
      { wrapper },
    )
    await act(async () => {
      await Promise.resolve()
    })
    expect(onClose).not.toHaveBeenCalled()
    expect(onOpen).toHaveBeenCalledTimes(1)
  })

  it('does not move focus back to the trigger after a click outside', async () => {
    render(
      <>
        <OverlayComponent trigger={Trigger} type="dropdown">
          {Content}
        </OverlayComponent>
        <button type="button" data-testid="elsewhere">
          elsewhere
        </button>
      </>,
      { wrapper },
    )
    await act(async () => {
      fireEvent.click(screen.getByTestId('trigger'))
    })
    expect(screen.getByTestId('content')).toBeInTheDocument()
    // Safari: clicking a button doesn't focus it, so activeElement stays body.
    ;(document.activeElement as HTMLElement | null)?.blur()
    const elsewhere = screen.getByTestId('elsewhere')
    await act(async () => {
      fireEvent.pointerDown(elsewhere)
      fireEvent.click(elsewhere)
    })
    expect(screen.queryByTestId('content')).not.toBeInTheDocument()
    expect(document.activeElement).not.toBe(screen.getByTestId('trigger'))
  })

  it('nested: opening the child does not close it or the parent, and clicking inside child keeps parent open', async () => {
    const parentClose = vi.fn()
    const childClose = vi.fn()
    const ChildOverlay = () => (
      <OverlayComponent
        isOpen
        closeOn="clickOutsideContent"
        trigger={<button type="button" data-testid="child-trigger" />}
        onClose={childClose}
      >
        <div data-testid="child-content">
          <span data-testid="child-inner">x</span>
        </div>
      </OverlayComponent>
    )
    render(
      <OverlayComponent
        isOpen
        closeOn="clickOutsideContent"
        trigger={<button type="button" data-testid="parent-trigger" />}
        onClose={parentClose}
      >
        <div data-testid="parent-content">
          <ChildOverlay />
        </div>
      </OverlayComponent>,
      { wrapper },
    )
    await act(async () => {})
    expect(screen.getByTestId('child-content')).toBeInTheDocument()
    expect(childClose).not.toHaveBeenCalled()

    await act(async () => {
      fireEvent.click(screen.getByTestId('child-inner'))
    })
    expect(parentClose).not.toHaveBeenCalled()
    expect(childClose).not.toHaveBeenCalled()
    expect(screen.getByTestId('parent-content')).toBeInTheDocument()
    expect(screen.getByTestId('child-content')).toBeInTheDocument()
  })
})

describe('Overlay Escape stack', () => {
  it('closes only the topmost overlay per Escape press', async () => {
    render(
      <>
        <OverlayComponent
          trigger={<button type="button" data-testid="t1" />}
          closeOn="manual"
          isOpen
        >
          <div data-testid="c1" />
        </OverlayComponent>
        <OverlayComponent
          trigger={<button type="button" data-testid="t2" />}
          closeOn="manual"
          isOpen
        >
          <div data-testid="c2" />
        </OverlayComponent>
      </>,
      { wrapper },
    )
    await act(async () => {})
    expect(screen.getByTestId('c1')).toBeInTheDocument()
    expect(screen.getByTestId('c2')).toBeInTheDocument()

    await act(async () => {
      fireEvent.keyDown(window, { key: 'Escape' })
    })
    expect(screen.getByTestId('c1')).toBeInTheDocument()
    expect(screen.queryByTestId('c2')).not.toBeInTheDocument()

    await act(async () => {
      fireEvent.keyDown(window, { key: 'Escape' })
    })
    expect(screen.queryByTestId('c1')).not.toBeInTheDocument()
  })
})

describe('Overlay a11y', () => {
  it('restores focus to trigger when a dropdown closes via Escape', async () => {
    render(<OverlayComponent trigger={Trigger}>{Content}</OverlayComponent>, {
      wrapper,
    })
    await act(async () => {
      fireEvent.click(screen.getByTestId('trigger'))
    })
    act(() => screen.getByTestId('inside').focus())
    await act(async () => {
      fireEvent.keyDown(window, { key: 'Escape' })
    })
    expect(screen.queryByTestId('content')).not.toBeInTheDocument()
    expect(document.activeElement).toBe(screen.getByTestId('trigger'))
  })

  it('does not steal focus when closed by clicking another focusable element', async () => {
    render(
      <>
        <OverlayComponent trigger={Trigger}>{Content}</OverlayComponent>
        <button type="button" data-testid="other">
          other
        </button>
      </>,
      { wrapper },
    )
    await act(async () => {
      fireEvent.click(screen.getByTestId('trigger'))
    })
    const other = screen.getByTestId('other')
    act(() => other.focus())
    await act(async () => {
      fireEvent.click(other)
    })
    expect(screen.queryByTestId('content')).not.toBeInTheDocument()
    expect(document.activeElement).toBe(other)
  })

  it('opens/closes on trigger focus/blur for hover overlays', async () => {
    vi.useFakeTimers()
    render(
      <OverlayComponent trigger={Trigger} openOn="hover" closeOn="hover">
        {Content}
      </OverlayComponent>,
      { wrapper },
    )
    const trigger = screen.getByTestId('trigger')
    await act(async () => {
      fireEvent.focusIn(trigger)
    })
    expect(screen.getByTestId('content')).toBeInTheDocument()
    await act(async () => {
      fireEvent.focusOut(trigger)
      vi.advanceTimersByTime(500)
    })
    expect(screen.queryByTestId('content')).not.toBeInTheDocument()
    vi.useRealTimers()
  })

  it('stays open when the trigger blurs while still hovered', async () => {
    vi.useFakeTimers()
    render(
      <OverlayComponent trigger={Trigger} openOn="hover" closeOn="hover">
        {Content}
      </OverlayComponent>,
      { wrapper },
    )
    const trigger = screen.getByTestId('trigger')
    await act(async () => {
      fireEvent.mouseEnter(trigger)
      fireEvent.focusIn(trigger)
    })
    expect(screen.getByTestId('content')).toBeInTheDocument()
    await act(async () => {
      fireEvent.focusOut(trigger)
      vi.advanceTimersByTime(500)
    })
    expect(screen.getByTestId('content')).toBeInTheDocument()
    // pointer leaving still closes it, even with focus elsewhere
    await act(async () => {
      fireEvent.mouseLeave(trigger)
      vi.advanceTimersByTime(500)
    })
    expect(screen.queryByTestId('content')).not.toBeInTheDocument()
    vi.useRealTimers()
  })

  it('uses aria-haspopup=dialog for popover and menu for dropdown', async () => {
    const { rerender } = render(
      <OverlayComponent trigger={Trigger} type="popover">
        {Content}
      </OverlayComponent>,
      { wrapper },
    )
    expect(screen.getByTestId('trigger')).toHaveAttribute(
      'aria-haspopup',
      'dialog',
    )
    rerender(
      <OverlayComponent trigger={Trigger} type="dropdown">
        {Content}
      </OverlayComponent>,
    )
    expect(screen.getByTestId('trigger')).toHaveAttribute(
      'aria-haspopup',
      'menu',
    )
  })

  it('tooltip: role=tooltip on content, aria-describedby on trigger', async () => {
    render(
      <OverlayComponent trigger={Trigger} type="tooltip" isOpen>
        {Content}
      </OverlayComponent>,
      { wrapper },
    )
    await act(async () => {})
    const content = screen.getByTestId('content')
    const trigger = screen.getByTestId('trigger')
    expect(content).toHaveAttribute('role', 'tooltip')
    expect(trigger).toHaveAttribute('aria-describedby', content.id)
    expect(trigger).not.toHaveAttribute('aria-expanded')
    expect(trigger).not.toHaveAttribute('aria-haspopup')
  })

  it('modal with no focusable children prevents Tab from escaping', async () => {
    render(
      <OverlayComponent trigger={Trigger} type="modal" isOpen closeOn="manual">
        <div data-testid="empty-modal" />
      </OverlayComponent>,
      { wrapper },
    )
    await act(async () => {})
    const ev = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true,
    })
    document.dispatchEvent(ev)
    expect(ev.defaultPrevented).toBe(true)
  })
})

describe('Overlay DOM children', () => {
  it('does not inject component-only props into DOM element children', async () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <OverlayComponent
        isOpen
        trigger={<button type="button" data-testid="trigger" />}
      >
        <div data-testid="content" />
      </OverlayComponent>,
      { wrapper },
    )
    await act(async () => {})
    const content = screen.getByTestId('content')
    expect(content.hasAttribute('alignx')).toBe(false)
    expect(content.hasAttribute('active')).toBe(false)
    expect(content.hasAttribute('showcontent')).toBe(false)
    const warned = err.mock.calls.some((c) =>
      String(c[0]).includes('React does not recognize'),
    )
    expect(warned).toBe(false)
  })
})

describe('Overlay parentContainer overflow', () => {
  it('restores previous inline overflow on close', async () => {
    const parent = document.createElement('div')
    parent.style.overflow = 'auto'
    document.body.appendChild(parent)
    render(
      <OverlayComponent trigger={Trigger} parentContainer={parent}>
        {Content}
      </OverlayComponent>,
      { wrapper },
    )
    await act(async () => {
      fireEvent.click(screen.getByTestId('trigger'))
    })
    expect(parent.style.overflow).toBe('hidden')
    await act(async () => {
      fireEvent.click(screen.getByTestId('trigger'))
    })
    expect(parent.style.overflow).toBe('auto')
    parent.remove()
  })
})
