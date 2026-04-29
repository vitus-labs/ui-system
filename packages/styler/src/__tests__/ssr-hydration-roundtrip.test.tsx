/**
 * End-to-end SSR ↔ hydration roundtrip:
 *   1. Render a styled component to an HTML string with renderToString
 *   2. Mount that HTML into the document head/body to simulate hydration state
 *   3. Re-import sheet (so its constructor runs with the hydrated DOM in place)
 *   4. Render the SAME component on the client
 *   5. Assert: no rule appears twice across all `<style>` elements
 *
 * Before the precedence-hydration fix, step 5 failed: every rule was present
 * once in the React-emitted `<style data-precedence>` tag *and* a second time
 * in the freshly-mounted `<style data-vl>` sheet.
 */
import { render } from '@testing-library/react'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const cleanHead = () => {
  document
    .querySelectorAll('style[data-vl], style[data-precedence]')
    .forEach((el) => {
      el.remove()
    })
}

/**
 * Run `fn` with `globalThis.document` deleted so any imported module's
 * `IS_SERVER` check evaluates true. Always restores document, even on throw —
 * a leaked deletion would crash the next test's beforeEach/afterEach.
 */
const runAsSSR = async <T,>(fn: () => Promise<T>): Promise<T> => {
  const original = globalThis.document
  // @ts-expect-error - SSR simulation
  delete globalThis.document
  try {
    return await fn()
  } finally {
    globalThis.document = original
  }
}

/** Walk every `<style>` element in the document, return all CSS rule texts. */
const collectAllRules = (): string[] => {
  const rules: string[] = []
  document.querySelectorAll('style').forEach((el) => {
    if (!el.sheet) return
    for (let i = 0; i < el.sheet.cssRules.length; i++) {
      rules.push(el.sheet.cssRules[i]!.cssText)
    }
  })
  return rules
}

const countRulesMatching = (predicate: (rule: string) => boolean): number =>
  collectAllRules().filter(predicate).length

