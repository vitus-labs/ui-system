import { act, render, screen } from '@testing-library/react'
import { kinetic } from '../index'
import { fade, slideUp } from '../presets'
import { fireTransitionEnd, setupMatchMedia, setupRaf } from './setupFixtures'

setupMatchMedia()
const { flushRaf } = setupRaf()

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

// ─── Collapse — leave animation ──────────────────────────────
describe('kinetic() — collapse leave', () => {
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

  it('animates height to 0 on leave and fires lifecycle callbacks', () => {
    const onLeave = vi.fn()
    const onAfterLeave = vi.fn()
    const Accordion = kinetic('div').collapse()

    const { container, rerender } = render(
      <Accordion show onLeave={onLeave} onAfterLeave={onAfterLeave}>
        <p>Content</p>
      </Accordion>,
    )

    rerender(
      <Accordion show={false} onLeave={onLeave} onAfterLeave={onAfterLeave}>
        <p>Content</p>
      </Accordion>,
    )

    const wrapper = container.firstChild as HTMLElement
    expect(onLeave).toHaveBeenCalledTimes(1)
    expect(wrapper.style.height).toBe('0px')
    expect(wrapper.style.overflow).toBe('hidden')

    // Complete the leave animation via transitionend
    act(() => fireTransitionEnd(wrapper))

    expect(onAfterLeave).toHaveBeenCalledTimes(1)
  })

  it('appear=true animates on initial mount', () => {
    const onEnter = vi.fn()
    const Accordion = kinetic('div').collapse({ appear: true })

    const { container } = render(
      <Accordion show onEnter={onEnter}>
        <p>Content</p>
      </Accordion>,
    )

    const wrapper = container.firstChild as HTMLElement
    expect(onEnter).toHaveBeenCalledTimes(1)
    expect(wrapper.style.height).toBe('200px')
  })
})

