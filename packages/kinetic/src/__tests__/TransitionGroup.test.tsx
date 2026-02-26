import { act, render, screen } from '@testing-library/react'
import TransitionGroup from '../TransitionGroup'

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

describe('TransitionGroup', () => {
  it('renders all children initially', () => {
    render(
      <TransitionGroup>
        {[
          <div key="a" data-testid="a">
            A
          </div>,
          <div key="b" data-testid="b">
            B
          </div>,
        ]}
      </TransitionGroup>,
    )
    expect(screen.getByTestId('a')).toBeInTheDocument()
    expect(screen.getByTestId('b')).toBeInTheDocument()
  })

  it('keeps removed children during leave animation', () => {
    const { rerender } = render(
      <TransitionGroup leave="t-leave">
        {[
          <div key="a" data-testid="a">
            A
          </div>,
          <div key="b" data-testid="b">
            B
          </div>,
        ]}
      </TransitionGroup>,
    )

    // Remove "b"
    rerender(
      <TransitionGroup leave="t-leave">
        {[
          <div key="a" data-testid="a">
            A
          </div>,
        ]}
      </TransitionGroup>,
    )

    // "b" should still be in the DOM (leaving)
    expect(screen.getByTestId('a')).toBeInTheDocument()
    expect(screen.getByTestId('b')).toBeInTheDocument()
  })

  it('removes children after leave animation completes', () => {
    const { rerender } = render(
      <TransitionGroup>
        {[
          <div key="a" data-testid="a">
            A
          </div>,
          <div key="b" data-testid="b">
            B
          </div>,
        ]}
      </TransitionGroup>,
    )

    rerender(
      <TransitionGroup>
        {[
          <div key="a" data-testid="a">
            A
          </div>,
        ]}
      </TransitionGroup>,
    )

    const bEl = screen.getByTestId('b')

    // Double rAF to complete class swap
    act(() => flushRaf())
    act(() => flushRaf())

    // Fire transitionend to complete leave
    act(() => fireTransitionEnd(bEl))

    expect(screen.queryByTestId('b')).not.toBeInTheDocument()
    expect(screen.getByTestId('a')).toBeInTheDocument()
  })

  it('enters new children with animation', () => {
    const { rerender } = render(
      <TransitionGroup enter="t-enter" enterFrom="t-enter-from">
        {[
          <div key="a" data-testid="a">
            A
          </div>,
        ]}
      </TransitionGroup>,
    )

    rerender(
      <TransitionGroup enter="t-enter" enterFrom="t-enter-from">
        {[
          <div key="a" data-testid="a">
            A
          </div>,
          <div key="b" data-testid="b">
            B
          </div>,
        ]}
      </TransitionGroup>,
    )

    const bEl = screen.getByTestId('b')
    expect(bEl.classList.contains('t-enter')).toBe(true)
    expect(bEl.classList.contains('t-enter-from')).toBe(true)
  })

  it('handles removing a child that was re-added', () => {
    const { rerender } = render(
      <TransitionGroup>
        {[
          <div key="a" data-testid="a">
            A
          </div>,
          <div key="b" data-testid="b">
            B
          </div>,
        ]}
      </TransitionGroup>,
    )

    // Remove "b"
    rerender(
      <TransitionGroup>
        {[
          <div key="a" data-testid="a">
            A
          </div>,
        ]}
      </TransitionGroup>,
    )

    // Re-add "b"
    rerender(
      <TransitionGroup>
        {[
          <div key="a" data-testid="a">
            A
          </div>,
          <div key="b" data-testid="b">
            B
          </div>,
        ]}
      </TransitionGroup>,
    )

    expect(screen.getByTestId('b')).toBeInTheDocument()
  })

  it('calls onAfterLeave when leave completes', () => {
    const onAfterLeave = vi.fn()

    const { rerender } = render(
      <TransitionGroup onAfterLeave={onAfterLeave}>
        {[
          <div key="a" data-testid="a">
            A
          </div>,
          <div key="b" data-testid="b">
            B
          </div>,
        ]}
      </TransitionGroup>,
    )

    rerender(
      <TransitionGroup onAfterLeave={onAfterLeave}>
        {[
          <div key="a" data-testid="a">
            A
          </div>,
        ]}
      </TransitionGroup>,
    )

    const bEl = screen.getByTestId('b')
    act(() => flushRaf())
    act(() => flushRaf())
    act(() => fireTransitionEnd(bEl))

    expect(onAfterLeave).toHaveBeenCalledTimes(1)
  })
})
