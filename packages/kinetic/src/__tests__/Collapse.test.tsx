import { act, render, screen } from '@testing-library/react'
import Collapse from '../Collapse'
import { kinetic } from '../index'
import { fireTransitionEnd, setupMatchMedia } from './setupFixtures'

setupMatchMedia()

// Mock scrollHeight
const mockScrollHeight = (value: number) => {
  Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
    configurable: true,
    get() {
      return value
    },
  })
}

describe('Collapse', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockScrollHeight(200)
  })

  afterEach(() => vi.useRealTimers())

  it('renders content when show=true', () => {
    render(
      <Collapse show>
        <div data-testid="content">Hello</div>
      </Collapse>,
    )
    expect(screen.getByTestId('content')).toBeInTheDocument()
  })

  it('does not render content when show=false', () => {
    render(
      <Collapse show={false}>
        <div data-testid="content">Hello</div>
      </Collapse>,
    )
    expect(screen.queryByTestId('content')).not.toBeInTheDocument()
  })

  it('wrapper has height:0 when hidden', () => {
    const { container } = render(
      <Collapse show={false}>
        <div>Hello</div>
      </Collapse>,
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.height).toBe('0px')
  })

  it('wrapper has height:auto when entered', () => {
    const { container } = render(
      <Collapse show>
        <div>Hello</div>
      </Collapse>,
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.height).toBe('auto')
  })

  it('animates height from 0 to scrollHeight on enter', () => {
    const { container, rerender } = render(
      <Collapse show={false}>
        <div>Hello</div>
      </Collapse>,
    )

    rerender(
      <Collapse show>
        <div>Hello</div>
      </Collapse>,
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.height).toBe('200px')
    expect(wrapper.style.transition).toBe('height 300ms ease')
  })

  it('switches to height:auto after enter animation completes', () => {
    const { container, rerender } = render(
      <Collapse show={false}>
        <div>Hello</div>
      </Collapse>,
    )

    rerender(
      <Collapse show>
        <div>Hello</div>
      </Collapse>,
    )

    const wrapper = container.firstChild as HTMLElement

    act(() => fireTransitionEnd(wrapper))

    expect(wrapper.style.height).toBe('auto')
    expect(wrapper.style.overflow).toBe('')
    expect(wrapper.style.transition).toBe('')
  })

  it('animates height to 0 on leave', () => {
    const { container, rerender } = render(
      <Collapse show>
        <div>Hello</div>
      </Collapse>,
    )

    rerender(
      <Collapse show={false}>
        <div>Hello</div>
      </Collapse>,
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.height).toBe('0px')
    expect(wrapper.style.overflow).toBe('hidden')
  })

  it('unmounts content after leave animation completes', () => {
    const { rerender } = render(
      <Collapse show>
        <div data-testid="content">Hello</div>
      </Collapse>,
    )

    rerender(
      <Collapse show={false}>
        <div data-testid="content">Hello</div>
      </Collapse>,
    )

    // Content is still rendered during leave
    expect(screen.getByTestId('content')).toBeInTheDocument()

    // Use timeout fallback since transitionend won't fire in jsdom naturally
    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(screen.queryByTestId('content')).not.toBeInTheDocument()
  })

  it('fires lifecycle callbacks at correct times', () => {
    const onEnter = vi.fn()
    const onAfterEnter = vi.fn()
    const onLeave = vi.fn()
    const onAfterLeave = vi.fn()

    const { container, rerender } = render(
      <Collapse
        show={false}
        onEnter={onEnter}
        onAfterEnter={onAfterEnter}
        onLeave={onLeave}
        onAfterLeave={onAfterLeave}
      >
        <div>Hello</div>
      </Collapse>,
    )

    // Enter
    rerender(
      <Collapse
        show
        onEnter={onEnter}
        onAfterEnter={onAfterEnter}
        onLeave={onLeave}
        onAfterLeave={onAfterLeave}
      >
        <div>Hello</div>
      </Collapse>,
    )

    expect(onEnter).toHaveBeenCalledTimes(1)
    expect(onAfterEnter).not.toHaveBeenCalled()

    const wrapper = container.firstChild as HTMLElement
    act(() => fireTransitionEnd(wrapper))

    expect(onAfterEnter).toHaveBeenCalledTimes(1)

    // Leave
    rerender(
      <Collapse
        show={false}
        onEnter={onEnter}
        onAfterEnter={onAfterEnter}
        onLeave={onLeave}
        onAfterLeave={onAfterLeave}
      >
        <div>Hello</div>
      </Collapse>,
    )

    expect(onLeave).toHaveBeenCalledTimes(1)

    act(() => fireTransitionEnd(wrapper))

    expect(onAfterLeave).toHaveBeenCalledTimes(1)
  })

  it('uses custom transition property', () => {
    const { container, rerender } = render(
      <Collapse show={false} transition="height 500ms ease-in-out">
        <div>Hello</div>
      </Collapse>,
    )

    rerender(
      <Collapse show transition="height 500ms ease-in-out">
        <div>Hello</div>
      </Collapse>,
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.transition).toBe('height 500ms ease-in-out')
  })

  it('appear=true animates on initial mount', () => {
    const onEnter = vi.fn()

    const { container } = render(
      <Collapse show appear onEnter={onEnter}>
        <div>Hello</div>
      </Collapse>,
    )

    expect(onEnter).toHaveBeenCalledTimes(1)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.height).toBe('200px')
  })
})

