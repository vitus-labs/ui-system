import { render, screen } from '@testing-library/react'
import { createElement, Fragment, useState } from 'react'
import Element from '../Element'
import Iterator from '../helpers/Iterator/component'
import Portal from '../Portal/component'
import Text from '../Text'

const Stateful = ({ label }: { label: string }) => {
  const [v] = useState(label)
  return <span data-testid="stateful">{v}</span>
}

describe('Iterator keys', () => {
  it('preserves user keys so state follows identity on prepend', () => {
    const I = Iterator as any
    const { rerender } = render(
      <I>{[<Stateful key="a" label="a" />, <Stateful key="b" label="b" />]}</I>,
    )
    expect(screen.getAllByTestId('stateful').map((n) => n.textContent)).toEqual(
      ['a', 'b'],
    )
    rerender(
      <I>
        {[
          <Stateful key="z" label="z" />,
          <Stateful key="a" label="NEW" />,
          <Stateful key="b" label="NEW" />,
        ]}
      </I>,
    )
    expect(screen.getAllByTestId('stateful').map((n) => n.textContent)).toEqual(
      ['z', 'a', 'b'],
    )
  })

  it('fallback index keys do not collide with user keys', () => {
    const I = Iterator as any
    const err = vi.spyOn(console, 'error').mockImplementation(() => {})
    // unkeyed siblings next to a user key "1" are the case under test
    const unkeyed = [
      createElement('span', null, 'b'),
      createElement('span', null, 'c'),
    ]
    render(<I>{[<span key="1">a</span>, ...unkeyed]}</I>)
    expect(err.mock.calls.some((c) => String(c[0]).includes('same key'))).toBe(
      false,
    )
    err.mockRestore()
  })

  it('renders a fragment with a single child', () => {
    const I = Iterator as any
    render(
      <I itemProps={{ 'data-x': '1' }}>
        <Fragment>
          <span data-testid="only">only</span>
        </Fragment>
      </I>,
    )
    expect(screen.getByTestId('only')).toHaveAttribute('data-x', '1')
  })
})

describe('Portal', () => {
  it('does not throw on unmount when node was already detached', async () => {
    const { unmount } = render(
      <Portal>
        <span data-testid="p" />
      </Portal>,
    )
    const node = (await screen.findByTestId('p')).parentElement as HTMLElement
    node.remove()
    expect(() => unmount()).not.toThrow()
  })

  it('mounts content in the same commit (layout effect)', () => {
    render(
      <Portal>
        <span data-testid="sync" />
      </Portal>,
    )
    expect(screen.getByTestId('sync')).toBeInTheDocument()
  })
})

describe('Element ref swap', () => {
  it('attaches the new ref when ref={a} changes to ref={b}', () => {
    const a = { current: null as HTMLElement | null }
    const b = { current: null as HTMLElement | null }
    const { rerender } = render(<Element ref={a as any}>x</Element>)
    expect(a.current).toBeInstanceOf(HTMLElement)
    rerender(<Element ref={b as any}>x</Element>)
    expect(a.current).toBeNull()
    expect(b.current).toBeInstanceOf(HTMLElement)
  })
})

describe('Element equalize shrink', () => {
  const sizes = { before: 100, after: 50 }
  let roCallback: (() => void) | undefined
  const OriginalRO = globalThis.ResizeObserver

  beforeEach(() => {
    roCallback = undefined
    globalThis.ResizeObserver = class {
      constructor(cb: () => void) {
        roCallback = cb
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    } as any
    // Natural size = content size unless an inline width is set.
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      get(this: HTMLElement) {
        if (this.style.width) return Number.parseInt(this.style.width, 10)
        return this.dataset.slot === 'before' ? sizes.before : sizes.after
      },
    })
  })
  afterEach(() => {
    globalThis.ResizeObserver = OriginalRO
    delete (HTMLElement.prototype as any).offsetWidth
  })

  it('shrinks both slots when natural size gets smaller', () => {
    const { container } = render(
      <Element
        equalBeforeAfter
        direction="inline"
        beforeContent={<span data-slot="before" />}
        afterContent={<span data-slot="after" />}
      >
        Main
      </Element>,
    )
    const root = container.firstElementChild as HTMLElement
    const [beforeEl, afterEl] = [
      root.firstElementChild as HTMLElement,
      root.lastElementChild as HTMLElement,
    ]
    // The slot wrappers are Content elements; mark them for the mock.
    beforeEl.dataset.slot = 'before'
    afterEl.dataset.slot = 'after'
    roCallback?.()
    expect(beforeEl.style.width).toBe('100px')
    expect(afterEl.style.width).toBe('100px')

    sizes.before = 40
    sizes.after = 30
    roCallback?.()
    expect(beforeEl.style.width).toBe('40px')
    expect(afterEl.style.width).toBe('40px')
  })
})

describe('Text $text memoization', () => {
  it('renders with css prop', () => {
    const css = 'color: red;'
    const { container, rerender } = render(<Text css={css}>a</Text>)
    const first = container.firstElementChild?.className
    rerender(<Text css={css}>a</Text>)
    expect(container.firstElementChild?.className).toBe(first)
  })
})
