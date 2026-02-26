import { act, render, screen } from '@testing-library/react'
import Collapse from '../Collapse'

// Mock matchMedia
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

// Mock scrollHeight
const mockScrollHeight = (value: number) => {
  Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
    configurable: true,
    get() {
      return value
    },
  })
}

const fireTransitionEnd = (el: HTMLElement) => {
  const event = new Event('transitionend', { bubbles: true })
  Object.defineProperty(event, 'target', { value: el })
  el.dispatchEvent(event)
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
