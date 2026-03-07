import { act, render, screen } from '@testing-library/react'
import Transition from '../Transition'

// Mock matchMedia (needed by useReducedMotion → useMediaQuery)
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
})

// Mock requestAnimationFrame for deterministic double-rAF testing
let rafCallbacks: (() => void)[] = []
const originalRaf = globalThis.requestAnimationFrame
const originalCaf = globalThis.cancelAnimationFrame

beforeEach(() => {
  vi.useFakeTimers()
  rafCallbacks = []

  vi.stubGlobal(
    'requestAnimationFrame',
    vi.fn((cb: () => void) => {
      rafCallbacks.push(cb)
      return rafCallbacks.length
    }),
  )

  vi.stubGlobal('cancelAnimationFrame', vi.fn())
})

afterEach(() => {
  vi.useRealTimers()
  vi.stubGlobal('requestAnimationFrame', originalRaf)
  vi.stubGlobal('cancelAnimationFrame', originalCaf)
})

const flushRaf = () => {
  const cbs = [...rafCallbacks]
  rafCallbacks = []
  for (const cb of cbs) cb()
}

const fireTransitionEnd = (el: HTMLElement) => {
  const event = new Event('transitionend', { bubbles: true })
  Object.defineProperty(event, 'target', { value: el })
  el.dispatchEvent(event)
}

