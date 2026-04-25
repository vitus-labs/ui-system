import { act, render, screen } from '@testing-library/react'
import TransitionItem from '../kinetic/TransitionItem'
import { fireTransitionEnd, setupMatchMedia, setupRaf } from './setupFixtures'

setupMatchMedia()
const { flushRaf } = setupRaf()

// ─── Rendering ──────────────────────────────────────────────

describe('TransitionItem — rendering', () => {
  it('renders child when show=true', () => {
    render(
      <TransitionItem show>
        <div data-testid="child">Hello</div>
      </TransitionItem>,
    )

    expect(screen.getByTestId('child')).toBeInTheDocument()
    expect(screen.getByTestId('child').textContent).toBe('Hello')
  })

  it('unmounts child when show=false and unmount=true (default)', () => {
    render(
      <TransitionItem show={false}>
        <div data-testid="child">Hello</div>
      </TransitionItem>,
    )

    expect(screen.queryByTestId('child')).not.toBeInTheDocument()
  })

  it('hides with display:none when show=false and unmount=false', () => {
    render(
      <TransitionItem show={false} unmount={false}>
        <div data-testid="child">Hello</div>
      </TransitionItem>,
    )

    const el = screen.getByTestId('child')
    expect(el).toBeInTheDocument()
    expect(el.style.display).toBe('none')
  })
})

// ─── Style-based enter transition ───────────────────────────

describe('TransitionItem — style-based enter', () => {
  it('applies enterStyle on entering', () => {
    const { rerender } = render(
      <TransitionItem
        show={false}
        enterStyle={{ opacity: 0 }}
        enterToStyle={{ opacity: 1 }}
        enterTransition="opacity 300ms ease"
      >
        <div data-testid="child">Hello</div>
      </TransitionItem>,
    )

    rerender(
      <TransitionItem
        show
        enterStyle={{ opacity: 0 }}
        enterToStyle={{ opacity: 1 }}
        enterTransition="opacity 300ms ease"
      >
        <div data-testid="child">Hello</div>
      </TransitionItem>,
    )

    const el = screen.getByTestId('child')
    expect(el.style.opacity).toBe('0')
    expect(el.style.transition).toBe('opacity 300ms ease')
  })

  it('applies enterToStyle after rAF on entering', () => {
    const { rerender } = render(
      <TransitionItem
        show={false}
        enterStyle={{ opacity: 0 }}
        enterToStyle={{ opacity: 1 }}
        enterTransition="opacity 300ms ease"
      >
        <div data-testid="child">Hello</div>
      </TransitionItem>,
    )

    rerender(
      <TransitionItem
        show
        enterStyle={{ opacity: 0 }}
        enterToStyle={{ opacity: 1 }}
        enterTransition="opacity 300ms ease"
      >
        <div data-testid="child">Hello</div>
      </TransitionItem>,
    )

    const el = screen.getByTestId('child')
    expect(el.style.opacity).toBe('0')

    // Double rAF (nextFrame uses nested rAF)
    act(() => flushRaf())
    act(() => flushRaf())

    expect(el.style.opacity).toBe('1')
  })
})

// ─── Enter callbacks ────────────────────────────────────────

describe('TransitionItem — enter callbacks', () => {
  it('fires onEnter callback when entering starts', () => {
    const onEnter = vi.fn()

    const { rerender } = render(
      <TransitionItem
        show={false}
        enterStyle={{ opacity: 0 }}
        enterToStyle={{ opacity: 1 }}
        enterTransition="opacity 300ms ease"
        onEnter={onEnter}
      >
        <div data-testid="child">Hello</div>
      </TransitionItem>,
    )

    expect(onEnter).not.toHaveBeenCalled()

    rerender(
      <TransitionItem
        show
        enterStyle={{ opacity: 0 }}
        enterToStyle={{ opacity: 1 }}
        enterTransition="opacity 300ms ease"
        onEnter={onEnter}
      >
        <div data-testid="child">Hello</div>
      </TransitionItem>,
    )

    expect(onEnter).toHaveBeenCalledTimes(1)
  })

  it('fires onAfterEnter after transition completes', () => {
    const onAfterEnter = vi.fn()

    const { rerender } = render(
      <TransitionItem
        show={false}
        enterStyle={{ opacity: 0 }}
        enterToStyle={{ opacity: 1 }}
        enterTransition="opacity 300ms ease"
        onAfterEnter={onAfterEnter}
      >
        <div data-testid="child">Hello</div>
      </TransitionItem>,
    )

    rerender(
      <TransitionItem
        show
        enterStyle={{ opacity: 0 }}
        enterToStyle={{ opacity: 1 }}
        enterTransition="opacity 300ms ease"
        onAfterEnter={onAfterEnter}
      >
        <div data-testid="child">Hello</div>
      </TransitionItem>,
    )

    expect(onAfterEnter).not.toHaveBeenCalled()

    const el = screen.getByTestId('child')
    act(() => flushRaf())
    act(() => flushRaf())
    act(() => fireTransitionEnd(el))

    expect(onAfterEnter).toHaveBeenCalledTimes(1)
  })
})

