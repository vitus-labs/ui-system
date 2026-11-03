/**
 * getDefaultAttrs must include priority attrs in the same order as the HOC
 * (2026-11 audit).
 */
import rocketstyle from '~/init'

const Leaf = (p: any) => <div {...p} />

describe('getDefaultAttrs', () => {
  it('includes priority attrs (priority < attrs)', () => {
    const C = rocketstyle()({ name: 'C', component: Leaf })
      .attrs({ tag: 'button', label: 'p' } as any, { priority: true })
      .attrs({ label: 'x' } as any)
    expect(C.getDefaultAttrs({}, {}, 'light')).toEqual({
      tag: 'button',
      label: 'x',
    })
  })

  it('attrs callbacks see priority attrs', () => {
    const C = rocketstyle()({ name: 'C', component: Leaf })
      .attrs({ tag: 'button' } as any, { priority: true })
      .attrs(((p: any) => ({ isButton: p.tag === 'button' })) as any)
    expect(C.getDefaultAttrs({}, {}, 'light')).toEqual({
      tag: 'button',
      isButton: true,
    })
  })
})