describe('Collapse with reducedMotion', () => {
  beforeEach(() => {
    vi.useFakeTimers()
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
    vi.useRealTimers()
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

  it('expands instantly without animation', () => {
    const onEnter = vi.fn()
    const onAfterEnter = vi.fn()

    const { container, rerender } = render(
      <Collapse show={false} onEnter={onEnter} onAfterEnter={onAfterEnter}>
        <div>Hello</div>
      </Collapse>,
    )

    rerender(
      <Collapse show onEnter={onEnter} onAfterEnter={onAfterEnter}>
        <div>Hello</div>
      </Collapse>,
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.height).toBe('auto')
    expect(onEnter).toHaveBeenCalledTimes(1)
    expect(onAfterEnter).toHaveBeenCalledTimes(1)
  })

  it('collapses instantly without animation', () => {
    const onLeave = vi.fn()
    const onAfterLeave = vi.fn()

    const { container, rerender } = render(
      <Collapse show onLeave={onLeave} onAfterLeave={onAfterLeave}>
        <div>Hello</div>
      </Collapse>,
    )

    rerender(
      <Collapse show={false} onLeave={onLeave} onAfterLeave={onAfterLeave}>
        <div>Hello</div>
      </Collapse>,
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.height).toBe('0px')
    expect(onLeave).toHaveBeenCalledTimes(1)
    expect(onAfterLeave).toHaveBeenCalledTimes(1)
  })
})

// ─── Additional coverage: leave animation, rapid toggle, timeout, kinetic API ─

describe('Collapse — leaving stage height animation detail', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockScrollHeight(150)
  })

  afterEach(() => vi.useRealTimers())

  it('sets height from scrollHeight then animates to 0 with transition during leave', () => {
    const { container, rerender } = render(
      <Collapse show>
        <div data-testid="content">Hello</div>
      </Collapse>,
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.height).toBe('auto')

    // Trigger leave
    rerender(
      <Collapse show={false}>
        <div data-testid="content">Hello</div>
      </Collapse>,
    )

    // During leaving stage:
    // 1. transition set to 'none' initially, height set to scrollHeight (150px)
    // 2. overflow set to 'hidden'
    // 3. After reflow, transition applied and height set to 0px
    expect(wrapper.style.height).toBe('0px')
    expect(wrapper.style.overflow).toBe('hidden')
    expect(wrapper.style.transition).toBe('height 300ms ease')

    // Content should still be rendered during leaving
    expect(screen.getByTestId('content')).toBeInTheDocument()
  })

  it('transitions to hidden stage and unmounts content after leave transitionend', () => {
    const onAfterLeave = vi.fn()

    const { container, rerender } = render(
      <Collapse show onAfterLeave={onAfterLeave}>
        <div data-testid="content">Hello</div>
      </Collapse>,
    )

    rerender(
      <Collapse show={false} onAfterLeave={onAfterLeave}>
        <div data-testid="content">Hello</div>
      </Collapse>,
    )

    const wrapper = container.firstChild as HTMLElement

    // Fire transitionend to complete the leave
    act(() => fireTransitionEnd(wrapper))

    // After leave completes: stage → hidden, content unmounted
    expect(onAfterLeave).toHaveBeenCalledTimes(1)
    expect(screen.queryByTestId('content')).not.toBeInTheDocument()
    expect(wrapper.style.height).toBe('0px')
  })

  it('uses custom transition string during leave animation', () => {
    const { container, rerender } = render(
      <Collapse show transition="height 500ms ease-in-out">
        <div>Hello</div>
      </Collapse>,
    )

    rerender(
      <Collapse show={false} transition="height 500ms ease-in-out">
        <div>Hello</div>
      </Collapse>,
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.transition).toBe('height 500ms ease-in-out')
    expect(wrapper.style.height).toBe('0px')
  })
})

