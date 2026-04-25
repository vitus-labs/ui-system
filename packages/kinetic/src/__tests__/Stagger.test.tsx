import { act, render, screen } from '@testing-library/react'
import Stagger from '../Stagger'
import { setupMatchMedia, setupRaf } from './setupFixtures'

setupMatchMedia()
setupRaf()

describe('Stagger', () => {
  it('renders all children when show=true', () => {
    render(
      <Stagger show>
        {[
          <div key="a" data-testid="a">
            A
          </div>,
          <div key="b" data-testid="b">
            B
          </div>,
          <div key="c" data-testid="c">
            C
          </div>,
        ]}
      </Stagger>,
    )
    expect(screen.getByTestId('a')).toBeInTheDocument()
    expect(screen.getByTestId('b')).toBeInTheDocument()
    expect(screen.getByTestId('c')).toBeInTheDocument()
  })

  it('does not render children when show=false', () => {
    render(
      <Stagger show={false}>
        {[
          <div key="a" data-testid="a">
            A
          </div>,
          <div key="b" data-testid="b">
            B
          </div>,
        ]}
      </Stagger>,
    )
    expect(screen.queryByTestId('a')).not.toBeInTheDocument()
    expect(screen.queryByTestId('b')).not.toBeInTheDocument()
  })

  it('sets --stagger-index CSS custom property on each child', () => {
    render(
      <Stagger show appear>
        {[
          <div key="a" data-testid="a">
            A
          </div>,
          <div key="b" data-testid="b">
            B
          </div>,
          <div key="c" data-testid="c">
            C
          </div>,
        ]}
      </Stagger>,
    )

    expect(
      screen.getByTestId('a').style.getPropertyValue('--stagger-index'),
    ).toBe('0')
    expect(
      screen.getByTestId('b').style.getPropertyValue('--stagger-index'),
    ).toBe('1')
    expect(
      screen.getByTestId('c').style.getPropertyValue('--stagger-index'),
    ).toBe('2')
  })

  it('sets transitionDelay incrementally on each child', () => {
    render(
      <Stagger show interval={100} appear>
        {[
          <div key="a" data-testid="a">
            A
          </div>,
          <div key="b" data-testid="b">
            B
          </div>,
          <div key="c" data-testid="c">
            C
          </div>,
        ]}
      </Stagger>,
    )

    expect(screen.getByTestId('a').style.transitionDelay).toBe('0ms')
    expect(screen.getByTestId('b').style.transitionDelay).toBe('100ms')
    expect(screen.getByTestId('c').style.transitionDelay).toBe('200ms')
  })

  it('uses default interval of 50ms', () => {
    render(
      <Stagger show appear>
        {[
          <div key="a" data-testid="a">
            A
          </div>,
          <div key="b" data-testid="b">
            B
          </div>,
        ]}
      </Stagger>,
    )

    expect(screen.getByTestId('a').style.transitionDelay).toBe('0ms')
    expect(screen.getByTestId('b').style.transitionDelay).toBe('50ms')
  })

  it('sets --stagger-interval CSS custom property', () => {
    render(
      <Stagger show interval={75} appear>
        {[
          <div key="a" data-testid="a">
            A
          </div>,
        ]}
      </Stagger>,
    )

    expect(
      screen.getByTestId('a').style.getPropertyValue('--stagger-interval'),
    ).toBe('75ms')
  })

  it('reverses stagger order on leave when reverseLeave=true', () => {
    const { rerender } = render(
      <Stagger show interval={100} reverseLeave>
        {[
          <div key="a" data-testid="a">
            A
          </div>,
          <div key="b" data-testid="b">
            B
          </div>,
          <div key="c" data-testid="c">
            C
          </div>,
        ]}
      </Stagger>,
    )

    rerender(
      <Stagger show={false} interval={100} reverseLeave>
        {[
          <div key="a" data-testid="a">
            A
          </div>,
          <div key="b" data-testid="b">
            B
          </div>,
          <div key="c" data-testid="c">
            C
          </div>,
        ]}
      </Stagger>,
    )

    // Reversed: c=0, b=1, a=2
    expect(screen.getByTestId('a').style.transitionDelay).toBe('200ms')
    expect(screen.getByTestId('b').style.transitionDelay).toBe('100ms')
    expect(screen.getByTestId('c').style.transitionDelay).toBe('0ms')
  })

  it('uses index as key when children have no explicit key', () => {
    const children = [
      // biome-ignore lint/correctness/useJsxKeyInIterable: intentionally testing keyless children
      <div data-testid="a">A</div>,
      // biome-ignore lint/correctness/useJsxKeyInIterable: intentionally testing keyless children
      <div data-testid="b">B</div>,
    ]
    render(
      <Stagger show appear interval={100}>
        {children}
      </Stagger>,
    )

    expect(screen.getByTestId('a').style.transitionDelay).toBe('0ms')
    expect(screen.getByTestId('b').style.transitionDelay).toBe('100ms')
  })

  it('renders keyless children with index fallback and applies stagger styles', () => {
    const children = [
      // biome-ignore lint/correctness/useJsxKeyInIterable: intentionally testing keyless children
      <div data-testid="x">X</div>,
      // biome-ignore lint/correctness/useJsxKeyInIterable: intentionally testing keyless children
      <div data-testid="y">Y</div>,
      // biome-ignore lint/correctness/useJsxKeyInIterable: intentionally testing keyless children
      <div data-testid="z">Z</div>,
    ]
    render(
      <Stagger show appear interval={75}>
        {children}
      </Stagger>,
    )

    expect(screen.getByTestId('x')).toBeInTheDocument()
    expect(screen.getByTestId('y')).toBeInTheDocument()
    expect(screen.getByTestId('z')).toBeInTheDocument()

    expect(screen.getByTestId('x').style.transitionDelay).toBe('0ms')
    expect(screen.getByTestId('y').style.transitionDelay).toBe('75ms')
    expect(screen.getByTestId('z').style.transitionDelay).toBe('150ms')

    expect(
      screen.getByTestId('x').style.getPropertyValue('--stagger-index'),
    ).toBe('0')
    expect(
      screen.getByTestId('y').style.getPropertyValue('--stagger-index'),
    ).toBe('1')
    expect(
      screen.getByTestId('z').style.getPropertyValue('--stagger-index'),
    ).toBe('2')
  })

  it('preserves child existing styles', () => {
    render(
      <Stagger show appear>
        {[
          <div key="a" data-testid="a" style={{ color: 'red' }}>
            A
          </div>,
        ]}
      </Stagger>,
    )

    const el = screen.getByTestId('a')
    expect(el.style.color).toBe('red')
    expect(el.style.transitionDelay).toBe('0ms')
  })

  it('fires onAfterLeave on last child (normal order)', () => {
    const onAfterLeave = vi.fn()

    const { rerender } = render(
      <Stagger show onAfterLeave={onAfterLeave}>
        {[
          <div key="a" data-testid="a">
            A
          </div>,
          <div key="b" data-testid="b">
            B
          </div>,
        ]}
      </Stagger>,
    )

    rerender(
      <Stagger show={false} onAfterLeave={onAfterLeave}>
        {[
          <div key="a" data-testid="a">
            A
          </div>,
          <div key="b" data-testid="b">
            B
          </div>,
        ]}
      </Stagger>,
    )

    // The last child (b) should receive the onAfterLeave
    // Timeout fallback completes the transitions
    act(() => {
      vi.advanceTimersByTime(5100)
    })

    expect(onAfterLeave).toHaveBeenCalled()
  })

  it('fires onAfterLeave on first child when reverseLeave=true', () => {
    const onAfterLeave = vi.fn()

    const { rerender } = render(
      <Stagger show reverseLeave onAfterLeave={onAfterLeave}>
        {[
          <div key="a" data-testid="a">
            A
          </div>,
          <div key="b" data-testid="b">
            B
          </div>,
        ]}
      </Stagger>,
    )

    rerender(
      <Stagger show={false} reverseLeave onAfterLeave={onAfterLeave}>
        {[
          <div key="a" data-testid="a">
            A
          </div>,
          <div key="b" data-testid="b">
            B
          </div>,
        ]}
      </Stagger>,
    )

    act(() => {
      vi.advanceTimersByTime(5100)
    })

    expect(onAfterLeave).toHaveBeenCalled()
  })
})