// ─── Style-based leave transition ───────────────────────────

describe('TransitionItem — style-based leave', () => {
  it('applies leaveStyle on leaving', () => {
    const { rerender } = render(
      <TransitionItem
        show
        enterStyle={{ opacity: 0 }}
        enterToStyle={{ opacity: 1 }}
        enterTransition="opacity 300ms ease"
        leaveStyle={{ opacity: 1 }}
        leaveToStyle={{ opacity: 0 }}
        leaveTransition="opacity 200ms ease-in"
      >
        <div data-testid="child">Hello</div>
      </TransitionItem>,
    )

    // Trigger leave
    rerender(
      <TransitionItem
        show={false}
        enterStyle={{ opacity: 0 }}
        enterToStyle={{ opacity: 1 }}
        enterTransition="opacity 300ms ease"
        leaveStyle={{ opacity: 1 }}
        leaveToStyle={{ opacity: 0 }}
        leaveTransition="opacity 200ms ease-in"
      >
        <div data-testid="child">Hello</div>
      </TransitionItem>,
    )

    const el = screen.getByTestId('child')
    expect(el.style.opacity).toBe('1')
    expect(el.style.transition).toBe('opacity 200ms ease-in')
  })

  it('applies leaveToStyle after rAF on leaving', () => {
    const { rerender } = render(
      <TransitionItem
        show
        leaveStyle={{ opacity: 1 }}
        leaveToStyle={{ opacity: 0 }}
        leaveTransition="opacity 200ms ease-in"
      >
        <div data-testid="child">Hello</div>
      </TransitionItem>,
    )

    rerender(
      <TransitionItem
        show={false}
        leaveStyle={{ opacity: 1 }}
        leaveToStyle={{ opacity: 0 }}
        leaveTransition="opacity 200ms ease-in"
      >
        <div data-testid="child">Hello</div>
      </TransitionItem>,
    )

    const el = screen.getByTestId('child')
    expect(el.style.opacity).toBe('1')

    act(() => flushRaf())
    act(() => flushRaf())

    expect(el.style.opacity).toBe('0')
  })
})

// ─── Leave callbacks ────────────────────────────────────────

describe('TransitionItem — leave callbacks', () => {
  it('fires onLeave when leaving starts', () => {
    const onLeave = vi.fn()

    const { rerender } = render(
      <TransitionItem
        show
        leaveStyle={{ opacity: 1 }}
        leaveToStyle={{ opacity: 0 }}
        leaveTransition="opacity 200ms ease-in"
        onLeave={onLeave}
      >
        <div data-testid="child">Hello</div>
      </TransitionItem>,
    )

    expect(onLeave).not.toHaveBeenCalled()

    rerender(
      <TransitionItem
        show={false}
        leaveStyle={{ opacity: 1 }}
        leaveToStyle={{ opacity: 0 }}
        leaveTransition="opacity 200ms ease-in"
        onLeave={onLeave}
      >
        <div data-testid="child">Hello</div>
      </TransitionItem>,
    )

    expect(onLeave).toHaveBeenCalledTimes(1)
  })

  it('fires onAfterLeave after leave transition completes', () => {
    const onAfterLeave = vi.fn()

    const { rerender } = render(
      <TransitionItem
        show
        leaveStyle={{ opacity: 1 }}
        leaveToStyle={{ opacity: 0 }}
        leaveTransition="opacity 200ms ease-in"
        onAfterLeave={onAfterLeave}
      >
        <div data-testid="child">Hello</div>
      </TransitionItem>,
    )

    rerender(
      <TransitionItem
        show={false}
        leaveStyle={{ opacity: 1 }}
        leaveToStyle={{ opacity: 0 }}
        leaveTransition="opacity 200ms ease-in"
        onAfterLeave={onAfterLeave}
      >
        <div data-testid="child">Hello</div>
      </TransitionItem>,
    )

    expect(onAfterLeave).not.toHaveBeenCalled()

    const el = screen.getByTestId('child')
    act(() => flushRaf())
    act(() => flushRaf())
    act(() => fireTransitionEnd(el))

    expect(onAfterLeave).toHaveBeenCalledTimes(1)
  })

  it('unmounts child after leave animation completes', () => {
    const { rerender } = render(
      <TransitionItem
        show
        leaveStyle={{ opacity: 1 }}
        leaveToStyle={{ opacity: 0 }}
        leaveTransition="opacity 200ms ease-in"
      >
        <div data-testid="child">Hello</div>
      </TransitionItem>,
    )

    rerender(
      <TransitionItem
        show={false}
        leaveStyle={{ opacity: 1 }}
        leaveToStyle={{ opacity: 0 }}
        leaveTransition="opacity 200ms ease-in"
      >
        <div data-testid="child">Hello</div>
      </TransitionItem>,
    )

    // Still in DOM during leave animation
    expect(screen.getByTestId('child')).toBeInTheDocument()

    const el = screen.getByTestId('child')
    act(() => flushRaf())
    act(() => flushRaf())
    act(() => fireTransitionEnd(el))

    expect(screen.queryByTestId('child')).not.toBeInTheDocument()
  })
})

