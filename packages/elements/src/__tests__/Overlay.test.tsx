import { Provider, breakpoints } from '@vitus-labs/unistyle'
import { act, fireEvent, render, screen } from '@testing-library/react'
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

// Mock requestAnimationFrame for positioning
beforeEach(() => {
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
    cb(0)
    return 0
  })
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe('Overlay', () => {
  describe('statics', () => {
    it('has displayName', () => {
      expect(OverlayComponent.displayName).toBe(
        '@vitus-labs/elements/Overlay',
      )
    })

    it('has pkgName', () => {
      expect(OverlayComponent.pkgName).toBe('@vitus-labs/elements')
    })
  })

  describe('rendering', () => {
    it('renders trigger always', () => {
      render(
        <OverlayComponent trigger={Trigger}>
          {Content}
        </OverlayComponent>,
        { wrapper },
      )
      expect(screen.getByTestId('trigger')).toBeInTheDocument()
    })

    it('does not render content when closed', () => {
      render(
        <OverlayComponent trigger={Trigger}>
          {Content}
        </OverlayComponent>,
        { wrapper },
      )
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
      const TriggerManual = forwardRef<HTMLButtonElement, any>(
        (props, ref) => (
          <button
            type="button"
            ref={ref}
            data-testid="trigger"
            onClick={props.showContent}
          >
            Open
          </button>
        ),
      )
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
      const onOpen = jest.fn()
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
      const onClose = jest.fn()
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
        <OverlayComponent trigger={Trigger} isOpen type="modal" closeOn="manual">
          {Content}
        </OverlayComponent>,
        { wrapper },
      )
      expect(document.body.style.overflow).toBe('hidden')
    })

    it('restores body overflow when modal closes', async () => {
      const { unmount } = render(
        <OverlayComponent trigger={Trigger} isOpen type="modal" closeOn="manual">
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
            <div ref={props.ref} data-testid="fn-content" data-active={String(props.active)}>
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
})
