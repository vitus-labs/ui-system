import { act, render, screen } from '@testing-library/react'
import type { ReactElement } from 'react'
import { kinetic } from '../index'
import { fade } from '../presets'
import Stagger from '../Stagger'
import Transition from '../Transition'
import TransitionGroup from '../TransitionGroup'
import { fireTransitionEnd, setupMatchMedia, setupRaf } from './setupFixtures'

setupMatchMedia()
const { flushRaf } = setupRaf()

const flushFrames = () => {
  act(() => flushRaf())
  act(() => flushRaf())
}

const items = (keys: string[]) =>
  keys.map((k) => (
    <div key={k} data-testid={k}>
      {k}
    </div>
  ))

const order = (container: HTMLElement) =>
  Array.from(container.children).map((c) => c.textContent)

describe('transition delay survives the transition shorthand', () => {
  // jsdom's cssstyle doesn't expand the `transition` shorthand, so emulate
  // the browser: assigning the shorthand resets transition-delay to 0.
  let restore = () => {}
  beforeEach(() => {
    const proto = Object.getPrototypeOf(document.createElement('div').style)
    const desc = Object.getOwnPropertyDescriptor(proto, 'transition')
    if (!desc?.set) return
    Object.defineProperty(proto, 'transition', {
      ...desc,
      configurable: true,
      set(this: CSSStyleDeclaration, v: string) {
        desc.set?.call(this, v)
        this.transitionDelay = '0s'
      },
    })
    restore = () => Object.defineProperty(proto, 'transition', desc)
  })
  afterEach(() => restore())

  it('Transition keeps `delay` while entering and clears it once entered', () => {
    render(
      <Transition
        show
        appear
        delay={150}
        enterTransition="opacity 300ms ease"
        enterStyle={{ opacity: 0 }}
        enterToStyle={{ opacity: 1 }}
      >
        <div data-testid="el" />
      </Transition>,
    )
    flushFrames()
    const el = screen.getByTestId('el')
    expect(el.style.transitionDelay).toBe('150ms')

    act(() => fireTransitionEnd(el))
    expect(el.style.transitionDelay).toBe('')
  })

  it('Stagger children keep their cascade delay while entering', () => {
    render(
      <Stagger
        show
        appear
        interval={100}
        enterTransition="opacity 300ms ease"
        enterStyle={{ opacity: 0 }}
        enterToStyle={{ opacity: 1 }}
      >
        {items(['a', 'b', 'c'])}
      </Stagger>,
    )
    flushFrames()
    expect(screen.getByTestId('a').style.transitionDelay).toBe('0ms')
    expect(screen.getByTestId('b').style.transitionDelay).toBe('100ms')
    expect(screen.getByTestId('c').style.transitionDelay).toBe('200ms')

    // cleared after entering so later (hover) transitions aren't delayed
    act(() => fireTransitionEnd(screen.getByTestId('b')))
    expect(screen.getByTestId('b').style.transitionDelay).toBe('')
  })

  it('a sibling removal does not restart an in-flight Stagger item', () => {
    const props = {
      show: true,
      appear: true,
      interval: 100,
      enterTransition: 'opacity 300ms ease',
      enterStyle: { opacity: 0 },
      enterToStyle: { opacity: 1 },
    }
    const { rerender } = render(
      <Stagger {...props}>{items(['a', 'b'])}</Stagger>,
    )
    flushFrames()
    expect(screen.getByTestId('b').style.transitionDelay).toBe('100ms')
    expect(screen.getByTestId('b').style.opacity).toBe('1')
    // b's cascade delay becomes 0 — its running enter must not be
    // re-applied, which would snap it back to the start state (opacity 0).
    rerender(<Stagger {...props}>{items(['b'])}</Stagger>)
    expect(screen.getByTestId('b').style.opacity).toBe('1')
  })

  it('kinetic().stagger() keeps the cascade delay while entering', () => {
    const List = kinetic('ul')
      .preset(fade)
      .config({ appear: true })
      .stagger({ interval: 100 })
    render(
      <List show>
        <li data-testid="a">a</li>
        <li data-testid="b">b</li>
      </List>,
    )
    flushFrames()
    expect(screen.getByTestId('b').style.transitionDelay).toBe('100ms')
  })
})