// ─── Class-based transitions ────────────────────────────────

describe('TransitionItem — class-based transitions', () => {
  it('applies enter and enterFrom classes, then enterTo on rAF', () => {
    const { rerender } = render(
      <TransitionItem
        show={false}
        enter="fade-enter"
        enterFrom="fade-enter-from"
        enterTo="fade-enter-to"
      >
        <div data-testid="child">Hello</div>
      </TransitionItem>,
    )

    rerender(
      <TransitionItem
        show
        enter="fade-enter"
        enterFrom="fade-enter-from"
        enterTo="fade-enter-to"
      >
        <div data-testid="child">Hello</div>
      </TransitionItem>,
    )

    const el = screen.getByTestId('child')

    // First frame: enter + enterFrom applied
    expect(el.classList.contains('fade-enter')).toBe(true)
    expect(el.classList.contains('fade-enter-from')).toBe(true)
    expect(el.classList.contains('fade-enter-to')).toBe(false)

    // After double rAF: enterFrom removed, enterTo applied
    act(() => flushRaf())
    act(() => flushRaf())

    expect(el.classList.contains('fade-enter-from')).toBe(false)
    expect(el.classList.contains('fade-enter-to')).toBe(true)
    // enter class stays active during transition
    expect(el.classList.contains('fade-enter')).toBe(true)
  })

  it('applies leave and leaveFrom classes, then leaveTo on rAF', () => {
    const { rerender } = render(
      <TransitionItem
        show
        leave="fade-leave"
        leaveFrom="fade-leave-from"
        leaveTo="fade-leave-to"
      >
        <div data-testid="child">Hello</div>
      </TransitionItem>,
    )

    rerender(
      <TransitionItem
        show={false}
        leave="fade-leave"
        leaveFrom="fade-leave-from"
        leaveTo="fade-leave-to"
      >
        <div data-testid="child">Hello</div>
      </TransitionItem>,
    )

    const el = screen.getByTestId('child')

    expect(el.classList.contains('fade-leave')).toBe(true)
    expect(el.classList.contains('fade-leave-from')).toBe(true)
    expect(el.classList.contains('fade-leave-to')).toBe(false)

    act(() => flushRaf())
    act(() => flushRaf())

    expect(el.classList.contains('fade-leave-from')).toBe(false)
    expect(el.classList.contains('fade-leave-to')).toBe(true)
  })
})

// ─── Entered stage cleanup ──────────────────────────────────

describe('TransitionItem — entered stage cleanup', () => {
  it('cleans up transition style on entered stage', () => {
    const { rerender } = render(
      <TransitionItem
        show={false}
        enter="t-enter"
        enterStyle={{ opacity: 0 }}
        enterToStyle={{ opacity: 1 }}
        enterTransition="opacity 300ms ease"
      >
        <div data-testid="child">Hello</div>
      </TransitionItem>,
    )

    rerender(
      <TransitionItem
        show
        enter="t-enter"
        enterStyle={{ opacity: 0 }}
        enterToStyle={{ opacity: 1 }}
        enterTransition="opacity 300ms ease"
      >
        <div data-testid="child">Hello</div>
      </TransitionItem>,
    )

    const el = screen.getByTestId('child')
    expect(el.style.transition).toBe('opacity 300ms ease')
    expect(el.classList.contains('t-enter')).toBe(true)

    // Complete the transition
    act(() => flushRaf())
    act(() => flushRaf())
    act(() => fireTransitionEnd(el))

    // After entering → entered, transition and enter class should be cleaned up
    expect(el.style.transition).toBe('')
    expect(el.classList.contains('t-enter')).toBe(false)
  })
})

