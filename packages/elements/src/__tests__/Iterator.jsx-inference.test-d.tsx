/**
 * JSX-site overload resolution tests for Iterator + List.
 *
 * These don't run — typecheck passing IS the test passing. Each block
 * documents what should compile and what should NOT (the latter via
 * `@ts-expect-error`). If a regression flips any of these, `bun run
 * typecheck` fails and CI catches it.
 */

import Iterator from '~/helpers/Iterator'
import List from '~/List'

const Item = (_props: { text?: string; id?: number; name?: string }) => null

type User = { id: number; name: string }
const users: User[] = []
const strings: string[] = ['a', 'b']

// ----------------------------------------------------------------------
// Iterator — primitive array branch
// ----------------------------------------------------------------------
;<Iterator data={strings} valueName="text" component={Item} />

// itemProps callback infers item shape — { [k: string]: string }
;<Iterator
  data={strings}
  valueName="text"
  component={Item}
  itemProps={(item) => {
    const _typed: { [k: string]: string } = item
    void _typed
    return {}
  }}
/>

// valueName is OPTIONAL — defaults to 'children' at runtime. This compiles.
;<Iterator data={strings} component={Item} />

// ----------------------------------------------------------------------
// Iterator — object array branch
// ----------------------------------------------------------------------
;<Iterator data={users} component={Item} itemKey="id" />

// itemProps callback receives the full User
;<Iterator
  data={users}
  component={Item}
  itemProps={(user) => {
    const _typed: User = user
    void _typed
    return {}
  }}
/>

// MUST FAIL: valueName is forbidden on object arrays
// @ts-expect-error — valueName is meaningless for object arrays
;<Iterator data={users} valueName="text" component={Item} />

// MUST FAIL: itemKey only accepts keyof T or a function — not arbitrary strings
// @ts-expect-error — 'nope' is not a key of User
;<Iterator data={users} component={Item} itemKey="nope" />

// ----------------------------------------------------------------------
// Iterator — children branch
// ----------------------------------------------------------------------
;<Iterator>
  <div>hi</div>
</Iterator>

// MUST FAIL: data + children at once is forbidden by ChildrenProps
// (children mode disallows data via `data?: never`)
// @ts-expect-error — children mode forbids `data`
;<Iterator data={strings}>
  <div>hi</div>
</Iterator>

// ----------------------------------------------------------------------
// List — same overloads + Element prop surface
// ----------------------------------------------------------------------

// Primitive array + List-only `tag` + `rootElement` (Element prop forwarded)
;<List data={strings} valueName="text" component={Item} tag="ul" rootElement />

// Object array — itemKey accepts keyof T
;<List data={users} component={Item} itemKey="name" />

// valueName is OPTIONAL on List too. This compiles.
;<List data={strings} component={Item} tag="ul" />

// MUST FAIL: List<User[]> still forbids valueName
// @ts-expect-error — valueName forbidden on object arrays
;<List data={users} valueName="text" component={Item} />

// Children mode through List
;<List rootElement tag="div">
  <span>x</span>
</List>

// ----------------------------------------------------------------------
// Rocketstyle interop — strict overloads must accept rocketstyle components
// in the `component` slot, and T inference must still flow from `data`
// ----------------------------------------------------------------------
import rocketstyle from '@vitus-labs/rocketstyle'
import Element from '~/Element'

const RocketButton = rocketstyle()({
  component: Element,
  name: 'RocketButton',
}).theme({ fontFamily: 'Arial' })

// Object array with a rocketstyle component — must compile, T = User
;<List
  data={users}
  component={RocketButton}
  itemKey="id"
  itemProps={(user) => {
    const _typed: User = user
    void _typed
    return {}
  }}
/>

// Iterator with a rocketstyle component — same expectation
;<Iterator data={users} component={RocketButton} itemKey="name" />

// Primitive array with a rocketstyle component
;<List data={strings} valueName="text" component={RocketButton} />

// ----------------------------------------------------------------------
// Forwarded refs — passing a ref to List (Element-prop surface)
// ----------------------------------------------------------------------
import { createRef, type Ref } from 'react'

// List forwards its ref to the inner Element when rootElement is true.
const listRef = createRef<HTMLDivElement>()
;<List rootElement tag="div" ref={listRef}>
  <span>child</span>
</List>

// Same with data-driven mode
const ulRef: Ref<HTMLUListElement> = createRef<HTMLUListElement>()
;<List rootElement tag="ul" ref={ulRef} data={users} component={Item} />

// ----------------------------------------------------------------------
// Rocketstyle dimension props — `<List component={RocketBtn} size="lg" />`
// must accept dimension props alongside data + component
// ----------------------------------------------------------------------

const SizedButton = rocketstyle({
  dimensions: { size: 'size' },
  useBooleans: true,
})({ component: Element, name: 'SizedButton' }).theme({})

// Pass the dimension prop on each rendered item via itemProps
;<List
  data={users}
  component={SizedButton}
  itemKey="id"
  itemProps={() => ({ size: 'lg' })}
/>

// Also via the dimension boolean shorthand (when useBooleans is true)
;<List
  data={users}
  component={SizedButton}
  itemKey="id"
  itemProps={() => ({ md: true })}
/>

// ----------------------------------------------------------------------
// Heterogeneous arrays — mixed string|object should NOT pick a strict
// overload (the consumer needs to commit to one shape)
// ----------------------------------------------------------------------

const mixed: (string | User)[] = ['a', { id: 1, name: 'one' }]
// MUST FAIL: heterogeneous array doesn't match any single branch
// @ts-expect-error — mixed-type arrays must be normalized before iteration
;<Iterator data={mixed} component={Item} />

// ----------------------------------------------------------------------
// Generic-over-generic — T itself is parameterized
// ----------------------------------------------------------------------

type Wrapped<X> = { id: number; payload: X }
const wrappedNumbers: Wrapped<number>[] = []
;<Iterator
  data={wrappedNumbers}
  component={Item}
  itemKey="id"
  itemProps={(w) => {
    const _typed: Wrapped<number> = w
    void _typed
    return {}
  }}
/>

// ----------------------------------------------------------------------
// Explicit type annotations on data — equivalent to inline literal
// ----------------------------------------------------------------------

const explicitStrings: string[] = ['a', 'b']
;<Iterator data={explicitStrings} valueName="text" component={Item} />

const explicitUsers: User[] = [{ id: 1, name: 'a' }]
;<Iterator
  data={explicitUsers}
  component={Item}
  itemKey="id"
  itemProps={(u) => {
    const _typed: User = u
    void _typed
    return {}
  }}
/>

// ----------------------------------------------------------------------
// Explicit type parameter — `<Iterator<User>>` form for cases where
// inference doesn't kick in (e.g. when data is built dynamically)
// ----------------------------------------------------------------------
;<Iterator<User>
  data={users}
  component={Item}
  itemKey="id"
  itemProps={(u) => {
    const _typed: User = u
    void _typed
    return {}
  }}
/>
