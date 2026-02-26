import { act, render, screen } from '@testing-library/react'
import { kinetic } from '../index'
import { fade, slideUp } from '../presets'

// Mock matchMedia (needed by useReducedMotion)
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

// Mock rAF for deterministic testing
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

// ─── Transition Mode (default) ────────────────────────────

describe('kinetic() — transition mode', () => {
  it('renders the tag element when show=true', () => {
    const FadeDiv = kinetic('div').preset(fade)
    render(
      <FadeDiv show data-testid="el">
        Hello
      </FadeDiv>,
    )
    expect(screen.getByTestId('el')).toBeInTheDocument()
    expect(screen.getByTestId('el').tagName).toBe('DIV')
  })

  it('does not render when show=false', () => {
    const FadeDiv = kinetic('div').preset(fade)
    render(
      <FadeDiv show={false} data-testid="el">
        Hello
      </FadeDiv>,
    )
    expect(screen.queryByTestId('el')).not.toBeInTheDocument()
  })

  it('renders custom tag elements', () => {
    const FadeSection = kinetic('section').preset(fade)
    render(
      <FadeSection show data-testid="el">
        Hello
      </FadeSection>,
    )
    expect(screen.getByTestId('el').tagName).toBe('SECTION')
  })

  it('forwards HTML attributes to the element', () => {
    const FadeDiv = kinetic('div').preset(fade)
    render(
      <FadeDiv show data-testid="el" className="custom" id="my-div">
        Hello
      </FadeDiv>,
    )
    const el = screen.getByTestId('el')
    expect(el.className).toContain('custom')
    expect(el.id).toBe('my-div')
  })

  it('applies enterStyle on entering', () => {
    const Slide = kinetic('div')
      .enter({ opacity: 0, transform: 'translateY(16px)' })
      .enterTo({ opacity: 1, transform: 'translateY(0)' })
      .enterTransition('all 300ms ease')

    const { rerender } = render(
      <Slide show={false} data-testid="el">
        Hello
      </Slide>,
    )

    rerender(
      <Slide show data-testid="el">
        Hello
      </Slide>,
    )

    const el = screen.getByTestId('el')
    expect(el.style.opacity).toBe('0')
    expect(el.style.transition).toBe('all 300ms ease')

    // After double rAF
    act(() => flushRaf())
    act(() => flushRaf())

    expect(el.style.opacity).toBe('1')
  })

  it('applies class-based transitions via .enterClass()', () => {
    const ClassFade = kinetic('div')
      .enterClass({ active: 't-enter', from: 't-from', to: 't-to' })
      .leaveClass({ active: 't-leave', from: 't-lfrom', to: 't-lto' })

    const { rerender } = render(
      <ClassFade show={false} data-testid="el">
        Hello
      </ClassFade>,
    )

    rerender(
      <ClassFade show data-testid="el">
        Hello
      </ClassFade>,
    )

    const el = screen.getByTestId('el')
    expect(el.classList.contains('t-enter')).toBe(true)
    expect(el.classList.contains('t-from')).toBe(true)

    act(() => flushRaf())
    act(() => flushRaf())

    expect(el.classList.contains('t-from')).toBe(false)
    expect(el.classList.contains('t-to')).toBe(true)
  })

  it('unmounts after leave animation completes', () => {
    const FadeDiv = kinetic('div').preset(fade)

    const { rerender } = render(
      <FadeDiv show data-testid="el">
        Hello
      </FadeDiv>,
    )

    rerender(
      <FadeDiv show={false} data-testid="el">
        Hello
      </FadeDiv>,
    )

    const el = screen.getByTestId('el')
    act(() => flushRaf())
    act(() => flushRaf())
    act(() => fireTransitionEnd(el))

    expect(screen.queryByTestId('el')).not.toBeInTheDocument()
  })

  it('unmount=false keeps element with display:none', () => {
    const FadeDiv = kinetic('div').preset(fade).config({ unmount: false })
    render(
      <FadeDiv show={false} data-testid="el">
        Hello
      </FadeDiv>,
    )

    const el = screen.getByTestId('el')
    expect(el.style.display).toBe('none')
  })

  it('appear=true animates on initial mount', () => {
    const onEnter = vi.fn()
    const FadeDiv = kinetic('div')
      .preset(fade)
      .config({ appear: true })
      .on({ onEnter })

    render(
      <FadeDiv show data-testid="el">
        Hello
      </FadeDiv>,
    )
    expect(onEnter).toHaveBeenCalledTimes(1)
  })

  it('fires lifecycle callbacks at correct times', () => {
    const onEnter = vi.fn()
    const onAfterEnter = vi.fn()
    const onLeave = vi.fn()
    const onAfterLeave = vi.fn()

    const FadeDiv = kinetic('div').preset(fade)

    const { rerender } = render(
      <FadeDiv
        show={false}
        data-testid="el"
        onEnter={onEnter}
        onAfterEnter={onAfterEnter}
        onLeave={onLeave}
        onAfterLeave={onAfterLeave}
      >
        Hello
      </FadeDiv>,
    )

    // Enter
    rerender(
      <FadeDiv
        show
        data-testid="el"
        onEnter={onEnter}
        onAfterEnter={onAfterEnter}
        onLeave={onLeave}
        onAfterLeave={onAfterLeave}
      >
        Hello
      </FadeDiv>,
    )

    expect(onEnter).toHaveBeenCalledTimes(1)
    expect(onAfterEnter).not.toHaveBeenCalled()

    act(() => flushRaf())
    act(() => flushRaf())

    const el = screen.getByTestId('el')
    act(() => fireTransitionEnd(el))

    expect(onAfterEnter).toHaveBeenCalledTimes(1)

    // Leave
    rerender(
      <FadeDiv
        show={false}
        data-testid="el"
        onEnter={onEnter}
        onAfterEnter={onAfterEnter}
        onLeave={onLeave}
        onAfterLeave={onAfterLeave}
      >
        Hello
      </FadeDiv>,
    )

    expect(onLeave).toHaveBeenCalledTimes(1)

    const leavingEl = screen.getByTestId('el')
    act(() => flushRaf())
    act(() => flushRaf())
    act(() => fireTransitionEnd(leavingEl))

    expect(onAfterLeave).toHaveBeenCalledTimes(1)
  })

  it('timeout fallback completes transition', () => {
    const FadeDiv = kinetic('div').preset(fade).config({ timeout: 1000 })

    const { rerender } = render(
      <FadeDiv show={false} data-testid="el">
        Hello
      </FadeDiv>,
    )

    rerender(
      <FadeDiv show data-testid="el">
        Hello
      </FadeDiv>,
    )

    act(() => flushRaf())
    act(() => flushRaf())

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(screen.getByTestId('el')).toBeInTheDocument()
  })
})

