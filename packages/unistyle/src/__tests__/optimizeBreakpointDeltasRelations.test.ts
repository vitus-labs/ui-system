/**
 * Regression tests for the 2026-11 unistyle audit — delta optimizer
 * shorthand / longhand / logical-side relations and comment handling.
 */
import { describe, expect, it } from 'vitest'
import { optimizeBreakpointDeltas } from '../responsive/optimizeBreakpointDeltas'

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
