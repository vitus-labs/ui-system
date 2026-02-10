import { render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { css } from '../css'
import { createSheet, StyleSheet } from '../sheet'
import { styled } from '../styled'
import { ThemeProvider } from '../ThemeProvider'

describe('P3 features', () => {
  describe('shouldForwardProp', () => {
    it('allows custom prop filtering', () => {
      const Comp = styled('div', {
        shouldForwardProp: (prop) => prop !== 'color',
      })`display: flex;`

      const { container } = render(<Comp color="red" title="hello" />)
      const el = container.lastElementChild as HTMLElement
      expect(el.getAttribute('color')).toBeNull()
      expect(el.getAttribute('title')).toBe('hello')
    })

    it('custom filter receives all non-system props', () => {
      const forwarded: string[] = []
      const Comp = styled('div', {
        shouldForwardProp: (prop) => {
          forwarded.push(prop)
          return true
        },
      })`display: flex;`

      render(<Comp data-x="1" title="hi" />)
      expect(forwarded).toContain('data-x')
      expect(forwarded).toContain('title')
    })

    it('works with dynamic interpolations', () => {
      const Comp = styled('div', {
        shouldForwardProp: (prop) => prop === 'title',
      })`color: ${(p: any) => p.$color};`

      const { container } = render(<Comp $color="red" title="yes" custom="no" />)
      const el = container.lastElementChild as HTMLElement
      expect(el.getAttribute('title')).toBe('yes')
      expect(el.getAttribute('custom')).toBeNull()
    })

    it('does not affect component wrapping (components receive all props)', () => {
      const Inner = ({ className, myProp }: { className?: string; myProp?: string }) => (
        <div className={className} data-my={myProp} />
      )
      // shouldForwardProp is only for HTML elements
      const Comp = styled(Inner, {
        shouldForwardProp: () => false,
      })`color: red;`

      const { container } = render(<Comp myProp="hello" />)
      const el = container.lastElementChild as HTMLElement
      // Components always receive all props (no filtering)
      expect(el.getAttribute('data-my')).toBe('hello')
    })
  })

  describe('styled(StyledComponent) — extending', () => {
    it('extends a styled component', () => {
      const Base = styled('div')`color: red;`
      const Extended = styled(Base)`font-size: 20px;`

      const { container } = render(<Extended />)
      const el = container.lastElementChild as HTMLElement
      // Extended wraps Base, so Base applies its own className
      // and Extended passes its className to Base as a prop
      expect(el.className).toContain('vl-')
    })

    it('extended component receives className from outer', () => {
      const Base = styled('div')`color: red;`
      const Extended = styled(Base)`font-size: 20px;`

      const { container } = render(<Extended className="user-cls" />)
      const el = container.lastElementChild as HTMLElement
      expect(el.className).toContain('user-cls')
    })

    it('multi-level extension works', () => {
      const L1 = styled('div')`display: flex;`
      const L2 = styled(L1)`color: red;`
      const L3 = styled(L2)`font-size: 14px;`

      const { container } = render(<L3 />)
      const el = container.lastElementChild as HTMLElement
      expect(el.className).toContain('vl-')
      expect(el.nodeName).toBe('DIV')
    })
  })

  describe('HMR cleanup API', () => {
    beforeEach(() => {
      document.querySelectorAll('style[data-vl]').forEach((el) => {
        el.remove()
      })
    })

    it('clearCache removes all cached entries', () => {
      const s = createSheet()
      s.insert('color: red;')
      s.insert('color: blue;')
      expect(s.cacheSize).toBe(2)

      s.clearCache()
      expect(s.cacheSize).toBe(0)
    })

    it('clearAll removes cache, SSR buffer, and DOM rules', () => {
      const s = new StyleSheet()
      s.insert('color: red;')
      s.insert('color: blue;')
      expect(s.cacheSize).toBe(2)

      s.clearAll()
      expect(s.cacheSize).toBe(0)
    })

    it('after clearCache, same CSS gets re-inserted', () => {
      const s = createSheet()
      s.insert('color: red;')
      expect(s.cacheSize).toBe(1)

      s.clearCache()
      expect(s.cacheSize).toBe(0)

      // Re-insert — should work since cache was cleared
      s.insert('color: red;')
      expect(s.cacheSize).toBe(1)
    })
  })

  describe('HMR cleanup API (SSR mode)', () => {
    let originalDocument: typeof document

    beforeEach(() => {
      originalDocument = globalThis.document
      // @ts-expect-error - intentionally deleting for SSR simulation
      delete globalThis.document
    })

    afterEach(() => {
      globalThis.document = originalDocument
    })

    it('clearAll in SSR mode clears buffer and cache', () => {
      const s = createSheet()
      s.insert('color: red;')
      expect(s.getStyles()).toContain('color: red;')
      expect(s.cacheSize).toBe(1)

      s.clearAll()
      expect(s.getStyles()).toBe('')
      expect(s.cacheSize).toBe(0)
    })
  })

  describe('CSS nesting (& selectors)', () => {
    it('& selectors pass through to the CSS rule', () => {
      // Native CSS nesting is supported by modern browsers
      // The resolver passes CSS through without transformation
      const Comp = styled('div')`
        color: red;
        &:hover { color: blue; }
      `
      const { container } = render(<Comp />)
      const el = container.lastElementChild as HTMLElement
      expect(el.className).toMatch(/^vl-/)
    })

    it('nested & with pseudo-elements', () => {
      const Comp = styled('div')`
        position: relative;
        &::before { content: ""; display: block; }
        &::after { content: ""; display: block; }
      `
      const { container } = render(<Comp />)
      expect((container.lastElementChild as HTMLElement).className).toMatch(/^vl-/)
    })
  })

  describe('edge cases', () => {
    it('empty template with dynamic interpolation returning nothing', () => {
      const Comp = styled('div')`${(p: any) => p.$show && css`color: red;`}`
      const { container } = render(<Comp $show={false} />)
      const el = container.lastElementChild as HTMLElement
      // When resolved CSS is empty/whitespace, no className
      expect(el.className).toBe('')
    })

    it('empty template with dynamic interpolation returning value', () => {
      const Comp = styled('div')`${(p: any) => p.$show && css`color: red;`}`
      const { container } = render(<Comp $show />)
      const el = container.lastElementChild as HTMLElement
      expect(el.className).toMatch(/^vl-/)
    })

    it('deeply nested CSSResult chains resolve correctly', () => {
      const l1 = css`color: red;`
      const l2 = css`${l1} font-size: 14px;`
      const l3 = css`${l2} display: flex;`
      const l4 = css`${l3} padding: 8px;`
      const l5 = css`${l4} margin: 4px;`

      const resolved = l5.toString()
      expect(resolved).toContain('color: red;')
      expect(resolved).toContain('font-size: 14px;')
      expect(resolved).toContain('display: flex;')
      expect(resolved).toContain('padding: 8px;')
      expect(resolved).toContain('margin: 4px;')
    })

    it('anonymous component gets fallback displayName', () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const Anon = (() => {
        const fn = () => null
        Object.defineProperty(fn, 'name', { value: '' })
        return fn
      })()

      const Comp = styled(Anon)`color: red;`
      expect(Comp.displayName).toBe('styled(Component)')
    })

    it('handles very large CSS strings', () => {
      const bigCSS = Array.from({ length: 100 }, (_, i) => `prop${i}: val${i};`).join(' ')
      const Comp = styled('div')`${bigCSS}`
      const { container } = render(<Comp />)
      expect((container.lastElementChild as HTMLElement).className).toMatch(/^vl-/)
    })

    it('theme change causes new className', () => {
      const Comp = styled('div')`
        color: ${(p: any) => p.theme.color};
        font-size: ${(p: any) => p.theme.size};
      `

      const { container, rerender } = render(
        <ThemeProvider theme={{ color: 'red', size: '14px' }}>
          <Comp />
        </ThemeProvider>,
      )
      const cls1 = (container.lastElementChild as HTMLElement).className

      rerender(
        <ThemeProvider theme={{ color: 'blue', size: '16px' }}>
          <Comp />
        </ThemeProvider>,
      )
      const cls2 = (container.lastElementChild as HTMLElement).className

      expect(cls1).not.toBe(cls2)
      expect(cls1).toMatch(/^vl-/)
      expect(cls2).toMatch(/^vl-/)
    })

    it('same theme values produce same className (useRef cache)', () => {
      const Comp = styled('div')`color: ${(p: any) => p.theme.color};`

      const { container, rerender } = render(
        <ThemeProvider theme={{ color: 'red' }}>
          <Comp />
        </ThemeProvider>,
      )
      const cls1 = (container.lastElementChild as HTMLElement).className

      // Re-render with same theme value
      rerender(
        <ThemeProvider theme={{ color: 'red' }}>
          <Comp />
        </ThemeProvider>,
      )
      const cls2 = (container.lastElementChild as HTMLElement).className

      expect(cls1).toBe(cls2)
    })
  })
})
