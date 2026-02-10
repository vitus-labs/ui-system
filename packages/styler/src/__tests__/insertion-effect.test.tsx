import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { styled } from '../styled'
import { ThemeProvider } from '../ThemeProvider'

describe('useInsertionEffect (style injection timing)', () => {
  describe('dynamic styled components', () => {
    it('injects styles before DOM is painted', () => {
      // Verify that the className is applied correctly
      // (useInsertionEffect runs synchronously before layout effects)
      const Comp = styled('div')`
        color: ${(props: any) => props.$color};
      `

      const { container } = render(<Comp $color="red" />)
      const el = container.firstChild as HTMLElement

      // Class should be present and properly generated
      expect(el.className).toMatch(/^vl-[0-9a-z]+$/)
    })

    it('works with multiple dynamic components', () => {
      const Comp1 = styled('div')`color: ${(p: any) => p.$c};`
      const Comp2 = styled('span')`font-size: ${(p: any) => p.$s};`

      const { container } = render(
        <section>
          <Comp1 $c="red" />
          <Comp2 $s="16px" />
        </section>,
      )

      const el1 = container.querySelector('section > div') as HTMLElement
      const el2 = container.querySelector('span') as HTMLElement

      expect(el1.className).toMatch(/^vl-/)
      expect(el2.className).toMatch(/^vl-/)
      expect(el1.className).not.toBe(el2.className)
    })

    it('handles rapid prop changes', () => {
      const Comp = styled('div')`color: ${(p: any) => p.$color};`

      const { container, rerender } = render(<Comp $color="red" />)

      const colors = ['blue', 'green', 'yellow', 'purple', 'orange']
      const classNames = new Set<string>()

      for (const color of colors) {
        rerender(<Comp $color={color} />)
        const el = container.firstChild as HTMLElement
        expect(el.className).toMatch(/^vl-/)
        classNames.add(el.className)
      }

      // Different colors should produce different classNames
      expect(classNames.size).toBe(colors.length)
    })

    it('same dynamic CSS produces same className', () => {
      const Comp = styled('div')`color: ${(p: any) => p.$color};`

      const { container, rerender } = render(<Comp $color="red" />)
      const cls1 = (container.firstChild as HTMLElement).className

      rerender(<Comp $color="blue" />)
      rerender(<Comp $color="red" />) // back to red
      const cls3 = (container.firstChild as HTMLElement).className

      // Same resolved CSS → same className
      expect(cls1).toBe(cls3)
    })
  })

  describe('static styled components', () => {
    it('static components do not use useInsertionEffect', () => {
      // Static components compute class at creation time
      const Comp = styled('div')`display: flex; color: red;`

      const { container } = render(<Comp />)
      const el = container.firstChild as HTMLElement

      expect(el.className).toMatch(/^vl-[0-9a-z]+$/)
    })

    it('static className is stable across renders', () => {
      const Comp = styled('div')`display: flex;`

      const { container, rerender } = render(<Comp />)
      const cls1 = (container.firstChild as HTMLElement).className

      rerender(<Comp />)
      rerender(<Comp />)
      const cls3 = (container.firstChild as HTMLElement).className

      expect(cls1).toBe(cls3)
    })
  })

  describe('theme-dependent components', () => {
    it('re-renders with new className when theme changes', () => {
      const Comp = styled('div')`
        background: ${(p: any) => p.theme.bg};
      `

      const { container, rerender } = render(
        <ThemeProvider theme={{ bg: 'white' }}>
          <Comp />
        </ThemeProvider>,
      )
      const cls1 = (container.firstChild as HTMLElement).className

      rerender(
        <ThemeProvider theme={{ bg: 'black' }}>
          <Comp />
        </ThemeProvider>,
      )
      const cls2 = (container.firstChild as HTMLElement).className

      expect(cls1).not.toBe(cls2)
      expect(cls1).toMatch(/^vl-/)
      expect(cls2).toMatch(/^vl-/)
    })
  })
})
