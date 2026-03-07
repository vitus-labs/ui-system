import { render, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { css } from '../css'
import { ThemeProvider } from '../ThemeProvider'
import { useCSS } from '../useCSS'

describe('useCSS', () => {
  describe('basic usage', () => {
    it('returns a className string for static CSS', () => {
      const template = css`display: flex;`
      const { result } = renderHook(() => useCSS(template))
      expect(typeof result.current).toBe('string')
      expect(result.current).toMatch(/^vl-[0-9a-z]+$/)
    })

    it('returns different classNames for different CSS', () => {
      const template1 = css`display: flex;`
      const template2 = css`display: block;`

      const { result: r1 } = renderHook(() => useCSS(template1))
      const { result: r2 } = renderHook(() => useCSS(template2))

      expect(r1.current).toMatch(/^vl-/)
      expect(r2.current).toMatch(/^vl-/)
      expect(r1.current).not.toBe(r2.current)
    })

    it('returns empty string for empty CSS', () => {
      const template = css``
      const { result } = renderHook(() => useCSS(template))
      expect(result.current).toBe('')
    })

    it('returns empty string for whitespace-only CSS', () => {
      const template = css`   `
      const { result } = renderHook(() => useCSS(template))
      expect(result.current).toBe('')
    })
  })

  describe('dynamic values', () => {
    it('works with static interpolation values', () => {
      const color = 'red'
      const template = css`color: ${color};`
      const { result } = renderHook(() => useCSS(template))
      expect(result.current).toMatch(/^vl-[0-9a-z]+$/)
    })

    it('works with function interpolations resolved via props', () => {
      const template = css`color: ${(p: any) => p.color};`
      const { result } = renderHook(() => useCSS(template, { color: 'blue' }))
      expect(result.current).toMatch(/^vl-[0-9a-z]+$/)
    })

    it('different prop values produce different classNames', () => {
      const template = css`color: ${(p: any) => p.color};`

      const { result: r1 } = renderHook(() =>
        useCSS(template, { color: 'red' }),
      )
      const { result: r2 } = renderHook(() =>
        useCSS(template, { color: 'green' }),
      )

      expect(r1.current).not.toBe(r2.current)
    })
  })

  describe('ThemeProvider integration', () => {
    it('resolves theme from ThemeProvider in interpolations', () => {
      const template = css`color: ${(p: any) => p.theme.primary};`

      const wrapper = ({ children }: { children: ReactNode }) => (
        <ThemeProvider theme={{ primary: 'purple' }}>{children}</ThemeProvider>
      )

      const { result } = renderHook(() => useCSS(template), { wrapper })
      expect(result.current).toMatch(/^vl-[0-9a-z]+$/)
    })

    it('different theme values produce different classNames', () => {
      const template = css`color: ${(p: any) => p.theme.color};`

      const wrapper1 = ({ children }: { children: ReactNode }) => (
        <ThemeProvider theme={{ color: 'red' }}>{children}</ThemeProvider>
      )
      const wrapper2 = ({ children }: { children: ReactNode }) => (
        <ThemeProvider theme={{ color: 'blue' }}>{children}</ThemeProvider>
      )

      const { result: r1 } = renderHook(() => useCSS(template), {
        wrapper: wrapper1,
      })
      const { result: r2 } = renderHook(() => useCSS(template), {
        wrapper: wrapper2,
      })

      expect(r1.current).toMatch(/^vl-/)
      expect(r2.current).toMatch(/^vl-/)
      expect(r1.current).not.toBe(r2.current)
    })
  })

  describe('caching', () => {
    it('same CSS returns same className on re-render', () => {
      const template = css`display: flex;`
      const { result, rerender } = renderHook(() => useCSS(template))

      const cls1 = result.current
      rerender()
      const cls2 = result.current

      expect(cls1).toBe(cls2)
    })

    it('same dynamic CSS returns same className on re-render', () => {
      const template = css`color: ${(p: any) => p.color};`
      const { result, rerender } = renderHook(() =>
        useCSS(template, { color: 'red' }),
      )

      const cls1 = result.current
      rerender()
      const cls2 = result.current

      expect(cls1).toBe(cls2)
    })
  })

  describe('cache hit path', () => {
    it('reuses cached className on re-render with identical resolved CSS', () => {
      const template = css`color: ${(p: any) => p.color};`
      const { result, rerender } = renderHook(() =>
        useCSS(template, { color: 'red' }),
      )

      const cls1 = result.current
      // Re-render with same props → cache hit (cssText === cacheRef.current.css)
      rerender()
      const cls2 = result.current

      expect(cls1).toBe(cls2)
      expect(cls1).toMatch(/^vl-/)
    })

    it('updates className when resolved CSS changes', () => {
      let color = 'red'
      const template = css`color: ${(p: any) => p.color};`
      const { result, rerender } = renderHook(() => useCSS(template, { color }))

      const cls1 = result.current
      color = 'blue'
      rerender()
      const cls2 = result.current

      expect(cls1).not.toBe(cls2)
    })
  })

  describe('boost parameter', () => {
    it('does not throw when boost is true', () => {
      const template = css`display: flex;`
      const { result } = renderHook(() => useCSS(template, undefined, true))
      expect(result.current).toMatch(/^vl-[0-9a-z]+$/)
    })

    it('does not throw when boost is false', () => {
      const template = css`display: flex;`
      const { result } = renderHook(() => useCSS(template, undefined, false))
      expect(result.current).toMatch(/^vl-[0-9a-z]+$/)
    })
  })

  describe('used in a component', () => {
    it('applies className to a rendered element', () => {
      const template = css`display: grid;`

      const Comp = () => {
        const className = useCSS(template)
        return <div className={className} />
      }

      const { container } = render(<Comp />)
      const el = container.lastElementChild as HTMLElement
      expect(el.className).toMatch(/^vl-[0-9a-z]+$/)
    })
  })

  describe('without ThemeProvider and without props', () => {
    it('uses empty object when no props and no theme', () => {
      const template = css`display: flex;`
      // No props argument, no ThemeProvider → hits (props ?? {}) fallback
      const { result } = renderHook(() => useCSS(template))
      expect(result.current).toMatch(/^vl-[0-9a-z]+$/)
    })

    it('handles dynamic template without theme or props', () => {
      const template = css`color: ${(p: any) => p.color ?? 'red'};`
      // Pass undefined as props → hits (props ?? {}) fallback
      const { result } = renderHook(() => useCSS(template, undefined))
      expect(result.current).toMatch(/^vl-/)
    })
  })

  describe('cache miss with empty CSS', () => {
    it('returns empty className when dynamic CSS changes from non-empty to empty', () => {
      // First render: non-empty CSS → cache is { css: 'color:red;', className: 'vl-xxx' }
      // Second render: empty CSS → cache miss (different cssText) + empty branch (line 40)
      let color: string | undefined = 'red'
      const template = css`${(p: any) => (p.color ? `color: ${p.color};` : '')}`

      const { result, rerender } = renderHook(() => useCSS(template, { color }))

      // First render produces a className
      expect(result.current).toMatch(/^vl-/)

      // Change to empty CSS — triggers cache miss + empty CSS path
      color = undefined
      rerender()
      expect(result.current).toBe('')
    })
  })
})
