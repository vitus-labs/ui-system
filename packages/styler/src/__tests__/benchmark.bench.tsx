/**
 * Benchmark: @vitus-labs/styler vs styled-components vs Emotion vs Goober
 *
 * Run: bun vitest bench
 *
 * Compares core CSS-in-JS operations:
 * 1. css() tagged template creation
 * 2. css() with interpolations
 * 3. Template resolution to CSS string
 * 4. Dynamic function interpolation
 * 5. Hash function throughput
 * 6. Nested css() composition
 * 7. SSR renderToString
 * 8. styled() component factory
 */

// --- @emotion/react + @emotion/styled ---
import { css as emotionCss } from '@emotion/react'
import emotionStyled from '@emotion/styled'
// --- goober ---
import { css as gooberCss, styled as gooberStyled, setup } from 'goober'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
// --- styled-components ---
import scStyled, { ServerStyleSheet, css as scCss } from 'styled-components'
import { bench, describe } from 'vitest'
// --- @vitus-labs/styler ---
import { css as stylerCss } from '../css'
import { hash as stylerHash } from '../hash'
import { resolve as stylerResolve } from '../resolve'
import { styled as stylerStyled } from '../styled'

// Setup goober to use React.createElement
setup(createElement)

// ============================================================================
// 1. CSS Tagged Template — Creation Speed
// ============================================================================
describe('css() tagged template creation', () => {
  bench('@vitus-labs/styler', () => {
    stylerCss`
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      margin: 8px;
      background-color: #f0f0f0;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    `
  })

  bench('styled-components', () => {
    scCss`
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      margin: 8px;
      background-color: #f0f0f0;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    `
  })

  bench('@emotion/react', () => {
    emotionCss`
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      margin: 8px;
      background-color: #f0f0f0;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    `
  })

  bench('goober', () => {
    gooberCss`
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      margin: 8px;
      background-color: #f0f0f0;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    `
  })
})

// ============================================================================
// 2. CSS Tagged Template with Interpolations
// ============================================================================
describe('css() with interpolations', () => {
  const color = '#ff0000'
  const size = '16px'

  bench('@vitus-labs/styler', () => {
    stylerCss`
      color: ${color};
      font-size: ${size};
      display: flex;
      padding: 8px;
    `
  })

  bench('styled-components', () => {
    scCss`
      color: ${color};
      font-size: ${size};
      display: flex;
      padding: 8px;
    `
  })

  bench('@emotion/react', () => {
    emotionCss`
      color: ${color};
      font-size: ${size};
      display: flex;
      padding: 8px;
    `
  })

  bench('goober', () => {
    gooberCss`
      color: ${color};
      font-size: ${size};
      display: flex;
      padding: 8px;
    `
  })
})

// ============================================================================
// 3. Template Resolution (strings + values → CSS string)
// ============================================================================
describe('template resolution to CSS string', () => {
  const strings = Object.assign(
    ['display: flex; color: ', '; font-size: ', '; padding: 8px;'],
    { raw: ['display: flex; color: ', '; font-size: ', '; padding: 8px;'] },
  ) as unknown as TemplateStringsArray

  const values = ['red', '16px']
  const props = { theme: { primary: 'blue' } }

  bench('@vitus-labs/styler resolve()', () => {
    stylerResolve(strings, values, props)
  })

  bench('styled-components (array concat)', () => {
    const result = scCss(strings, ...values)
    result.join('')
  })
})

// ============================================================================
// 4. Dynamic Interpolation (function interpolations)
// ============================================================================
describe('dynamic function interpolation', () => {
  const props = { theme: { primary: 'blue', size: '14px' }, active: true }

  const strings = Object.assign(
    ['color: ', '; font-size: ', '; opacity: ', ';'],
    { raw: ['color: ', '; font-size: ', '; opacity: ', ';'] },
  ) as unknown as TemplateStringsArray

  const stylerValues = [
    (p: any) => p.theme.primary,
    (p: any) => p.theme.size,
    (p: any) => (p.active ? '1' : '0.5'),
  ]

  bench('@vitus-labs/styler resolve()', () => {
    stylerResolve(strings, stylerValues, props)
  })

  bench('styled-components (manual flatten)', () => {
    const values = [
      (p: any) => p.theme.primary,
      (p: any) => p.theme.size,
      (p: any) => (p.active ? '1' : '0.5'),
    ]
    let _result = strings[0]!
    for (let i = 0; i < values.length; i++) {
      _result += values[i]!(props) + strings[i + 1]!
    }
  })
})

