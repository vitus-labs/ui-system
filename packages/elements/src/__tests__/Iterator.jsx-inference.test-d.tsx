/**
 * JSX-site overload resolution tests for Iterator + List.
 *
 * These don't run — typecheck passing IS the test passing. Each block
 * documents what should compile and what should NOT (the latter via
 * `@ts-expect-error`). If a regression flips any of these, `bun run
 * typecheck` fails and CI catches it.
 *
 * Discrimination model: the iterator overloads narrow via `data`'s
 * element type (`T extends SimpleValue | ObjectValue`), nothing else.
 * Other slots (valueName, itemKey, itemProps, wrapProps, children) share
 * the same loose signature across all branches so prop-forwarding
 * patterns (`<Wrapper {...props} data={users} />`) work without manual
 * Omit-chains. Previously `?: never` markers enforced mutual exclusion
 * but broke forwarding — the trade-off is documented in the changeset.
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

// itemProps callback — item is loose (`LooseItem`), explicit annotation
// for per-T access if the caller needs it.
;<Iterator
  data={strings}
  valueName="text"
  component={Item}
  itemProps={(item) => {
    void item
    return {}
  }}
/>

// valueName is OPTIONAL — defaults to 'children' at runtime. This compiles.
;<Iterator data={strings} component={Item} />

// ----------------------------------------------------------------------
// Iterator — object array branch
// ----------------------------------------------------------------------
;<Iterator data={users} component={Item} itemKey="id" />

// itemKey accepts `keyof T` (narrowed on object branch — direct callers
// keep this benefit; wrapped callers lose it via ExtractProps's bound
// substitution).
;<Iterator data={users} component={Item} itemKey="name" />

// itemProps callback — explicit annotation if you need typed access.
;<Iterator
  data={users}
  component={Item}
  itemProps={(item) => {
    const _user = item as User
    void _user
    return {}
  }}
/>

// ----------------------------------------------------------------------
// Iterator — children branch
// ----------------------------------------------------------------------
;<Iterator>
  <div>hi</div>
</Iterator>

// ----------------------------------------------------------------------
// List — same overloads + Element prop surface
// ----------------------------------------------------------------------

// Primitive array + List-only `tag` + `rootElement` (Element prop forwarded)
;<List data={strings} valueName="text" component={Item} tag="ul" rootElement />

// Object array — itemKey accepts keyof T
;<List data={users} component={Item} itemKey="name" />

// valueName is OPTIONAL on List too.
;<List data={strings} component={Item} tag="ul" />

// Children mode through List
;<List rootElement tag="div">
  <span>x</span>
</List>

// ----------------------------------------------------------------------
// Rocketstyle interop — overloads accept rocketstyle components in the
// `component` slot, and T inference still flows from `data`
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
  itemProps={(item) => {
    const _user = item as User
    void _user
    return {}
  }}
/>

// Iterator with a rocketstyle component
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
// Heterogeneous arrays — mixed string|object still rejected by all
// overloads (`T extends SimpleValue | ObjectValue` doesn't accept a
// union of the two simultaneously).
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
  itemProps={(item) => {
    const _w = item as Wrapped<number>
    void _w
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
  itemProps={(item) => {
    const _u = item as User
    void _u
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
  itemProps={(item) => {
    const _u = item as User
    void _u
    return {}
  }}
/>
