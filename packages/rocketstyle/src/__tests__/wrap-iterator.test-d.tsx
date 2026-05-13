/**
 * Integration: does `rocketstyle()({ component: List })` produce a wrapper
 * whose JSX call site preserves the per-mode narrowing #199 introduced on
 * direct `<List>` usage?
 *
 * `bun run typecheck` fails if narrowing-through-wrap regresses:
 *   - `valueName` on object arrays — must be rejected on the wrapper.
 *   - `data` + `children` mode-mixing — must be rejected.
 *   - Object-array mode with the right shape — must compile.
 *   - String-array mode with `valueName` — must compile.
 *   - Children-only mode — must compile.
 *
 * Note on per-T narrowing inside the wrapped surface: `keyof ObjectValue`
 * widens to `string | number | symbol` (ObjectValue includes
 * `Record<string, unknown>`), so `itemKey="anything"` is accepted on the
 * wrapper — that's a documented trade-off of going through ExtractProps
 * (the wrapped T substitutes its upper bound). Direct `<List …>` calls
 * keep per-T narrowing.
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

// ─── Fail: illegal calls must be rejected by the narrowing ───────────

// MUST FAIL: valueName forbidden on object arrays
const _badValueName = (
  // @ts-expect-error — valueName forbidden on object arrays (Object branch)
  <StyledList data={users} valueName="text" component={Card} />
)

// MUST FAIL: Children mode forbids `data`
const _modeMix = (
  // @ts-expect-error — children mode rejects `data`
  <StyledList data={strings}>
    <span>x</span>
  </StyledList>
)

export { _badValueName, _children, _modeMix, _obj, _str }
