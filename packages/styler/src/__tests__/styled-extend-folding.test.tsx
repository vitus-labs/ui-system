/**
 * `styled(StyledComp)` folds into one component (styled-components v6
 * semantics), and dynamic styled components don't forward the injected
 * context theme (2026-11 audit). SSR side: styled-extend-folding-ssr.test.tsx.
 */
import { render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { sheet } from '../sheet'
import { styled } from '../styled'
import { ThemeProvider } from '../ThemeProvider'

const sheetRules = (): string[] => {
  const el = document.querySelector('style[data-vl]') as HTMLStyleElement
  return Array.from(el.sheet?.cssRules ?? []).map((r) => r.cssText)
}

afterEach(() => {
  sheet.clearAll()
})

describe('styled(StyledComp) folds into a single component', () => {
  it('static extension of a dynamic base wins', () => {
    const Base = styled('div')`color: ${(p: any) => p.$c ?? 'red'};`
    const Ext = styled(Base)`color: blue;`
    const { container } = render(<Ext id="x" />)
    const el = container.querySelector('#x') as HTMLElement
    expect(getComputedStyle(el).color).toBe('rgb(0, 0, 255)')
    expect(el.className.split(' ').length).toBe(1)
  })

  it('dynamic extension still wins after the base prop changes', () => {
    const Base = styled('div')`color: ${(p: any) => p.c};`
    const Ext = styled(Base)`color: ${() => 'blue'};`
    const r = render(<Ext id="y" c="red" />)
    const el = r.container.querySelector('#y') as HTMLElement
    expect(getComputedStyle(el).color).toBe('rgb(0, 0, 255)')
    r.rerender(<Ext id="y" c="green" />)
    expect(getComputedStyle(el).color).toBe('rgb(0, 0, 255)')
  })

  it('transient $props reach the base interpolations', () => {
    const Base = styled('div')`width: ${(p: any) => p.$w}px;`
    const Ext = styled(Base)`color: blue;`
    const { container } = render(<Ext id="z" $w={10} />)
    const el = container.querySelector('#z') as HTMLElement
    expect(getComputedStyle(el).width).toBe('10px')
    expect(el.hasAttribute('$w')).toBe(false)
  })

  it('extension elements match Base component selectors', () => {
    const Base = styled('div')`color: red;`
    const Ext = styled(Base)`color: blue;`
    const Parent = styled('section')`
      & ${Base} { outline-color: green; }
    `
    const { container } = render(
      <Parent>
        <Ext id="e" />
      </Parent>,
    )
    const el = container.querySelector('#e') as HTMLElement
    expect(el.classList.contains((Base as any)._sel.slice(1))).toBe(true)
    expect(getComputedStyle(el).color).toBe('rgb(0, 0, 255)')
  })

  it('renders the base tag, keeps the extension displayName, supports `as`', () => {
    const Base = styled('button')`color: red;`
    const Ext = styled(Base)`color: blue;`
    expect(Ext.displayName).toBe('styled(styled(button))')
    const { container } = render(
      <>
        <Ext id="b" />
        <Ext as="a" id="a" />
      </>,
    )
    expect(container.querySelector('#b')?.tagName).toBe('BUTTON')
    expect(container.querySelector('#a')?.tagName).toBe('A')
  })

  it('composes shouldForwardProp (extension filter + default DOM filter)', () => {
    const Base = styled('div')`color: red;`
    const Ext = styled(Base, {
      shouldForwardProp: (p) => p !== 'title',
    })`color: blue;`
    const { container } = render(
      <Ext id="f" title="no" variant="junk" data-x="1" />,
    )
    const el = container.querySelector('#f') as HTMLElement
    expect(el.hasAttribute('title')).toBe(false)
    expect(el.hasAttribute('variant')).toBe(false)
    expect(el.getAttribute('data-x')).toBe('1')
  })

  it('ANDs base and extension filters; boost is OR-ed', () => {
    const Base = styled('div', {
      shouldForwardProp: (p) => p !== 'title',
      boost: true,
    })`color: red;`
    const Ext = styled(Base, {
      shouldForwardProp: (p) => p !== 'lang',
    })`color: blue;`
    const { container } = render(<Ext id="g" title="t" lang="cs" dir="ltr" />)
    const el = container.querySelector('#g') as HTMLElement
    expect(el.hasAttribute('title')).toBe(false)
    expect(el.hasAttribute('lang')).toBe(false)
    expect(el.getAttribute('dir')).toBe('ltr')
    const cls = el.className.split(' ')[0]
    expect(sheetRules().some((t) => t.startsWith(`.${cls}.${cls}`))).toBe(true)
  })

  it('does not fold a wrapper that hoisted the base statics (attrs/rocketstyle)', () => {
    const Base = styled('div')`color: red;`
    const Wrapper = (p: any) => <Base {...p} data-wrapped="1" />
    for (const k of ['_sel', '_styler']) {
      Object.defineProperty(
        Wrapper,
        k,
        Object.getOwnPropertyDescriptor(Base, k)!,
      )
    }
    const S = styled(Wrapper)`color: blue;`
    const { container } = render(<S id="w" />)
    const el = container.querySelector('#w') as HTMLElement
    expect(el.getAttribute('data-wrapped')).toBe('1')
    expect(getComputedStyle(el).color).toBe('rgb(0, 0, 255)')
  })

  it('joins templates safely (no trailing `;`, trailing line comment)', () => {
    const Base = styled('div')`width: 5px // trailing comment`
    const Ext = styled(Base)`height: 6px`
    const { container } = render(<Ext id="j" />)
    const cs = getComputedStyle(container.querySelector('#j')!)
    expect(cs.width).toBe('5px')
    expect(cs.height).toBe('6px')
  })

  it('leaves styled(NonStyledComponent) as a wrapper', () => {
    const Inner = (p: any) => <span {...p} data-inner="1" />
    const S = styled(Inner)`color: red;`
    const { container } = render(<S id="n" />)
    expect(container.querySelector('#n')?.getAttribute('data-inner')).toBe('1')
  })
})

describe('dynamic styled does not forward the context theme', () => {
  it('matches the static path for component targets', () => {
    let seen: Record<string, unknown> = {}
    const Custom = (p: any) => {
      seen = p
      return <div className={p.className} />
    }
    const Dyn = styled(Custom)`color: ${(p: any) => p.theme.c};`
    const Stat = styled(Custom)`color: red;`
    render(
      <ThemeProvider theme={{ c: 'red' }}>
        <Dyn />
      </ThemeProvider>,
    )
    expect('theme' in seen).toBe(false)
    render(
      <ThemeProvider theme={{ c: 'red' }}>
        <Stat />
      </ThemeProvider>,
    )
    expect('theme' in seen).toBe(false)
  })

  it('still forwards an explicitly passed theme', () => {
    let seen: Record<string, unknown> = {}
    const Custom = (p: any) => {
      seen = p
      return null
    }
    const Dyn = styled(Custom)`color: ${(p: any) => p.theme.c};`
    const theme = { c: 'blue' }
    render(<Dyn theme={theme} />)
    expect(seen.theme).toBe(theme)
  })
})
