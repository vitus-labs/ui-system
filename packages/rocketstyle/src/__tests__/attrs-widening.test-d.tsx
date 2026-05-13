/**
 * `.attrs({ x: defaultValue })` provides a runtime default for `x` — so at
 * the JSX call site, `x` is optional, not required. This test pins that
 * widening for both:
 *
 *   - keys that exist on the wrapped component (OA-overlapping):
 *     `.attrs({ component: Card })` makes `component` optional even though
 *     `ObjectProps['component']` is required.
 *   - keys that are new (EA-only): `.attrs<{ tone: string }>({ tone: 'a' })`
 *     makes `tone` optional at the call site.
 *
 * Per-mode discrimination via `?: never` markers was previously enforced
 * here (PR #222) but is now relaxed in @vitus-labs/elements to support
 * prop-forwarding patterns (`<Wrapper {...props} />` over derived
 * `Partial<$$types>`). See the elements changeset for the trade-off.
 */
import { List } from '@vitus-labs/elements'
import rocketstyle from '~/init'

type User = { id: number; name: string }

declare const users: User[]
declare const Card: (p: User) => React.ReactNode

// ─── OA-overlapping key: `component` ────────────────────────────────
// List's ObjectProps requires `component`. After `.attrs({ component })`,
// the consumer can omit it — the default fills in.
const CardList = rocketstyle()({ component: List, name: 'CardList' })
  .theme(() => ({ rootSize: 16 }))
  .attrs({ component: Card, rootElement: false })

// Compiles WITHOUT passing `component={Card}` — default kicks in.
const _omitted = <CardList data={users} itemKey="id" />

// Still accepts an explicit override.
const _override = <CardList data={users} component={Card} itemKey="id" />

// ─── EA-only key: net-new attr ──────────────────────────────────────
const Sized = rocketstyle()({ component: List, name: 'Sized' })
  .theme(() => ({ rootSize: 16 }))
  .attrs<{ tone: 'a' | 'b' }>({ tone: 'a' })

// `tone` was passed to `.attrs()` as required-typed P — but on the wrapper
// it's now optional because it has a default.
const _toneOmitted = <Sized data={users} component={Card} itemKey="id" />
const _toneSet = <Sized data={users} component={Card} itemKey="id" tone="b" />

export { _omitted, _override, _toneOmitted, _toneSet }