describe('TransitionGroup ordering and re-adds', () => {
  it('a leaving item keeps its position', () => {
    const { container, rerender } = render(
      <TransitionGroup leave="x">{items(['a', 'b', 'c'])}</TransitionGroup>,
    )
    rerender(<TransitionGroup leave="x">{items(['a', 'c'])}</TransitionGroup>)
    expect(order(container)).toEqual(['a', 'b', 'c'])
  })

  it('a leaving item keeps its position (kinetic group)', () => {
    const List = kinetic('div').leaveClass({ active: 'x' }).group()
    const { container, rerender } = render(
      <List>{items(['a', 'b', 'c'])}</List>,
    )
    rerender(<List>{items(['a', 'c'])}</List>)
    expect(order(container.firstElementChild as HTMLElement)).toEqual([
      'a',
      'b',
      'c',
    ])
  })

  it('a re-added key that was in the initial render animates in', () => {
    const { rerender } = render(
      <TransitionGroup enter="in" enterFrom="from">
        {items(['a', 'b'])}
      </TransitionGroup>,
    )
    rerender(
      <TransitionGroup enter="in" enterFrom="from">
        {items(['a'])}
      </TransitionGroup>,
    )
    flushFrames()
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(screen.queryByTestId('b')).not.toBeInTheDocument()

    rerender(
      <TransitionGroup enter="in" enterFrom="from">
        {items(['a', 'b'])}
      </TransitionGroup>,
    )
    expect(screen.getByTestId('b')).toHaveClass('in')
    expect(screen.getByTestId('b')).toHaveClass('from')
  })

  it('a re-added key animates in (kinetic group)', () => {
    const List = kinetic('div')
      .enterClass({ active: 'in', from: 'from' })
      .group()
    const { rerender } = render(<List>{items(['a', 'b'])}</List>)
    rerender(<List>{items(['a'])}</List>)
    flushFrames()
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    rerender(<List>{items(['a', 'b'])}</List>)
    expect(screen.getByTestId('b')).toHaveClass('in')
  })

  it('warns in dev about children without a key', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(
      <TransitionGroup>
        {[<div key={undefined as never}>no key</div>] as ReactElement[]}
      </TransitionGroup>,
    )
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('key'))
    warn.mockRestore()
  })
})

describe('kinetic() stagger/group forward all callbacks', () => {
  it('stagger forwards onEnter, onAfterEnter (last child only), onLeave', () => {
    const onEnter = vi.fn()
    const onAfterEnter = vi.fn()
    const onLeave = vi.fn()
    const List = kinetic('ul').stagger({ interval: 10 })
    const props = { onEnter, onAfterEnter, onLeave }
    const kids = [
      <li key="1" data-testid="i1" />,
      <li key="2" data-testid="i2" />,
    ]

    const { rerender } = render(
      <List show={false} {...props}>
        {kids}
      </List>,
    )
    rerender(
      <List show {...props}>
        {kids}
      </List>,
    )
    flushFrames()
    expect(onEnter).toHaveBeenCalledTimes(2)

    act(() => fireTransitionEnd(screen.getByTestId('i1')))
    act(() => fireTransitionEnd(screen.getByTestId('i2')))
    expect(onAfterEnter).toHaveBeenCalledTimes(1)

    rerender(
      <List show={false} {...props}>
        {kids}
      </List>,
    )
    expect(onLeave).toHaveBeenCalledTimes(2)
  })

  it('group forwards onEnter, onAfterEnter, onLeave', () => {
    const onEnter = vi.fn()
    const onAfterEnter = vi.fn()
    const onLeave = vi.fn()
    const List = kinetic('div').group()
    const props = { onEnter, onAfterEnter, onLeave }

    const { rerender } = render(<List {...props}>{items(['a'])}</List>)
    rerender(<List {...props}>{items(['a', 'b'])}</List>)
    flushFrames()
    expect(onEnter).toHaveBeenCalledTimes(1)
    act(() => fireTransitionEnd(screen.getByTestId('b')))
    expect(onAfterEnter).toHaveBeenCalledTimes(1)

    rerender(<List {...props}>{items(['a'])}</List>)
    expect(onLeave).toHaveBeenCalledTimes(1)
  })
})

describe('interrupted transitions clean up stale classes', () => {
  const cfg = {
    enter: 'e',
    enterFrom: 'ef',
    enterTo: 'et',
    leave: 'l',
    leaveFrom: 'lf',
    leaveTo: 'lt',
  }

  it('leave removes enter classes and enter removes leave classes', () => {
    const { rerender } = render(
      <Transition show appear {...cfg}>
        <div data-testid="el" />
      </Transition>,
    )
    const el = screen.getByTestId('el')
    expect(el).toHaveClass('e', 'ef')

    // interrupt entering with a leave before the first frame ran
    rerender(
      <Transition show={false} {...cfg}>
        <div data-testid="el" />
      </Transition>,
    )
    expect(el).toHaveClass('l', 'lf')
    expect(el).not.toHaveClass('e')
    expect(el).not.toHaveClass('ef')
    expect(el).not.toHaveClass('et')

    flushFrames()
    // interrupt leaving with an enter
    rerender(
      <Transition show {...cfg}>
        <div data-testid="el" />
      </Transition>,
    )
    expect(el).toHaveClass('e', 'ef')
    expect(el).not.toHaveClass('l')
    expect(el).not.toHaveClass('lf')
    expect(el).not.toHaveClass('lt')
  })

  it('removes enterFrom once entered', () => {
    render(
      <Transition show appear {...cfg}>
        <div data-testid="el" />
      </Transition>,
    )
    const el = screen.getByTestId('el')
    // finish before the frame that would drop enterFrom ran
    act(() => fireTransitionEnd(el))
    expect(el).not.toHaveClass('ef')
    expect(el).not.toHaveClass('e')
  })
})