// ─── Chain Immutability ────────────────────────────────────

describe('kinetic() — chaining', () => {
  it('chain is immutable (each method returns new component)', () => {
    const Base = kinetic('div')
    const WithFade = Base.preset(fade)
    const WithSlide = Base.preset(slideUp)

    // Base should still work without preset
    render(
      <Base show data-testid="base">
        Base
      </Base>,
    )
    expect(screen.getByTestId('base')).toBeInTheDocument()

    // WithFade and WithSlide are different components
    expect(WithFade).not.toBe(WithSlide)
    expect(WithFade).not.toBe(Base)
  })

  it('.preset() merges preset properties into config', () => {
    const FadeDiv = kinetic('div').preset(fade)

    const { rerender } = render(
      <FadeDiv show={false} data-testid="el">
        Hello
      </FadeDiv>,
    )

    rerender(
      <FadeDiv show data-testid="el">
        Hello
      </FadeDiv>,
    )

    const el = screen.getByTestId('el')
    expect(el.style.opacity).toBe('0')
    expect(el.style.transition).toBe('opacity 300ms ease-out')
  })

  it('.on() callbacks from chain are used when runtime callbacks not provided', () => {
    const onEnter = vi.fn()
    const FadeDiv = kinetic('div').preset(fade).on({ onEnter })

    const { rerender } = render(
      <FadeDiv show={false} data-testid="el">
        Hello
      </FadeDiv>,
    )

    rerender(
      <FadeDiv show data-testid="el">
        Hello
      </FadeDiv>,
    )
    expect(onEnter).toHaveBeenCalledTimes(1)
  })

  it('runtime props override chain config', () => {
    const chainOnEnter = vi.fn()
    const runtimeOnEnter = vi.fn()
    const FadeDiv = kinetic('div').preset(fade).on({ onEnter: chainOnEnter })

    const { rerender } = render(
      <FadeDiv show={false} data-testid="el" onEnter={runtimeOnEnter}>
        Hello
      </FadeDiv>,
    )

    rerender(
      <FadeDiv show data-testid="el" onEnter={runtimeOnEnter}>
        Hello
      </FadeDiv>,
    )

    expect(runtimeOnEnter).toHaveBeenCalledTimes(1)
    expect(chainOnEnter).not.toHaveBeenCalled()
  })

  it('displayName is set correctly', () => {
    const FadeDiv = kinetic('div').preset(fade)
    expect(FadeDiv.displayName).toBe('kinetic(div)')
  })
})

