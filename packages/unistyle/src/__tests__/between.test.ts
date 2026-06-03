import { describe, expect, it } from 'vitest'
import { between } from '../responsive'

const bps = { xs: 0, sm: 576, md: 768, lg: 1024, xl: 1200 } as const

describe('between() — closed-range media-query helper', () => {
  it('builds a min+max query with the standard 0.02px decrement on max', () => {
    expect(between(bps, 'sm', 'md')).toBe(
      '@media (min-width: 576px) and (max-width: 767.98px)',
    )
  })

  it('handles the `xs` base breakpoint (min 0)', () => {
    expect(between(bps, 'xs', 'sm')).toBe(
      '@media (min-width: 0px) and (max-width: 575.98px)',
    )
  })

  it('clamps max to 0 when the upper bound would go negative', () => {
    // Defensive: a misconfigured breakpoint shouldn't produce `-0.02px`
    expect(between({ a: 0, b: 0 } as const, 'a', 'b')).toBe(
      '@media (min-width: 0px) and (max-width: 0px)',
    )
  })

  it('passes string breakpoint values through verbatim', () => {
    const em = { sm: '36em', md: '48em' } as const
    // Numeric path doesn't apply — string max isn't decremented
    expect(between(em, 'sm' as const, 'md' as const)).toBe(
      '@media (min-width: 36em) and (max-width: 48em)',
    )
  })
})
