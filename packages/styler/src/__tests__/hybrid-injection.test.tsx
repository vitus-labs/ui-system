/**
 * Tests for the hybrid injection approach:
 * - Client (jsdom): useInsertionEffect + single shared <style data-vl> sheet
 * - No per-component <style> elements in the React tree on client
 * - CSS rules actually present in the CSSOM sheet after render
 * - `boost` option threaded from styled() through to the sheet
 */
import { render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { createGlobalStyle } from '../globalStyle'
import { sheet } from '../sheet'
import { styled } from '../styled'
import { ThemeProvider } from '../ThemeProvider'

/** Helper: collect all CSS rule texts from the shared <style data-vl> sheet. */
const getSheetRules = (): string[] => {
  const el = document.querySelector('style[data-vl]') as HTMLStyleElement | null
  if (!el?.sheet) return []
  return Array.from(el.sheet.cssRules).map((r) => r.cssText)
}

/** Helper: find rules matching a className in the CSSOM. */
const findRulesFor = (className: string): string[] =>
  getSheetRules().filter((r) => r.includes(`.${className}`))

describe('hybrid injection — CSS in shared sheet', () => {
  afterEach(() => {
    sheet.clearAll()
  })

  describe('static styled components', () => {
    it('injects CSS rules into the shared <style data-vl> element', () => {
      const Comp = styled('div')`color: red;`
      const { container } = render(<Comp />)
      const className = (container.lastElementChild as HTMLElement).className

      const rules = findRulesFor(className)
      expect(rules.length).toBeGreaterThanOrEqual(1)
      expect(rules.some((r) => r.includes('color: red'))).toBe(true)
    })

    it('multiple static components share the same <style> element', () => {
      const A = styled('div')`color: red;`
      const B = styled('span')`font-size: 20px;`

      render(
        <section>
          <A />
          <B />
        </section>,
      )

      // Both should be in the same sheet
      const styleEls = document.querySelectorAll('style[data-vl]')
      expect(styleEls.length).toBe(1)

      const rules = getSheetRules()
      expect(rules.some((r) => r.includes('color: red'))).toBe(true)
      expect(rules.some((r) => r.includes('font-size: 20px'))).toBe(true)
    })
  })

  describe('dynamic styled components', () => {
    it('injects CSS via useInsertionEffect into the shared sheet', () => {
      const Comp = styled('div')`color: ${(p: any) => p.$color};`
      const { container } = render(<Comp $color="blue" />)
      const className = (container.lastElementChild as HTMLElement).className

      const rules = findRulesFor(className)
      expect(rules.length).toBeGreaterThanOrEqual(1)
      expect(rules.some((r) => r.includes('color: blue'))).toBe(true)
    })

    it('prop change injects new CSS rule into the sheet', () => {
      const Comp = styled('div')`color: ${(p: any) => p.$color};`
      const { container, rerender } = render(<Comp $color="red" />)
      const cls1 = (container.lastElementChild as HTMLElement).className

      rerender(<Comp $color="green" />)
      const cls2 = (container.lastElementChild as HTMLElement).className

      expect(cls1).not.toBe(cls2)

      // Both rules should be in the sheet
      expect(findRulesFor(cls1).some((r) => r.includes('color: red'))).toBe(
        true,
      )
      expect(findRulesFor(cls2).some((r) => r.includes('color: green'))).toBe(
        true,
      )
    })
  })

  describe('createGlobalStyle', () => {
    it('static global styles are injected into the shared sheet', () => {
      const GlobalStyle = createGlobalStyle`
        body { margin: 0; }
      `
      render(<GlobalStyle />)

      const rules = getSheetRules()
      expect(rules.some((r) => r.includes('margin') && r.includes('0'))).toBe(
        true,
      )
    })

    it('dynamic global styles are injected via useInsertionEffect', () => {
      const GlobalStyle = createGlobalStyle`
        body { font-family: ${({ theme }: any) => theme.font}; }
      `
      render(
        <ThemeProvider theme={{ font: 'Arial' }}>
          <GlobalStyle />
        </ThemeProvider>,
      )

      const rules = getSheetRules()
      expect(
        rules.some((r) => r.includes('font-family') && r.includes('Arial')),
      ).toBe(true)
    })
  })
})

describe('hybrid injection — no <style> elements in client React tree', () => {
  afterEach(() => {
    sheet.clearAll()
  })

  describe('styled components', () => {
    it('static component renders only the element, no <style>', () => {
      const Comp = styled('div')`color: red;`
      const { container } = render(<Comp />)

      // Should render exactly one child: the <div>
      expect(container.children.length).toBe(1)
      expect(container.children[0]!.nodeName).toBe('DIV')
      // No <style> elements in the rendered tree
      expect(container.querySelector('style')).toBeNull()
    })

    it('dynamic component renders only the element, no <style>', () => {
      const Comp = styled('div')`color: ${(p: any) => p.$color};`
      const { container } = render(<Comp $color="red" />)

      expect(container.children.length).toBe(1)
      expect(container.children[0]!.nodeName).toBe('DIV')
      expect(container.querySelector('style')).toBeNull()
    })

    it('theme-dependent component renders only the element, no <style>', () => {
      const Comp = styled('div')`
        background: ${(p: any) => p.theme.bg};
      `
      const { container } = render(
        <ThemeProvider theme={{ bg: 'white' }}>
          <Comp />
        </ThemeProvider>,
      )

      // ThemeProvider renders its children, Comp renders the <div>
      expect(container.querySelector('style')).toBeNull()
      expect(container.querySelector('div')).toBeTruthy()
    })

    it('multiple styled components produce no <style> elements', () => {
      const A = styled('div')`color: red;`
      const B = styled('span')`color: ${(p: any) => p.$c};`

      const { container } = render(
        <section>
          <A />
          <B $c="blue" />
        </section>,
      )

      expect(container.querySelector('style')).toBeNull()
      expect(container.querySelectorAll('div').length).toBe(1)
      expect(container.querySelectorAll('span').length).toBe(1)
    })
  })

  describe('createGlobalStyle', () => {
    it('static global style renders nothing (no DOM output)', () => {
      const GlobalStyle = createGlobalStyle`body { margin: 0; }`
      const { container } = render(<GlobalStyle />)

      expect(container.innerHTML).toBe('')
      expect(container.querySelector('style')).toBeNull()
    })

    it('dynamic global style renders nothing (no DOM output)', () => {
      const GlobalStyle = createGlobalStyle`
        body { color: ${({ theme }: any) => theme.color}; }
      `
      const { container } = render(
        <ThemeProvider theme={{ color: 'black' }}>
          <GlobalStyle />
        </ThemeProvider>,
      )

      expect(container.innerHTML).toBe('')
    })
  })
})

describe('hybrid injection — boost option at component level', () => {
  afterEach(() => {
    sheet.clearAll()
  })

  it('static boosted component produces doubled selector in CSSOM', () => {
    const Comp = styled('div', { boost: true })`color: red;`
    const { container } = render(<Comp />)
    const className = (container.lastElementChild as HTMLElement).className

    const rules = findRulesFor(className)
    expect(rules.length).toBeGreaterThanOrEqual(1)
    // Boost doubles the selector: .vl-abc.vl-abc
    expect(rules.some((r) => r.includes(`.${className}.${className}`))).toBe(
      true,
    )
  })

  it('dynamic boosted component produces doubled selector in CSSOM', () => {
    const Comp = styled('div', { boost: true })`
      color: ${(p: any) => p.$color};
    `
    const { container } = render(<Comp $color="blue" />)
    const className = (container.lastElementChild as HTMLElement).className

    const rules = findRulesFor(className)
    expect(rules.length).toBeGreaterThanOrEqual(1)
    expect(rules.some((r) => r.includes(`.${className}.${className}`))).toBe(
      true,
    )
  })

  it('non-boosted component produces single selector', () => {
    const Comp = styled('div')`color: green;`
    const { container } = render(<Comp />)
    const className = (container.lastElementChild as HTMLElement).className

    const rules = findRulesFor(className)
    expect(rules.length).toBeGreaterThanOrEqual(1)
    // Single selector: .vl-abc { ... } — NOT .vl-abc.vl-abc
    const baseRule = rules[0]!
    expect(baseRule).toContain(`.${className}`)
    // Count occurrences of the className in the selector portion
    const selectorPart = baseRule.split('{')[0]!
    const occurrences = selectorPart.split(`.${className}`).length - 1
    expect(occurrences).toBe(1)
  })

  it('boosted component with @media splits correctly', () => {
    const Comp = styled('div', { boost: true })`
      color: red;
      @media (min-width: 768px) { font-size: 20px; }
    `
    const { container } = render(<Comp />)
    const className = (container.lastElementChild as HTMLElement).className

    const rules = findRulesFor(className)
    // Should have at least 2 rules: base + @media
    expect(rules.length).toBeGreaterThanOrEqual(2)
    // Both base and media rule should use doubled selector
    for (const rule of rules) {
      expect(rule).toContain(`.${className}.${className}`)
    }
  })
})
