/**
 * Integration: `rocketstyle()({ component: List })` produces a wrapper
 * whose JSX call site can be invoked in each of List's three iterator
 * modes (object-array, string-array, children-only).
 *
 * After the forwarding-friendliness refactor in @vitus-labs/elements,
 * the per-mode `?: never` discrimination was dropped (it broke
 * `<Wrapper {...props} />` patterns over derived `$$types`). What stays:
 * each mode's required slots (data for iterators, children for the
 * children branch) still discriminate via the data-element type at the
 * overload level, and `bun run typecheck` fails if those compile paths
 * regress.
 */
import { List } from '@vitus-labs/elements'
import rocketstyle from '~/init'

type User = { id: number; name: string }

declare const users: User[]
declare const strings: string[]
declare const Card: (p: User) => React.ReactNode
declare const Item: (p: { children: string }) => React.ReactNode

// ─── Wrap List with rocketstyle (no manual type annotations) ────────
const StyledList = rocketstyle()({
  component: List,
  name: 'StyledList',
}).theme(() => ({ rootSize: 16 }))

// ─── Compile: legal calls through the wrapper ────────────────────────

// Object array mode
const _obj = <StyledList data={users} component={Card} itemKey="id" />

// String array mode
const _str = <StyledList data={strings} component={Item} valueName="children" />

// Children mode
const _children = (
  <StyledList>
    <span>x</span>
  </StyledList>
)

export { _children, _obj, _str }