describe('Transition', () => {
  it('renders children when show=true', () => {
    render(
      <Transition show>
        <div data-testid="child">Hello</div>
      </Transition>,
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('does not render children when show=false', () => {
    render(
      <Transition show={false}>
        <div data-testid="child">Hello</div>
      </Transition>,
    )
    expect(screen.queryByTestId('child')).not.toBeInTheDocument()
  })

  it('applies enter + enterFrom classes on entering', () => {
    const { rerender } = render(
      <Transition
        show={false}
        enter="t-enter"
        enterFrom="t-enter-from"
        enterTo="t-enter-to"
      >
        <div data-testid="child">Hello</div>
      </Transition>,
    )

    rerender(
      <Transition
        show
        enter="t-enter"
        enterFrom="t-enter-from"
        enterTo="t-enter-to"
      >
        <div data-testid="child">Hello</div>
      </Transition>,
    )

    const el = screen.getByTestId('child')
    expect(el.classList.contains('t-enter')).toBe(true)
    expect(el.classList.contains('t-enter-from')).toBe(true)
    expect(el.classList.contains('t-enter-to')).toBe(false)
  })

  it('swaps enterFrom to enterTo after double rAF', () => {
    const { rerender } = render(
      <Transition
        show={false}
        enter="t-enter"
        enterFrom="t-enter-from"
        enterTo="t-enter-to"
      >
        <div data-testid="child">Hello</div>
      </Transition>,
    )

    rerender(
      <Transition
        show
        enter="t-enter"
        enterFrom="t-enter-from"
        enterTo="t-enter-to"
      >
        <div data-testid="child">Hello</div>
      </Transition>,
    )

    // Flush first rAF (inside nextFrame)
    act(() => flushRaf())
    // Flush second rAF (the actual callback)
    act(() => flushRaf())

    const el = screen.getByTestId('child')
    expect(el.classList.contains('t-enter')).toBe(true)
    expect(el.classList.contains('t-enter-from')).toBe(false)
    expect(el.classList.contains('t-enter-to')).toBe(true)
  })

  it('cleans up enter classes after transitionend', () => {
    const { rerender } = render(
      <Transition
        show={false}
        enter="t-enter"
        enterFrom="t-enter-from"
        enterTo="t-enter-to"
      >
        <div data-testid="child">Hello</div>
      </Transition>,
    )

    rerender(
      <Transition
        show
        enter="t-enter"
        enterFrom="t-enter-from"
        enterTo="t-enter-to"
      >
        <div data-testid="child">Hello</div>
      </Transition>,
    )

    const el = screen.getByTestId('child')

    // Complete the double rAF
    act(() => flushRaf())
    act(() => flushRaf())

    // Fire transitionend
    act(() => fireTransitionEnd(el))

    // enter class should be removed, enterTo can remain
    expect(el.classList.contains('t-enter')).toBe(false)
  })

  it('applies leave classes and unmounts after leave completes', () => {
    const { rerender } = render(
      <Transition
        show
        leave="t-leave"
        leaveFrom="t-leave-from"
        leaveTo="t-leave-to"
      >
        <div data-testid="child">Hello</div>
      </Transition>,
    )

    expect(screen.getByTestId('child')).toBeInTheDocument()

    rerender(
      <Transition
        show={false}
        leave="t-leave"
        leaveFrom="t-leave-from"
        leaveTo="t-leave-to"
      >
        <div data-testid="child">Hello</div>
      </Transition>,
    )

    const el = screen.getByTestId('child')
    expect(el.classList.contains('t-leave')).toBe(true)
    expect(el.classList.contains('t-leave-from')).toBe(true)

    // Double rAF to swap classes
    act(() => flushRaf())
    act(() => flushRaf())

    expect(el.classList.contains('t-leave-from')).toBe(false)
    expect(el.classList.contains('t-leave-to')).toBe(true)

    // Fire transitionend to complete leave
    act(() => fireTransitionEnd(el))

    expect(screen.queryByTestId('child')).not.toBeInTheDocument()
  })

  it('unmount=false keeps element with display:none', () => {
    render(
      <Transition show={false} unmount={false}>
        <div data-testid="child">Hello</div>
      </Transition>,
    )

    const el = screen.getByTestId('child')
    expect(el.style.display).toBe('none')
  })

  it('fires lifecycle callbacks at correct times', () => {
    const onEnter = vi.fn()
    const onAfterEnter = vi.fn()
    const onLeave = vi.fn()
    const onAfterLeave = vi.fn()

    const { rerender } = render(
      <Transition
        show={false}
        onEnter={onEnter}
        onAfterEnter={onAfterEnter}
        onLeave={onLeave}
        onAfterLeave={onAfterLeave}
      >
        <div data-testid="child">Hello</div>
      </Transition>,
    )

    // Enter
    rerender(
      <Transition
        show
        onEnter={onEnter}
        onAfterEnter={onAfterEnter}
        onLeave={onLeave}
        onAfterLeave={onAfterLeave}
      >
        <div data-testid="child">Hello</div>
      </Transition>,
    )

    expect(onEnter).toHaveBeenCalledTimes(1)
    expect(onAfterEnter).not.toHaveBeenCalled()

    act(() => flushRaf())
    act(() => flushRaf())

    const el = screen.getByTestId('child')
    act(() => fireTransitionEnd(el))

    expect(onAfterEnter).toHaveBeenCalledTimes(1)

    // Leave
    rerender(
      <Transition
        show={false}
        onEnter={onEnter}
        onAfterEnter={onAfterEnter}
        onLeave={onLeave}
        onAfterLeave={onAfterLeave}
      >
        <div data-testid="child">Hello</div>
      </Transition>,
    )

    expect(onLeave).toHaveBeenCalledTimes(1)
    expect(onAfterLeave).not.toHaveBeenCalled()

    // Get the element before it unmounts
    const leavingEl = screen.getByTestId('child')

    act(() => flushRaf())
    act(() => flushRaf())
    act(() => fireTransitionEnd(leavingEl))

    expect(onAfterLeave).toHaveBeenCalledTimes(1)
  })

  it('timeout fallback completes transition when transitionend never fires', () => {
    const { rerender } = render(
      <Transition show={false} timeout={1000}>
        <div data-testid="child">Hello</div>
      </Transition>,
    )

    rerender(
      <Transition show timeout={1000}>
        <div data-testid="child">Hello</div>
      </Transition>,
    )

    expect(screen.getByTestId('child')).toBeInTheDocument()

    act(() => flushRaf())
    act(() => flushRaf())

    // No transitionend fired — timeout should force complete
    act(() => {
      vi.advanceTimersByTime(1000)
    })

    // Should still be mounted (entered state, not leaving)
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('applies style-object transitions', () => {
    const { rerender } = render(
      <Transition
        show={false}
        enterStyle={{ opacity: 0 }}
        enterToStyle={{ opacity: 1 }}
        enterTransition="opacity 300ms ease"
      >
        <div data-testid="child">Hello</div>
      </Transition>,
    )

    rerender(
      <Transition
        show
        enterStyle={{ opacity: 0 }}
        enterToStyle={{ opacity: 1 }}
        enterTransition="opacity 300ms ease"
      >
        <div data-testid="child">Hello</div>
      </Transition>,
    )

    const el = screen.getByTestId('child')
    expect(el.style.opacity).toBe('0')
    expect(el.style.transition).toBe('opacity 300ms ease')

    // After double rAF
    act(() => flushRaf())
    act(() => flushRaf())

    expect(el.style.opacity).toBe('1')
  })

  it('appear=true animates on initial mount', () => {
    const onEnter = vi.fn()

    render(
      <Transition
        show
        appear
        onEnter={onEnter}
        enter="t-enter"
        enterFrom="t-enter-from"
      >
        <div data-testid="child">Hello</div>
      </Transition>,
    )

    expect(onEnter).toHaveBeenCalledTimes(1)
    const el = screen.getByTestId('child')
    expect(el.classList.contains('t-enter')).toBe(true)
    expect(el.classList.contains('t-enter-from')).toBe(true)
  })

  it('preserves child existing className', () => {
    render(
      <Transition show enter="t-enter" enterFrom="t-from" appear>
        <div data-testid="child" className="existing">
          Hello
        </div>
      </Transition>,
    )

    const el = screen.getByTestId('child')
    expect(el.classList.contains('existing')).toBe(true)
    expect(el.classList.contains('t-enter')).toBe(true)
  })

  it('applies leave style-object transitions', () => {
    const { rerender } = render(
      <Transition
        show
        leaveStyle={{ opacity: 1 }}
        leaveToStyle={{ opacity: 0 }}
        leaveTransition="opacity 200ms ease-in"
      >
        <div data-testid="child">Hello</div>
      </Transition>,
    )

    rerender(
      <Transition
        show={false}
        leaveStyle={{ opacity: 1 }}
        leaveToStyle={{ opacity: 0 }}
        leaveTransition="opacity 200ms ease-in"
      >
        <div data-testid="child">Hello</div>
      </Transition>,
    )

    const el = screen.getByTestId('child')
    expect(el.style.opacity).toBe('1')
    expect(el.style.transition).toBe('opacity 200ms ease-in')

    act(() => flushRaf())
    act(() => flushRaf())

    expect(el.style.opacity).toBe('0')
  })

  it('unmount=false hides with display:none after leave completes', () => {
    const { rerender } = render(
      <Transition show unmount={false}>
        <div data-testid="child">Hello</div>
      </Transition>,
    )

    rerender(
      <Transition show={false} unmount={false}>
        <div data-testid="child">Hello</div>
      </Transition>,
    )

    const el = screen.getByTestId('child')

    act(() => flushRaf())
    act(() => flushRaf())
    act(() => fireTransitionEnd(el))

    // After leave completes with unmount=false, should have display:none
    expect(el.style.display).toBe('none')
  })

  it('unmount=false preserves existing child style', () => {
    render(
      <Transition show={false} unmount={false}>
        <div data-testid="child" style={{ color: 'red' }}>
          Hello
        </div>
      </Transition>,
    )

    const el = screen.getByTestId('child')
    expect(el.style.display).toBe('none')
    expect(el.style.color).toBe('red')
  })

  it('cleans up transition style and enter class on entered stage', () => {
    const { rerender } = render(
      <Transition
        show={false}
        enter="t-enter"
        enterTransition="opacity 300ms ease"
        enterStyle={{ opacity: 0 }}
        enterToStyle={{ opacity: 1 }}
      >
        <div data-testid="child">Hello</div>
      </Transition>,
    )

    rerender(
      <Transition
        show
        enter="t-enter"
        enterTransition="opacity 300ms ease"
        enterStyle={{ opacity: 0 }}
        enterToStyle={{ opacity: 1 }}
      >
        <div data-testid="child">Hello</div>
      </Transition>,
    )

    const el = screen.getByTestId('child')
    expect(el.style.transition).toBe('opacity 300ms ease')
    expect(el.classList.contains('t-enter')).toBe(true)

    act(() => flushRaf())
    act(() => flushRaf())
    act(() => fireTransitionEnd(el))

    // After entering -> entered, transition reset and enter class removed
    expect(el.style.transition).toBe('')
    expect(el.classList.contains('t-enter')).toBe(false)
  })
})

describe('Transition — leaveStyle and leaveToStyle', () => {
  it('applies leaveStyle on the first frame of leaving', () => {
    const { rerender } = render(
      <Transition
        show
        leaveStyle={{ opacity: 1, transform: 'scale(1)' }}
        leaveToStyle={{ opacity: 0, transform: 'scale(0.95)' }}
        leaveTransition="all 300ms ease"
      >
        <div data-testid="child">Hello</div>
      </Transition>,
    )

    rerender(
      <Transition
        show={false}
        leaveStyle={{ opacity: 1, transform: 'scale(1)' }}
        leaveToStyle={{ opacity: 0, transform: 'scale(0.95)' }}
        leaveTransition="all 300ms ease"
      >
        <div data-testid="child">Hello</div>
      </Transition>,
    )

    const el = screen.getByTestId('child')
    expect(el.style.opacity).toBe('1')
    expect(el.style.transform).toBe('scale(1)')
    expect(el.style.transition).toBe('all 300ms ease')
  })

  it('applies leaveToStyle after double rAF', () => {
    const { rerender } = render(
      <Transition
        show
        leaveStyle={{ opacity: 1, transform: 'scale(1)' }}
        leaveToStyle={{ opacity: 0, transform: 'scale(0.95)' }}
        leaveTransition="all 300ms ease"
      >
        <div data-testid="child">Hello</div>
      </Transition>,
    )

    rerender(
      <Transition
        show={false}
        leaveStyle={{ opacity: 1, transform: 'scale(1)' }}
        leaveToStyle={{ opacity: 0, transform: 'scale(0.95)' }}
        leaveTransition="all 300ms ease"
      >
        <div data-testid="child">Hello</div>
      </Transition>,
    )

    act(() => flushRaf())
    act(() => flushRaf())

    const el = screen.getByTestId('child')
    expect(el.style.opacity).toBe('0')
    expect(el.style.transform).toBe('scale(0.95)')
  })

  it('unmounts after leaveToStyle animation completes', () => {
    const onAfterLeave = vi.fn()

    const { rerender } = render(
      <Transition
        show
        leaveStyle={{ opacity: 1 }}
        leaveToStyle={{ opacity: 0 }}
        leaveTransition="opacity 200ms ease"
        onAfterLeave={onAfterLeave}
      >
        <div data-testid="child">Hello</div>
      </Transition>,
    )

    rerender(
      <Transition
        show={false}
        leaveStyle={{ opacity: 1 }}
        leaveToStyle={{ opacity: 0 }}
        leaveTransition="opacity 200ms ease"
        onAfterLeave={onAfterLeave}
      >
        <div data-testid="child">Hello</div>
      </Transition>,
    )

    const el = screen.getByTestId('child')
    act(() => flushRaf())
    act(() => flushRaf())
    act(() => fireTransitionEnd(el))

    expect(onAfterLeave).toHaveBeenCalledTimes(1)
    expect(screen.queryByTestId('child')).not.toBeInTheDocument()
  })
})

describe('Transition with reducedMotion', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })

  afterEach(() => {
    // Restore default (non-reduced) matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn((query: string) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })

  it('skips animation and mounts instantly', () => {
    const onEnter = vi.fn()
    const onAfterEnter = vi.fn()

    const { rerender } = render(
      <Transition show={false} onEnter={onEnter} onAfterEnter={onAfterEnter}>
        <div data-testid="child">Hello</div>
      </Transition>,
    )

    rerender(
      <Transition show onEnter={onEnter} onAfterEnter={onAfterEnter}>
        <div data-testid="child">Hello</div>
      </Transition>,
    )

    // Both callbacks fire immediately
    expect(onEnter).toHaveBeenCalledTimes(1)
    expect(onAfterEnter).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('skips animation and unmounts instantly', () => {
    const onLeave = vi.fn()
    const onAfterLeave = vi.fn()

    const { rerender } = render(
      <Transition show onLeave={onLeave} onAfterLeave={onAfterLeave}>
        <div data-testid="child">Hello</div>
      </Transition>,
    )

    rerender(
      <Transition show={false} onLeave={onLeave} onAfterLeave={onAfterLeave}>
        <div data-testid="child">Hello</div>
      </Transition>,
    )

    expect(onLeave).toHaveBeenCalledTimes(1)
    expect(onAfterLeave).toHaveBeenCalledTimes(1)
    expect(screen.queryByTestId('child')).not.toBeInTheDocument()
  })
})
