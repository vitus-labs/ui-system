import { render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { css } from '../css'
import { buildProps, filterProps } from '../forward'
import { createSheet } from '../sheet'
import { styled } from '../styled'
import { ThemeProvider, useTheme } from '../ThemeProvider'

describe('prop forwarding', () => {
  it('forwards on* props only when they are functions', () => {
    const fn = () => {}
    expect(filterProps({ onFoo: fn, onBar: 'x' })).toEqual({ onFoo: fn })
  })

  it('forwards SVG attributes', () => {
    const r = filterProps({
      viewBox: '0 0 1 1',
      xmlns: 'x',
      d: 'M0',
      fill: 'red',
      strokeWidth: 2,
      foo: 1,
    })
    expect(r).toEqual({
      viewBox: '0 0 1 1',
      xmlns: 'x',
      d: 'M0',
      fill: 'red',
      strokeWidth: 2,
    })
  })

  it('forwards any on* handler and newer props', () => {
    const fn = () => {}
    const r = filterProps({
      onPlayCapture: fn,
      onToggle: fn,
      onTimeUpdate: fn,
      inert: true,
      popover: '',
      suppressHydrationWarning: true,
      online: 1,
    })
    expect(Object.keys(r).sort()).toEqual([
      'inert',
      'onPlayCapture',
      'onTimeUpdate',
      'onToggle',
      'popover',
      'suppressHydrationWarning',
    ])
  })

  it('styled.svg keeps viewBox in markup', () => {
    const Svg = styled.svg!`color: red;`
    expect(renderToString(<Svg viewBox="0 0 10 10" />)).toContain(
      'viewBox="0 0 10 10"',
    )
  })

  it('applies shouldForwardProp to component targets', () => {
    const r = buildProps(
      { a: 1, b: 2, $t: 3 },
      'c',
      undefined,
      false,
      (p) => p !== 'b',
    )
    expect(r).toEqual({ className: 'c', a: 1 })
  })
})

describe('sheet', () => {
  it('splits @import from following rules and inserts it first', () => {
    const s = createSheet()
    const inserted: [string, number][] = []
    ;(s as any).sheet = {
      cssRules: { length: 3 },
      insertRule: (r: string, i: number) => inserted.push([r, i]),
    }
    s.insertGlobal('@import url(x.css); body{margin:0}')
    expect(inserted).toEqual([
      ['@import url(x.css);', 0],
      ['body{margin:0}', 3],
    ])
  })

  it('does not emit a lone `;` as a rule', () => {
    const s = createSheet()
    const inserted: string[] = []
    ;(s as any).sheet = {
      cssRules: { length: 0 },
      insertRule: (r: string) => inserted.push(r),
    }
    s.insertGlobal('body{margin:0}; html{color:red}')
    expect(inserted).toEqual(['body{margin:0}', 'html{color:red}'])
  })

  it('boosted and unboosted identical CSS get distinct classes', () => {
    const s = createSheet()
    expect(s.insert('color:red;', true)).not.toBe(s.insert('color:red;', false))
    expect(s.prepare('color:red;', true).className).not.toBe(
      s.prepare('color:red;').className,
    )
  })
})

describe('theme', () => {
  it('does not forward an empty theme to component targets', () => {
    let received: unknown = 'unset'
    const Inner = (p: any) => {
      received = p.theme
      return null
    }
    const C = styled(Inner)`color: ${(p: any) => p.theme.x ?? 'blue'};`
    render(<C />)
    expect(received).toBeUndefined()
  })

  it('dynamic styled without ThemeProvider gets an empty theme', () => {
    const C = styled.div!`color: ${(p: any) => p.theme.x ?? 'blue'};`
    expect(() => render(<C />)).not.toThrow()
  })

  it('supports function themes', () => {
    let t: any
    const Probe = () => {
      t = useTheme()
      return null
    }
    render(
      <ThemeProvider theme={{ a: 1 }}>
        <ThemeProvider theme={(outer) => ({ ...outer, b: 2 })}>
          <Probe />
        </ThemeProvider>
      </ThemeProvider>,
    )
    expect(t).toEqual({ a: 1, b: 2 })
  })
})

describe('component selectors', () => {
  it('static styled component interpolates as its class selector', () => {
    const Inner = styled.span!`color: red;`
    const { container } = render(<Inner />)
    const cls = (container.firstChild as HTMLElement).className
    expect((Inner as any)._sel).toBe(`.${cls}`)
    expect(css`${Inner as any} { margin: 0; }`.toString()).toBe(
      `.${cls} { margin: 0; }`,
    )
  })

  it('dynamic component as selector throws a clear error at definition', () => {
    const Dyn = styled.span!`color: ${(p: any) => p.c};`
    expect(() => styled.div!`${Dyn as any} { margin: 0; }`).toThrow(
      /cannot be a selector/,
    )
  })
})