// ─── appear=true ────────────────────────────────────────────

describe('TransitionItem — appear=true', () => {
  it('animates on initial mount when appear=true and show=true', () => {
    const onEnter = vi.fn()
    const onAfterEnter = vi.fn()

    render(
      <TransitionItem
        show
        appear
        enterStyle={{ opacity: 0 }}
        enterToStyle={{ opacity: 1 }}
        enterTransition="opacity 300ms ease"
        onEnter={onEnter}
        onAfterEnter={onAfterEnter}
      >
        <div data-testid="child">Hello</div>
      </TransitionItem>,
    )

    expect(onEnter).toHaveBeenCalledTimes(1)

    const el = screen.getByTestId('child')
    expect(el.style.opacity).toBe('0')
    expect(el.style.transition).toBe('opacity 300ms ease')

    // After double rAF, enterToStyle is applied
    act(() => flushRaf())
    act(() => flushRaf())

    expect(el.style.opacity).toBe('1')

    // After transitionend, the animation completes
    act(() => fireTransitionEnd(el))

    expect(onAfterEnter).toHaveBeenCalledTimes(1)
  })

  it('does not animate on mount when appear=false (default)', () => {
    const onEnter = vi.fn()

    render(
      <TransitionItem
        show
        enterStyle={{ opacity: 0 }}
        enterToStyle={{ opacity: 1 }}
        enterTransition="opacity 300ms ease"
        onEnter={onEnter}
      >
        <div data-testid="child">Hello</div>
      </TransitionItem>,
    )

    // Without appear, show=true starts in "entered" stage — no animation
    expect(onEnter).not.toHaveBeenCalled()
    const el = screen.getByTestId('child')
    // No enterStyle applied since it starts in entered stage
    expect(el.style.opacity).toBe('')
  })
})

// ─── Timeout fallback ───────────────────────────────────────

describe('TransitionItem — timeout fallback', () => {
  it('completes transition via timeout when transitionend does not fire', () => {
    const onAfterEnter = vi.fn()

    const { rerender } = render(
      <TransitionItem
        show={false}
        timeout={500}
        enterStyle={{ opacity: 0 }}
        enterToStyle={{ opacity: 1 }}
        enterTransition="opacity 300ms ease"
        onAfterEnter={onAfterEnter}
      >
        <div data-testid="child">Hello</div>
      </TransitionItem>,
    )

    rerender(
      <TransitionItem
        show
        timeout={500}
        enterStyle={{ opacity: 0 }}
        enterToStyle={{ opacity: 1 }}
        enterTransition="opacity 300ms ease"
        onAfterEnter={onAfterEnter}
      >
        <div data-testid="child">Hello</div>
      </TransitionItem>,
    )

    expect(onAfterEnter).not.toHaveBeenCalled()

    // Advance past the timeout without firing transitionend
    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(onAfterEnter).toHaveBeenCalledTimes(1)
  })

  it('completes leave via timeout when transitionend does not fire', () => {
    const onAfterLeave = vi.fn()

    const { rerender } = render(
      <TransitionItem
        show
        timeout={600}
        leaveStyle={{ opacity: 1 }}
        leaveToStyle={{ opacity: 0 }}
        leaveTransition="opacity 200ms ease-in"
        onAfterLeave={onAfterLeave}
      >
        <div data-testid="child">Hello</div>
      </TransitionItem>,
    )

    rerender(
      <TransitionItem
        show={false}
        timeout={600}
        leaveStyle={{ opacity: 1 }}
        leaveToStyle={{ opacity: 0 }}
        leaveTransition="opacity 200ms ease-in"
        onAfterLeave={onAfterLeave}
      >
        <div data-testid="child">Hello</div>
      </TransitionItem>,
    )

    expect(onAfterLeave).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(600)
    })

    expect(onAfterLeave).toHaveBeenCalledTimes(1)
    expect(screen.queryByTestId('child')).not.toBeInTheDocument()
  })
})

// ─── Unmount branch ──────────────────────────────────────────

