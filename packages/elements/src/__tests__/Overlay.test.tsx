import { act, fireEvent, render, screen } from '@testing-library/react'
import { breakpoints, Provider } from '@vitus-labs/unistyle'
import { forwardRef } from 'react'
import OverlayComponent from '../Overlay/component'

// Trigger and Content components that accept ref via forwardRef
const Trigger = forwardRef<HTMLButtonElement, any>((props, ref) => (
  <button type="button" ref={ref} data-testid="trigger" {...props}>
    {props.active ? 'Active' : 'Trigger'}
  </button>
))
Trigger.displayName = 'Trigger'

const Content = forwardRef<HTMLDivElement, any>((props, ref) => (
  <div ref={ref} data-testid="content" {...props}>
    Overlay Content
  </div>
))
Content.displayName = 'Content'

const wrapper = ({ children }: any) => (
  <Provider theme={breakpoints}>{children}</Provider>
)

// Helper to mock bounding rects on trigger and content elements
const mockBoundingRects = (
  triggerRect: Partial<DOMRect>,
  contentRect: Partial<DOMRect>,
) => {
  const defaultRect = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    toJSON: () => {},
  }

  const triggerEl = screen.getByTestId('trigger')
  const contentEl = screen.getByTestId('content')

  triggerEl.getBoundingClientRect = () =>
    ({
      ...defaultRect,
      ...triggerRect,
    }) as DOMRect

  contentEl.getBoundingClientRect = () =>
    ({
      ...defaultRect,
      ...contentRect,
    }) as DOMRect
}

// Mock requestAnimationFrame for positioning
beforeEach(() => {
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
    cb(0)
    return 0
  })
  // Set window dimensions
  Object.defineProperty(window, 'innerWidth', {
    value: 1024,
    writable: true,
    configurable: true,
  })
  Object.defineProperty(window, 'innerHeight', {
    value: 768,
    writable: true,
    configurable: true,
  })
})

afterEach(() => {
  vi.restoreAllMocks()
  document.body.style.overflow = ''
})