// ============================================================================
// 5. Hash Function Throughput
// ============================================================================
describe('hash function throughput', () => {
  const shortCSS = 'display: flex; color: red;'
  const mediumCSS =
    'display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; margin: 0 auto; max-width: 1200px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.12);'
  const longCSS = mediumCSS.repeat(5)

  bench('@vitus-labs/styler FNV-1a (short)', () => {
    stylerHash(shortCSS)
  })

  bench('@vitus-labs/styler FNV-1a (medium)', () => {
    stylerHash(mediumCSS)
  })

  bench('@vitus-labs/styler FNV-1a (long)', () => {
    stylerHash(longCSS)
  })
})

// ============================================================================
// 6. Nested css() Composition
// ============================================================================
describe('nested css() composition', () => {
  bench('@vitus-labs/styler', () => {
    const base = stylerCss`display: flex; padding: 8px;`
    const hover = stylerCss`background: #eee;`
    const result = stylerCss`
      ${base};
      &:hover { ${hover}; }
      color: red;
    `
    result.toString()
  })

  bench('styled-components', () => {
    const base = scCss`display: flex; padding: 8px;`
    const hover = scCss`background: #eee;`
    const result = scCss`
      ${base};
      &:hover { ${hover}; }
      color: red;
    `
    result.join('')
  })

  bench('@emotion/react', () => {
    const base = emotionCss`display: flex; padding: 8px;`
    const hover = emotionCss`background: #eee;`
    emotionCss`
      ${base};
      &:hover { ${hover}; }
      color: red;
    `
  })

  bench('goober', () => {
    const base = gooberCss`display: flex; padding: 8px;`
    const hover = gooberCss`background: #eee;`
    gooberCss`
      ${base};
      &:hover { ${hover}; }
      color: red;
    `
  })
})

// ============================================================================
// 7. SSR — renderToString with styled components
// ============================================================================
describe('SSR renderToString', () => {
  const StylerDiv = stylerStyled(
    'div',
  )`display: flex; padding: 16px; color: blue;`
  const SCDiv = scStyled.div`display: flex; padding: 16px; color: blue;`
  const EmotionDiv = emotionStyled.div`display: flex; padding: 16px; color: blue;`
  const GooberDiv = gooberStyled(
    'div',
  )`display: flex; padding: 16px; color: blue;`

  bench('@vitus-labs/styler', () => {
    renderToString(createElement(StylerDiv, null, 'Hello'))
  })

  bench('styled-components', () => {
    const sheet = new ServerStyleSheet()
    try {
      renderToString(sheet.collectStyles(createElement(SCDiv, null, 'Hello')))
      sheet.getStyleTags()
    } finally {
      sheet.seal()
    }
  })

  bench('@emotion/styled', () => {
    renderToString(createElement(EmotionDiv, null, 'Hello'))
  })

  bench('goober', () => {
    renderToString(createElement(GooberDiv, null, 'Hello'))
  })
})

// ============================================================================
// 8. Styled Component Creation (factory call)
// ============================================================================
describe('styled() component factory', () => {
  bench('@vitus-labs/styler', () => {
    stylerStyled('div')`display: flex; color: red; padding: 8px;`
  })

  bench('styled-components', () => {
    scStyled.div`display: flex; color: red; padding: 8px;`
  })

  bench('@emotion/styled', () => {
    emotionStyled.div`display: flex; color: red; padding: 8px;`
  })

  bench('goober', () => {
    gooberStyled('div')`display: flex; color: red; padding: 8px;`
  })
})
