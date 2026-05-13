---
'@vitus-labs/rocketstyle': minor
---

Preserve per-mode narrowing on overloaded components through `rocketstyle()` wrapping.

PR #199 made `Iterator` and `List` overloaded interfaces so direct call sites get strict per-mode discrimination (e.g. `<List data={users} valueName="x" />` is rejected because `valueName?: never` on the object-array branch). Wrapping with `rocketstyle()({ component: List })` lost that — `ExtractProps<C>` picked the last overload, so the wrapper exposed only `ChildrenProps` and every iterator-style call errored.

The fix is two-layered:

- `ExtractProps` now pattern-matches against 1–4 callable overloads and returns the union of every overload's first-param type. Single-callable and plain-object inputs fall through to the previous behaviour unchanged.
- `IRocketStyleComponent`'s `DFP` distributes over `OA`'s union branches and intersects each branch raw (not via `MergeTypes`), so `valueName?: never` markers survive — `MergeTypes`' `ExtractNullableKeys` would otherwise strip them.

Result on wrapped components like `rocketstyle()({ component: List })`:

- `<StyledList data={users} component={Card} />` — compiles (object-array branch).
- `<StyledList data={users} valueName="x" component={Card} />` — rejected.
- `<StyledList data={strings} component={Item} valueName="x" />` — compiles (string-array branch).
- `<StyledList>{children}</StyledList>` — compiles (children branch).
- `<StyledList data={strings}>{children}</StyledList>` — rejected (mode mixing).

Trade-off: per-`T` narrowing inside `itemProps` / `wrapProps` callbacks is lost through the wrap (the callback's `item` argument is the constraint's upper bound, not the consumer's concrete `T`). Direct `<List data={users} itemProps={(u) => …} />` keeps full per-`T` narrowing. Wrapped consumers who need the concrete type in callbacks can annotate explicitly: `itemProps={(item: User) => …}`.
