/**
 * Regression tests for the 2026-11 unistyle audit — delta optimizer
 * shorthand / longhand / logical-side relations and comment handling.
 */
import { describe, expect, it } from 'vitest'
import {
  isRelated,
  optimizeBreakpointDeltas,
  propFamilies,
} from '../responsive/optimizeBreakpointDeltas'
import propertyMap from '../styles/styles/propertyMap'

const norm = (s: string) => s.trim().replace(/\s+/g, ' ')

// ─────────────────────────────────────────────────────────────────────
// Finding: delta optimizer under-invalidation + comments
// ─────────────────────────────────────────────────────────────────────
describe('optimizeBreakpointDeltas — relations', () => {
  const abA = (a: string, b: string) =>
    optimizeBreakpointDeltas([a, b, a]).map(norm)

  it.each([
    ['border-top: 1px solid red;', 'border-color: blue;'],
    ['border-width: 2px;', 'border-top: 1px solid;'],
    ['border-style: dashed;', 'border-inline-start: 1px solid;'],
    ['border-color: red;', 'border-block-end-color: blue;'],
    ['border-left-color: red;', 'border-inline-start: 1px solid blue;'],
    ['border-top: 1px solid;', 'border-block-start-width: 2px;'],
    ['grid-row: 1 / 3;', 'grid-area: 2 / 2 / 4 / 4;'],
    ['grid-column: 1;', 'grid-area: auto;'],
    ['margin-inline-start: 4px;', 'margin-left: 0;'],
    ['margin-block-end: 4px;', 'margin-bottom: 0;'],
    ['padding-inline: 4px;', 'padding-right: 0;'],
    ['inset-inline-start: 4px;', 'left: 0;'],
    ['inset-block: 0;', 'top: 1px;'],
    ['scroll-margin-block-start: 4px;', 'scroll-margin-top: 0;'],
  ])('%s ↔ %s re-emits at the 3rd breakpoint (both orders)', (a, b) => {
    expect(abA(a, b)[2]).toBe(a)
    expect(abA(b, a)[2]).toBe(b)
  })

  it.each([
    ['margin-top: 1px;', 'margin-left: 0;'],
    ['top: 1px;', 'left: 0;'],
    ['border-top: 1px solid;', 'border-left: 0;'],
    ['border-top-color: red;', 'border-top-width: 2px;'],
    ['margin-block: 1px;', 'margin-inline-start: 0;'],
    ['border-inline-start-color: red;', 'border-left-width: 1px;'],
    ['margin-inline-start: 1px;', 'padding-left: 0;'],
    ['color: red;', 'background-color: blue;'],
  ])('%s and %s stay independent', (a, b) => {
    expect(abA(a, b)[2]).toBe('')
  })

  it('family index covers every related pair (isRelated ⇒ shared family)', () => {
    const sides = ['top', 'right', 'bottom', 'left']
    const logical = [
      'block',
      'inline',
      'block-start',
      'block-end',
      'inline-start',
      'inline-end',
    ]
    const props = new Set<string>([
      'border',
      'border-width',
      'border-style',
      'border-color',
      'border-radius',
      'border-image',
      'border-image-width',
      'inset',
      'gap',
      'row-gap',
      'column-gap',
      'grid-gap',
      'grid-row-gap',
      'grid-column-gap',
      'grid',
      'grid-area',
      'grid-template',
      'grid-template-areas',
      'font',
      'font-size',
      'line-height',
      'columns',
      'column-count',
      'column-width',
      'column-rule',
      'column-rule-color',
      'flex',
      'flex-flow',
      'flex-direction',
      'flex-wrap',
      'flex-grow',
      'place-items',
      'place-content',
      'place-self',
      'align-items',
      'align-content',
      'align-self',
      'justify-items',
      'justify-content',
      'justify-self',
      'outline',
      'outline-color',
      'background',
      'background-color',
      '-webkit-mask',
      '-webkit-mask-image',
      'color',
      ...sides,
      ...logical.map((l) => `inset-${l}`),
      ...['row', 'column'].flatMap((a) => [
        `grid-${a}`,
        `grid-${a}-start`,
        `grid-${a}-end`,
      ]),
    ])
    for (const base of [
      'margin',
      'padding',
      'scroll-margin',
      'scroll-padding',
      'border',
    ]) {
      props.add(base)
      for (const s of [...sides, ...logical]) {
        props.add(`${base}-${s}`)
        if (base === 'border')
          for (const part of ['width', 'style', 'color'])
            props.add(`border-${s}-${part}`)
      }
    }
    for (const d of propertyMap) {
      if ('css' in d && d.css) props.add(d.css)
    }
    const list = [...props]
    const misses: string[] = []
    for (const a of list) {
      const fa = propFamilies(a)
      for (const b of list) {
        if (a === b || !isRelated(a, b)) continue
        if (!propFamilies(b).some((f) => fa.includes(f)))
          misses.push(`${a} ↔ ${b}`)
      }
    }
    expect(misses).toEqual([])
  })
})

describe('optimizeBreakpointDeltas — comments', () => {
  it('a `;` inside a comment does not split the declaration', () => {
    expect(
      optimizeBreakpointDeltas([
        '/* a; b */ color: red;',
        '/* a; b */ color: blue;',
      ]).map(norm),
    ).toEqual(['color: red;', 'color: blue;'])
  })

  it('comments with braces, unterminated comments and quoted /* survive', () => {
    expect(
      optimizeBreakpointDeltas([
        'color: red; /* } { */ content: "/* not a comment */";',
        'color: red; content: "/* not a comment */"; /* trailing',
      ]).map(norm),
    ).toEqual(['color: red; content: "/* not a comment */";', ''])
  })

  it('leaves comment-like text inside parens alone', () => {
    const out = optimizeBreakpointDeltas([
      'background: url(a/*.png);',
      'background: url(b/*.png);',
    ]).map(norm)
    expect(out).toEqual([
      'background: url(a/*.png);',
      'background: url(b/*.png);',
    ])
  })
})