describe('Collapse — leave animation via transitionend', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockScrollHeight(200)
  })

  afterEach(() => vi.useRealTimers())

  it('fires onAfterLeave when transitionend fires during leaving', () => {
    const onLeave = vi.fn()
    const onAfterLeave = vi.fn()

    const { container, rerender } = render(
      <Collapse show onLeave={onLeave} onAfterLeave={onAfterLeave}>
        <div data-testid="content">Hello</div>
      </Collapse>,
    )

    // Trigger leave
    rerender(
      <Collapse show={false} onLeave={onLeave} onAfterLeave={onAfterLeave}>
        <div data-testid="content">Hello</div>
      </Collapse>,
    )

    expect(onLeave).toHaveBeenCalledTimes(1)
    expect(onAfterLeave).not.toHaveBeenCalled()

    const wrapper = container.firstChild as HTMLElement

    // Fire transitionend on the wrapper (simulates real CSS transition completing)
    act(() => fireTransitionEnd(wrapper))

    expect(onAfterLeave).toHaveBeenCalledTimes(1)
    // After leave completes, content should be unmounted
    expect(screen.queryByTestId('content')).not.toBeInTheDocument()
  })

  it('sets height from scrollHeight to 0 during leave animation', () => {
    const { container, rerender } = render(
      <Collapse show>
        <div>Hello</div>
      </Collapse>,
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.height).toBe('auto')

    // Trigger leave
    rerender(
      <Collapse show={false}>
        <div>Hello</div>
      </Collapse>,
    )

    // During leave, height should be set to 0 with overflow hidden and transition applied
    expect(wrapper.style.height).toBe('0px')
    expect(wrapper.style.overflow).toBe('hidden')
    expect(wrapper.style.transition).toBe('height 300ms ease')
  })

  it('transitions to hidden stage after leave transitionend fires', () => {
    const { container, rerender } = render(
      <Collapse show>
        <div data-testid="content">Hello</div>
      </Collapse>,
    )

    rerender(
      <Collapse show={false}>
        <div data-testid="content">Hello</div>
      </Collapse>,
    )

    // Content still present during leaving
    expect(screen.getByTestId('content')).toBeInTheDocument()

    const wrapper = container.firstChild as HTMLElement
    act(() => fireTransitionEnd(wrapper))

    // After transitionend, stage transitions to hidden — content unmounts
    expect(screen.queryByTestId('content')).not.toBeInTheDocument()
    expect(wrapper.style.height).toBe('0px')
  })
})

describe('Collapse — appear=true with show=false', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockScrollHeight(200)
  })

  afterEach(() => vi.useRealTimers())

  it('starts hidden when appear=true but show=false', () => {
    const onEnter = vi.fn()

    const { container } = render(
      <Collapse show={false} appear onEnter={onEnter}>
        <div data-testid="content">Hello</div>
      </Collapse>,
    )

    // Should not animate enter since show is false
    expect(onEnter).not.toHaveBeenCalled()
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.height).toBe('0px')
    expect(screen.queryByTestId('content')).not.toBeInTheDocument()
  })
})

