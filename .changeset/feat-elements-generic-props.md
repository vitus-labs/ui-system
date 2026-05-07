---
"@vitus-labs/elements": minor
---

Generic `Props<T>` on `Iterator` and `List` with discriminated branches — `T` is inferred at the JSX call site from the `data` array. Primitive arrays get `SimpleProps<T>` (`valueName` required), object arrays get `ObjectProps<T>` (`valueName` forbidden, `itemKey` typed against `keyof T`), no-data calls get `ChildrenProps`, and unparameterized callers fall back to the previous loose shape (`LooseProps`) for back-compat. Existing code keeps type-checking; new code gains stricter inference automatically.