describe('Overlay', () => {
  describe('statics', () => {
    it('has displayName', () => {
      expect(OverlayComponent.displayName).toBe('@vitus-labs/elements/Overlay')
    })

    it('has pkgName', () => {
      expect(OverlayComponent.pkgName).toBe('@vitus-labs/elements')
    })
  })

  describe('rendering', () => {
    it('renders trigger always', () => {
      render(<OverlayComponent trigger={Trigger}>{Content}</OverlayComponent>, {
        wrapper,
      })
      expect(screen.getByTestId('trigger')).toBeInTheDocument()
    })

    it('does not render content when closed', () => {
      render(<OverlayComponent trigger={Trigger}>{Content}</OverlayComponent>, {
        wrapper,
      })
      expect(screen.queryByTestId('content')).not.toBeInTheDocument()
    })

    it('renders content when isOpen is true', () => {
      render(
        <OverlayComponent trigger={Trigger} isOpen>
          {Content}
        </OverlayComponent>,
        { wrapper },
      )
      expect(screen.getByTestId('content')).toBeInTheDocument()
    })
  })

  describe('click open/close', () => {
    it('opens on trigger click', async () => {
      render(
        <OverlayComponent trigger={Trigger} openOn="click" closeOn="manual">
          {Content}
        </OverlayComponent>,
        { wrapper },
      )
      expect(screen.queryByTestId('content')).not.toBeInTheDocument()
      await act(async () => {
        fireEvent.click(screen.getByTestId('trigger'))
      })
      expect(screen.getByTestId('content')).toBeInTheDocument()
    })

    it('closes on click when closeOn=click', async () => {
      render(
        <OverlayComponent trigger={Trigger} isOpen closeOn="click">
          {Content}
        </OverlayComponent>,
        { wrapper },
      )
      expect(screen.getByTestId('content')).toBeInTheDocument()
      await act(async () => {
        fireEvent.click(document.body)
      })
      expect(screen.queryByTestId('content')).not.toBeInTheDocument()
    })

    it('closes on trigger click when closeOn=clickOnTrigger', async () => {
      render(
        <OverlayComponent trigger={Trigger} isOpen closeOn="clickOnTrigger">
          {Content}
        </OverlayComponent>,
        { wrapper },
      )
      expect(screen.getByTestId('content')).toBeInTheDocument()
      await act(async () => {
        fireEvent.click(screen.getByTestId('trigger'))
      })
      expect(screen.queryByTestId('content')).not.toBeInTheDocument()
    })
  })

  describe('ESC key', () => {
    it('closes on Escape key press', async () => {
      render(
        <OverlayComponent trigger={Trigger} isOpen closeOnEsc>
          {Content}
        </OverlayComponent>,
        { wrapper },
      )
      expect(screen.getByTestId('content')).toBeInTheDocument()
      await act(async () => {
        fireEvent.keyDown(window, { key: 'Escape' })
      })
      expect(screen.queryByTestId('content')).not.toBeInTheDocument()
    })

    it('does not close on Escape when closeOnEsc=false', async () => {
      render(
        <OverlayComponent
          trigger={Trigger}
          isOpen
          closeOnEsc={false}
          closeOn="manual"
        >
          {Content}
        </OverlayComponent>,
        { wrapper },
      )
      expect(screen.getByTestId('content')).toBeInTheDocument()
      await act(async () => {
        fireEvent.keyDown(window, { key: 'Escape' })
      })
      expect(screen.getByTestId('content')).toBeInTheDocument()
    })
  })

  describe('manual mode', () => {
    it('passes showContent and hideContent to trigger when openOn=manual', () => {
      const TriggerWithHandlers = forwardRef<HTMLButtonElement, any>(
        (props, ref) => (
          <button
            type="button"
            ref={ref}
            data-testid="trigger"
            data-has-show={String(typeof props.showContent === 'function')}
            data-has-hide={String(typeof props.hideContent === 'function')}
            onClick={props.showContent}
          >
            Trigger
          </button>
        ),
      )
      TriggerWithHandlers.displayName = 'TriggerWithHandlers'

      render(
        <OverlayComponent trigger={TriggerWithHandlers} openOn="manual">
          {Content}
        </OverlayComponent>,
        { wrapper },
      )
      expect(screen.getByTestId('trigger')).toHaveAttribute(
        'data-has-show',
        'true',
      )
      expect(screen.getByTestId('trigger')).toHaveAttribute(
        'data-has-hide',
        'true',
      )
    })

    it('opens via showContent callback', async () => {
      const TriggerManual = forwardRef<HTMLButtonElement, any>((props, ref) => (
        <button
          type="button"
          ref={ref}
          data-testid="trigger"
          onClick={props.showContent}
        >
          Open
        </button>
      ))
      TriggerManual.displayName = 'TriggerManual'

      render(
        <OverlayComponent
          trigger={TriggerManual}
          openOn="manual"
          closeOn="manual"
        >
          {Content}
        </OverlayComponent>,
        { wrapper },
      )
      expect(screen.queryByTestId('content')).not.toBeInTheDocument()
      await act(async () => {
        fireEvent.click(screen.getByTestId('trigger'))
      })
      expect(screen.getByTestId('content')).toBeInTheDocument()
    })
  })

  describe('disabled', () => {
    it('does not open when disabled', async () => {
      render(
        <OverlayComponent trigger={Trigger} openOn="click" disabled>
          {Content}
        </OverlayComponent>,
        { wrapper },
      )
      await act(async () => {
        fireEvent.click(screen.getByTestId('trigger'))
      })
      expect(screen.queryByTestId('content')).not.toBeInTheDocument()
    })

    it('closes content when disabled is set while open', () => {
      const { rerender } = render(
        <Provider theme={breakpoints}>
          <OverlayComponent trigger={Trigger} isOpen closeOn="manual">
            {Content}
          </OverlayComponent>
        </Provider>,
      )
      expect(screen.getByTestId('content')).toBeInTheDocument()
      rerender(
        <Provider theme={breakpoints}>
          <OverlayComponent trigger={Trigger} isOpen closeOn="manual" disabled>
            {Content}
          </OverlayComponent>
        </Provider>,
      )
      expect(screen.queryByTestId('content')).not.toBeInTheDocument()
    })
  })

  describe('callbacks', () => {
    it('calls onOpen when overlay opens', async () => {
      const onOpen = vi.fn()
      render(
        <OverlayComponent
          trigger={Trigger}
          openOn="click"
          closeOn="manual"
          onOpen={onOpen}
        >
          {Content}
        </OverlayComponent>,
        { wrapper },
      )
      await act(async () => {
        fireEvent.click(screen.getByTestId('trigger'))
      })
      expect(onOpen).toHaveBeenCalledTimes(1)
    })

    it('calls onClose when overlay closes', async () => {
      const onClose = vi.fn()
      render(
        <OverlayComponent
          trigger={Trigger}
          isOpen
          closeOn="click"
          onClose={onClose}
        >
          {Content}
        </OverlayComponent>,
        { wrapper },
      )
      await act(async () => {
        fireEvent.click(document.body)
      })
      // Called from both effect cleanup (previous active=true closure) and
      // effect body (active transition true→false)
      expect(onClose).toHaveBeenCalled()
    })
  })

  describe('modal type', () => {
    it('sets body overflow hidden when modal is open', () => {
      render(
        <OverlayComponent
          trigger={Trigger}
          isOpen
          type="modal"
          closeOn="manual"
        >
          {Content}
        </OverlayComponent>,
        { wrapper },
      )
      expect(document.body.style.overflow).toBe('hidden')
    })

    it('restores body overflow when modal closes', async () => {
      const { unmount } = render(
        <OverlayComponent
          trigger={Trigger}
          isOpen
          type="modal"
          closeOn="manual"
        >
          {Content}
        </OverlayComponent>,
        { wrapper },
      )
      expect(document.body.style.overflow).toBe('hidden')
      unmount()
      expect(document.body.style.overflow).toBe('')
    })
  })

  describe('render function pattern', () => {
    it('supports function children', () => {
      render(
        <OverlayComponent trigger={Trigger} isOpen closeOn="manual">
          {(props: any) => (
            <div
              ref={props.ref}
              data-testid="fn-content"
              data-active={String(props.active)}
            >
              Function Content
            </div>
          )}
        </OverlayComponent>,
        { wrapper },
      )
      expect(screen.getByTestId('fn-content')).toHaveTextContent(
        'Function Content',
      )
      expect(screen.getByTestId('fn-content')).toHaveAttribute(
        'data-active',
        'true',
      )
    })

    it('supports function trigger', async () => {
      render(
        <OverlayComponent
          trigger={(props: any) => (
            <button
              type="button"
              ref={props.ref}
              data-testid="fn-trigger"
              data-active={String(props.active)}
            >
              Fn Trigger
            </button>
          )}
          isOpen
          closeOn="manual"
        >
          {Content}
        </OverlayComponent>,
        { wrapper },
      )
      expect(screen.getByTestId('fn-trigger')).toHaveAttribute(
        'data-active',
        'true',
      )
    })
  })

  describe('positioning: align=bottom (default)', () => {
    it('positions content below trigger with align=bottom, alignX=left', () => {
      render(
        <OverlayComponent
          trigger={Trigger}
          isOpen
          closeOn="manual"
          align="bottom"
          alignX="left"
        >
          {Content}
        </OverlayComponent>,
        { wrapper },
      )
      mockBoundingRects(
        { top: 100, left: 50, right: 150, bottom: 130, width: 100, height: 30 },
        { top: 0, left: 0, right: 200, bottom: 100, width: 200, height: 100 },
      )
      // Trigger resize to recalculate position
      act(() => {
        fireEvent(window, new Event('resize'))
      })
      const content = screen.getByTestId('content')
      expect(content.style.position).toBe('fixed')
      expect(content.style.top).not.toBe('')
    })

    it('positions with align=bottom, alignX=center', () => {
      render(
        <OverlayComponent
          trigger={Trigger}
          isOpen
          closeOn="manual"
          align="bottom"
          alignX="center"
        >
          {Content}
        </OverlayComponent>,
        { wrapper },
      )
      mockBoundingRects(
        {
          top: 100,
          left: 400,
          right: 600,
          bottom: 130,
          width: 200,
          height: 30,
        },
        { top: 0, left: 0, right: 100, bottom: 50, width: 100, height: 50 },
      )
      act(() => {
        fireEvent(window, new Event('resize'))
      })
      const content = screen.getByTestId('content')
      expect(content.style.top).not.toBe('')
    })

    it('positions with align=bottom, alignX=right', () => {
      render(
        <OverlayComponent
          trigger={Trigger}
          isOpen
          closeOn="manual"
          align="bottom"
          alignX="right"
        >
          {Content}
        </OverlayComponent>,
        { wrapper },
      )
      mockBoundingRects(
        {
          top: 100,
          left: 800,
          right: 1000,
          bottom: 130,
          width: 200,
          height: 30,
        },
        { top: 0, left: 0, right: 150, bottom: 50, width: 150, height: 50 },
      )
      act(() => {
        fireEvent(window, new Event('resize'))
      })
      const content = screen.getByTestId('content')
      expect(content.style.position).toBe('fixed')
    })
  })

  describe('positioning: align=top', () => {
    it('positions content above trigger', () => {
      render(
        <OverlayComponent
          trigger={Trigger}
          isOpen
          closeOn="manual"
          align="top"
          alignX="left"
        >
          {Content}
        </OverlayComponent>,
        { wrapper },
      )
      mockBoundingRects(
        { top: 400, left: 50, right: 150, bottom: 430, width: 100, height: 30 },
        { top: 0, left: 0, right: 200, bottom: 100, width: 200, height: 100 },
      )
      act(() => {
        fireEvent(window, new Event('resize'))
      })
      const content = screen.getByTestId('content')
      expect(content.style.position).toBe('fixed')
    })

    it('flips to bottom when no room on top', () => {
      render(
        <OverlayComponent
          trigger={Trigger}
          isOpen
          closeOn="manual"
          align="top"
          alignX="left"
        >
          {Content}
        </OverlayComponent>,
        { wrapper },
      )
      // Trigger near top of viewport — not enough room for 100px content above
      mockBoundingRects(
        { top: 50, left: 50, right: 150, bottom: 80, width: 100, height: 30 },
        { top: 0, left: 0, right: 200, bottom: 100, width: 200, height: 100 },
      )
      act(() => {
        fireEvent(window, new Event('resize'))
      })
      const content = screen.getByTestId('content')
      expect(content.style.position).toBe('fixed')
    })
  })

  describe('positioning: align=left', () => {
    it('positions content to the left of trigger', () => {
      render(
        <OverlayComponent
          trigger={Trigger}
          isOpen
          closeOn="manual"
          align="left"
          alignY="top"
        >
          {Content}
        </OverlayComponent>,
        { wrapper },
      )
      mockBoundingRects(
        {
          top: 300,
          left: 500,
          right: 600,
          bottom: 330,
          width: 100,
          height: 30,
        },
        { top: 0, left: 0, right: 200, bottom: 100, width: 200, height: 100 },
      )
      act(() => {
        fireEvent(window, new Event('resize'))
      })
      const content = screen.getByTestId('content')
      expect(content.style.position).toBe('fixed')
    })

    it('positions with align=left, alignY=center', () => {
      render(
        <OverlayComponent
          trigger={Trigger}
          isOpen
          closeOn="manual"
          align="left"
          alignY="center"
        >
          {Content}
        </OverlayComponent>,
        { wrapper },
      )
      mockBoundingRects(
        {
          top: 300,
          left: 500,
          right: 600,
          bottom: 360,
          width: 100,
          height: 60,
        },
        { top: 0, left: 0, right: 100, bottom: 40, width: 100, height: 40 },
      )
      act(() => {
        fireEvent(window, new Event('resize'))
      })
      const content = screen.getByTestId('content')
      expect(content.style.position).toBe('fixed')
    })

    it('positions with align=left, alignY=bottom', () => {
      render(
        <OverlayComponent
          trigger={Trigger}
          isOpen
          closeOn="manual"
          align="left"
          alignY="bottom"
        >
          {Content}
        </OverlayComponent>,
        { wrapper },
      )
      mockBoundingRects(
        {
          top: 300,
          left: 500,
          right: 600,
          bottom: 330,
          width: 100,
          height: 30,
        },
        { top: 0, left: 0, right: 100, bottom: 50, width: 100, height: 50 },
      )
      act(() => {
        fireEvent(window, new Event('resize'))
      })
      const content = screen.getByTestId('content')
      expect(content.style.position).toBe('fixed')
    })

    it('flips to right when no room on left', () => {
      render(
        <OverlayComponent
          trigger={Trigger}
          isOpen
          closeOn="manual"
          align="left"
          alignY="top"
        >
          {Content}
        </OverlayComponent>,
        { wrapper },
      )
      // Trigger near left edge — not enough room for 200px content
      mockBoundingRects(
        {
          top: 300,
          left: 100,
          right: 200,
          bottom: 330,
          width: 100,
          height: 30,
        },
        { top: 0, left: 0, right: 200, bottom: 100, width: 200, height: 100 },
      )
      act(() => {
        fireEvent(window, new Event('resize'))
      })
      const content = screen.getByTestId('content')
      expect(content.style.position).toBe('fixed')
    })
  })

  describe('positioning: align=right', () => {
    it('positions content to the right of trigger', () => {
      render(
        <OverlayComponent
          trigger={Trigger}
          isOpen
          closeOn="manual"
          align="right"
          alignY="top"
        >
          {Content}
        </OverlayComponent>,
        { wrapper },
      )
      mockBoundingRects(
        {
          top: 300,
          left: 100,
          right: 200,
          bottom: 330,
          width: 100,
          height: 30,
        },
        { top: 0, left: 0, right: 150, bottom: 80, width: 150, height: 80 },
      )
      act(() => {
        fireEvent(window, new Event('resize'))
      })
      const content = screen.getByTestId('content')
      expect(content.style.position).toBe('fixed')
    })

    it('flips to left when no room on right', () => {
      render(
        <OverlayComponent
          trigger={Trigger}
          isOpen
          closeOn="manual"
          align="right"
          alignY="top"
        >
          {Content}
        </OverlayComponent>,
        { wrapper },
      )
      // Trigger near right edge
      mockBoundingRects(
        {
          top: 300,
          left: 800,
          right: 1000,
          bottom: 330,
          width: 200,
          height: 30,
        },
        { top: 0, left: 0, right: 200, bottom: 100, width: 200, height: 100 },
      )
      act(() => {
        fireEvent(window, new Event('resize'))
      })
      const content = screen.getByTestId('content')
      expect(content.style.position).toBe('fixed')
    })
  })

  describe('positioning: modal type', () => {
    it('positions modal with alignX=left, alignY=top', () => {
      render(
        <OverlayComponent
          trigger={Trigger}
          isOpen
          closeOn="manual"
          type="modal"
          alignX="left"
          alignY="top"
          offsetX={10}
          offsetY={20}
        >
          {Content}
        </OverlayComponent>,
        { wrapper },
      )
      mockBoundingRects(
        { top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 },
        { top: 0, left: 0, right: 300, bottom: 200, width: 300, height: 200 },
      )
      act(() => {
        fireEvent(window, new Event('resize'))
      })
      const content = screen.getByTestId('content')
      expect(content.style.position).toBe('fixed')
    })

    it('positions modal with alignX=center, alignY=center', () => {
      render(
        <OverlayComponent
          trigger={Trigger}
          isOpen
          closeOn="manual"
          type="modal"
          alignX="center"
          alignY="center"
        >
          {Content}
        </OverlayComponent>,
        { wrapper },
      )
      mockBoundingRects(
        { top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 },
        { top: 0, left: 0, right: 300, bottom: 200, width: 300, height: 200 },
      )
      act(() => {
        fireEvent(window, new Event('resize'))
      })
      const content = screen.getByTestId('content')
      expect(content.style.position).toBe('fixed')
    })

    it('positions modal with alignX=right, alignY=bottom', () => {
      render(
        <OverlayComponent
          trigger={Trigger}
          isOpen
          closeOn="manual"
          type="modal"
          alignX="right"
          alignY="bottom"
          offsetX={5}
          offsetY={10}
        >
          {Content}
        </OverlayComponent>,
        { wrapper },
      )
      mockBoundingRects(
        { top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 },
        { top: 0, left: 0, right: 400, bottom: 300, width: 400, height: 300 },
      )
      act(() => {
        fireEvent(window, new Event('resize'))
      })
      const content = screen.getByTestId('content')
      expect(content.style.position).toBe('fixed')
    })
  })

  describe('positioning: position=absolute', () => {
    it('adjusts for offsetParent when position=absolute', () => {
      render(
        <OverlayComponent
          trigger={Trigger}
          isOpen
          closeOn="manual"
          position="absolute"
          align="bottom"
          alignX="left"
        >
          {Content}
        </OverlayComponent>,
        { wrapper },
      )
      const contentEl = screen.getByTestId('content')
      // Mock offsetParent with a position
      const fakeParent = document.createElement('div')
      fakeParent.getBoundingClientRect = () =>
        ({
          top: 50,
          left: 30,
          right: 530,
          bottom: 550,
          width: 500,
          height: 500,
          x: 30,
          y: 50,
          toJSON: () => {},
        }) as DOMRect
      Object.defineProperty(contentEl, 'offsetParent', {
        value: fakeParent,
        configurable: true,
      })
      mockBoundingRects(
        {
          top: 200,
          left: 100,
          right: 200,
          bottom: 230,
          width: 100,
          height: 30,
        },
        { top: 0, left: 0, right: 150, bottom: 80, width: 150, height: 80 },
      )
      act(() => {
        fireEvent(window, new Event('resize'))
      })
      expect(contentEl.style.position).toBe('absolute')
    })
  })

  describe('click: clickOutsideContent', () => {
    it('stays open when clicking inside content', async () => {
      render(
        <OverlayComponent
          trigger={Trigger}
          isOpen
          closeOn="clickOutsideContent"
        >
          {Content}
        </OverlayComponent>,
        { wrapper },
      )
      expect(screen.getByTestId('content')).toBeInTheDocument()
      await act(async () => {
        fireEvent.click(screen.getByTestId('content'))
      })
      expect(screen.getByTestId('content')).toBeInTheDocument()
    })

    it('closes when clicking outside content', async () => {
      render(
        <OverlayComponent
          trigger={Trigger}
          isOpen
          closeOn="clickOutsideContent"
        >
          {Content}
        </OverlayComponent>,
        { wrapper },
      )
      expect(screen.getByTestId('content')).toBeInTheDocument()
      await act(async () => {
        fireEvent.click(document.body)
      })
      expect(screen.queryByTestId('content')).not.toBeInTheDocument()
    })
  })

  describe('hover open/close', () => {
    it('opens on mouseenter and closes on mouseleave', async () => {
      render(
        <OverlayComponent trigger={Trigger} openOn="hover" closeOn="hover">
          {Content}
        </OverlayComponent>,
        { wrapper },
      )
      expect(screen.queryByTestId('content')).not.toBeInTheDocument()
      const trigger = screen.getByTestId('trigger')

      // Hover over trigger to open
      await act(async () => {
        fireEvent.mouseEnter(trigger)
      })
      expect(screen.getByTestId('content')).toBeInTheDocument()

      // Leave trigger — content should hide after timeout
      vi.useFakeTimers()
      await act(async () => {
        fireEvent.mouseLeave(trigger)
      })
      act(() => {
        vi.advanceTimersByTime(200)
      })
      expect(screen.queryByTestId('content')).not.toBeInTheDocument()
      vi.useRealTimers()
    })

    it('stays open when moving from trigger to content', async () => {
      render(
        <OverlayComponent trigger={Trigger} openOn="hover" closeOn="hover">
          {Content}
        </OverlayComponent>,
        { wrapper },
      )
      const trigger = screen.getByTestId('trigger')

      // Open via hover
      await act(async () => {
        fireEvent.mouseEnter(trigger)
      })
      expect(screen.getByTestId('content')).toBeInTheDocument()

      vi.useFakeTimers()
      // Leave trigger (starts close timer)
      await act(async () => {
        fireEvent.mouseLeave(trigger)
      })
      // Enter content before timeout (cancels close timer)
      await act(async () => {
        fireEvent.mouseEnter(screen.getByTestId('content'))
      })
      act(() => {
        vi.advanceTimersByTime(200)
      })
      // Content should still be visible
      expect(screen.getByTestId('content')).toBeInTheDocument()

      // Leave content to close
      await act(async () => {
        fireEvent.mouseLeave(screen.getByTestId('content'))
      })
      act(() => {
        vi.advanceTimersByTime(200)
      })
      expect(screen.queryByTestId('content')).not.toBeInTheDocument()
      vi.useRealTimers()
    })

    it('closes on scroll when closeOn=hover', async () => {
      render(
        <OverlayComponent trigger={Trigger} openOn="hover" closeOn="hover">
          {Content}
        </OverlayComponent>,
        { wrapper },
      )
      const trigger = screen.getByTestId('trigger')
      await act(async () => {
        fireEvent.mouseEnter(trigger)
      })
      expect(screen.getByTestId('content')).toBeInTheDocument()
      await act(async () => {
        fireEvent.scroll(window)
      })
      expect(screen.queryByTestId('content')).not.toBeInTheDocument()
    })
  })

  describe('parentContainer', () => {
    it('attaches scroll listener to parentContainer', async () => {
      const parentContainer = document.createElement('div')
      document.body.appendChild(parentContainer)

      render(
        <OverlayComponent
          trigger={Trigger}
          isOpen
          closeOn="manual"
          parentContainer={parentContainer}
        >
          {Content}
        </OverlayComponent>,
        { wrapper },
      )
      expect(parentContainer.style.overflow).toBe('hidden')
      expect(screen.getByTestId('content')).toBeInTheDocument()

      document.body.removeChild(parentContainer)
    })

    it('does not set overflow hidden when closeOn=hover', async () => {
      const parentContainer = document.createElement('div')
      document.body.appendChild(parentContainer)

      render(
        <OverlayComponent
          trigger={Trigger}
          isOpen
          closeOn="hover"
          openOn="hover"
          parentContainer={parentContainer}
        >
          {Content}
        </OverlayComponent>,
        { wrapper },
      )
      expect(parentContainer.style.overflow).not.toBe('hidden')

      document.body.removeChild(parentContainer)
    })

    it('restores overflow on cleanup', () => {
      const parentContainer = document.createElement('div')
      document.body.appendChild(parentContainer)

      const { unmount } = render(
        <OverlayComponent
          trigger={Trigger}
          isOpen
          closeOn="manual"
          parentContainer={parentContainer}
        >
          {Content}
        </OverlayComponent>,
        { wrapper },
      )
      expect(parentContainer.style.overflow).toBe('hidden')
      unmount()
      expect(parentContainer.style.overflow).toBe('')

      document.body.removeChild(parentContainer)
    })
  })

  describe('scroll and resize events', () => {
    it('recalculates position on window scroll', () => {
      render(
        <OverlayComponent trigger={Trigger} isOpen closeOn="manual">
          {Content}
        </OverlayComponent>,
        { wrapper },
      )
      mockBoundingRects(
        { top: 100, left: 50, right: 150, bottom: 130, width: 100, height: 30 },
        { top: 0, left: 0, right: 200, bottom: 100, width: 200, height: 100 },
      )
      act(() => {
        fireEvent.scroll(window)
      })
      const content = screen.getByTestId('content')
      expect(content.style.position).toBe('fixed')
    })

    it('recalculates position on window resize', () => {
      render(
        <OverlayComponent trigger={Trigger} isOpen closeOn="manual">
          {Content}
        </OverlayComponent>,
        { wrapper },
      )
      mockBoundingRects(
        { top: 100, left: 50, right: 150, bottom: 130, width: 100, height: 30 },
        { top: 0, left: 0, right: 200, bottom: 100, width: 200, height: 100 },
      )
      act(() => {
        fireEvent(window, new Event('resize'))
      })
      const content = screen.getByTestId('content')
      expect(content.style.position).toBe('fixed')
    })
  })
})
