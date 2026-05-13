/**
 * `.attrs(callback)` returns an object literal — its literal keys should
 * narrow contextually against DFP, so `tag: 'ul'` stays `'ul'`, not
 * widened to `string`. Without this, consumers had to write `tag: 'ul' as
 * const`.
 *
 * The two-overload split on `.attrs()` makes this work: the callback
 * overload's return type is `Partial<MergeTypes<[DFP, P]>>` with P = {}
 * default — no P-inference circularity — so DFP provides clean
 * contextual typing for the return literal.
 */
import { Element, List } from '@vitus-labs/elements'
import rocketstyle from '~/init'

// Callback form, no destructure. Pre-fix this errored
// `Type 'string' is not assignable to type '"button" | "a" | …'`.
// Post-fix: 'ul' / 'center' contextually narrow.
const _List = rocketstyle()({ component: Element, name: 'List' })
  .theme(() => ({ rootSize: 16 }))
  .attrs((_props) => ({
    tag: 'ul',
    contentAlignX: 'center',
  }))

// Callback form on a List wrapper, with destructure of an OA-only key
// (a real-world pattern from bokisch.com LinkList that motivated this
// fix). `rootElement` comes from List's iterator extras.
const _ListDestructure = rocketstyle()({
  component: List,
  name: 'ListDestructure',
})
  .theme(() => ({ rootSize: 16 }))
  .attrs(({ rootElement: _r }) => ({
    tag: 'ul',
    contentAlignX: 'center',
  }))

// Callback form with explicit `<P>` (bokisch.com Heading / IconLogo
// pattern). P extends EA with new keys; the rest of the return narrows
// against DFP.
const _Heading = rocketstyle()({ component: Element, name: 'Heading' })
  .theme(() => ({ rootSize: 16 }))
  .attrs<{ level?: 1 | 2 | 3 }>((props) => ({
    tag: 'h1',
    level: props.level ?? 1,
  }))

// Object form was already fine — pinning that it stays fine.
const _Inline = rocketstyle()({ component: Element, name: 'Inline' })
  .theme(() => ({ rootSize: 16 }))
  .attrs({ tag: 'span', contentAlignX: 'left' })

export { _Heading, _Inline, _List, _ListDestructure }
