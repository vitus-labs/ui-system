/**
 * Tests for the CVA-shaped `recipe()` API. Asserts that:
 *  - base styles always apply
 *  - per-variant themes apply when the corresponding prop is passed
 *  - defaultVariants kick in when the prop is absent and lose to an
 *    explicit prop value
 *  - compoundVariants only activate when EVERY listed axis matches
 *  - the returned component is still chainable (drop down to .attrs/.compose)
 */
import { render } from '@testing-library/react'
import { Provider as CoreProvider } from '@vitus-labs/core'
import { Element } from '@vitus-labs/elements'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import recipe from '../recipe'

const wrapper = ({ children }: { children: ReactNode }) => (
  <CoreProvider theme={{ rootSize: 16 }}>{children}</CoreProvider>
)

/** Collect all CSS text from all stylesheets in the document. */
const getAllCSS = () => {
  let out = ''
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      for (const rule of Array.from(sheet.cssRules)) {
        out += `${rule.cssText}\n`
      }
    } catch {
      // cross-origin sheets can't be read
    }
  }
  return out
}

describe('recipe()', () => {
  it('emits base styles unconditionally', () => {
    const Box = recipe({
      name: 'BaseOnlyBox',
      component: Element,
      base: { padding: 8, color: 'royalblue' },
    })

    render(<Box />, { wrapper })
    const css = getAllCSS()
    expect(css).toContain('color: royalblue')
    expect(css).toContain('padding: 0.5rem')
  })

  it('applies the active variant theme when its prop is passed', () => {
    const Box = recipe({
      name: 'SizedBox',
      component: Element,
      base: { padding: 4 },
      variants: {
        size: {
          sm: { fontSize: 12 },
          md: { fontSize: 14 },
          lg: { fontSize: 18 },
        },
      },
    })

    render(<Box size="lg" />, { wrapper })
    const css = getAllCSS()
    // 18px ÷ rootSize 16 = 1.125rem
    expect(css).toContain('font-size: 1.125rem')
  })

  it('falls back to defaultVariants when prop is absent; explicit prop wins', () => {
    const Box = recipe({
      name: 'IntentBox',
      component: Element,
      variants: {
        intent: {
          primary: { color: 'mediumseagreen' },
          danger: { color: 'crimson' },
        },
      },
      defaultVariants: { intent: 'primary' },
    })

    // No prop → defaultVariants.intent='primary' → green
    const { container, rerender } = render(<Box />, { wrapper })
    const css1 = getAllCSS()
    expect(css1).toContain('color: mediumseagreen')
    // Rendered with default, the element exists
    expect(container.firstElementChild).toBeTruthy()

    // Explicit prop overrides default
    rerender(<Box intent="danger" />)
    const css2 = getAllCSS()
    expect(css2).toContain('color: crimson')
  })

  it('applies compoundVariants only when every listed axis matches', () => {
    const Box = recipe({
      name: 'CompoundBox',
      component: Element,
      base: { padding: 4 },
      variants: {
        size: { sm: { fontSize: 12 }, lg: { fontSize: 16 } },
        intent: { primary: { color: 'blue' }, danger: { color: 'red' } },
      },
      compoundVariants: [
        {
          variants: { size: 'lg', intent: 'primary' },
          // compoundVariant styles flow through the tiny objectToCss
          // helper in recipe — pass string values to avoid unit ambiguity.
          styles: { letterSpacing: '0.05em', textTransform: 'uppercase' },
        },
      ],
    })

    // Matches both axes → compound applies
    render(<Box size="lg" intent="primary" />, { wrapper })
    const css = getAllCSS()
    expect(css).toContain('letter-spacing: 0.05em')
    expect(css).toContain('text-transform: uppercase')
  })

  it('compoundVariants do NOT activate when one axis does not match', () => {
    const Box = recipe({
      name: 'CompoundBoxNoMatch',
      component: Element,
      variants: {
        size: { sm: { fontSize: 12 }, lg: { fontSize: 16 } },
        intent: { primary: { color: 'blue' }, danger: { color: 'red' } },
      },
      compoundVariants: [
        {
          variants: { size: 'lg', intent: 'primary' },
          styles: { letterSpacing: '0.99em' },
        },
      ],
    })

    // size=lg but intent=danger → compound does NOT fire
    render(<Box size="lg" intent="danger" />, { wrapper })
    const css = getAllCSS()
    expect(css).not.toContain('letter-spacing: 0.99em')
  })

  it('returns a component that is still chainable (drop down for advanced cases)', () => {
    const Box = recipe({
      name: 'ChainableBox',
      component: Element,
      base: { padding: 8 },
    })
    // We don't render here — just assert the chain methods survived.
    expect(typeof (Box as any).attrs).toBe('function')
    expect(typeof (Box as any).compose).toBe('function')
    expect(typeof (Box as any).config).toBe('function')
  })
})
