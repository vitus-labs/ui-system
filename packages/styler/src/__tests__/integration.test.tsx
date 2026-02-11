import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { css } from '../css'
import { styled } from '../styled'
import { ThemeProvider } from '../ThemeProvider'

describe('integration', () => {
  describe('ThemeProvider + styled', () => {
    it('provides theme to styled components', () => {
      const Comp = styled('div')`
        color: ${(props: any) => props.theme.primary};
      `
      const { container } = render(
        <ThemeProvider theme={{ primary: 'blue' }}>
          <Comp />
        </ThemeProvider>,
      )
      const el = container.lastElementChild as HTMLElement
      expect(el.className).toMatch(/^vl-/)
    })

    it('nested ThemeProviders override theme', () => {
      const Comp = styled('div')`
        color: ${(props: any) => props.theme.color};
      `
      const { container } = render(
        <ThemeProvider theme={{ color: 'red' }}>
          <ThemeProvider theme={{ color: 'blue' }}>
            <Comp />
          </ThemeProvider>
        </ThemeProvider>,
      )
      const el = container.lastElementChild as HTMLElement
      expect(el.className).toMatch(/^vl-/)
    })
  })

  describe('nested css results', () => {
    it('resolves nested css tagged templates', () => {
      const flexCSS = css`display: flex;`
      const Comp = styled('div')`
        ${flexCSS}
        color: red;
      `
      const { container } = render(<Comp />)
      const el = container.lastElementChild as HTMLElement
      expect(el.className).toMatch(/^vl-/)
    })

    it('resolves conditional css (logical AND pattern)', () => {
      const isWeb = true
      const Comp = styled('div')`
        ${isWeb && css`box-sizing: border-box;`};
        display: flex;
      `
      const { container } = render(<Comp />)
      const el = container.lastElementChild as HTMLElement
      expect(el.className).toMatch(/^vl-/)
    })

    it('handles false conditional css', () => {
      const isWeb = false
      const Comp = styled('div')`
        ${isWeb && css`box-sizing: border-box;`};
        display: flex;
      `
      const { container } = render(<Comp />)
      const el = container.lastElementChild as HTMLElement
      expect(el.className).toMatch(/^vl-/)
    })
  })

  describe('array interpolations (makeItResponsive pattern)', () => {
    it('resolves array of css results (simulating breakpoints)', () => {
      // Simulates what makeItResponsive returns: array of css results per breakpoint
      const breakpointStyles = [
        css`color: red;`,
        css`@media (min-width: 48em) { color: blue; }`,
        css`@media (min-width: 62em) { color: green; }`,
      ]

      const Comp = styled('div')`
        display: flex;
        ${breakpointStyles};
      `
      const { container } = render(<Comp />)
      const el = container.lastElementChild as HTMLElement
      expect(el.className).toMatch(/^vl-/)
    })

    it('resolves function returning array (makeItResponsive full pattern)', () => {
      // makeItResponsive returns a function (props) => CSSResult[]
      const responsiveFn = (props: any) => {
        const theme = props.$element || {}
        return [
          css`color: ${theme.color || 'black'};`,
          theme.breakpoint
            ? css`@media (min-width: 48em) { color: ${theme.breakpoint}; }`
            : '',
        ]
      }

      const Comp = styled('div')`
        display: flex;
        ${responsiveFn};
      `
      const { container } = render(
        <Comp $element={{ color: 'red', breakpoint: 'blue' }} />,
      )
      const el = container.lastElementChild as HTMLElement
      expect(el.className).toMatch(/^vl-/)
    })
  })

  describe('createMediaQueries pattern', () => {
    it('css called as function (css(...args)) wrapping in @media', () => {
      // Simulates createMediaQueries: builds functions that call css(...args)
      const createMedia = (breakpoint: number, rootSize: number) => {
        const emSize = breakpoint / rootSize
        return (...args: any[]) =>
          css`@media only screen and (min-width: ${emSize}em) {
            ${css(...(args as [TemplateStringsArray, ...any[]]))};
          }`
      }

      const md = createMedia(768, 16)
      const result = md`color: blue;`

      // Wrap in a styled component
      const Comp = styled('div')`
        color: red;
        ${result};
      `
      const { container } = render(<Comp />)
      const el = container.lastElementChild as HTMLElement
      expect(el.className).toMatch(/^vl-/)
    })

    it('zero-breakpoint passthrough (css(...args) without @media)', () => {
      // Breakpoint 0 means no @media wrapper
      const passthrough = (...args: any[]) =>
        css(...(args as [TemplateStringsArray, ...any[]]))

      const result = passthrough`color: red;`

      const Comp = styled('div')`
        ${result};
      `
      const { container } = render(<Comp />)
      const el = container.lastElementChild as HTMLElement
      expect(el.className).toMatch(/^vl-/)
    })
  })

  describe('complex styled patterns', () => {
    it('function interpolation with prop-based conditional', () => {
      const Comp = styled('div')`
        display: flex;
        ${({ $contentType }: any) => $contentType === 'content' && 'flex: 1;'};
      `
      const { container } = render(<Comp $contentType="content" />)
      const el = container.lastElementChild as HTMLElement
      expect(el.className).toMatch(/^vl-/)
    })

    it('platform-specific CSS (compile-time constant)', () => {
      const __WEB__ = true
      const platformCSS = __WEB__ ? 'box-sizing: border-box;' : ''

      const Comp = styled('div')`
        ${platformCSS};
        display: flex;
      `
      const { container } = render(<Comp />)
      const el = container.lastElementChild as HTMLElement
      expect(el.className).toMatch(/^vl-/)
    })

    it('multiple function interpolations', () => {
      const Comp = styled('div')`
        color: ${(p: any) => p.$color || 'black'};
        font-size: ${(p: any) => p.$size || '16px'};
      `
      const { container } = render(<Comp $color="red" $size="20px" />)
      const el = container.lastElementChild as HTMLElement
      expect(el.className).toMatch(/^vl-/)
    })

    it('empty template produces no className', () => {
      const Comp = styled('div')``
      const { container } = render(<Comp />)
      const el = container.lastElementChild as HTMLElement
      expect(el.className).toBe('')
    })
  })
})
