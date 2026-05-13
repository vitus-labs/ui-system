/**
 * Integration check: `LooseList` actually composes with rocketstyle.
 *
 * The escape-hatch export is only useful if `rocketstyle()({ component:
 * LooseList })` actually produces a wrapper whose typed JSX surface
 * accepts iterator props. This file fails `bun run typecheck` if that
 * round-trip breaks.
 */
import rocketstyle from '@vitus-labs/rocketstyle'
import List, { LooseList } from '~/List'

type User = { id: number; name: string }

declare const users: User[]
declare const Card: (p: User) => React.ReactNode

// ---------------------------------------------------------------------------
// LooseList wraps cleanly — iterator surface preserved at the JSX call site
// ---------------------------------------------------------------------------

const StyledList = rocketstyle()({
  component: LooseList,
  name: 'StyledList',
}).theme(() => ({ rootSize: 16 }))

// Object array — must compile
const _objArray = <StyledList data={users} component={Card} itemKey="id" />

// String array — must compile
declare const strings: string[]
declare const Item: (p: { children: string }) => React.ReactNode
const _strArray = (
  <StyledList data={strings} component={Item} valueName="children" />
)

// itemProps callback — works (loose surface accepts any callback)
const _withItemProps = (
  <StyledList
    data={users}
    component={Card}
    itemKey="id"
    itemProps={(item) => ({ 'data-id': (item as User).id })}
  />
)

// ---------------------------------------------------------------------------
// Strict default `List` STILL rejects misuse — #199 narrowing intact
// ---------------------------------------------------------------------------

// MUST FAIL: object arrays forbid valueName
// @ts-expect-error — valueName forbidden on object arrays
const _strictFails = <List data={users} valueName="text" component={Card} />

export { _objArray, _strArray, _strictFails, _withItemProps }