describe('SSR → client hydration roundtrip — no duplicate rules', () => {
  beforeEach(() => {
    vi.resetModules()
    cleanHead()
  })

  afterEach(() => {
    cleanHead()
    vi.resetModules()
  })

  it('static styled component: rule appears exactly once after hydration', async () => {
    // 1. SSR phase: import styled fresh with `document` deleted
    const html = await runAsSSR(async () => {
      const { styled: ssrStyled } = await import('../styled')
      const SSRComp = ssrStyled('div')`color: red;`
      // renderToString must be called inside the SSR window so
      // useInsertionEffect resolves to its server no-op variant.
      return renderToString(createElement(SSRComp, null, 'hi'))
    })

    // 2. Inject the SSR HTML into the document head as if React just hydrated
    document.head.insertAdjacentHTML('beforeend', html)

    // Sanity: a <style data-precedence> tag with our class is now in the head
    const precedenceTags = document.head.querySelectorAll(
      'style[data-precedence][data-href^="vl-"]',
    )
    expect(precedenceTags.length).toBe(1)
    const ssrClassName = precedenceTags[0]!.getAttribute('data-href')!
    expect(ssrClassName).toMatch(/^vl-/)

    // 3. Fresh sheet import — its constructor mounts and hydrates from the
    //    precedence tag we just inserted
    vi.resetModules()
    const { sheet } = await import('../sheet')
    expect(sheet.has(ssrClassName)).toBe(true)

    // 4. Client-render the same component (same template literal text, so
    //    same className). useInsertionEffect runs and *would* re-insert the
    //    rule if the cache hadn't been hydrated.
    const { styled: clientStyled } = await import('../styled')
    const ClientComp = clientStyled('div')`color: red;`
    render(<ClientComp />)

    // 5. The rule must appear exactly once across the whole document
    const occurrences = countRulesMatching(
      (r) => r.includes(`.${ssrClassName}`) && r.includes('color: red'),
    )
    expect(occurrences).toBe(1)
  })

  it('dynamic styled component: rule appears exactly once after hydration', async () => {
    const html = await runAsSSR(async () => {
      const { styled: ssrStyled } = await import('../styled')
      const { ThemeProvider: SSRTP } = await import('../ThemeProvider')
      const SSRComp = ssrStyled('div')`color: ${(p: any) => p.$c};`
      return renderToString(
        <SSRTP theme={{}}>
          <SSRComp $c="red" />
        </SSRTP>,
      )
    })

    document.head.insertAdjacentHTML('beforeend', html)

    const precedenceTags = document.head.querySelectorAll(
      'style[data-precedence][data-href^="vl-"]',
    )
    expect(precedenceTags.length).toBe(1)
    const ssrClassName = precedenceTags[0]!.getAttribute('data-href')!

    vi.resetModules()
    const { sheet } = await import('../sheet')
    expect(sheet.has(ssrClassName)).toBe(true)

    const { styled: clientStyled } = await import('../styled')
    const { ThemeProvider } = await import('../ThemeProvider')
    const ClientComp = clientStyled('div')`color: ${(p: any) => p.$c};`
    render(
      <ThemeProvider theme={{}}>
        <ClientComp $c="red" />
      </ThemeProvider>,
    )

    const occurrences = countRulesMatching(
      (r) => r.includes(`.${ssrClassName}`) && r.includes('color: red'),
    )
    expect(occurrences).toBe(1)
  })

  it('createGlobalStyle: rule appears exactly once after hydration', async () => {
    const html = await runAsSSR(async () => {
      const { createGlobalStyle: ssrCreateGlobalStyle } = await import(
        '../globalStyle'
      )
      const SSRGlobal = ssrCreateGlobalStyle`body { margin: 0; }`
      return renderToString(createElement(SSRGlobal))
    })

    document.head.insertAdjacentHTML('beforeend', html)

    const precedenceTags = document.head.querySelectorAll(
      'style[data-precedence][data-href^="g-"]',
    )
    expect(precedenceTags.length).toBe(1)
    const ssrHref = precedenceTags[0]!.getAttribute('data-href')!
    expect(ssrHref).toMatch(/^g-/)

    vi.resetModules()
    const { sheet } = await import('../sheet')
    expect(sheet.has(ssrHref)).toBe(true)

    const { createGlobalStyle: clientCreateGlobalStyle } = await import(
      '../globalStyle'
    )
    const ClientGlobal = clientCreateGlobalStyle`body { margin: 0; }`
    render(<ClientGlobal />)

    const occurrences = countRulesMatching(
      (r) => r.includes('body') && r.includes('margin') && r.includes('0'),
    )
    expect(occurrences).toBe(1)
  })

  it('mixed scoped + global: each rule appears exactly once', async () => {
    const { componentHtml, globalHtml } = await runAsSSR(async () => {
      const { styled: ssrStyled } = await import('../styled')
      const { createGlobalStyle: ssrCreateGlobalStyle } = await import(
        '../globalStyle'
      )
      const SSRComp = ssrStyled('div')`color: red;`
      const SSRGlobal = ssrCreateGlobalStyle`body { margin: 0; }`
      return {
        componentHtml: renderToString(createElement(SSRComp, null, 'hi')),
        globalHtml: renderToString(createElement(SSRGlobal)),
      }
    })

    document.head.insertAdjacentHTML('beforeend', componentHtml + globalHtml)

    vi.resetModules()
    await import('../sheet') // trigger mount + hydrate

    const { styled: clientStyled } = await import('../styled')
    const { createGlobalStyle: clientCreateGlobalStyle } = await import(
      '../globalStyle'
    )
    const ClientComp = clientStyled('div')`color: red;`
    const ClientGlobal = clientCreateGlobalStyle`body { margin: 0; }`

    render(
      <>
        <ClientGlobal />
        <ClientComp />
      </>,
    )

    expect(
      countRulesMatching(
        (r) => r.includes('color: red') && r.match(/^\.vl-/) !== null,
      ),
    ).toBe(1)
    expect(
      countRulesMatching(
        (r) => r.includes('body') && r.includes('margin') && r.includes('0'),
      ),
    ).toBe(1)
  })
})