// ─── Collapse — reduced motion ──────────────────────────────
describe('kinetic() — collapse reduced motion', () => {
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

  it('skips animation on enter with reduced motion', () => {
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

    const wrapper = container.firstChild as HTMLElement
    expect(onEnter).toHaveBeenCalledTimes(1)
    expect(onAfterEnter).toHaveBeenCalledTimes(1)
    expect(wrapper.style.height).toBe('auto')
  })

  it('skips animation on leave with reduced motion', () => {
    const onLeave = vi.fn()
    const onAfterLeave = vi.fn()
    const Accordion = kinetic('div').collapse()

    const { container, rerender } = render(
      <Accordion show onLeave={onLeave} onAfterLeave={onAfterLeave}>
        <p>Content</p>
      </Accordion>,
    )

    rerender(
      <Accordion show={false} onLeave={onLeave} onAfterLeave={onAfterLeave}>
        <p>Content</p>
      </Accordion>,
    )

    const wrapper = container.firstChild as HTMLElement
    expect(onLeave).toHaveBeenCalledTimes(1)
    expect(onAfterLeave).toHaveBeenCalledTimes(1)
    expect(wrapper.style.height).toBe('0px')
    expect(wrapper.style.overflow).toBe('hidden')
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

// ─── Stagger reverseLeave ────────────────────────────────────
describe('kinetic() — stagger reverseLeave', () => {
  it('reverses stagger order on leave', () => {
    const StaggerList = kinetic('ul')
      .preset(fade)
      .stagger({ interval: 100, reverseLeave: true })

    const { rerender } = render(
      <StaggerList show>
        <li key="1" data-testid="item-1">
          A
        </li>
        <li key="2" data-testid="item-2">
          B
        </li>
        <li key="3" data-testid="item-3">
          C
        </li>
      </StaggerList>,
    )

    rerender(
      <StaggerList show={false}>
        <li key="1" data-testid="item-1">
          A
        </li>
        <li key="2" data-testid="item-2">
          B
        </li>
        <li key="3" data-testid="item-3">
          C
        </li>
      </StaggerList>,
    )

    // Reversed: item-3 gets index 0, item-2 gets index 1, item-1 gets index 2
    expect(screen.getByTestId('item-1').style.transitionDelay).toBe('200ms')
    expect(screen.getByTestId('item-2').style.transitionDelay).toBe('100ms')
    expect(screen.getByTestId('item-3').style.transitionDelay).toBe('0ms')
  })

  it('applies normal stagger order on enter even with reverseLeave', () => {
    const StaggerList = kinetic('ul')
      .preset(fade)
      .stagger({ interval: 100, reverseLeave: true })

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

    expect(screen.getByTestId('item-1').style.transitionDelay).toBe('0ms')
    expect(screen.getByTestId('item-2').style.transitionDelay).toBe('100ms')
  })
})

// ─── Transition mode — leave with styles ─────────────────────
describe('kinetic() — transition leave styles', () => {
  it('applies leaveStyle and leaveTransition on leaving', () => {
    const Slide = kinetic('div')
      .enter({ opacity: 0 })
      .enterTo({ opacity: 1 })
      .enterTransition('opacity 300ms ease')
      .leave({ opacity: 1 })
      .leaveTo({ opacity: 0 })
      .leaveTransition('opacity 200ms ease-in')

    const { rerender } = render(
      <Slide show data-testid="el">
        Hello
      </Slide>,
    )

    rerender(
      <Slide show={false} data-testid="el">
        Hello
      </Slide>,
    )

    const el = screen.getByTestId('el')
    expect(el.style.opacity).toBe('1')
    expect(el.style.transition).toBe('opacity 200ms ease-in')

    act(() => flushRaf())
    act(() => flushRaf())

    expect(el.style.opacity).toBe('0')
  })

  it('applies leaveToStyle after rAF', () => {
    const FadeOut = kinetic('div')
      .leave({ opacity: 1, transform: 'scale(1)' })
      .leaveTo({ opacity: 0, transform: 'scale(0.95)' })
      .leaveTransition('all 300ms ease')

    const { rerender } = render(
      <FadeOut show data-testid="el">
        Hello
      </FadeOut>,
    )

    rerender(
      <FadeOut show={false} data-testid="el">
        Hello
      </FadeOut>,
    )

    const el = screen.getByTestId('el')

    act(() => flushRaf())
    act(() => flushRaf())

    expect(el.style.opacity).toBe('0')
  })
})

// ─── Group mode — callback handling ──────────────────────────
describe('kinetic() — group callbacks and edge cases', () => {
  it('fires onAfterLeave callback via group', () => {
    const onAfterLeave = vi.fn()
    const AnimatedList = kinetic('ul')
      .preset(fade)
      .config({ timeout: 500 })
      .group()

    const { rerender } = render(
      <AnimatedList onAfterLeave={onAfterLeave}>
        <li key="1" data-testid="item-1">
          A
        </li>
        <li key="2" data-testid="item-2">
          B
        </li>
      </AnimatedList>,
    )

    rerender(
      <AnimatedList onAfterLeave={onAfterLeave}>
        <li key="1" data-testid="item-1">
          A
        </li>
      </AnimatedList>,
    )

    act(() => flushRaf())
    act(() => flushRaf())
    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(onAfterLeave).toHaveBeenCalled()
    expect(screen.queryByTestId('item-2')).not.toBeInTheDocument()
  })

  it('re-entering an item cancels its leave', () => {
    const AnimatedList = kinetic('ul').preset(fade).group()

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

    // Remove item-2
    rerender(
      <AnimatedList>
        <li key="1" data-testid="item-1">
          A
        </li>
      </AnimatedList>,
    )

    // Re-add item-2 before leave completes
    rerender(
      <AnimatedList>
        <li key="1" data-testid="item-1">
          A
        </li>
        <li key="2" data-testid="item-2">
          B
        </li>
      </AnimatedList>,
    )

    expect(screen.getByTestId('item-2')).toBeInTheDocument()
  })
})

// ─── Config defaults ──────────────────────────────────────

describe('kinetic() — config defaults and overrides', () => {
  it('appear from config is used when runtime appear not provided', () => {
    const onEnter = vi.fn()
    const FadeDiv = kinetic('div').preset(fade).config({ appear: true })

    render(
      <FadeDiv show data-testid="el" onEnter={onEnter}>
        Hello
      </FadeDiv>,
    )

    // appear=true from config, so it should animate on initial mount
    expect(onEnter).toHaveBeenCalledTimes(1)
  })

  it('runtime appear overrides config appear', () => {
    const onEnter = vi.fn()
    const FadeDiv = kinetic('div').preset(fade).config({ appear: true })

    render(
      <FadeDiv show appear={false} data-testid="el" onEnter={onEnter}>
        Hello
      </FadeDiv>,
    )

    // Runtime appear=false overrides config appear=true
    expect(onEnter).not.toHaveBeenCalled()
  })

  it('unmount from config controls hide behavior', () => {
    const FadeDiv = kinetic('div').preset(fade).config({ unmount: false })

    render(
      <FadeDiv show={false} data-testid="el">
        Hello
      </FadeDiv>,
    )

    const el = screen.getByTestId('el')
    expect(el.style.display).toBe('none')
  })

  it('runtime unmount overrides config unmount', () => {
    const FadeDiv = kinetic('div').preset(fade).config({ unmount: false })

    render(
      <FadeDiv show={false} unmount data-testid="el">
        Hello
      </FadeDiv>,
    )

    expect(screen.queryByTestId('el')).not.toBeInTheDocument()
  })

  it('timeout from config is used as fallback', () => {
    const onAfterEnter = vi.fn()
    const FadeDiv = kinetic('div').preset(fade).config({ timeout: 200 })

    const { rerender } = render(
      <FadeDiv show={false} data-testid="el" onAfterEnter={onAfterEnter}>
        Hello
      </FadeDiv>,
    )

    rerender(
      <FadeDiv show data-testid="el" onAfterEnter={onAfterEnter}>
        Hello
      </FadeDiv>,
    )

    act(() => flushRaf())
    act(() => flushRaf())

    // No transitionend fired — timeout from config (200ms) should fire
    act(() => {
      vi.advanceTimersByTime(200)
    })

    expect(onAfterEnter).toHaveBeenCalledTimes(1)
  })

  it('runtime timeout overrides config timeout', () => {
    const onAfterEnter = vi.fn()
    const FadeDiv = kinetic('div').preset(fade).config({ timeout: 200 })

    const { rerender } = render(
      <FadeDiv show={false} data-testid="el" onAfterEnter={onAfterEnter}>
        Hello
      </FadeDiv>,
    )

    rerender(
      <FadeDiv show timeout={500} data-testid="el" onAfterEnter={onAfterEnter}>
        Hello
      </FadeDiv>,
    )

    act(() => flushRaf())
    act(() => flushRaf())

    // 200ms from config should NOT trigger since runtime is 500ms
    act(() => {
      vi.advanceTimersByTime(200)
    })

    expect(onAfterEnter).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(onAfterEnter).toHaveBeenCalledTimes(1)
  })

  it('unmount=false with existing style preserves style in display:none', () => {
    const FadeDiv = kinetic('div').preset(fade).config({ unmount: false })

    render(
      <FadeDiv show={false} data-testid="el" style={{ color: 'red' }}>
        Hello
      </FadeDiv>,
    )

    const el = screen.getByTestId('el')
    expect(el.style.display).toBe('none')
    expect(el.style.color).toBe('red')
  })
})

// ─── DisplayName ───────────────────────────────────────────

describe('kinetic() — displayName', () => {
  it('uses tag string for displayName', () => {
    const FadeDiv = kinetic('div').preset(fade)
    expect(FadeDiv.displayName).toBe('kinetic(div)')
  })

  it('uses component displayName for function tag', () => {
    const MyComponent = (props: any) => <div {...props} />
    MyComponent.displayName = 'MyComponent'
    const FadeComp = kinetic(MyComponent as any).preset(fade)
    expect(FadeComp.displayName).toBe('kinetic(MyComponent)')
  })

  it('uses component.name when displayName is missing', () => {
    function NamedComp(props: any) {
      return <div {...props} />
    }
    const FadeComp = kinetic(NamedComp as any).preset(fade)
    expect(FadeComp.displayName).toBe('kinetic(NamedComp)')
  })

  it('falls back to Component when both displayName and name are missing', () => {
    const anon = (props: any) => <div {...props} />
    Object.defineProperty(anon, 'displayName', { value: undefined })
    Object.defineProperty(anon, 'name', { value: undefined })
    const FadeComp = kinetic(anon as any).preset(fade)
    expect(FadeComp.displayName).toBe('kinetic(Component)')
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
