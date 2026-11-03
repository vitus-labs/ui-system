/**
 * Regression tests for the 2026-11 elements audit (Iterator + Content gap).
 */
import { render } from '@testing-library/react'
import { breakpoints, Provider } from '@vitus-labs/unistyle'
import { Component, useState } from 'react'
import Element from '../Element'
import Iterator from '../helpers/Iterator'

const Item = ({ last, first, position, ...p }: any) => (
  <i
    data-first={String(first)}
    data-last={String(last)}
    data-pos={position}
    {...p}
  />
)

describe('Iterator children normalization', () => {
  const meta = (_: any, e: any) => ({
    first: e.first,
    last: e.last,
    position: e.position,
  })

  it('falsy children do not count toward first/last/position', () => {
    const show = false
    const { container } = render(
      <Iterator itemProps={meta}>
        {show && <Item data-k="z" />}
        <Item data-k="a" />
        <Item data-k="b" />
        {show && <Item data-k="c" />}
        {null}
      </Iterator>,
    )
    const items = [...container.querySelectorAll('i')]
    expect(items).toHaveLength(2)
    expect(items.map((n) => n.getAttribute('data-pos'))).toEqual(['1', '2'])
    expect(items[0]?.getAttribute('data-first')).toBe('true')
    expect(items[1]?.getAttribute('data-last')).toBe('true')
  })

  it('itemProps reach items of a nested mapped array', () => {
    const { container } = render(
      <Iterator itemProps={{ 'data-injected': 'yes' }}>
        <Item data-k="static" />
        {['x', 'y'].map((k) => (
          <Item key={k} data-k={k} />
        ))}
      </Iterator>,
    )
    const items = [...container.querySelectorAll('i')]
    expect(items).toHaveLength(3)
    expect(items.map((n) => n.getAttribute('data-injected'))).toEqual([
      'yes',
      'yes',
      'yes',
    ])
  })

  it('mapped items get positional metadata across the flattened list', () => {
    const { container } = render(
      <Iterator itemProps={meta}>
        <Item data-k="static" />
        {['x', 'y'].map((k) => (
          <Item key={k} data-k={k} />
        ))}
      </Iterator>,
    )
    const items = [...container.querySelectorAll('i')]
    expect(items.map((n) => n.getAttribute('data-pos'))).toEqual([
      '1',
      '2',
      '3',
    ])
    expect(items[2]?.getAttribute('data-last')).toBe('true')
  })

  it('state of mapped items follows their keys on reorder', () => {
    class Stateful extends Component<{ label: string }> {
      initial = this.props.label
      render() {
        return <i data-initial={this.initial} />
      }
    }
    let setOrder: (v: string[]) => void = () => {}
    const App = () => {
      const [order, set] = useState(['a', 'b'])
      setOrder = set
      return (
        <Iterator itemProps={{}}>
          <span>head</span>
          {order.map((k) => (
            <Stateful key={k} label={k} />
          ))}
        </Iterator>
      )
    }
    const { container, rerender } = render(<App />)
    setOrder(['z', 'a', 'b'])
    rerender(<App />)
    const initial = [...container.querySelectorAll('i')].map((n) =>
      n.getAttribute('data-initial'),
    )
    // Existing items keep their own state; only the new one is fresh.
    expect(initial).toEqual(['z', 'a', 'b'])
  })
})

describe('Content gap margins for reverse directions', () => {
  const cssFor = (el: Element) => {
    const out: string[] = []
    for (const s of Array.from(document.styleSheets) as CSSStyleSheet[])
      for (const r of Array.from(s.cssRules)) {
        const sel = (r as CSSStyleRule).selectorText
        if (sel && [...el.classList].some((c) => sel.includes(c)))
          out.push(r.cssText)
      }
    return out.join('\n')
  }

  const renderSlots = (direction: string) => {
    const { container } = render(
      <Provider theme={{ ...breakpoints, rootSize: 16 }}>
        <Element
          direction={direction as any}
          gap={8}
          beforeContent={<b>B</b>}
          afterContent={<b>A</b>}
        >
          C
        </Element>
      </Provider>,
    )
    return {
      before: cssFor(
        container.querySelector('[data-vl-element="before"]') as Element,
      ),
      after: cssFor(
        container.querySelector('[data-vl-element="after"]') as Element,
      ),
    }
  }

  it.each([
    ['inline', 'margin-right', 'margin-left'],
    ['reverseInline', 'margin-left', 'margin-right'],
    ['rows', 'margin-bottom', 'margin-top'],
    ['reverseRows', 'margin-top', 'margin-bottom'],
  ])(
    '%s: before gets %s, after gets %s',
    (direction, beforeProp, afterProp) => {
      const { before, after } = renderSlots(direction)
      expect(before).toContain(`${beforeProp}:`)
      expect(before).not.toContain(`${afterProp}:`)
      expect(after).toContain(`${afterProp}:`)
      expect(after).not.toContain(`${beforeProp}:`)
    },
  )
})
