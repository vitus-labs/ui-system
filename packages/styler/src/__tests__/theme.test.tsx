import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { styled } from '../styled'
import { ThemeProvider, useTheme } from '../ThemeProvider'

describe('ThemeProvider + useTheme', () => {
  describe('basic functionality', () => {
    it('provides theme to useTheme consumers', () => {
      let capturedTheme: Record<string, unknown> = {}

      const Consumer = () => {
        capturedTheme = useTheme()
        return null
      }

      render(
        <ThemeProvider theme={{ color: 'red' }}>
          <Consumer />
        </ThemeProvider>,
      )

      expect(capturedTheme).toEqual({ color: 'red' })
    })

    it('returns empty object when no ThemeProvider', () => {
      let capturedTheme: Record<string, unknown> = {}

      const Consumer = () => {
        capturedTheme = useTheme()
        return null
      }

      render(<Consumer />)
      expect(capturedTheme).toEqual({})
    })

    it('innermost ThemeProvider wins', () => {
      let capturedTheme: Record<string, unknown> = {}

      const Consumer = () => {
        capturedTheme = useTheme()
        return null
      }

      render(
        <ThemeProvider theme={{ color: 'red' }}>
          <ThemeProvider theme={{ color: 'blue' }}>
            <Consumer />
          </ThemeProvider>
        </ThemeProvider>,
      )

      expect(capturedTheme).toEqual({ color: 'blue' })
    })
  })

  describe('generic useTheme<T>()', () => {
    it('can be called with a type parameter', () => {
      interface MyTheme extends Record<string, unknown> {
        primary: string
        spacing: number
      }

      let theme: MyTheme | null = null

      const Consumer = () => {
        theme = useTheme<MyTheme>()
        return null
      }

      render(
        <ThemeProvider theme={{ primary: 'blue', spacing: 8 }}>
          <Consumer />
        </ThemeProvider>,
      )

      expect(theme).toEqual({ primary: 'blue', spacing: 8 })
      // TypeScript should allow typed access:
      expect(theme?.primary).toBe('blue')
      expect(theme?.spacing).toBe(8)
    })
  })

  describe('theme with styled components', () => {
    it('styled component receives theme from ThemeProvider', () => {
      const Comp = styled('div')`
        color: ${(props: any) => props.theme.textColor};
      `
      const { container } = render(
        <ThemeProvider theme={{ textColor: 'green' }}>
          <Comp />
        </ThemeProvider>,
      )
      const el = container.firstChild as HTMLElement
      expect(el.className).toMatch(/^vl-/)
    })

    it('theme updates cause re-render with new styles', () => {
      const Comp = styled('div')`
        color: ${(props: any) => props.theme.color};
      `

      const { container, rerender } = render(
        <ThemeProvider theme={{ color: 'red' }}>
          <Comp />
        </ThemeProvider>,
      )

      const cls1 = (container.firstChild as HTMLElement).className

      rerender(
        <ThemeProvider theme={{ color: 'blue' }}>
          <Comp />
        </ThemeProvider>,
      )

      const cls2 = (container.firstChild as HTMLElement).className

      // Different theme values should produce different class names
      expect(cls1).not.toBe(cls2)
    })
  })
})
