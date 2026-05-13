---
'@vitus-labs/rocketstyle': minor
---

`.attrs({ x: defaultValue })` now makes `x` optional at the JSX call site.

Semantically, `.attrs()` provides a runtime default — so the consumer shouldn't be required to pass that prop. The previous types didn't reflect that: keys passed to `.attrs()` stayed required at the call site (especially when they overlapped with the wrapped component's required props, e.g. `component` on `List`).

Two changes:

- **DFP widening**: `IRocketStyleComponent`'s `DFP` now strips OA keys that EA defaults and re-adds them as `Partial`, and feeds `Partial<EA>` into the merge — every `.attrs()`-provided key becomes optional at the call site.
- **`.attrs()` inference**: previously the object-form `.attrs({ … })` didn't update EA without an explicit `<P>` annotation (the param type `Partial<MergeTypes<[DFP, P]>>` defeated P inference). The new signature uses `P & Partial<NoInfer<DFP>>`, letting TS infer P from the param's keys while still accepting extra DFP defaults.

Result on wrappers like:

```ts
const CardList = rocketstyle()({ component: List, name: 'CardList' })
  .attrs({ component: Card, rootElement: false })
```

- `<CardList data={users} itemKey="id" />` — compiles (component default from .attrs).
- `<CardList data={users} component={OtherCard} itemKey="id" />` — still compiles (override).
- `<CardList data={users} valueName="x" />` — still rejected (per-mode narrowing from #222 preserved).

**Behavior change to be aware of**: `.attrs<{ isRequired: boolean }>({ isRequired: true })` no longer requires `isRequired` at the JSX call site (it has a default). This is consistent with what `.attrs` means, but if anyone was relying on `.attrs()` keys being required JSX props, that no longer holds.

Callback-form `.attrs((props) => …)` does not infer P; pass it explicitly (`.attrs<P>((props) => …)`) if you want callback-set defaults to widen the type surface.
