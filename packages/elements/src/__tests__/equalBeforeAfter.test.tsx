import { render } from '@testing-library/react'
import Element from '../Element'

describe('Element equalBeforeAfter', () => {
  it('does not equalize when equalBeforeAfter is not set', () => {
    const { container } = render(
      <Element
        direction="inline"
        beforeContent={<span>Before</span>}
        afterContent={<span>After</span>}
      >
        Main
      </Element>,
    )
    const root = container.firstElementChild as HTMLElement
    const beforeEl = root.firstElementChild as HTMLElement
    const afterEl = root.lastElementChild as HTMLElement

    expect(beforeEl.style.width).toBe('')
    expect(afterEl.style.width).toBe('')
  })

  it('equalizes width for inline direction', () => {
    const { container } = render(
      <Element
        equalBeforeAfter
        direction="inline"
        beforeContent={<span>B</span>}
        afterContent={<span>After</span>}
      >
        Main
      </Element>,
    )
    const root = container.firstElementChild as HTMLElement
    const beforeEl = root.firstElementChild as HTMLElement
    const afterEl = root.lastElementChild as HTMLElement

    // jsdom returns 0 for offsetWidth, so both get "0px"
    expect(beforeEl.style.width).toBe('0px')
    expect(afterEl.style.width).toBe('0px')
  })

  it('equalizes height for rows direction', () => {
    const { container } = render(
      <Element
        equalBeforeAfter
        direction="rows"
        beforeContent={<span>B</span>}
        afterContent={<span>After</span>}
      >
        Main
      </Element>,
    )
    const root = container.firstElementChild as HTMLElement
    const beforeEl = root.firstElementChild as HTMLElement
    const afterEl = root.lastElementChild as HTMLElement

    expect(beforeEl.style.height).toBe('0px')
    expect(afterEl.style.height).toBe('0px')
  })

  it('does not crash without before/after content', () => {
    const { container } = render(<Element equalBeforeAfter>Main only</Element>)
    expect(container.firstElementChild).toBeTruthy()
  })

  it('does not crash with only beforeContent', () => {
    const { container } = render(
      <Element equalBeforeAfter beforeContent={<span>Before</span>}>
        Main
      </Element>,
    )
    expect(container.firstElementChild).toBeTruthy()
  })

  it('does not crash with only afterContent', () => {
    const { container } = render(
      <Element equalBeforeAfter afterContent={<span>After</span>}>
        Main
      </Element>,
    )
    expect(container.firstElementChild).toBeTruthy()
  })

  it('uses larger dimension when sizes differ', () => {
    const { container, rerender } = render(
      <Element
        equalBeforeAfter
        direction="inline"
        beforeContent={<span>B</span>}
        afterContent={<span>After</span>}
      >
        Main
      </Element>,
    )
    const root = container.firstElementChild as HTMLElement
    const beforeEl = root.firstElementChild as HTMLElement
    const afterEl = root.lastElementChild as HTMLElement

    // Mock different sizes on the slot wrappers
    Object.defineProperty(beforeEl, 'offsetWidth', {
      value: 50,
      configurable: true,
    })
    Object.defineProperty(afterEl, 'offsetWidth', {
      value: 100,
      configurable: true,
    })

    // Re-render to trigger useLayoutEffect
    rerender(
      <Element
        equalBeforeAfter
        direction="inline"
        beforeContent={<span>B2</span>}
        afterContent={<span>After2</span>}
      >
        Main
      </Element>,
    )

    expect(beforeEl.style.width).toBe('100px')
    expect(afterEl.style.width).toBe('100px')
  })

  it('renders three slot children', () => {
    const { container } = render(
      <Element
        equalBeforeAfter
        direction="inline"
        beforeContent={<span>Short</span>}
        afterContent={<span>Longer content</span>}
      >
        Center
      </Element>,
    )
    const root = container.firstElementChild as HTMLElement
    expect(root.children).toHaveLength(3)
  })
})