describe('TransitionItem — unmount branch', () => {
  it('returns null when unmount=true (default) and show transitions from true to false', () => {
    const onAfterLeave = vi.fn()

    const { rerender } = render(
      <TransitionItem
        show
        leaveStyle={{ opacity: 1 }}
        leaveToStyle={{ opacity: 0 }}
        leaveTransition="opacity 200ms ease-in"
        onAfterLeave={onAfterLeave}
      >
        <div data-testid="child">Hello</div>
      </TransitionItem>,
    )

    expect(screen.getByTestId('child')).toBeInTheDocument()

    // Trigger leave
    rerender(
      <TransitionItem
        show={false}
        leaveStyle={{ opacity: 1 }}
        leaveToStyle={{ opacity: 0 }}
        leaveTransition="opacity 200ms ease-in"
        onAfterLeave={onAfterLeave}
      >
        <div data-testid="child">Hello</div>
      </TransitionItem>,
    )

    // Still mounted during leave animation
    expect(screen.getByTestId('child')).toBeInTheDocument()

    const el = screen.getByTestId('child')
    act(() => flushRaf())
    act(() => flushRaf())
    act(() => fireTransitionEnd(el))

    // After leave completes, unmount=true removes from DOM completely
    expect(screen.queryByTestId('child')).not.toBeInTheDocument()
    expect(onAfterLeave).toHaveBeenCalledTimes(1)
  })

  it('keeps element with display:none when unmount=false after leave completes', () => {
    const onAfterLeave = vi.fn()

    const { rerender } = render(
      <TransitionItem
        show
        unmount={false}
        leaveStyle={{ opacity: 1 }}
        leaveToStyle={{ opacity: 0 }}
        leaveTransition="opacity 200ms ease-in"
        onAfterLeave={onAfterLeave}
      >
        <div data-testid="child">Hello</div>
      </TransitionItem>,
    )

    // Trigger leave
    rerender(
      <TransitionItem
        show={false}
        unmount={false}
        leaveStyle={{ opacity: 1 }}
        leaveToStyle={{ opacity: 0 }}
        leaveTransition="opacity 200ms ease-in"
        onAfterLeave={onAfterLeave}
      >
        <div data-testid="child">Hello</div>
      </TransitionItem>,
    )

    const el = screen.getByTestId('child')
    act(() => flushRaf())
    act(() => flushRaf())
    act(() => fireTransitionEnd(el))

    // After leave completes, unmount=false keeps element but hidden
    expect(screen.getByTestId('child')).toBeInTheDocument()
    expect(screen.getByTestId('child').style.display).toBe('none')
    expect(onAfterLeave).toHaveBeenCalledTimes(1)
  })
})

// ─── Reduced motion ─────────────────────────────────────────

describe('TransitionItem — reduced motion', () => {
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

  it('skips enter animation and fires both callbacks instantly', () => {
    const onEnter = vi.fn()
    const onAfterEnter = vi.fn()

    const { rerender } = render(
      <TransitionItem
        show={false}
        enterStyle={{ opacity: 0 }}
        enterToStyle={{ opacity: 1 }}
        enterTransition="opacity 300ms ease"
        onEnter={onEnter}
        onAfterEnter={onAfterEnter}
      >
        <div data-testid="child">Hello</div>
      </TransitionItem>,
    )

    rerender(
      <TransitionItem
        show
        enterStyle={{ opacity: 0 }}
        enterToStyle={{ opacity: 1 }}
        enterTransition="opacity 300ms ease"
        onEnter={onEnter}
        onAfterEnter={onAfterEnter}
      >
        <div data-testid="child">Hello</div>
      </TransitionItem>,
    )

    expect(onEnter).toHaveBeenCalledTimes(1)
    expect(onAfterEnter).toHaveBeenCalledTimes(1)
  })

  it('skips leave animation and fires both callbacks instantly', () => {
    const onLeave = vi.fn()
    const onAfterLeave = vi.fn()

    const { rerender } = render(
      <TransitionItem
        show
        leaveStyle={{ opacity: 1 }}
        leaveToStyle={{ opacity: 0 }}
        leaveTransition="opacity 200ms ease-in"
        onLeave={onLeave}
        onAfterLeave={onAfterLeave}
      >
        <div data-testid="child">Hello</div>
      </TransitionItem>,
    )

    rerender(
      <TransitionItem
        show={false}
        leaveStyle={{ opacity: 1 }}
        leaveToStyle={{ opacity: 0 }}
        leaveTransition="opacity 200ms ease-in"
        onLeave={onLeave}
        onAfterLeave={onAfterLeave}
      >
        <div data-testid="child">Hello</div>
      </TransitionItem>,
    )

    expect(onLeave).toHaveBeenCalledTimes(1)
    expect(onAfterLeave).toHaveBeenCalledTimes(1)
    expect(screen.queryByTestId('child')).not.toBeInTheDocument()
  })
})