describe('Collapse — rapid toggle (leaving to entering)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockScrollHeight(200)
  })

  afterEach(() => vi.useRealTimers())

  it('interrupts leave and starts entering when toggled back to show', () => {
    const onEnter = vi.fn()
    const onLeave = vi.fn()
    const onAfterEnter = vi.fn()

    const { container, rerender } = render(
      <Collapse
        show
        onEnter={onEnter}
        onLeave={onLeave}
        onAfterEnter={onAfterEnter}
      >
        <div data-testid="content">Hello</div>
      </Collapse>,
    )

    // Start leaving
    rerender(
      <Collapse
        show={false}
        onEnter={onEnter}
        onLeave={onLeave}
        onAfterEnter={onAfterEnter}
      >
        <div data-testid="content">Hello</div>
      </Collapse>,
    )

    expect(onLeave).toHaveBeenCalledTimes(1)

    // Immediately toggle back to show before leave completes
    // This hits stage === 'leaving' branch in the show=true check
    rerender(
      <Collapse
        show
        onEnter={onEnter}
        onLeave={onLeave}
        onAfterEnter={onAfterEnter}
      >
        <div data-testid="content">Hello</div>
      </Collapse>,
    )

    expect(onEnter).toHaveBeenCalledTimes(1)

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.height).toBe('200px')

    // Complete the enter animation
    act(() => fireTransitionEnd(wrapper))
    expect(onAfterEnter).toHaveBeenCalledTimes(1)
    expect(wrapper.style.height).toBe('auto')
  })
})

describe('Collapse — rapid toggle (entering to leaving)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockScrollHeight(200)
  })

  afterEach(() => vi.useRealTimers())

  it('interrupts enter and starts leaving when toggled rapidly', () => {
    const onEnter = vi.fn()
    const onLeave = vi.fn()
    const onAfterLeave = vi.fn()

    const { container, rerender } = render(
      <Collapse
        show={false}
        onEnter={onEnter}
        onLeave={onLeave}
        onAfterLeave={onAfterLeave}
      >
        <div data-testid="content">Hello</div>
      </Collapse>,
    )

    // Start entering
    rerender(
      <Collapse
        show
        onEnter={onEnter}
        onLeave={onLeave}
        onAfterLeave={onAfterLeave}
      >
        <div data-testid="content">Hello</div>
      </Collapse>,
    )

    expect(onEnter).toHaveBeenCalledTimes(1)

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.height).toBe('200px')

    // Immediately toggle back to hidden before enter completes
    rerender(
      <Collapse
        show={false}
        onEnter={onEnter}
        onLeave={onLeave}
        onAfterLeave={onAfterLeave}
      >
        <div data-testid="content">Hello</div>
      </Collapse>,
    )

    expect(onLeave).toHaveBeenCalledTimes(1)
    expect(wrapper.style.height).toBe('0px')
    expect(wrapper.style.overflow).toBe('hidden')

    // Complete the leave animation
    act(() => fireTransitionEnd(wrapper))

    expect(onAfterLeave).toHaveBeenCalledTimes(1)
    expect(screen.queryByTestId('content')).not.toBeInTheDocument()
  })
})

