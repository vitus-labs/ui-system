---
'@vitus-labs/rocketstyle': minor
---

`.attrs()` callback form now keeps literal narrowing — no more `as const` workarounds.

**What changed**

`.attrs()` is now an overloaded interface with two signatures:

- **Object form**: `<P extends TObj = {}>(param: P & Partial<NoInfer<DFP>>, …)`.
- **Callback form**: `<P extends TObj = {}>(param: AttrsCb<DFP & P, Theme<T>>, …)`.

The callback signature uses `AttrsCb<DFP & P, …>` directly so the return literal narrows contextually against `DFP`. Previously the single branched signature combined with the `Partial<NoInfer<DFP>>` from the object path caused literals in the callback's return to widen — consumers had to write:

```ts
.attrs(({ rootElement }) => ({
  tag: 'ul' as const,        // ← needed before
  contentAlignX: 'block' as const,
}))
```

After this change, the `as const` is no longer needed — `'ul'` contextually narrows to `HTMLTags`.

```ts
.attrs(({ rootElement }) => ({
  tag: 'ul',           // ✓ narrows to literal 'ul' assignable to HTMLTags
  contentAlignX: 'block',
}))
```

**No behavioral change** for existing object-form `.attrs({…})` or explicit-`<P>` callback `.attrs<P>((props) => …)` patterns. The OA-overlapping widening and EA-key optionality from the previous release stay intact.
