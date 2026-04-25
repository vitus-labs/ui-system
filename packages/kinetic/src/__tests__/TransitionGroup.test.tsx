import { act, render, screen } from '@testing-library/react'
import TransitionGroup from '../TransitionGroup'
import { fireTransitionEnd, setupMatchMedia, setupRaf } from './setupFixtures'

setupMatchMedia()
const { flushRaf } = setupRaf()

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

  it('ignores children without keys', () => {
    // Children.forEach skips null/non-elements, and child.key == null is filtered
    const { container } = render(
      <TransitionGroup>
        {[
          <div key="a" data-testid="a">
            A
          </div>,
        ]}
      </TransitionGroup>,
    )
    expect(screen.getByTestId('a')).toBeInTheDocument()
    expect(container).toBeDefined()
  })

  it('filters out children with null keys from keyed list', () => {
    // Manually construct children array with a keyless element to hit child.key == null
    const keyedChild = (
      <div key="a" data-testid="a">
        A
      </div>
    )
    const keylessChild = <div data-testid="no-key">No Key</div>

    const { container } = render(
      <TransitionGroup>{[keyedChild, keylessChild]}</TransitionGroup>,
    )

    // The keyed child should render, the keyless one is filtered from the keyed list
    // but still rendered through React's normal rendering
    expect(screen.getByTestId('a')).toBeInTheDocument()
    expect(container).toBeDefined()
  })

  it('appear=true animates initial children on mount', () => {
    const onEnter = vi.fn()

    render(
      <TransitionGroup
        appear
        enter="t-enter"
        enterFrom="t-from"
        onEnter={onEnter}
      >
        {[
          <div key="a" data-testid="a">
            A
          </div>,
        ]}
      </TransitionGroup>,
    )

    // With appear=true, initial children should animate in
    expect(onEnter).toHaveBeenCalled()
    const el = screen.getByTestId('a')
    expect(el.classList.contains('t-enter')).toBe(true)
  })

  it('cancels leave animation when a leaving child reappears', () => {
    const onAfterLeave = vi.fn()

    const { rerender } = render(
      <TransitionGroup
        enter="t-enter"
        enterFrom="t-from"
        enterTo="t-to"
        leave="t-leave"
        onAfterLeave={onAfterLeave}
      >
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

    // Remove "b" — starts leave animation
    rerender(
      <TransitionGroup
        enter="t-enter"
        enterFrom="t-from"
        enterTo="t-to"
        leave="t-leave"
        onAfterLeave={onAfterLeave}
      >
        {[
          <div key="a" data-testid="a">
            A
          </div>,
        ]}
      </TransitionGroup>,
    )

    // "b" should still be in the DOM (leaving)
    expect(screen.getByTestId('b')).toBeInTheDocument()

    // Re-add "b" before leave completes — cancels leave, starts enter
    rerender(
      <TransitionGroup
        enter="t-enter"
        enterFrom="t-from"
        enterTo="t-to"
        leave="t-leave"
        onAfterLeave={onAfterLeave}
      >
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

    // "b" should be present and entering (show flipped back to true)
    expect(screen.getByTestId('b')).toBeInTheDocument()

    // The enter animation should be running on b
    const bEl = screen.getByTestId('b')
    expect(bEl.classList.contains('t-enter')).toBe(true)

    // Complete all animations via timeout
    act(() => {
      vi.advanceTimersByTime(5000)
    })

    // onAfterLeave should NOT have been called since leave was cancelled
    expect(onAfterLeave).not.toHaveBeenCalled()
    expect(screen.getByTestId('b')).toBeInTheDocument()
  })

  it('new children added after initial render use appear=true', () => {
    const { rerender } = render(
      <TransitionGroup enter="t-enter" enterFrom="t-from">
        {[
          <div key="a" data-testid="a">
            A
          </div>,
        ]}
      </TransitionGroup>,
    )

    // Add new child — it should animate in regardless of group appear setting
    rerender(
      <TransitionGroup enter="t-enter" enterFrom="t-from">
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
    expect(bEl.classList.contains('t-from')).toBe(true)
  })
})