describe('Collapse — custom timeout', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockScrollHeight(200)
  })

  afterEach(() => vi.useRealTimers())

  it('uses custom timeout as fallback for completing transition', () => {
    const onAfterEnter = vi.fn()

    const { rerender } = render(
      <Collapse show={false} timeout={1000} onAfterEnter={onAfterEnter}>
        <div data-testid="content">Hello</div>
      </Collapse>,
    )

    rerender(
      <Collapse show timeout={1000} onAfterEnter={onAfterEnter}>
        <div data-testid="content">Hello</div>
      </Collapse>,
    )

    // Before timeout, onAfterEnter should not have fired
    expect(onAfterEnter).not.toHaveBeenCalled()

    // Advance past the custom timeout
    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(onAfterEnter).toHaveBeenCalledTimes(1)
  })

  it('custom timeout completes leave when transitionend does not fire', () => {
    const onAfterLeave = vi.fn()

    const { rerender } = render(
      <Collapse show timeout={800} onAfterLeave={onAfterLeave}>
        <div data-testid="content">Hello</div>
      </Collapse>,
    )

    rerender(
      <Collapse show={false} timeout={800} onAfterLeave={onAfterLeave}>
        <div data-testid="content">Hello</div>
      </Collapse>,
    )

    expect(onAfterLeave).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(800)
    })

    expect(onAfterLeave).toHaveBeenCalledTimes(1)
    expect(screen.queryByTestId('content')).not.toBeInTheDocument()
  })
})

describe('Collapse — kinetic API with tag prop', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockScrollHeight(150)
  })

  afterEach(() => vi.useRealTimers())

  it('kinetic("section").collapse() renders a section wrapper', () => {
    const CollapseSection = kinetic('section').collapse({
      transition: 'height 400ms ease',
    })

    const { container } = render(
      <CollapseSection show>
        <p>Content</p>
      </CollapseSection>,
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.tagName).toBe('SECTION')
    expect(wrapper.style.height).toBe('auto')
  })

  it('kinetic("nav").collapse() uses custom transition from config', () => {
    const CollapseNav = kinetic('nav').collapse({
      transition: 'height 600ms cubic-bezier(0.4, 0, 0.2, 1)',
    })

    const { container, rerender } = render(
      <CollapseNav show={false}>
        <p>Nav content</p>
      </CollapseNav>,
    )

    rerender(
      <CollapseNav show>
        <p>Nav content</p>
      </CollapseNav>,
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.tagName).toBe('NAV')
    expect(wrapper.style.transition).toBe(
      'height 600ms cubic-bezier(0.4, 0, 0.2, 1)',
    )
    expect(wrapper.style.height).toBe('150px')
  })

  it('kinetic collapse supports runtime transition override', () => {
    const CollapseDiv = kinetic('div').collapse({
      transition: 'height 300ms ease',
    })

    const { container, rerender } = render(
      <CollapseDiv show={false} transition="height 100ms linear">
        <p>Content</p>
      </CollapseDiv>,
    )

    rerender(
      <CollapseDiv show transition="height 100ms linear">
        <p>Content</p>
      </CollapseDiv>,
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.transition).toBe('height 100ms linear')
  })

  it('kinetic collapse fires full lifecycle', () => {
    const onEnter = vi.fn()
    const onAfterEnter = vi.fn()
    const onLeave = vi.fn()
    const onAfterLeave = vi.fn()

    const CollapseSection = kinetic('section').collapse()

    const { container, rerender } = render(
      <CollapseSection
        show={false}
        onEnter={onEnter}
        onAfterEnter={onAfterEnter}
        onLeave={onLeave}
        onAfterLeave={onAfterLeave}
      >
        <p>Content</p>
      </CollapseSection>,
    )

    // Enter
    rerender(
      <CollapseSection
        show
        onEnter={onEnter}
        onAfterEnter={onAfterEnter}
        onLeave={onLeave}
        onAfterLeave={onAfterLeave}
      >
        <p>Content</p>
      </CollapseSection>,
    )

    expect(onEnter).toHaveBeenCalledTimes(1)

    const wrapper = container.firstChild as HTMLElement
    act(() => fireTransitionEnd(wrapper))

    expect(onAfterEnter).toHaveBeenCalledTimes(1)

    // Leave
    rerender(
      <CollapseSection
        show={false}
        onEnter={onEnter}
        onAfterEnter={onAfterEnter}
        onLeave={onLeave}
        onAfterLeave={onAfterLeave}
      >
        <p>Content</p>
      </CollapseSection>,
    )

    expect(onLeave).toHaveBeenCalledTimes(1)

    act(() => fireTransitionEnd(wrapper))

    expect(onAfterLeave).toHaveBeenCalledTimes(1)
  })
})
