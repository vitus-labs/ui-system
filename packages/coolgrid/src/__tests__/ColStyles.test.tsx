import { render } from '@testing-library/react'
import { Provider } from '@vitus-labs/unistyle'
import Col from '../Col/component'
import Container from '../Container/component'
import Row from '../Row/component'

const theme = { rootSize: 10, breakpoints: { xs: 0, md: 768 } }
const wrapper = ({ children }: any) => (
  <Provider theme={theme}>{children}</Provider>
)

/** Collect cssText of every styler rule (incl. inside @media) targeting the element's classes. */
const cssFor = (el: HTMLElement) => {
  const seen = new Set(Array.from(el.classList))
  const out: string[] = []
  const visit = (rules: CSSRuleList) => {
    for (const rule of Array.from(rules)) {
      if (rule instanceof CSSStyleRule) {
        const cls =
          rule.selectorText.replace(/^\./, '').split(/[.:\s]/)[0] ?? ''
        if (seen.has(cls)) out.push(rule.cssText)
      } else if ('cssRules' in rule) {
        visit((rule as CSSMediaRule).cssRules)
      }
    }
  }
  for (const styleEl of Array.from(
    document.querySelectorAll<HTMLStyleElement>('style[data-vl]'),
  )) {
    if (styleEl.sheet) visit(styleEl.sheet.cssRules)
  }
  return out.join('\n')
}

const renderCol = (colProps: Record<string, unknown>) => {
  const { getByTestId } = render(
    <Container columns={12} gap={20}>
      <Row>
        <Col data-testid="col" {...colProps}>
          x
        </Col>
      </Row>
    </Container>,
    { wrapper },
  )
  return getByTestId('col')
}

describe('Col styles', () => {
  it('uses the same relative unit for gap in width calc and margin', () => {
    const css = cssFor(renderCol({ size: 6 }))
    // rootSize 10, gap 20 -> calc subtracts 2rem; margin is half (1rem)
    expect(css).toContain('calc(50% - 2rem)')
    expect(css).toContain('margin: 1rem')
    expect(css).not.toMatch(/\d+px/)
  })

  it('hides size 0 with display:none instead of off-screen positioning', () => {
    const css = cssFor(renderCol({ size: 0 }))
    expect(css).toContain('display: none')
    expect(css).not.toContain('-9999px')
    expect(css).not.toContain('position: fixed')
  })

  it('resets display when toggling from hidden back to visible', () => {
    const css = cssFor(renderCol({ size: { xs: 0, md: 6 } }))
    expect(css).toContain('display: none')
    expect(css).toContain('display: flex')
  })
})