// ─── Collapse Mode ─────────────────────────────────────────

describe('kinetic() — collapse mode', () => {
  const mockScrollHeight = (value: number) => {
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
      configurable: true,
      get() {
        return value
      },
    })
  }

  beforeEach(() => {
    mockScrollHeight(200)
  })

  it('renders with height:auto when show=true (entered)', () => {
    const Accordion = kinetic('div').collapse()
    const { container } = render(
      <Accordion show>
        <p>Content</p>
      </Accordion>,
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.height).toBe('auto')
  })

  it('renders with height:0 when show=false (hidden)', () => {
    const Accordion = kinetic('div').collapse()
    const { container } = render(
      <Accordion show={false}>
        <p>Content</p>
      </Accordion>,
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.height).toBe('0px')
  })

  it('animates height on enter', () => {
    const Accordion = kinetic('div').collapse()
    const { container, rerender } = render(
      <Accordion show={false}>
        <p>Content</p>
      </Accordion>,
    )

    rerender(
      <Accordion show>
        <p>Content</p>
      </Accordion>,
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.height).toBe('200px')
    expect(wrapper.style.transition).toBe('height 300ms ease')
  })

  it('uses custom transition from chain config', () => {
    const Accordion = kinetic('div').collapse({
      transition: 'height 500ms ease-in-out',
    })

    const { container, rerender } = render(
      <Accordion show={false}>
        <p>Content</p>
      </Accordion>,
    )

    rerender(
      <Accordion show>
        <p>Content</p>
      </Accordion>,
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.transition).toBe('height 500ms ease-in-out')
  })

  it('renders custom tag as wrapper', () => {
    const Accordion = kinetic('section').collapse()
    const { container } = render(
      <Accordion show>
        <p>Content</p>
      </Accordion>,
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.tagName).toBe('SECTION')
  })

  it('fires lifecycle callbacks', () => {
    const onEnter = vi.fn()
    const onAfterEnter = vi.fn()
    const Accordion = kinetic('div').collapse()

    const { container, rerender } = render(
      <Accordion show={false} onEnter={onEnter} onAfterEnter={onAfterEnter}>
        <p>Content</p>
      </Accordion>,
    )

    rerender(
      <Accordion show onEnter={onEnter} onAfterEnter={onAfterEnter}>
        <p>Content</p>
      </Accordion>,
    )

    expect(onEnter).toHaveBeenCalledTimes(1)

    const wrapper = container.firstChild as HTMLElement
    act(() => fireTransitionEnd(wrapper))

    expect(onAfterEnter).toHaveBeenCalledTimes(1)
  })
})

// ─── Stagger Mode ──────────────────────────────────────────

describe('kinetic() — stagger mode', () => {
  it('renders children inside wrapper tag', () => {
    const StaggerList = kinetic('ul').preset(fade).stagger({ interval: 50 })

    render(
      <StaggerList show data-testid="list">
        <li key="1" data-testid="item-1">
          A
        </li>
        <li key="2" data-testid="item-2">
          B
        </li>
      </StaggerList>,
    )

    const list = screen.getByTestId('list')
    expect(list.tagName).toBe('UL')
    expect(screen.getByTestId('item-1')).toBeInTheDocument()
    expect(screen.getByTestId('item-2')).toBeInTheDocument()
  })

  it('applies stagger delay to children', () => {
    const StaggerList = kinetic('ul').preset(fade).stagger({ interval: 100 })

    const { rerender } = render(
      <StaggerList show={false}>
        <li key="1" data-testid="item-1">
          A
        </li>
        <li key="2" data-testid="item-2">
          B
        </li>
      </StaggerList>,
    )

    rerender(
      <StaggerList show>
        <li key="1" data-testid="item-1">
          A
        </li>
        <li key="2" data-testid="item-2">
          B
        </li>
      </StaggerList>,
    )

    const item1 = screen.getByTestId('item-1')
    const item2 = screen.getByTestId('item-2')
    expect(item1.style.transitionDelay).toBe('0ms')
    expect(item2.style.transitionDelay).toBe('100ms')
  })

  it('does not render children when show=false', () => {
    const StaggerList = kinetic('ul').preset(fade).stagger({ interval: 50 })

    render(
      <StaggerList show={false}>
        <li key="1" data-testid="item-1">
          A
        </li>
      </StaggerList>,
    )

    expect(screen.queryByTestId('item-1')).not.toBeInTheDocument()
  })
})

