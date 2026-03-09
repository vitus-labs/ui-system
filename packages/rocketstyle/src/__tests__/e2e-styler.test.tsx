/**
 * End-to-end test: rocketstyle + Element + unistyle + styler
 *
 * Renders real components through the full chain and verifies
 * the actual CSS injected into the DOM contains expected declarations.
 */
import { render } from '@testing-library/react'
// Use config.styled directly (same as production code)
import { Provider as CoreProvider, config } from '@vitus-labs/core'
import { Element } from '@vitus-labs/elements'
import {
  makeItResponsive,
  styles,
  Provider as UnistyleProvider,
} from '@vitus-labs/unistyle'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import rocketstyle from '../init'

const wrapper = ({ children }: { children: ReactNode }) => (
  <CoreProvider theme={{ rootSize: 16 }}>{children}</CoreProvider>
)

/** Collect all CSS text from all stylesheets in the document. */
const getAllCSS = () => {
  let allCss = ''
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      for (const rule of Array.from(sheet.cssRules)) {
        allCss += `${rule.cssText}\n`
      }
    } catch {
      // cross-origin sheets can't be read
    }
  }
  return allCss
}

describe('e2e: rocketstyle + styler CSS generation', () => {
  it('basic styled component injects CSS into DOM', () => {
    const { styled } = config

    const Box = styled.div`
      position: absolute;
      color: red;
    `

    const { container } = render(<Box />)
    const el = container.firstElementChild as HTMLElement
    expect(el.className).toMatch(/^vl-/)

    const allCss = getAllCSS()
    console.log('=== BASIC STYLED CSS ===')
    console.log(allCss || '(empty)')

    // Check that CSS was actually injected
    expect(allCss).toContain('position: absolute')
    expect(allCss).toContain('color: red')
  })

  it('dynamic styled component injects CSS into DOM', () => {
    const { styled } = config

    const Box = styled.div`
      color: ${(props: any) => props.$color || 'blue'};
      position: ${(props: any) => props.$pos || 'static'};
    `

    const { container } = render(<Box $color="red" $pos="absolute" />)
    const el = container.firstElementChild as HTMLElement
    expect(el.className).toMatch(/^vl-/)

    const allCss = getAllCSS()
    console.log('=== DYNAMIC STYLED CSS ===')
    console.log(allCss || '(empty)')

    expect(allCss).toContain('position: absolute')
    expect(allCss).toContain('color: red')
  })

  it('rocketstyle + Element generates CSS with theme properties', () => {
    const Comp = rocketstyle()({
      name: 'TestComp',
      component: Element,
      filterAttrs: [],
    } as any)
      .theme({
        position: 'absolute',
        backgroundColor: '#0070f3',
        color: '#fff',
      })
      .styles(
        (css) => css`
          ${({ $rocketstyle }: any) => {
            const baseTheme = makeItResponsive({
              theme: $rocketstyle,
              styles,
              css,
            })
            return css`
              ${baseTheme};
            `
          }};
        `,
      )

    const { container } = render(<Comp />, { wrapper })
    const el = container.firstElementChild as HTMLElement

    console.log('=== ROCKETSTYLE ELEMENT ===')
    console.log('Class:', el.className)
    console.log('HTML:', container.innerHTML.slice(0, 500))

    const allCss = getAllCSS()
    console.log('=== ALL CSS RULES ===')
    console.log(allCss || '(empty)')

    // Check that rocketstyle generated CSS with position: absolute
    expect(allCss).toContain('position: absolute')
  })

  it('variant with width and height both produce CSS output', () => {
    const wrapperWithBP = ({ children }: { children: ReactNode }) => (
      <UnistyleProvider
        theme={{
          rootSize: 16,
          breakpoints: { xs: 0, sm: 576, md: 768, lg: 992, xl: 1200 },
        }}
      >
        {children}
      </UnistyleProvider>
    )

    const Comp = rocketstyle()({
      name: 'VariantComp',
      component: Element,
      filterAttrs: [],
    } as any)
      .theme({
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
      })
      .variants({
        box: {
          height: { xs: 64, md: 100 } as any,
          padding: { xs: 8 } as any,
          backgroundColor: 'transparent',
        },
        circle: {
          width: 72,
          height: 72,
          padding: 4,
          backgroundColor: '#F0F0F0',
          borderRadius: 180,
        },
      })
      .styles(
        (css) => css`
          ${({ $rocketstyle }: any) => {
            const baseTheme = makeItResponsive({
              theme: $rocketstyle,
              styles,
              css,
            })
            return css`
              ${baseTheme};
            `
          }};
        `,
      )

    render(<Comp variant={'circle' as any} />, { wrapper: wrapperWithBP })

    const allCss = getAllCSS()
    console.log('=== VARIANT CIRCLE CSS ===')
    console.log(allCss || '(empty)')

    // Both width and height should produce CSS
    expect(allCss).toContain('width: 4.5rem')
    expect(allCss).toContain('height: 4.5rem')
    expect(allCss).toContain('background-color: rgb(240, 240, 240)')
  })

  it('scalar theme values persist across all responsive breakpoints', () => {
    const wrapperWithBP = ({ children }: { children: ReactNode }) => (
      <UnistyleProvider
        theme={{
          rootSize: 16,
          breakpoints: { xs: 0, sm: 576, md: 768, lg: 992, xl: 1200 },
        }}
      >
        {children}
      </UnistyleProvider>
    )

    const Comp = rocketstyle()({
      name: 'ResponsiveComp',
      component: Element,
      filterAttrs: [],
    } as any)
      .theme({
        position: 'absolute',
        width: 'auto',
        height: { xs: 460, md: 640 },
        right: { xs: -200, sm: -180, lg: -100 },
      })
      .styles(
        (css) => css`
          ${({ $rocketstyle }: any) => {
            const baseTheme = makeItResponsive({
              theme: $rocketstyle,
              styles,
              css,
            })
            return css`
              ${baseTheme};
            `
          }};
        `,
      )

    render(<Comp />, { wrapper: wrapperWithBP })

    const allCss = getAllCSS()
    console.log('=== RESPONSIVE BREAKPOINT CSS ===')
    console.log(allCss || '(empty)')

    // Scalar values (position, width) must appear in the base (xs) CSS
    expect(allCss).toContain('position: absolute')
    expect(allCss).toContain('width: auto')

    // Responsive values must appear in @media rules
    expect(allCss).toMatch(/@media/)
  })

  it('modifier transform derives styles from accumulated state theme', () => {
    const Comp = rocketstyle()({
      name: 'ModifierComp',
      component: Element,
    })
      .theme({
        backgroundColor: '#0070f3',
        color: '#fff',
      })
      .states({
        danger: {
          backgroundColor: '#dc3545',
          color: '#fff',
        },
      })
      .modifiers({
        outlined: (theme: any) => ({
          color: theme.backgroundColor,
          backgroundColor: 'transparent',
        }),
      })
      .styles(
        (css) => css`
          ${({ $rocketstyle }: any) => {
            const baseTheme = makeItResponsive({
              theme: $rocketstyle,
              styles,
              css,
            })
            return css`
              ${baseTheme};
            `
          }};
        `,
      )

    // Render with danger state + outlined modifier
    render(<Comp state="danger" modifier="outlined" />, { wrapper })

    const allCss = getAllCSS()

    // outlined modifier should flip: color becomes the danger backgroundColor
    expect(allCss).toContain('color: rgb(220, 53, 69)') // #dc3545
    expect(allCss).toContain('background-color: transparent')
  })

  it('modifier without active rocketstate uses base theme only', () => {
    const Comp = rocketstyle()({
      name: 'ModifierBaseComp',
      component: Element,
    })
      .theme({
        backgroundColor: '#0070f3',
        color: '#fff',
      })
      .modifiers({
        outlined: (theme: any) => ({
          color: theme.backgroundColor,
          backgroundColor: 'transparent',
        }),
      })
      .styles(
        (css) => css`
          ${({ $rocketstyle }: any) => {
            const baseTheme = makeItResponsive({
              theme: $rocketstyle,
              styles,
              css,
            })
            return css`
              ${baseTheme};
            `
          }};
        `,
      )

    // Render with just outlined (no state), should derive from base theme
    render(<Comp modifier="outlined" />, { wrapper })

    const allCss = getAllCSS()
    expect(allCss).toContain('color: rgb(0, 112, 243)') // #0070f3
    expect(allCss).toContain('background-color: transparent')
  })
})