// ─── Group Mode ────────────────────────────────────────────

describe('kinetic() — group mode', () => {
  it('renders children inside wrapper tag', () => {
    const AnimatedList = kinetic('ul').preset(fade).group()

    render(
      <AnimatedList data-testid="list">
        <li key="1" data-testid="item-1">
          A
        </li>
      </AnimatedList>,
    )

    const list = screen.getByTestId('list')
    expect(list.tagName).toBe('UL')
    expect(screen.getByTestId('item-1')).toBeInTheDocument()
  })

  it('animates entering items when new keys appear', () => {
    const AnimatedList = kinetic('ul').preset(fade).group()

    const { rerender } = render(
      <AnimatedList data-testid="list">
        <li key="1" data-testid="item-1">
          A
        </li>
      </AnimatedList>,
    )

    rerender(
      <AnimatedList data-testid="list">
        <li key="1" data-testid="item-1">
          A
        </li>
        <li key="2" data-testid="item-2">
          B
        </li>
      </AnimatedList>,
    )

    // New item should be rendered and entering
    expect(screen.getByTestId('item-2')).toBeInTheDocument()
    const item2 = screen.getByTestId('item-2')
    expect(item2.style.opacity).toBe('0')
  })

  it('keeps leaving items in DOM during animation', () => {
    const AnimatedList = kinetic('ul').preset(fade).group()

    const { rerender } = render(
      <AnimatedList data-testid="list">
        <li key="1" data-testid="item-1">
          A
        </li>
        <li key="2" data-testid="item-2">
          B
        </li>
      </AnimatedList>,
    )

    // Remove item-2
    rerender(
      <AnimatedList data-testid="list">
        <li key="1" data-testid="item-1">
          A
        </li>
      </AnimatedList>,
    )

    // item-2 should still be in DOM during leave animation
    expect(screen.getByTestId('item-2')).toBeInTheDocument()
  })

  it('unmounts leaving items after animation completes', () => {
    const AnimatedList = kinetic('ul')
      .preset(fade)
      .config({ timeout: 1000 })
      .group()

    const { rerender } = render(
      <AnimatedList>
        <li key="1" data-testid="item-1">
          A
        </li>
        <li key="2" data-testid="item-2">
          B
        </li>
      </AnimatedList>,
    )

    rerender(
      <AnimatedList>
        <li key="1" data-testid="item-1">
          A
        </li>
      </AnimatedList>,
    )

    // Wait for timeout fallback
    act(() => flushRaf())
    act(() => flushRaf())
    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(screen.queryByTestId('item-2')).not.toBeInTheDocument()
  })
})

// ─── Reduced Motion ────────────────────────────────────────

describe('kinetic() — reduced motion', () => {
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

  it('skips animation and mounts instantly', () => {
    const onEnter = vi.fn()
    const onAfterEnter = vi.fn()
    const FadeDiv = kinetic('div').preset(fade)

    const { rerender } = render(
      <FadeDiv
        show={false}
        data-testid="el"
        onEnter={onEnter}
        onAfterEnter={onAfterEnter}
      >
        Hello
      </FadeDiv>,
    )

    rerender(
      <FadeDiv
        show
        data-testid="el"
        onEnter={onEnter}
        onAfterEnter={onAfterEnter}
      >
        Hello
      </FadeDiv>,
    )

    expect(onEnter).toHaveBeenCalledTimes(1)
    expect(onAfterEnter).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId('el')).toBeInTheDocument()
  })

  it('skips animation and unmounts instantly', () => {
    const onLeave = vi.fn()
    const onAfterLeave = vi.fn()
    const FadeDiv = kinetic('div').preset(fade)

    const { rerender } = render(
      <FadeDiv
        show
        data-testid="el"
        onLeave={onLeave}
        onAfterLeave={onAfterLeave}
      >
        Hello
      </FadeDiv>,
    )

    rerender(
      <FadeDiv
        show={false}
        data-testid="el"
        onLeave={onLeave}
        onAfterLeave={onAfterLeave}
      >
        Hello
      </FadeDiv>,
    )

    expect(onLeave).toHaveBeenCalledTimes(1)
    expect(onAfterLeave).toHaveBeenCalledTimes(1)
    expect(screen.queryByTestId('el')).not.toBeInTheDocument()
  })
})
